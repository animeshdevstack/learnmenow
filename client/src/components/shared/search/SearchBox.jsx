import React from 'react'
import { Search } from 'lucide-react'
import './SearchBox.css'

const SearchBox = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className = "",
  width = "200px"
}) => {
  return (
    <div className={`search-box ${className}`} style={{ width }}>
      <Search size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="search-input"
      />
    </div>
  )
}

export default SearchBox
