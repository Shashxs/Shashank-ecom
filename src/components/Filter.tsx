import React, { useState, useEffect } from 'react';

interface FilterProps {
  onApplyFilters: (filters: { colors: string[], priceRange: number, categories: string[], collections: string[] }) => void;
  onResetFilters: () => void;
  isVisible: boolean;
}

const Filter: React.FC<FilterProps> = ({ onApplyFilters, onResetFilters, isVisible }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  const [showCategories, setShowCategories] = useState<boolean>(false);
  const [showCollections, setShowCollections] = useState<boolean>(false);
  const [showColors, setShowColors] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://localhost:5000/categories')
      .then(response => response.json())
      .then(data => setCategories(data.map((cat: any) => cat.name)));

    fetch('http://localhost:5000/collection')
      .then(response => response.json())
      .then(data => setCollections(data.map((col: any) => col.name)));

    fetch('http://localhost:5000/color')
      .then(response => response.json())
      .then(data => setColors(data.map((col: any) => col.name)));

    fetch('http://localhost:5000/items')
      .then(response => response.json())
      .then(data => {
        const prices = data.map((item: any) => item.price);
        setMaxPrice(Math.max(...prices));
        setPriceRange(Math.max(...prices));
      });
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleCollectionChange = (collection: string) => {
    setSelectedCollections(prev =>
      prev.includes(collection) ? prev.filter(c => c !== collection) : [...prev, collection]
    );
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(event.target.value));
  };

  const applyFilters = () => {
    onApplyFilters({
      colors: selectedColors,
      priceRange,
      categories: selectedCategories,
      collections: selectedCollections,
    });
  };

  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedCategories([]);
    setSelectedCollections([]);
    setPriceRange(maxPrice);
    onResetFilters();
  };

  return (
    <div className={`p-6 bg-white mt-11 rounded-lg shadow-lg ${isVisible ? 'block' : 'hidden'}`}>
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg text-gray-800 flex justify-between items-center cursor-pointer" onClick={() => setShowCategories(!showCategories)}>
          Categories
          <span>{showCategories ? '▲' : '▼'}</span>
        </h3>
        {showCategories && (
          <div>
            {categories.map(category => (
              <div key={category} className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id={category}
                  name={category}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={() => handleCategoryChange(category)}
                />
                <label htmlFor={category} className="text-gray-700">{category}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg text-gray-800 flex justify-between items-center cursor-pointer" onClick={() => setShowCollections(!showCollections)}>
          Collections
          <span>{showCollections ? '▲' : '▼'}</span>
        </h3>
        {showCollections && (
          <div>
            {collections.map(collection => (
              <div key={collection} className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id={collection}
                  name={collection}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={() => handleCollectionChange(collection)}
                />
                <label htmlFor={collection} className="text-gray-700">{collection}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg text-gray-800 flex justify-between items-center cursor-pointer" onClick={() => setShowColors(!showColors)}>
          Colors
          <span>{showColors ? '▲' : '▼'}</span>
        </h3>
        {showColors && (
          <div>
            {colors.map(color => (
              <div key={color} className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id={color}
                  name={color}
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                />
                <label htmlFor={color} className="text-gray-700">{color}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg text-gray-800">Price Range</h3>
        <input
          type="range"
          min="0"
          max={maxPrice}
          step="100"
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          value={priceRange}
          onChange={handlePriceChange}
          style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(priceRange / maxPrice) * 100}%, #d1d5db ${(priceRange / maxPrice) * 100}%, #d1d5db 100%)` }}
        />
        <div className="text-gray-700 mt-2 text-center">Up to ${priceRange}</div>
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-grey px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mr-2"
          onClick={applyFilters}
        > 
          Apply Filter
        </button>
        <button
          className="bg-white-500 text-grey px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          onClick={resetFilters}
        >
          Reset Filter
        </button>
      </div>
    </div>
  );
};

export default Filter;