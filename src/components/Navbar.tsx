import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

interface NavbarProps {
  onToggleFilter: () => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleFilter, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav className={`bg-white py-2 px-6 text-gray-800 flex justify-between items-center flex-wrap shadow-md w-full fixed top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`} aria-label="Main Navigation">
      <div className="flex items-center space-x-6">
        <button onClick={onToggleFilter} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-full transition duration-300" aria-label="Toggle Filter">
          <FiMenu className="h-6 w-6" />
        </button>
        <Link to="/" className="text-lg font-bold hover:text-gray-500 transition duration-300" aria-label="Home">Home</Link>
        <Link to="/favourites" className="text-lg font-bold hover:text-gray-500 transition duration-300" aria-label="Favourites">Favourites</Link>
        <Link to="/shop" className="text-lg font-bold hover:text-gray-500 transition duration-300" aria-label="Shop">Shop</Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-lg font-bold hover:text-gray-500 transition duration-300" aria-label="Logo">
          <img src="src\assets\logofinal.png" alt="Logo" className="h-12" />
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative w-48 sm:w-56 md:w-64">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 pl-10 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300 shadow-sm w-full"
            aria-label="Search"
          />
          <div className="absolute top-0 left-0 p-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <Link to="/cart" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-full transition duration-300" aria-label="Cart">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Link>
        <Link to="/login" className="text-lg hover:text-gray-500 transition duration-300" aria-label="Login">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;