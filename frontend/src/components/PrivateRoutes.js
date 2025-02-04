import react, {useState, useEffect } from 'react'
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoutes = ({children}) => {
    const {user} = useContext(AuthContext);

   //needs to be modify
    
    
    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoutes
