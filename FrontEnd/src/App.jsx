import React, { useContext } from "react";
import { Navigate, Route, Routes, Link } from "react-router-dom";
import { Detail } from "./components/Detail";

import Navbar from './components/Navbar'
import Container from './pages/Container'
import Trending from './pages/Trending';
import Ongoing from './pages/Ongoing';
import Toprated from './pages/Toprated';
import Newest from './pages/Newest';
import Movies from './pages/Movies';
import Favorite from './pages/Favoritepage';
import Contextpage from "./Contextpage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from './Stores/SignUp';
import Login from './Stores/Login';
import LogInForm from "./Stores/LogInForm";
import { Router } from "react-router-dom";

function App() {
  const { isLoggedIn } = useContext(Contextpage);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LogInForm />} />
        <Route path="*" element={<LogInForm />} />
      </Routes>
    )
  } else {

    return (
      <>
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
        />
        <Navbar />
        <div className="md:ml-[15rem]">
          <Routes>
            <Route path='/' element={<Trending />} />
            <Route path='/trending' element={<Trending />} />
            <Route path='/genres' element={<Container />} />
            <Route path='/ongoing' element={<Ongoing />} />
            <Route path='/toprated' element={<Toprated />} />
            <Route path='/newest' element={<Newest />} />
            <Route path='/movies' element={<Movies />} />
            <Route path='/animedetail/:anime_id' element={<Detail />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path='/login' element={<Navigate replace to="/trending" />} />
            <Route path='/signup' element={<Navigate replace to="/trending" />} />
            <Route path="*" element={<div>
              <div>
                404 - Page Not Found
              </div>
              <Link to="/trending" >Go to home page</Link>
            </div>} />
          </Routes>
        </div>
      </>
    );
  }
}

export default App;
