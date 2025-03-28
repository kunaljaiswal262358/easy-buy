import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import axios from "axios";
import jwt from "jwt-client";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Login from "./components/Login";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Order from "./components/MyOrder";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import NotFound from "./components/NotFound";
import Main from "./components/Main";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import CustomerOrders from "./components/CustomerOrders";
import CustomerOrder from "./components/CustomerOrder";

function App() {
  const [items, setItems] = useState([]);
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const handleProfileChange = (updatedUser) => {
    setUser(updatedUser)
  }


  const handleOrderCheckout = (orderedItems) => {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.filter((item) => {
      const ordered = orderedItems.some(
        (i) => i.product._id === item.product._id
      );
      return !ordered;
    });

    setItems(items);
    localStorage.setItem("items", JSON.stringify(items));
  };

  const handleAddToCart = (product) => {
    const quantity = product.stock > 0 ? 1 : 0;
    setItems([...items, { product, quantity }]);
    localStorage.setItem(
      "items",
      JSON.stringify([...items, { product, quantity }])
    );
  };

  const handleRemoveFromCart = (product) => {
    const filtered = items.filter((item) => item.product._id !== product._id);
    setItems(filtered);

    localStorage.setItem("items", JSON.stringify(filtered));
  };

  const handleBuy = (product) => {
    setProduct(product);
  };

  const handleIncreaseQuantity = (product) => {
    const result = items.map((item) => {
      if (
        item.product._id === product._id &&
        item.product.stock - item.quantity > 0
      )
        item.quantity++;
      return item;
    });
    setItems(result);
    localStorage.setItem("items", JSON.stringify(result));
  };

  const handleDecreaseQuantity = (product) => {
    const result = items.map((item) => {
      if (item.product._id === product._id && item.quantity > 1)
        item.quantity--;

      return item;
    });
    setItems(result);
    localStorage.setItem("items", JSON.stringify(result));
  };

  const populateItems = () => {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    
    setItems(items);
  };

  useEffect(() => {
    populateItems()
    const token = localStorage.getItem("token");
    if (token) {
      const { _id, isAdmin } = jwt.read(token).claim;
      setUser({_id, isAdmin})
    }
  }, []);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Navbar user={user} itemsInCart={items.length} />
        <main className="main">
        <Routes>
            <Route path="/" element={<Main user={user} />} />
            <Route path="/product/:id" element={<Product user={user} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onBuy={handleBuy} />}/>
            {!(user?.isAdmin) && <Route path="/cart" element={ <Cart items={items} onIncreaseQuantity={handleIncreaseQuantity} onDecreaseQuantity={handleDecreaseQuantity} onRemoveFromCart={handleRemoveFromCart} />} />}
            {!(user?.isAdmin) && <Route path="/checkout" element={<Checkout items={items} onCheckout={handleOrderCheckout} />}/>}
            {!(user?.isAdmin) && <Route path="/checkout/:id" element={product ? (<Checkout items={[{ product, quantity: 1 }]} onCheckout={handleOrderCheckout} /> ) : ( <Navigate to={"/"} />)} />}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={ <Profile user={user} onLogout={handleLogout} onProfileChange={handleProfileChange}  /> } />
            {!(user?.isAdmin) && <Route path="/orders" element={<Order />} />}
            <Route path="/shop" element={<Products user={user} />} />
            {user?.isAdmin && <Route path="/add-product" element={<AddProduct />} />}
            {user?.isAdmin && <Route path="/edit-product/:id" element={<EditProduct />} />}
            {user?.isAdmin && <Route path="/customer-orders" element={<CustomerOrders />} />}
            {user?.isAdmin && <Route path="/customer-order/:id" element={<CustomerOrder />} />}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
