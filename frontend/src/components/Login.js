import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Joi from "joi";

const Login = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ email: "", password: ""  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateUser = () => {
    const schema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .label("Email"),
      password: Joi.string().min(1).required().label("Password"),
    });

    return schema.validate(user, { abortEarly: false });
  };

  const checkError = () => {
    const error = {};
    const result = validateUser();
    if (result.error) {
      result.error.details.forEach((e, i) => {
        error[e.path[0]] = e.message;
      });
      setError(error);
      return true;
    }

    setError(error);
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkError()) return;
    setLoading(true)

    try {
      const result = await axios.post(process.env.REACT_APP_API_ENDPOINT+"/users/login",user)
      const token = result.data;

      localStorage.setItem('token',token)
      window.location.href = "/"
    } catch(error) {
      if(error.response) setError({generic: error.response.data})
      else setError({generic: "Service is unavailable"})
      }
      setLoading(false)
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) navigate("/profile")
  }, [])
  

  return (
    <>
      <div className="login">
        <h2 className="login__title">Login</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="form">
          <input
            className="form__input"
            type="text"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {error.email && <p className="form__error">{error.email}</p>}
          <input
            className="form__input"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {error.password && <p className="form__error">{error.password}</p>}
          {error.generic && <p className="form__error">{error.generic}</p>}
          <button disabled={loading} className={`btn btn--primary form__button ${loading ? 'diabled' : ''}`}>{loading ? "Processing" : "Login"}</button>
          <Link className="auth-switch" to={"/signup"}>Do not have an Account? SignUp</Link>
        </form>
      </div>
    </>
  );
};

export default Login;
