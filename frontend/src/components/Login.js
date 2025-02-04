import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const {login} = useContext(AuthContext)
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect") || "/";
  const error = useRef(null)
  const [formData, setFormData] = useState({email: "", password: ""}); 

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const showError = (msg) => {
    error.current.style.display="block";
    error.current.textContent=msg;
  }
  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      let res = await login(formData.email,formData.password)
      
      //check for errors
      if(res) {
        const result = await res.json();
        showError(result.message);
      } else {
        setFormData({});
        console.log(navigate,redirectPath)
        navigate(redirectPath)
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  }
  return (
    <>
      <div className="login auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="email">Email</label>
            <input className="email" type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required/>
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <div ref={error} className="error"></div>
      </div>
    </>
  );
};

export default Login;
