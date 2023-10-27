import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";
import config from "../config.js";
import Contextpage from "../Contextpage";
import backgroundImage from "../assets/images/bg-img.jpg";

const LogInFrom = () => {
  const { setIsLoggedIn, setUser, loginsuccess } = useContext(Contextpage);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState([]);
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if (err.email === "" && err.password === "") {
      try {
        const res = await axios.post(`${config.host}/login`, values);

        if (res.data.errors) {
          setBackendError(res.data.errors);
        } else {
          setBackendError([]);
          if (res.data.success) {
            // alert("Login Success");
            loginsuccess();
            localStorage.setItem("user", JSON.stringify(res.data.data));
            setIsLoggedIn(true);
            setUser(res.data.data);
            
          } else {
            alert(res.data.msg);
          }
        }
      } catch (err) {
        console.error(err);
        alert(err.response.data.error);
      }
    }
  };
  const { GoogleLogin } = useContext(Contextpage);
  return (
    <div
      className="flex justify-center items-center h-screen bg-gray-900"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur bg-opacity-25 bg-blue-200/30 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-3xl font-bold mb-5 text-center">Login</h2>

        {backendError.length > 0 && (
          <div className="mb-4">
            {backendError.map((e, index) => (
              <p key={index} className="text-red-500">
                {e.msg}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="w-54 text-gray-800">
            <label
              htmlFor="email"
              className="cursor-text rounded-xl block text-md font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              onChange={handleInput}
              className={`bg-blue-100 w-full border px-3 py-2 rounded-md ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="w-54 mt-4 mb-5 text-gray-800">
            <label
              for="password"
              className="cursor-text block text-md font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleInput}
              className={`bg-blue-100 w-full border px-3 py-2 rounded-md ${errors.password ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                // Add any additional logic you want to execute on button click
                // For example, navigating to the signup page
                navigate("/signup");
              }}
              className="bg-rose-600 text-white px-4 py-2 mr-4 rounded-md hover:bg-rose-900 transition duration-300"
              >
              Sign Up
            </button>

            <button
              type="submit"
              className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-900 transition duration-300"
            >
              Log in
            </button>
          </div>

          <p className="text-xs mt-5 text-black text-center">
            You agree to our terms and policies
          </p>
        </form>

        <div className="flex items-center mt-">
          {/* Add your Google login button or icon here */}
        </div>
      </div>
    </div>
  );
};

export default LogInFrom;
