import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-4 py-2 pl-10 pr-4 text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
        placeholder="Buscar usuario..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-800 hover:text-primary-600 transition-colors"
        onClick={handleSearch}
        aria-label="Buscar"
      >
        <FiSearch size={20} />
      </button>
    </div>
  );
};

export default SearchBar; 