import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import { NavbarProps } from '../../types/types';

// Define defaultProps for the Navbar component
const defaultProps: NavbarProps = {
  onToggleFilter: jest.fn(),
  onSearch: jest.fn(),
};

// Helper function to render the Navbar component with Router
const renderComponent = (props: Partial<NavbarProps> = {}) => {
  return render(
    <Router>
      <Navbar {...defaultProps} {...props} />
    </Router>
  );
};

describe('Navbar', () => {
  // Clear all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar with links and logo', () => {
    renderComponent();
    // Check if all the navigation links and logo are rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Favourites')).toBeInTheDocument();
    expect(screen.getByLabelText('Shop')).toBeInTheDocument();
    expect(screen.getByLabelText('Logo')).toBeInTheDocument();
    expect(screen.getByLabelText('Cart')).toBeInTheDocument();
    expect(screen.getByLabelText('Login')).toBeInTheDocument();
  });

  test('navigates to Home when Home link is clicked', () => {
    renderComponent();
    // clicking the Home link
    fireEvent.click(screen.getByLabelText('Home'));
    expect(window.location.pathname).toBe('/');
  });

  test('navigates to Favourites when Favourites link is clicked', () => {
    renderComponent();
    // clicking the Favourites link
    fireEvent.click(screen.getByLabelText('Favourites'));
    expect(window.location.pathname).toBe('/favourites');
  });

  test('navigates to Shop when Shop link is clicked', () => {
    renderComponent();
    // clicking the Shop link
    fireEvent.click(screen.getByLabelText('Shop'));
    expect(window.location.pathname).toBe('/shop');
  });

  test('navigates to Cart when Cart link is clicked', () => {
    renderComponent();
    // clicking the Cart link
    fireEvent.click(screen.getByLabelText('Cart'));
    expect(window.location.pathname).toBe('/cart');
  });

  test('navigates to Login when Login link is clicked', () => {
    renderComponent();
    // clicking the Login link
    fireEvent.click(screen.getByLabelText('Login'));
    expect(window.location.pathname).toBe('/login');
  });

  test('calls onToggleFilter when filter button is clicked', () => {
    const onToggleFilter = jest.fn();
    renderComponent({ onToggleFilter });
    // Find the filter button and simulate a click
    const filterButton = screen.getByLabelText('Toggle Filter');
    fireEvent.click(filterButton);
    expect(onToggleFilter).toHaveBeenCalledTimes(1);
  });

  test('calls onSearch when search input changes', () => {
    const onSearch = jest.fn();
    renderComponent({ onSearch });
    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'Couch' } });
    // Check if the onSearch function is called with the correct value
    expect(onSearch).toHaveBeenCalledWith('Couch');
  });

  test('initial state is correct', () => {
    renderComponent();
    // Check if the search input is empty
    expect(screen.getByLabelText('Search')).toHaveValue('');
    // Check if the navigation bar is visible 
    expect(screen.getByRole('navigation')).toHaveClass('translate-y-0');
  });

  test('Navbar visibility changes on scroll', () => {
    renderComponent();
    const navbar = screen.getByRole('navigation');

    // Simulate scroll down
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    // Check if the navigation bar is hidden on scroll down
    expect(navbar).toHaveClass('-translate-y-full');

    // Simulate scroll up
    fireEvent.scroll(window, { target: { scrollY: 0 } });
    // Check if the navigation bar is visible on scroll up
    expect(navbar).toHaveClass('translate-y-0');
  });

  test('Navbar visibility remains on scroll up', () => {
    renderComponent();
    const navbar = screen.getByRole('navigation');

    // Simulate scroll up&down
    fireEvent.scroll(window, { target: { scrollY: 100 } });
    // Check if the navigation bar is hidden on scroll down
    expect(navbar).toHaveClass('-translate-y-full');

    fireEvent.scroll(window, { target: { scrollY: 50 } });
    expect(navbar).toHaveClass('translate-y-0');
  });
});
