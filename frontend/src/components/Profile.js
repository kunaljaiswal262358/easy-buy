import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = ({user, onLogout , onProfileChange}) => {
  const navigate = useNavigate()
  const [isChanged, setIsChanged] = useState(false)
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null)
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setIsChanged(true)
    setData({ ...data, [name]: value });
  };

  const saveChanges = async () => {
    setIsChanged(false)
    navigate(-1)
    
    onProfileChange({...data, file});
  };

  const logout = () => {
   onLogout()
    window.location.href = "/";
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsChanged(true)
  };

  const updateUserData = (user) => {
    const userData = {...data}
    for (const key in data) {
      if(user.hasOwnProperty(key)) {
        userData[key] = user[key]
      }
    }
    setData(userData)

    if(user.image) setImage(user.image)
  }

  useEffect(() => {
    
    if(user) 
      updateUserData(user)
    
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) navigate("/login")
  }, [])
  
  
  return (
    <div className="profile">
      <div className="profile__header image">
        <img src={preview ? preview : image ? image : "images/user.png"} alt="Profile image" />
        <input className="upload" type="file" accept="image/*" onChange={handleFileChange}/>
        <button className="btn btn--outline"><i className="fa-solid fa-trash"></i> Remove</button>
      </div>
      <div className="profile__body">
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={data.name} onChange={handleChange}/>
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="text" name="email" value={data.email} onChange={handleChange}/>
        </div>
        <div className="input-group">
          <label htmlFor="address">Address</label>
          <input type="text" name="address" value={data.address} onChange={handleChange}/>
        </div>
        <div className="input-group">
          <label htmlFor="city">City</label>
          <input type="text" name="city" value={data.city} onChange={handleChange}/>
        </div>
        <div className="input-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input type="text" name="postalCode" value={data.postalCode} onChange={handleChange}/>
        </div>
        <div className="input-group">
          <label htmlFor="state">State</label>
          <input type="text" name="state" value={data.state} onChange={handleChange}/>
        </div>
        <div className="input-group">
          <label htmlFor="country">Country</label>
          <input type="text" name="country" value={data.country} onChange={handleChange}/>
        </div>
        <div>
          <button disabled={!isChanged} onClick={saveChanges} className={isChanged ? "btn btn--primary btn--save" : "btn btn--primary btn--save disabled"}>Save Change</button>
          <button onClick={logout} className="btn btn--red btn--delete">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
