import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"

function Navbar({user, itemsInCart}) {
  const [image, setImage] = useState(null)

  const toggleLinks = (e) => {
    e.target.classList.toggle("fa-xmark");
    document
      .getElementsByClassName("collapsible")[0]
      .classList.toggle("collapsible--expanded");
  };

  useEffect(() => {
    if(user) setImage(user.image)
  }, [user])
  

  return (
    <nav className="nav">
      <Link to={"/"}>
        <img className="logo-image" src="/images/logo.png" alt="an image of logo" />
            </Link>
      <ul className="list list--inline nav--list collapsible">
        <li className="list__item"><Link className="nav-link"  to={"/"}>Home</Link></li>
        <li className="list__item"><Link className="nav-link" to={"/shop"} >Shop</Link></li>
        {!(user?.isAdmin) && <li className="list__item"><Link className="nav-link" to={"/orders"} >Orders</Link></li>}
        {user?.isAdmin && <li className="list__item"><Link className="nav-link" to={"/customer-orders"} >See Orders</Link></li>}
        {!(user?.isAdmin) && <li className="list__item"><Link className="nav-link"  to={"/cart"}>Cart {itemsInCart > 0 && <span>({itemsInCart})</span>}</Link></li>}
        {user?.isAdmin && <li className="list__item"><Link className="nav-link"  to={"/add-product"}>Add Product</Link></li>}
            </ul>
      <div className="btn-bars-container">
        <span className="auth-btns">
          {!user && (
            <>
              <Link className="btn btn--link" to={"/login"}>
                Log in
              </Link>
              <Link className="btn btn--outline btn--link" to={"/signup"}>
                Sign up
              </Link>
            </>
          )}
          {user && <Link to={"/profile"}><img className="user-image" src={image? image: "/images/user.png"} alt="User image"/></Link> }
        </span>
        <span className="nav__bars toggler">
          <i onClick={(e) => toggleLinks(e)} className="fa-solid fa-bars"></i>
        </span>
      </div>
        </nav>
  );
}

export default Navbar;
