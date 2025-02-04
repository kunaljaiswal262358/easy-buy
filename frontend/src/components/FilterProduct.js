import React, { useEffect, useRef, useState } from "react";

const FilterProduct = ({updateFilters}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filters, setFilters] = useState({brand: "", category: "", minPrice: "", maxPrice: "",rating: ""});

  const handleChange = (e) => {
    setFilters({...filters, [e.target.name] : e.target.value})
  }

  const applyFilter = () => {
    updateFilters(filters)
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div ref={dropdownRef}  className="filterProduct">
        <button onClick={() => setIsOpen(!isOpen)} className="">Filters ▼</button>
        {isOpen 
        ? <div className="filterDropdown">
        <label htmlFor="brand" className="">
          Brand:
        </label>
        <select id="brand" className="" name="brand" value={filters.brand} onChange={handleChange}>
          <option value="">Select Brand</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="Puma">Puma</option>
        </select>

        <label htmlFor="category" className="">
          Category:
        </label>
        <select id="category" className="" name="category" value={filters.category} onChange={handleChange}>
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Shoes">Shoes</option>
          <option value="Clothing">Clothing</option>
          <option value="Home and Furniture">Home & Furniture</option>
        </select>

        <label htmlFor="min-price" className="">
          Min Price:
        </label>
        <input
          type="number"
          id="min-price"
          className=""
          placeholder="Min Price"
          name="minPrice" 
          value={filters.minPrice}
          onChange={handleChange}
        />

        <label htmlFor="max-price" className="">
          Max Price:
        </label>
        <input
          type="number"
          id="max-price"
          className=""
          placeholder="Max Price"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
        />

        <label htmlFor="rating" className="">
          Rating:
        </label>
        <select id="rating" className="" name="rating" value={filters.rating} onChange={handleChange}>
          <option value="">Select Rating</option>
          <option value="1">⭐ 1 Star</option>
          <option value="2">⭐⭐ 2 Stars</option>
          <option value="3">⭐⭐⭐ 3 Stars</option>
          <option value="4">⭐⭐⭐⭐ 4 Stars</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
        </select>

        <button onClick={applyFilter} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">
            
          Apply Filters
        </button>
      </div> 
      : ""}
      </div>
    </>
  );
};

export default FilterProduct;
