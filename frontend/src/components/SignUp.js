import React, { useState ,useRef} from "react";
import {useNavigate} from "react-router-dom";

const SignUp = (props) => {
  const navigate = useNavigate();
  const error = useRef(null)
  const [formData, setFormData] = useState({email: "", password: "", confirmPassword: "", mobile: "",
    shippingAddress: {fullName: "", address: "", city: "", postalCode: "", country: ""}
  }); 

  const handleChange = (e) => {
    if(e.target.name === "fullName" || e.target.name === "address" || e.target.name === "city" || e.target.name === "country" || e.target.name==="postalCode")
      setFormData({...formData,shippingAddress: {...formData.shippingAddress,  [e.target.name]: e.target.value}})
    else 
      setFormData({...formData, [e.target.name]: e.target.value})
  }

  const showError = (msg) => {
    console.log(msg)
    error.current.style.display="block";
    error.current.textContent=msg;
  }
  const handleSubmit= async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      //check for errors
      if(response.status === 400) {
        showError(result.message);
      } else {
        navigate("/login")
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  }
  return (
    <>
      <div className="signUp auth-container">
        <h2>SignUp</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="fullName">First Name</label>
            <input type="text" name="fullName" id="fullName" value={formData.shippingAddress.fullName} onChange={handleChange} required/>
          </div>
          <div className="input-box">
            <label htmlFor="email">Email</label>
            <input className="email" type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required/>
          </div>
          <div className="input-box">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>
          <div className="input-box">
            <label htmlFor="mobile">Mobile</label>
            <input type="text" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} required/>
          </div>
          <div className="address">
            <div className="input-box">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" value={formData.shippingAddress.address} onChange={handleChange} required/>
            </div>
            <div className="input-box">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" value={formData.shippingAddress.city} onChange={handleChange} required/>
            </div>
            <div className="input-box">
              <label htmlFor="postalCode">Postal Code</label>
              <input type="text" id="postalCode" name="postalCode" value={formData.shippingAddress.postalCode} onChange={handleChange} required/>
            </div>
            <div className="input-box">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" name="country" value={formData.shippingAddress.country} onChange={handleChange} required/>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
        <div ref={error} className="error">
          
        </div>
      </div>
    </>
  );
};

export default SignUp;
