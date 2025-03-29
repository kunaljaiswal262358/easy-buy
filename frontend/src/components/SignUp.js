import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Joi from "joi";

const SignUp = (props) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({name: "", email: "", password: "",confirmPassword: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateUser = () => {
    const schema = Joi.object({
      name: Joi.string().required().label("Name"),
      email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
      password: Joi.string().min(5).required().label("Password"),
      confirmPassword: Joi.valid(Joi.ref("password")).required().label("Password").messages({"any.only": "Passwords do not match.",})
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
      const payload = {...user}
      delete payload.confirmPassword
      const result = await axios.post(
        process.env.REACT_APP_API_ENDPOINT + "/users/register",
        payload
      );
      const token = result.headers['x-auth-token'];

      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch (error) {
      console.log(error)
      setError({generic: error.response.data.message})
    }
    setLoading(false)
  };

   useEffect(() => {
      const token = localStorage.getItem('token')
      if(token) navigate("/profile")
    }, [])

  return (
    <div className="signup">
      <h2 className="signup__title">Signup</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="form">
      <input
            className="form__input"
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Name"
          />
          {error.name && <p className="form__error">{error.name}</p>}
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
          <input
            className="form__input"
            type="password"
            name="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
          />
          {error.confirmPassword && <p className="form__error">{error.confirmPassword}</p>}
          {error.generic && <p className="form__error">{error.generic}</p>}
          <button disabled={loading} className={`btn btn--primary form__button ${loading ? 'disabled' : ''}`}>{loading ? "Processing" : "Signup"}</button>
          <Link className="auth-switch" to={"/login"}>Already have an account? Login</Link>
        </form>
      </div>
  );
};

export default SignUp;
