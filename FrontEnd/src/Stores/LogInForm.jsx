// import {react} from 'react'
// import InputField from "./InputField";
// import SubmitButton from "./SubmitButton";
import axios from "axios";
import Contextpage from '../Contextpage';
import React, { useState , useContext} from "react";
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LoginValidation";

const LogInFrom = () => {
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
      [event.target.name]: [event.target.value],
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const err = Validation(values);
    setErrors(err);
    if (err.email === "" && err.password === "") {
      axios
        .post("http://localhost:8081/login", values)
        .then((res) => {
          if (res.data.errors) {
            setBackendError(res.data.errors);
          } else {
            setBackendError([]);
            if (res.data === "Success") {
              navigate("/genres");
            } else {
              alert("No record existed");
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const {GoogleLogin} = useContext(Contextpage); 
  return (
    <div
      className="border-2 border-white/30 p-5 bg-[#757575] flex justify-center items-center gap-5 h-96 rounded-2xl cursor-pointer "
      onClick={GoogleLogin}
    >
      <div className="d-flex justify-content-center align-items-center bg-primary vh-100 h-96 bg-[#757575]">
        <div className=" p-3 rounded w-25 first-letter:h-90 bg-[#757575] ">
          <h2 className="p-5 text-2xl text-center font-bold">Sign-In</h2>
          {backendError ? (
            backendError.map((e) => <p className="text-danger">{e.msg}</p>)
          ) : (
            <span></span>
          )}
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="mr-8">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={handleInput}
                className="form-control rounded-0 mx-2 py-1 px-3 bg-white text-black font-semibold rounded-xl hover:border-blue-600"
              />
              {errors.email && (
                <span className="text-danger"> {errors.email}</span>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="mr-1">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleInput}
                className="form-control rounded-0 py-1 px-3 mx-2 bg-white text-black font-semibold rounded-xl hover:border-blue-600"
              />
              {errors.password && (
                <span className="text-danger"> {errors.password}</span>
              )}
            </div>
            <button type="submit" className="btn btn-success w-100 rounded-0 py-2 px-7 m-5 bg-teal-400 text-black font-semibold rounded-xl">
              {" "}
              Log in
            </button>
            <Link
              to="/signup"
              className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none py-2 px-7 mt-10 bg-teal-400 text-black font-semibold rounded-xl"
            >
              CreateAccount
            </Link>
            <p>You are agree to aour terms and policies</p>
          </form>
          <div className="flex p-4 ">
          <FcGoogle className="text-3xl mr-5" />
          <p className="text-white font-semibold">Sign in with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInFrom;
