import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from '../ProductList';
import ProductDetails from '../ProductDetails';
import { ProductListProps } from '../../types/types';
import db from '../../../db.json';

// Extract data from the database
const productTitles = db.items.map(item => item.title);
const productCategories = db.categories.map(category => category.name);
const productColors = db.color.map(color => color.name);

// Default props for ProductList
const defaultProps: ProductListProps = {
  filters: {
    colors: productColors,
    categories: productCategories,
    collections: db.collection.map(c => c.name),
    priceRange: 10000,
  },
  searchQuery: '',
};

// function to render the component with Router and Routes
const renderComponent = (props: Partial<ProductListProps> = {}) => {
  return render(
    <Router>
      <Routes>
        <Route path="/" element={<ProductList {...defaultProps} {...props} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
};

describe('ProductList', () => {
  // Mock the global fetch function before each test
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(db.items),
      })
    ) as jest.Mock;
  });

  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handles fetch error', async () => {
    // Mock fetch to simulate a failed response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as jest.Mock;
  
    renderComponent();
  
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText((content, element) => 
        content.includes('Fetch error: Network response was not ok')
      )).toBeInTheDocument();
    });
  });

  test('renders initial state correctly', async () => {
    renderComponent();
    // Check if the message is displayed
    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  test('filters products by category', async () => {
    // Render with a category filter
    renderComponent({ filters: { ...defaultProps.filters, categories: [productCategories[0]] } });
    // Wait for the first product title to appear in the document
    await waitFor(() => {
      expect(screen.getByText(productTitles[0])).toBeInTheDocument();
    });
  });

  test('filters products by color', async () => {
    // Render specific color filter
    renderComponent({ filters: { ...defaultProps.filters, colors: [productColors[0]] } });
    // Wait for the first product title to appear in the document
    await waitFor(() => {
      expect(screen.getByText(productTitles[0])).toBeInTheDocument();
    });
  });

  test('adds product to cart', async () => {
    renderComponent();
    const addToCartButton = await screen.findByLabelText(`Add ${productTitles[0]} to cart`);
    fireEvent.click(addToCartButton);
    // Wait for the cart items to be updated in local storage
    await waitFor(() => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].title).toBe(productTitles[0]);
    });
  });

  test('toggles product as favorite', async () => {
    renderComponent();
    const favoriteButton = await screen.findByLabelText(`Add ${productTitles[0]} to favorites`);
    fireEvent.click(favoriteButton);
    expect(favoriteButton).toHaveAttribute('aria-label', `Remove ${productTitles[0]} from favorites`);
  });

  test('navigates to product details page on product card click', async () => {
    renderComponent();
    // Find the product card for the first product
    const productCard = await screen.findByText(productTitles[0]);
    fireEvent.click(productCard);

    await waitFor(() => {
      expect(window.location.pathname).toBe(`/product/${db.items[0].id}`);
    });
  });
});