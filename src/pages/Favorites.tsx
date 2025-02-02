import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface FavItems {
  id: number;
  title: string;
  price: number;
  quantity: number;
  img_url: string;
}

const Cart: React.FC = () => {
  const [favItems, setFavItems] = useState<FavItems[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Fetch cart items from local storage or API
    const items = JSON.parse(localStorage.getItem('favItems') || '[]');
    setFavItems(items);
    calculateTotalPrice(items);
  }, []);

  const handleRemove = (id: number) => {
    const updatedItems = favItems.filter(item => item.id !== id);
    setFavItems(updatedItems);
    localStorage.setItem('favItems', JSON.stringify(updatedItems));
    calculateTotalPrice(updatedItems);
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    const updatedItems = favItems.map(item =>
      item.id === id ? { ...item, quantity: quantity } : item
    );
    setFavItems(updatedItems);
    localStorage.setItem('favItems', JSON.stringify(updatedItems));
    calculateTotalPrice(updatedItems);
  };

  const handleToggleFilter = () => {
    // No filter functionality needed here
  };

  const calculateTotalPrice = (items: FavItems[]) => {
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(totalPrice);
  };

  return (
    <div>
      <Navbar onToggleFilter={handleToggleFilter} onSearch={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <div className="container mx-auto p-12">
        <h1 className="text-3xl font-bold mb-6 text-right">Favorites</h1>
        {favItems.length === 0 ? (
          <p className="text-gray-600 text-center">You liked none☹️.</p>
        ) : (
          <div className="lg:space-x-12">
            <div className="flex-1">
              {favItems.map(item => (
                <div key={item.id} className="items-center border p-4 rounded-lg shadow-md mb-4 bg-white transform transition duration-500 hover:scale-105">
                  <img src={item.img_url} alt={item.title} className="w-24 h-24 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <div className="flex justify-between mt-2">
                      <p className="text-gray-700">Price: ${item.price}</p>
                      {/* <div className="flex items-center"> */}
                        {/* <label htmlFor={`quantity-${item.id}`} className="text-gray-700 mr-2">Quantity:</label> */}
                          {/* <input
                            type="number"
                            id={`quantity-${item.id}`}
                            className="w-16 p-1 border rounded"
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          /> */}
                      {/* </div> */}
                    </div>
                    {/* <p className="text-gray-700 mt-2">Subtotal: ${item.price * item.quantity}</p> */}
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 px-4 py-2 rounded ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-full">
              {/* <div className="border p-6 rounded-lg shadow-md bg-white transform transition duration-500 hover:scale-105"> */}
                {/* <h2 className="text-2xl font-semibold mb-4">Order Summary</h2> */}
                {/* <div className="flex justify-between mb-2"> */}
                  {/* <p className="text-gray-700">Total Price:</p> */}
                  {/* <p className="text-gray-700">${totalPrice}</p> */}
                {/* </div> */}
                {/* <button
                  className="bg-blue-500 text-grey w-full py-3 rounded hover:bg-blue-600 transition duration-300"
                >
                  Proceed to Checkout
                </button> */}
              </div>
            </div>
          // </div>
        )}
      </div>
    </div>
  );
};

export default Cart;