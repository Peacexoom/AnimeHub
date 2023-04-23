import { createContext, useState } from "react";
import { json, useNavigate } from "react-router-dom";
//=== google firebase import start ===
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { auth } from '../firebase';
// import { useAuthState } from "react-firebase-hooks/auth"
// ===================================
// import { toast } from 'react-toastify';

const Contextpage = createContext({
  header: '',
});
const IP = "10.42.0.137:5000";

export function AnimeProvider({ children }) {

  const [header, setHeader] = useState("Trending");
  const [animes, setAnimes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [page, setPage] = useState(1);
  const [activegenre, setActiveGenre] = useState(28);
  const [genres, setGenres] = useState([])
  const [loader, setLoader] = useState(true);
  const [backgenre, setBackGenre] = useState(false);
  // const [user, setUser] = useAuthState(auth)
  // const navigate = useNavigate();

  // const APIKEY = import.meta.env.VITE_API_KEY;

  if (page < 1) {
    setPage(1)
  }

  const filteredGenre = async () => {
    let data = await fetch(
      `http://${IP}/anime/popular/50`
    );

    data = await data.json();
    console.log(data);
    const animes = data;
    setAnimes(animes.data);
    setLoader(false);
    setHeader("Genres");
  };

  const fetchSearch = async (query) => {
    const data = await fetch(
      `http://${IP}/anime/popular/5`
    );
    const searchanimes = await data.json();
    setAnimes(searchanimes.results);
    setLoader(false);
    setHeader(`Results for "${query}"`);
  }

  const fetchGenre = async () => {
    let data = await fetch(
      `http://${IP}/anime/popular/5`
    );
    data = await data.json();
    console.log(data);
    // const gen = data;
    setGenres(data.data);
  }

  const fetchTrending = async () => {
    let data = await fetch(
      `http://${IP}/anime/popular/30`
    );
    data = await data.json();
    console.log(data);
    const trend = data;
    setTrending(trend.data);
    setLoader(false)
    setHeader("Trending Animes")
  }

  const fetchUpcoming = async () => {
    let data = await fetch(
      `http://${IP}/anime/popular/5`
    );
    data = await data.json();
    const upc = data;
    setUpcoming(upc.data);
    setLoader(false)
    setHeader("Upcoming Animes")
  }

  // creat local storage
  const GetFavorite = () => {
    setLoader(false)
    setHeader("Favorite Animes")
  }
      

  //<========= firebase Google Authentication ========>
  // const googleProvider = new GoogleAuthProvider();// =====> google auth provide
  
  // const GoogleLogin = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);
  //     navigate("/")
  //     toast.success("Login successfully");
  //   } catch (err) {
  //     console.log(err)
  //     navigate("/")
  //   }
  // }
  // <==========================================================>

  return (
    <Contextpage.Provider
      value={{
        fetchGenre,
        genres,
        setGenres,
        filteredGenre,
        header,
        setHeader,
        animes,
        setAnimes,
        page,
        setPage,
        activegenre,
        setActiveGenre,
        fetchSearch,
        loader,
        setBackGenre,
        backgenre,
        setLoader,
        fetchTrending,
        trending,
        fetchUpcoming,
        upcoming,
        GetFavorite,
      
        // GoogleLogin,
        // user,
        // setUser
      }}
    >
      {children}
    </Contextpage.Provider>
  );

}

export default Contextpage;