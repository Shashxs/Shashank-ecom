import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { CartItem } from '../types/types';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
      calculateTotalPrice(items);
    } catch (err) {
      setError('Failed to load cart items.');
    }
  }, []);

  const handleRemove = (id: number) => {
    try {
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      calculateTotalPrice(updatedItems);
    } catch (err) {
      setError('Failed to remove item from cart.');
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    try {
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
      setCartItems(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      calculateTotalPrice(updatedItems);
    } catch (err) {
      setError('Failed to update item quantity.');
    }
  };

  const handleToggleFilter = () => {
  };

  const calculateTotalPrice = (items: CartItem[]) => {
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0); //accumulator
    setTotalPrice(totalPrice);
  };

  return (
    <div>
      <Navbar onToggleFilter={handleToggleFilter} onSearch={function (): void {
        throw new Error('Function not implemented.');
      }} />
      <div className="container mx-auto p-12">
        <h1 className="text-3xl font-bold mb-6 text-right">Shopping Cart</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            <div className="flex-1">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center border p-6 rounded-lg shadow-lg mb-6 bg-white transform transition duration-500 hover:scale-105">
                  <img src={item.img_url} alt={item.title} className="w-24 h-24 object-cover rounded-lg mr-6" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
                    <div className="flex justify-between mt-4">
                      <p className="text-gray-700">Price: <span className="font-bold">${item.price}</span></p>
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="text-gray-700 mr-2">Quantity:</label>
                        <input
                          type="number"
                          id={`quantity-${item.id}`}
                          className="w-16 p-2 border rounded-lg text-center"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          aria-label={`Change quantity for ${item.title}`}
                        />
                      </div>
                    </div>
                    <p className="text-gray-700 mt-4">Subtotal: <span className="font-bold">${item.price * item.quantity}</span></p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 px-4 py-2 rounded-lg ml-4 bg-red-100 hover:bg-red-200 transition duration-300"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-1/3">
              <div className="border p-6 rounded-lg shadow-lg bg-white transform transition duration-500 hover:scale-105">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
                <div className="flex justify-between mb-4">
                  <p className="text-gray-700">Total Price:</p>
                  <p className="text-gray-700 font-bold">${totalPrice}</p>
                </div>
                <button
                  className="bg-blue-500 text-black w-full py-3 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-110"
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;