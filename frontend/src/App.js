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
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import CustomerOrders from "./components/CustomerOrders";
import CustomerOrder from "./components/CustomerOrder";

function App() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([])
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null)
  const [userDetails, setUserDetails] = useState()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  const handleProductAdd = async (product) => {
    try {
      const formData = new FormData()
      for (const key in product) 
       formData.append(key, product[key])

      const {data} = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/products`, formData,
      );

      setProducts([...products, data])
     toast.success("Product added!")
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!")
      return error
      
    }
  }

  const handleProductEdit = async (product) => {
    const original = products.find(p => p._id === product._id);

    const updated = products.map(item => item._id === product._id ? product : item)
    setProducts(updated)

    try {
      const {_id, image} = product;
      const imageFile = await base64ToFile(image, "image.png")

      const formData = new FormData();
      formData.append("name",product.name);
      formData.append("description",product.description);
      formData.append("price",product.price);
      formData.append("category",product.category);
      formData.append("brand",product.brand);
      formData.append("stock",product.stock);
      formData.append("image", imageFile)

      await axios.put(
        `${process.env.REACT_APP_API_ENDPOINT}/products/${_id}`,
        formData,
        {
          headers: {
          "Content-Type": "multipart/form-data",
          }
        }
      );
    } catch(error) {
      console.log(error)
      toast.error("Something went Wrong!");

      const updated = products.map(item => item._id === product._id ? original : item)
      setProducts(updated)
    }
  }

  const base64ToFile = async (base64String, fileName) => {
    const response = await fetch(base64String);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

  const handleProductDelete = async (product) => {
    const original = products;

    const updated = products.filter(p => p._id !== product._id)
    setProducts(updated);
    
    try {
      await axios.delete(process.env.REACT_APP_API_ENDPOINT+"/products/"+product._id);
    } catch(error) {
      setProducts(original)
      toast.error("Something went wrong!")
      console.log(error)
      return error;
    }
  }

  const handleProfileChange = async (profile) => {
    const {file, ...data} = profile
    const details = {
      ...data,
      image: file ? URL.createObjectURL(file) : userDetails.image
    };
    
    const original = userDetails;
    setUserDetails({...userDetails, ...details, });
    
    try {
      const formData = new FormData();
      for (const key in profile)
        formData.append(key,profile[key])

       await axios.post(
        process.env.REACT_APP_API_ENDPOINT + "/users/profile/" + userDetails._id,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

    } catch(error) {
      setUserDetails(original)
      console.log(error)
      toast.error("Something went wrong!", {autoClose: 1000});
      return error
    }
    // setUserDetails(pro)
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

  const populateUserDetails = async (id) => {
    try {
      const {data} = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/users/profile/"+id)
      setUserDetails(data)
    } catch(error) {
      console.log(error)
    }
  }

  const fetchProducts = async () => {
    try {
      const {data} = await axios.get(process.env.REACT_APP_API_ENDPOINT+"/products");
      setProducts(data)
    } catch(error) {
      console.log(error)
    }
  }
  
  const populateItems = (products) => {
    const items = JSON.parse(localStorage.getItem("items")) || [];

   for (const item of items) 
      item.product = products.find(p=> p._id === item.product._id)
   setItems(items)
  };

  useEffect(() => {
    populateItems(products)
  }, [products])
  
  
  useEffect(() => {
    fetchProducts()
    const token = localStorage.getItem("token");
    if (token) {
      const { _id, isAdmin } = jwt.read(token).claim;
      setUser({_id, isAdmin})
      populateUserDetails(_id)
    }
  }, []);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Navbar user={userDetails} itemsInCart={items.length} />
        <main className="main">
        <Routes>
            <Route path="/" element={<Main user={userDetails} products={products} />} />
            <Route path="/product/:id" element={<Product user={user} onProductDelete={handleProductDelete} products={products} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart} onBuy={handleBuy} />}/>
            {!(user?.isAdmin) && <Route path="/cart" element={ <Cart items={items} onIncreaseQuantity={handleIncreaseQuantity} onDecreaseQuantity={handleDecreaseQuantity} onRemoveFromCart={handleRemoveFromCart} />} />}
            {!(user?.isAdmin) && <Route path="/checkout" element={<Checkout items={items} onCheckout={handleOrderCheckout} />}/>}
            {!(user?.isAdmin) && <Route path="/checkout/:id" element={product ? (<Checkout items={[{ product, quantity: 1 }]} onCheckout={handleOrderCheckout} /> ) : ( <Navigate to={"/"} />)} />}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/profile" element={ <Profile user={userDetails} onLogout={handleLogout} onProfileChange={handleProfileChange}  /> } />
            {!(user?.isAdmin) && <Route path="/orders" element={<Order />} />}
            <Route path="/shop" element={<Products user={user} products={products} />} />
            {user?.isAdmin && <Route path="/add-product" element={<AddProduct onAddProduct={handleProductAdd} />} />}
            {user?.isAdmin && <Route path="/edit-product/:id" element={<EditProduct products={products} onEdit={handleProductEdit}/>} />}
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
