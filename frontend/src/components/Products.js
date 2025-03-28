import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Products.css"

const Products = ({user}) => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const location = useLocation()

  const populateProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/products`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    populateProducts();
  }, []);

  return (
    <section>
      {location.pathname === "/shop" && <h2 className="product-title">Products</h2>}
      <div className="products grid grid--1x3">
        {products.map((product) => (
          <div key={product._id}>
            <Link className="product-link" key={product._id} to={"/product/" + product._id}>
            <div className="card product__card">
              <img src={product.image} alt="product image" />
               <h2 className="product__title">{product.name}</h2>
              <span className="product__price">₹{product.price}.00</span>
            </div>
          </Link>
          <div>{user?.isAdmin && <button onClick={() =>navigate("/edit-product/"+product._id)} className="btn btn--edit">Edit</button> }</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
