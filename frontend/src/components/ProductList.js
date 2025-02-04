import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProductList = ({filters}) => {
  const [products, setproducts] = useState([]);
  const [inCart, setinCart] = useState([]);
  const {user} = useContext(AuthContext)

  const makeUrl = (baseUrl,userFilter) => {
    let queryParams = [];

    if (filters.brand?.trim() !== "") queryParams.push("brand=" + filters.brand);
    if (filters.category?.trim() !== "") queryParams.push("category=" + filters.category);
    if (filters.minPrice?.trim() !== "") queryParams.push("minPrice=" + filters.minPrice);
    if (filters.maxPrice?.trim() !== "") queryParams.push("maxPrice=" + filters.maxPrice);
    if (filters.rating?.trim() !== "") queryParams.push("minRating=" + filters.rating);
    if (filters.search?.trim() !== "") queryParams.push("search=" + filters.search);
    
    if (queryParams.length > 0) {
        baseUrl += "?" + queryParams.join("&");
    }
    return baseUrl;
  }

  useEffect(() => {
    if(localStorage.getItem("products"))
      setinCart(JSON.parse(localStorage.getItem("products")))
    let url = makeUrl("http://localhost:5000/api/products",filters)
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setproducts(data.products);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [filters]);

  const addProductToCart = (e,product) => {
    e.stopPropagation()
    e.preventDefault()
    setinCart([...inCart, {...product,quantity: 1}]);
    localStorage.setItem("products", JSON.stringify([...inCart, {...product,quantity: 1}]));

    //update products
    let id = product._id;
    const updatedProducts = products.map(product => product._id === id ? {...product,isInCart: true} : product);
    setproducts(updatedProducts);
  };

  const removeProductFromCart = (e,id) =>{
    e.stopPropagation();
    e.preventDefault();
    const updatedCart = inCart.filter(product => product._id !== id);
    console.log(updatedCart)
    setinCart(updatedCart);
    localStorage.setItem("products",JSON.stringify(updatedCart))
    

    //update products
    const updatedProducts = products.map(product => product._id === id ? {...product,isInCart: false} : product);
    setproducts(updatedProducts);
  }
  return (
    <>
      <section>
        <div className="products">
          {products.length === 0 ? (<p className="no-orders">No orders found.</p>):""}
          {products.map((product) => (
            <Link to={`/product/${product._id}`} style={{textDocaration:"none"}}>
            <div key={product._id} className="product">
              <div className="image-container">
                <img src={product.image} alt="an image of oppo reno 87" />
              </div>
              <p id="title" className="title">{product.name}</p>
              {/* {product.description !== "" 
              ? <p id="desc">{product.description}</p>
            : ""} */}
              <p>
                Price: <span>₹{product.price}</span>
              </p>
              {user?.role === "Admin" ? " ": <>
                {inCart.some(item => item._id === product._id)  ? (
                <button  className="btn remove" onClick={(e) => removeProductFromCart(e,product._id)}>
                  Remove from cart
                </button>
              ) : (
                <button className="btn" onClick={(e) => addProductToCart(e,product)}>
                  Add to cart 
                </button>
              )}
              </>}
            </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductList;
