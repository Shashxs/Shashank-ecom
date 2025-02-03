import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { Product, ProductListProps } from '../types/types'; // Import interfaces

const ProductList: React.FC<ProductListProps> = ({ filters, searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const productsPerPage = 8;

  useEffect(() => {
    fetch('http://localhost:5000/items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => console.error('Fetch error:', error));

    // const storedFavorites = localStorage.getItem('favorites');
    // if (storedFavorites) {
    //   setFavorites(JSON.parse(storedFavorites));
    // }
    
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => filters.colors.includes(product.color));
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    if (filters.collections.length > 0) {
      filtered = filtered.filter(product => filters.collections.includes(product.collection));
    }

    filtered = filtered.filter(product => Number(product.price) <= filters.priceRange);

    if (searchQuery) {
      filtered = filtered.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered;
  }, [filters, products, searchQuery]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddToCart = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCartItems = [...cartItems, { ...product, quantity: 1, color: product.color }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prevFavorites => {
      const updatedFavorites = prevFavorites.includes(id)
        ? prevFavorites.filter(favId => favId !== id)
        : [...prevFavorites, id];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-full mt-20">
      <div style={{ height: '60px' }}></div>
      <div className="flex-grow overflow-y-auto pt-7 ">
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentProducts.map(product => (
              <Link to={`/product/${product.id}`} key={product.id} aria-label={`View details of ${product.title}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out relative">
                  <img src={product.img_url} alt={product.title} className="w-full h-50 object-cover rounded-t-lg" />
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-gray-700 text-xl font-semibold">{product.title}</h2>
                      <AiOutlineShoppingCart
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="text-gray-400 w-6 h-6 hover:text-blue-500 transition duration-300 cursor-pointer"
                        aria-label={`Add ${product.title} to cart`}
                      />
                    </div>
                    <p className="text-gray-700 mb-2">{product.category}</p>
                    <p className="text-gray-700 mb-2">${product.price}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-gray-700 mr-2">Rating:</span>
                      <StarRating rating={product.rating} />
                    </div>
                    <div className="flex space-x-2 mb-2">
                      <span className="block w-6 h-6 rounded-full" style={{ backgroundColor: product.color1 }} aria-label={`Color option 1: ${product.color1}`}></span>
                      <span className="block w-6 h-6 rounded-full" style={{ backgroundColor: product.color2 }} aria-label={`Color option 2: ${product.color2}`}></span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className="favorite-button absolute top-2 right-2 focus:outline-none"
                    aria-label={favorites.includes(product.id) ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
                  >
                    {favorites.includes(product.id) ? (
                      <AiFillHeart className="text-red-500 w-6 h-6" aria-label="Remove from favorites" />
                    ) : (
                      <AiOutlineHeart className="text-gray-400 w-6 h-6 hover:text-red-500 transition duration-300" aria-label="Add to favorites" />
                    )}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 mt-10">
            No products found.
          </div>
        )}
      </div>
      {currentProducts.length > 0 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-2 py-1 mx-1 rounded text=sm ${currentPage === index + 1 ? 'bg-blue-500 text-black' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label={`Go to page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;