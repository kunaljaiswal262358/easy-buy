import { useContext, useEffect, useRef, useState } from "react";
import React from "react";
import { Link, useNavigate , useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FilterProduct from "./FilterProduct";

function Navbar({ updateFilters }) {
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation()
  const [display, setDisplay] = useState(true);
  const navLinks = useRef(null);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission (optional)
      handleSearch();
    }
  };

  const handleSearch = () => {
    updateFilters({ search: search });
  };

  const handleClick = () => {
    if (display) {
      navLinks.current.style.display = "flex";
      setDisplay(false);
    } else {
      navLinks.current.style.display = "none";
      setDisplay(true);
    }
  };

  const doLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/logIn");
    }, 0);
  }

  return (
    <>
      <header>
        <nav>
          <div className="logo">
            <Link to={"/"} >
              <img
                src="/images/easy-buy-logo.png"
                alt="an image of easy buy logo"
              />
            </Link>
          </div>
          <ul>
            <li className="search">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="search"
              />
              <i
                onClick={handleSearch}
                className="fa-solid fa-magnifying-glass"
              ></i>
            </li>
            <li>
              <FilterProduct updateFilters={updateFilters} />
            </li>
            <ul ref={navLinks} className="nav-links">
              <li>
                <Link to={"/"} className={location.pathname === "/" ? "active" : ""}>Home</Link>
              </li>

              {user?.role === "Admin" ? (
                <li>
                  <Link to={"/addProduct"} className={location.pathname === "/addProduct" ? "active" : ""}>Add Product</Link>
                </li>
              ) : (
                <li>
                  <Link to={"/carts"} className={location.pathname === "/carts" ? "active" : ""}>Carts</Link>
                </li>
              )}
              {user?.role === "User" ? (
                <li>
                  <Link to={"/dashboard"} className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
                </li>
              ) : (
                ""
              )}
              {user?.role === "Admin" ? (
                <li>
                <Link to={"/orders"} className={location.pathname === "/orders" ? "active" : ""}>Orders</Link>
              </li>
              ) : (
                ""
              )}
              {user ? (
                <li>
                  <Link onClick={()=>doLogout()} >Logout</Link>
                </li>
              ) : (
                <li>
                  <Link to={"/logIn"} className={location.pathname === "/logIn" ? "active" : ""}>Login</Link>
                </li>
              )}
              {user ? (
                ""
              ) : (
                <li>
                  <Link to={"/signUp"} className={location.pathname === "/signUp" ? "active" : ""}>SignUp</Link>
                </li>
              )}
              <li />
            </ul>
            <li onClick={() => handleClick()} className="hamburger">
              {display ? (
                <i class="fa-solid fa-bars"></i>
              ) : (
                <i class="fa-solid fa-xmark"></i>
              )}
            </li>
            <li></li>
          </ul>
        </nav>

      </header>
    </>
  );
}

export default Navbar;
