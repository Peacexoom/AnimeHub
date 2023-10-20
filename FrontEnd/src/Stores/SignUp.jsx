import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignupValidation";
import axios from "axios";
import config from "../config";
import backgroundImage from "../assets/images/bg-img.jpg";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if (err.name === "" && err.email === "" && err.password === "") {
      axios
        .post(`${config.host}/signup`, values)
        .then((res) => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div
      className="flex justify-center items-center h-screen bg-gray-900"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="backdrop-blur-md bg-opacity-25 bg-blue-200/30 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-3xl font-bold mb-5 text-center">
          Sign Up
        </h2>
        <form action="" onSubmit={handleSubmit}>
          <div className="w-54 text-gray-800">
            <label
              htmlFor="name"
              className="cursor-text block text-md font-semibold mb-1 rounded-xl"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              onChange={handleInput}
              className={`bg-blue-100 w-full border px-3 py-2 rounded-md ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div className="w-54 mt-4 text-gray-800">
            <label
              htmlFor="email"
              className="cursor-text block text-md font-semibold mb-1 rounded-xl"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              onChange={handleInput}
              className={`bg-blue-100 w-full border px-3 py-2 rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          <div className="w-54 mt-4 mb-5 text-gray-800">
            <label
              htmlFor="password"
              className="cursor-text block text-md font-semibold mb-1 rounded-xl"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleInput}
              className={`bg-blue-100 w-full border px-3 py-2 rounded-md ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password}</span>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                navigate("/");
              }}
              className="bg-rose-600 text-white px-4 py-2 mr-4 rounded-md hover:bg-rose-800 transition duration-300"
              >
              Log in
            </button>

            <button
              className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-800 transition duration-300"
              type="submit"
            >
              Register
            </button>
          </div>
          <p className="text-xs mt-5 text-black text-center">
            You agree to our terms and policies
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
