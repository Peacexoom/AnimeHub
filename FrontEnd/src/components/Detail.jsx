import React, { useContext, useEffect, useState } from 'react';
import { HiChevronLeft } from "react-icons/hi";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link, useParams } from 'react-router-dom';
import Contextpage from '../Contextpage';
import config from '../config';
import {AiFillStar, AiOutlineStar} from 'react-icons/ai';
import axios from "axios";

const HOST = config.host;

export const Detail = () => {
    // const APIKEY = import.meta.env.VITE_API_KEY;
    const { user } = useContext(Contextpage);

    const { setLoader } = useContext(Contextpage);
    const { anime_id } = useParams();
    const [showOptions, setShowOptions] = useState(false); // Define showOptions state
    const { setActiveGenre} = useContext(Contextpage);//To set the activegenre on the genre page
    const [animedet, setAnimedet] = useState();
    const [isBookmarked, setIsBookmarked] = useState(!!animedet?.is_added);
    // const [castdata, setCastdata] = useState([]);
    // const [animegenres, setAnimegenres] = useState([]);
    // const [video, setVideo] = useState([]);

    const fetchAnime = async () => {
        const data = await fetch(
            `${config.host}/anime/${anime_id}`
        );
        let anime = (await data.json()).data;
        if (anime.start_date) anime.start_date = new Date(anime.start_date);
        if (anime.end_date) anime.end_date = new Date(anime.end_date);
        anime.season = anime.season.charAt(0) + anime.season.slice(1).toLowerCase();
        setAnimedet(anime);
        setLoader(false);
    };

    const fetchCast = async () => {
        const castdata = await fetch(
            `http://10.42.0.137:5000/anime/popular/5`
        );
        const castdetail = await castdata.json();
        setCastdata(castdetail.cast);
        setLoader(false);
    }

    const fetchVideo = async () => {
        const data = await fetch(
            `http://10.42.0.137:5000/anime/popular/5`
        );
        const videodata = await data.json();
        setVideo(videodata.results);
        // console.log(videodata.results);
    }

    const BookmarkAnime = (type, remove) => {
        // if (!user) {
        //     toast.info("To bookmark this anime, please log in.");
        // } else {
        if (remove) {
            axios.delete(`${HOST}/user/${user.user_id}/list/${animedet.anime_id}/delete`)
                .then(response => {
                    console.log(response.data)
                    if (response.data.success) {
                        setIsBookmarked(false);
                        setShowOptions(false);
                    } else {
                        console.log('Error! Cannot remove bookmarked anime')
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (isBookmarked) {
            axios.post(`${HOST}/user/${user.user_id}/list/update`, {
                anime_id: animedet.anime_id,
                item_status: type  // Add the selected type to the request
            })
                .then(response => {
                    console.log(response.data);
                    setIsBookmarked(true);
                    setShowOptions(false);
                })
                .catch(function (error) {
                    console.error(error);
                });
        } else {
            axios.post(`${HOST}/user/${user.user_id}/list/add`, {
                anime_id: animedet.anime_id,
                item_status: type  // Add the selected type to the request
            })
                .then(response => {
                    console.log(response.data);
                    setIsBookmarked(true);
                    setShowOptions(false);

                })
                .catch(function (error) {
                    console.error(error);
                });
        }
        // setIsBookmarked(!isBookmarked)
        //     if (isBookmarked) {
        //         localStorage.removeItem(anime.id);
        //     } else {
        //         localStorage.setItem(anime.id, JSON.stringify(anime));
        //     }
        // }
    }

    useEffect(() => {
        (() => {
            fetchAnime();
        })()

        // fetchCast();
        // fetchVideo();
    }, []);

    return (
        <>
            {
                (!animedet) ? <div className='h-screen w-full flex justify-center items-center'><span className="loader m-10"></span></div> :
                    <>
                        <Link to="/" className='fixed z-10 text-4xl text-black bg-white m-3 md:m-5 rounded-full'><HiChevronLeft /></Link>
                        {/* poster */}
                        {/* <div className='relative h-auto md:h-[82vh] flex justify-center'>
                            <div className='h-full w-full shadowbackdrop absolute'></div>
                            <h1 className='text-white absolute bottom-0 p-10 text-2xl md:text-6xl font-bold text-center'></h1>
                            {animedet.backdrop_path === null ? <img src={noimage} className='h-full w-full' /> : <img src={"https://image.tmdb.org/t/p/original/" + animedet.backdrop_path} className='h-full w-full' />}
                        </div> */}

                        {/* overview */}
                        <div className='w-full flex max-2xl:flex-col max-2xl:justify-center max-2xl:items-center p-10 h-full'>
                            <div className='w-1/4 h-full relative flex flex-col items-center'>
                                <img src={animedet.img_link} className='' alt={animedet.title} />
                                <button
                                    className="px-8 py-2 text-white bg-slate-800 rounded-full mb-2 flex items-center mt-4"
                                    onClick={() => setShowOptions(!showOptions)}
                                >
                                    {isBookmarked ? <AiFillStar /> : <AiOutlineStar />}
                                    Add to bookmark
                                </button>
                                {showOptions ? (
                                    <div className="mt-2 w-48 text-black rounded-lg shadow-lg z-20 flex flex-col items-left">
                                        <button
                                            className="px-4 py-2 text-white bg-slate-800 rounded-full mb-2"
                                            onClick={() => BookmarkAnime('COMPLETED', false)}
                                        >
                                            Mark as Finished
                                        </button>
                                        <button
                                            className="px-4 py-2 text-white bg-slate-800 rounded-full mb-2"
                                            onClick={() => BookmarkAnime('CURRENT', false)}
                                        >
                                            Currently Watching
                                        </button>
                                        <button
                                            className="px-4 py-2 text-white bg-slate-800 rounded-full mb-2"
                                            onClick={() => BookmarkAnime('PLAN_TO_WATCH', false)}
                                        >
                                            Aim to See
                                        </button>
                                        <button
                                            className="px-4 py-2 text-white bg-red-800 rounded-full"
                                            onClick={() => BookmarkAnime('', true)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                            <div className='w-3/4 max-lg:w-full px-10 flex flex-col lg:items-start text-justify'>
                                <h2 className='text-white text-left pt-5 font-Roboto text-[36px]'>{animedet.title} ({animedet.alt_title})</h2>
                                <div className="details flex flex-shrink flex-wrap gap-3 mt-3">
                                    <p className='text-gray-200 font-semibold bg-blue-600 mr-2 rounded-md pl-2 p-1'>Score : {animedet.score}</p>
                                    <p className='text-gray-200 font-semibold bg-green-600 mr-2 rounded-md pl-2 p-1'>Popularity : {animedet.popularity}</p>
                                    <p className='text-gray-200 font-semibold bg-orange-500 mr-2 rounded-md pl-2 p-1'>{animedet.users} users</p>
                                    <p className='text-gray-200 font-semibold bg-red-500 mr-2 rounded-md pl-2 p-1'>{animedet.members} members</p>
                                </div>

                                <div className='lg:text-left text-justify w-full pt-5 leading-7 text-gray-200 font-normal text-[15px] mb-10'>{animedet.synopsis}</div>
                                <div className='text-blue-100 font-semibold my-3 flex justify-center'>
                                    <h2 className='bg-blue-600/30 border-2 border-blue-700 py-2 px-3 rounded-full'>Premiered : {(animedet.season)} {animedet?.start_date?.getFullYear()}</h2>

                                </div>
                                {/* tag */}
                                <div className='flex justify-left flex-wrap'>
                                    {animedet.genres.map((genreLabel, index) => (
                                        <>
                                            <Link to="/genres" key={index} onClick={() => setActiveGenre(genreLabel)}  className='text-white font-semibold bg-gray-800 rounded-full px-4 py-2 m-2 btn-link'>{genreLabel}</Link>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='h-[200px]'></div>

                    </>
            }
        </>
    )
}
