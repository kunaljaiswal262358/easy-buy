import React, { useState } from "react";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    stock: "",
    price: "",
    image: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to backend
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
        console.log({...formData,stock: Number(formData.stock)})
      const res = await fetch("http://localhost:5000/api/products",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify({...formData,stock: Number(formData.stock)})
      });
      const result = await res.json();
      console.log(result)
      alert("Product added successfully!");
      setFormData({ name: "", price: "", description: "", category: "", brand : "", stock: 0, image: "" }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="product-form">
      <h2>Add New Product</h2>
      <form onSubmit={handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
         <select id="brand" className="" name="brand" value={formData.brand} onChange={handleInputChange}>
          <option value="">Select Brand</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="Puma">Puma</option>
          <option value="other">Other</option>
        </select>
        <select id="category" className="" name="category" value={formData.category} onChange={handleInputChange}>
          <option value="">All</option>
          <option value="Electronics">Electronics</option>
          <option value="Shoes">Shoes</option>
          <option value="Clothing">Clothing</option>
          <option value="Home and Furniture">Home & Furniture</option>
        </select>
        <input type="number" name="stock" id="stock" value={formData.stock} placeholder="Number of items" onChange={handleInputChange}/>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
