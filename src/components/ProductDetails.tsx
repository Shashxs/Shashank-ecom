import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import StarRating from './StarRating';
import { Product } from '../types/types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/items/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json() as Promise<Product>;
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError('Failed to fetch product details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found.</div>;

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCartItems = [...cartItems, { ...product, quantity, color: selectedColor }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  const handleToggleFilter = () => {
    // No filter functionality needed here
  };

  return (
    <div className="min-h-screen bg-gray-25">
      <Navbar onToggleFilter={handleToggleFilter} onSearch={() => {}} />
      <div className="flex-grow pt-14 w-full mx-auto p-4 mt-16">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <img src={product.img_url} alt={product.title} className="w-full h-96 object-cover mb-4 rounded" />
          </div>
          <div className="lg:w-1/2 p-4">
            <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
            <p className="text-gray-700 mb-2">Category: {product.category}</p>
            <p className="text-gray-700 mb-2">Collection: {product.collection}</p>
            <p className="text-gray-700 mb-2">Price: ${product.price}</p>
            <div className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">Rating:</span>
              <StarRating rating={product.rating} />
            </div>
            <div className="flex space-x-2 mb-4">
              <span
                className={`block w-6 h-6 rounded-full cursor-pointer ${selectedColor === product.color1 ? 'border-2 border-black shadow-lg transform scale-110 transition duration-300' : ''}`}
                style={{ backgroundColor: product.color1 }}
                onClick={() => handleColorChange(product.color1)}
                aria-label={`Select color ${product.color1}`}
              ></span>
              <span
                className={`block w-6 h-6 rounded-full cursor-pointer ${selectedColor === product.color2 ? 'border-2 border-black shadow-lg transform scale-110 transition duration-300' : ''}`}
                style={{ backgroundColor: product.color2 }}
                onClick={() => handleColorChange(product.color2)}
                aria-label={`Select color ${product.color2}`}
              ></span>
            </div>
            <p className="text-gray-700 mb-4">{product.desc}</p>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="p-2 border rounded w-20"
                aria-label="Quantity"
              />
            </div>
            <button
              className="bg-white text-black px-4 py-2 rounded mr-2"
              onClick={handleBuyNow}
              aria-label="Buy Now"
            >
              Buy Now
            </button>
            <button
              className="bg-white text-black px-4 py-2 rounded"
              onClick={handleAddToCart}
              aria-label="Add to Cart"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;