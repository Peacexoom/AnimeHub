import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Detail } from './components/Detail';
// import Login from './auth/Login';
import LogInForm from './Stores/LogInForm';
import Navbar from './components/Navbar'
import Container from './pages/Container'
import Trending from './pages/Trending';
// import Upcoming from './pages/Upcoming';
import Favorite from './pages/Favoritepage';
import { AnimeProvider } from "./Contextpage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {

  return (
    <AnimeProvider>
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
        <Switch>
          <Route path='/' element={<LogInForm />} />
          <Route path='/login' element={<LogInForm />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/genres' element={<Container />} />
          <Route path='/trending' element={<Trending />} />
          {/* <Route path='/upcoming' element={<Upcoming />} /> */}
          <Route path='/animedetail/:id' element={<Detail />} />
          <Route path="/favorite" element={<Favorite />} />
        </Switch>
      </div>
    </AnimeProvider>
  )
}

export default Home
