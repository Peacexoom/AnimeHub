import { createContext, useState } from "react";
import config from "./config";
import axios from "axios";
//=== google firebase import start ===
// import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { auth } from '../firebase';
// import { useAuthState } from "react-firebase-hooks/auth"
// ===================================
// import { toast } from 'react-toastify';

const Contextpage = createContext({
  header: '',
});
const IP = config.ip;

export function AnimeProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem("user")));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [header, setHeader] = useState("Trending");
  const [animes, setAnimes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [toprated, setToprated] = useState([]);
  const [newest, setNewest] = useState([]);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [activegenre, setActiveGenre] = useState("All");
  const [genres, setGenres] = useState([])
  const [loader, setLoader] = useState(true);
  const [backgenre, setBackGenre] = useState(false);
  const [genreAnimes, setGenreAnimes] = useState([])
  // const [user, setUser] = useAuthState(auth)
  // const navigate = useNavigate();

  // const APIKEY = import.meta.env.VITE_API_KEY;

  if (page < 1) {
    setPage(1)
  }

  // const filteredGenre = async () => {
  //   let data = await fetch(
  //     `${IP}/anime/popular/50`, { headers: { 'user_id': user.user_id } }
  //   );

  //   const animes = (await data.json()).data;
  //   setLoader(false);
  //   setHeader("Genres");
  // };

  const fetchSearch = async (query) => {
    // setLoader(true);
    console.log(query)
    const data = await fetch(
      `${IP}/anime/search?search_query=${query}`, { headers: { 'user_id': user.user_id } }
    );
    const searchanimes = (await data.json()).data;
    console.log(searchanimes)
    setAnimes(searchanimes);
    setLoader(false);
    setHeader(`Results for "${query}"`);
  }

  const fetchGenre = async () => {
    if (genres?.length === 0) {
      let data = await fetch(
        `${IP}/genres`
      );
      data = (await data.json()).data;
      localStorage.setItem("genres", JSON.stringify({ data }));
      setGenres(data);
    }
  }

  const fetchTrending = async () => {
    let data = await fetch(
      `${IP}/anime/popular/32`, { headers: { 'user_id': user.user_id } }
    );
    data = await data.json();
    const trend = data;
    setTrending(trend.data);
    setLoader(false)
    setHeader("Popular Animes")
  }

  const fetchOngoing = async () => {
    let data = await fetch(
      `${IP}/anime/ongoing/32`, { headers: { 'user_id': user.user_id } }
    );
    data = await data.json();
    const on_going = data;
    setOngoing(on_going.data);
    setLoader(false)
    setHeader("Ongoing Animes")
  }

  const fetchToprated = async () => {
    let data = await fetch(
      `${IP}/anime/top_rated/32`, { headers: { 'user_id': user.user_id } }
    );
    data = await data.json();
    const top_rated = data;
    setToprated(top_rated.data);
    setLoader(false)
    setHeader("Top Rated Animes")
  }

  const fetchNewest = async () => {
    let data = await fetch(
      `${IP}/anime/newest/32`, { headers: { 'user_id': user.user_id } }
    );
    data = await data.json();
    const new_est = data;
    setNewest(new_est.data);
    setLoader(false)
    setHeader("Newest Animes")
  }

  const fetchMovies = async () => {
    let data = await fetch(
      `${IP}/anime/movies/32`, { headers: { 'user_id': user.user_id } }
    );
    data = await data.json();
    const mov_ies = data;
    setMovies(mov_ies.data);
    setLoader(false)
    setHeader("Anime Movies")
  }

  const fetchGenreAnime = async (genre) => {
    setLoader(true);
    let animes = (await axios.get(`${IP}/anime/filter?genre=${genre}`, { headers: { 'user_id': user.user_id } })).data.data;
    // let animes = await fetch(`${IP}/anime/filter?genre=${genre}`);
    // animes = (await animes.json()).data;
    setHeader("Genres")
    setLoader(false);
    setGenreAnimes(animes);
  }

  const GetFavorite = () => {
    setLoader(false)
    setHeader("Your WatchList");
  }

  const logout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(0);
    }
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
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        genreAnimes,
        logout,
        fetchGenre,
        genres,
        setGenres,
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
        fetchOngoing,
        ongoing,
        fetchToprated,
        toprated,
        fetchNewest,
        newest,
        fetchMovies,
        fetchGenreAnime,
        movies,
        GetFavorite,

        // GoogleLogin,
      }}
    >
      {children}
    </Contextpage.Provider>
  );

}

export default Contextpage;