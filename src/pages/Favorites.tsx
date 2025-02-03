import React from 'react';
import Navbar from '../components/Navbar';

const Favorites: React.FC = () => {
  const handleToggleFilter = () => {
  };

  return (
    <div>
      <Navbar onToggleFilter={handleToggleFilter} onSearch={function (): void {
        throw new Error('Function not implemented.');
      }} />
      <div className="container mx-auto p-12">
        <h1 className="text-3xl font-bold mb-6 text-right">Favorites</h1>
        <p className="text-gray-600 text-center">You liked none☹️.</p>
      </div>
    </div>
  );
};

export default Favorites;