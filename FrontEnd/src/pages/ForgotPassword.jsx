import React from "react";

const ForgotPasswordForm = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>

        <div className="mb-6">
          <label htmlFor="email" className="text-sm text-gray-600 block mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition duration-300">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
