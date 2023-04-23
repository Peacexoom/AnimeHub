import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Detail } from './components/Detail';

import Navbar from './components/Navbar'
import Container from './pages/Container'
import Trending from './pages/Trending';
import Ongoing from './pages/Ongoing';
import Toprated from './pages/Toprated';
import Newest from './pages/Newest';
import Movies from './pages/Movies';
import Favorite from './pages/Favoritepage';
import { AnimeProvider } from "./Contextpage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Stores/SignUp';
// import Login from './Stores/Login';
import LogInForm from './Stores/LogInForm';


function App() {

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
        <Routes>
          <Route path='/' element={<LogInForm/>}/>
          <Route path='/login' element={<LogInForm/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/genres' element={<Container/>}/>
          <Route path='/trending' element={<Trending />} />
          <Route path='/ongoing' element={<Ongoing />} />
          <Route path='/toprated' element={<Toprated />} />
          <Route path='/newest' element={<Newest />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/animedetail/:id' element={<Detail />} />
          <Route path="/favorite" element={<Favorite />} />
        </Routes>
      </div>
    </AnimeProvider>
  )
}

export default App
