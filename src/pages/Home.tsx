import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Filter from '../components/Filter';
import ProductList from '../components/ProductList';

const Home: React.FC = () => {
  const [filters, setFilters] = useState({
    colors: [],
    priceRange: 10000,
    categories: [],
    collections: [],
  });
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleApplyFilters = (appliedFilters: any) => {
    setFilters(appliedFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      colors: [],
      priceRange: 10000,
      categories: [],
      collections: [],
    });
  };

  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Navbar onToggleFilter={handleToggleFilter} onSearch={handleSearch} />
      <div className="flex flex-col lg:flex-row w-full">
        {isFilterVisible && (
          <div className="lg:w-1/4 p-4">
            <Filter onApplyFilters={handleApplyFilters} onResetFilters={handleResetFilters} isVisible={isFilterVisible} />
          </div>
        )}
        <div className={`p-4 ${isFilterVisible ? 'lg:w-3/4' : 'lg:w-350'}`}>
          <ProductList filters={filters} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default Home;