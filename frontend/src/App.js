import "./App.css";
// require('dotenv').config({path: './config.env'});
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import SignUp from "./components/SignUp";
import { useState } from "react";
import Login from "./components/Login";
import Carts from "./components/Carts";
import Banner from "./components/Banner";
import Dashboard from "./components/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import AuthContext from "./context/AuthContext";
import ProductForm from "./components/ProductForm";
import OrderList from "./components/OrderList";
import OrderDetails from "./components/OrderDetails";
import ProductDetails from "./components/ProductDetails";

function App() {
  const [filters, setFilters] = useState({brand: "", category: "", minPrice: "", maxPrice: "", rating: "", search: ""});
  const {user} = useContext(AuthContext)
  
  const updateFilters = (userFilters) => {
    setFilters({...filters,...userFilters});
  };
  return (
    <>
      <Router>
        <Navbar updateFilters={updateFilters} />
        <Routes>
          <Route path="/" element={<><Banner/><ProductList filters={filters}/></>}></Route>
          <Route path="/product/:productId" element={<ProductDetails/>}></Route>
          <Route path="/logIn" element={<Login/>}></Route>
          <Route path="/signUp" element={<SignUp/>}></Route>

          {/* for users */}
          {user?.role !== "Admin" ?  <Route path="/carts" element={<Carts/>}></Route> : ""}
          {user?.role === "User" ? (
          <Route path="/dashboard" element={
            <PrivateRoutes><Dashboard/></PrivateRoutes>}>
          </Route>
          ) : ""}

          {/* for admin */}
          {user?.role === "Admin" ? <Route path="/orders/" element={<OrderList/>}></Route> : ""}
          {user?.role === "Admin" ? <Route path="/order/:orderId" element={<OrderDetails/>}></Route> : ""}
          {user?.role === "Admin" ? <Route path="/addProduct" element={<ProductForm/>}></Route> : ""}
        </Routes>
        <Footer/>
      </Router>
    </>
  );
}

export default App;
