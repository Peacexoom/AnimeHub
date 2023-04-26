import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Validation from "./SignupValidation";

import axios from "axios";
import config from "../config";

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
      [event.target.name]: [event.target.value],
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if (err.name === "" && err.email === "" && err.password === "") {
      axios
        .post(`${config.ip}/signup`, values)
        .then((res) => {
          navigate("/");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div
      className="border-2 border-white/30 p-5 bg-[#757575] flex justify-center items-center gap-5 h-96 rounded-2xl cursor-pointer "
    //   onClick={GoogleLogin}
    >
      <div className="d-flex justify-content-center align-items-center bg-primary vh-100 h-96 bg-[#757575]">
        <div className="p-3 rounded w-25 first-letter:h-90 bg-[#757575] ">
          <h2 className="p-5 text-2xl text-center font-bold">Sign-Up</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                name="name"
                onChange={handleInput}
                className="form-control rounded-0 mx-2 ml-8 py-1 px-3 bg-white text-black font-semibold rounded-xl hover:border-blue-600"
              />
              {errors.name && (
                <span className="text-danger"> {errors.name}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={handleInput}
                className="form-control rounded-0 mx-2 py-1 ml-9 px-3 bg-white text-black font-semibold rounded-xl hover:border-blue-600"
              />
              {errors.email && (
                <span className="text-danger"> {errors.email}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleInput}
                className="form-control rounded-0 mx-2 py-1 px-3 ml-2 bg-white text-black font-semibold rounded-xl hover:border-blue-600"
              />
              {errors.password && (
                <span className="text-danger"> {errors.password}</span>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0 py-2 px-7 m-5 bg-teal-400 text-black font-semibold rounded-xl"
            >
              {" "}
              Sign up
            </button>
            <Link
              to="/"
              className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none py-2 px-7 mt-10 bg-teal-400 text-black font-semibold rounded-xl"
              >
              Login
            </Link>
                <p>You are agree to aour terms and policies</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
