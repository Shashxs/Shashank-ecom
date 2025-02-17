import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ProductDetail from '../../components/ProductDetails';
import db from '../../../db.json';


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

const mockProduct = db.items.find(item => item.id === 1);

if (!mockProduct) {
  throw new Error('Product not found in db.json');
}

const renderComponent = () => {
  return render(
    <MemoryRouter initialEntries={['/product/1']}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProductDetail', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    ) as jest.Mock;

    mockNavigate.mockClear(); // Reset after each test
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders product details after fetching', async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => expect(screen.getByText(mockProduct.title)).toBeInTheDocument());
    expect(screen.getByText(`Category: ${mockProduct.category}`)).toBeInTheDocument();
    expect(screen.getByText(`Collection: ${mockProduct.collection}`)).toBeInTheDocument();
    expect(screen.getByText(`Price: $${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.desc)).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    ) as jest.Mock;

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => expect(screen.getByText('Failed to fetch product details.')).toBeInTheDocument());
  });

  test('handles quantity change', async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => expect(screen.getByText(mockProduct.title)).toBeInTheDocument());

    const quantityInput = screen.getByLabelText('Quantity') as HTMLInputElement;
    fireEvent.change(quantityInput, { target: { value: '2' } });
    expect(quantityInput.value).toBe('2');
  });

  test('handles color selection', async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => expect(screen.getByText(mockProduct.title)).toBeInTheDocument());

    const colorOption = screen.getByLabelText(`Select color ${mockProduct.color1}`);
    fireEvent.click(colorOption);
    expect(colorOption).toHaveClass('border-2 border-black shadow-lg transform scale-110 transition duration-300');
  });

  test('adds product to cart', async () => {
    await act(async () => {
      renderComponent();
    });

    await waitFor(() => expect(screen.getByText(mockProduct.title)).toBeInTheDocument());

    const addToCartButton = screen.getByLabelText('Add to Cart');
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].title).toBe(mockProduct.title);
    });
  });

  test('navigates to cart on buy now', async () => {

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => expect(screen.getByText(mockProduct.title)).toBeInTheDocument());

    const buyNowButton = screen.getByLabelText('Buy Now');
    fireEvent.click(buyNowButton);

    expect(mockNavigate).toHaveBeenCalledWith('/cart');
  });
});
