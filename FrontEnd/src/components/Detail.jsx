import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Contextpage from '../Contextpage';
import { HiChevronLeft } from "react-icons/hi";
import 'react-lazy-load-image-component/src/effects/blur.css';
import config from '../config';

export const Detail = () => {
    // const APIKEY = import.meta.env.VITE_API_KEY;

    const { setLoader } = useContext(Contextpage);
    const { anime_id } = useParams();

    const [animedet, setAnimedet] = useState();
    // const [castdata, setCastdata] = useState([]);
    // const [animegenres, setAnimegenres] = useState([]);
    // const [video, setVideo] = useState([]);

    const fetchAnime = async () => {
        const data = await fetch(
            `${config.ip}/anime/${anime_id}`
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
                        <div className='flex p-10 h-full'>
                            <div className='w-1/4 h-full'>
                                <img src={animedet.img_link} className='' alt={animedet.title} />
                            </div>
                            <div className='w-3/4 px-10 flex flex-col items-start'>
                                <h2 className='text-white text-left pt-5 font-Roboto text-[36px]'>{animedet.title} ({animedet.alt_title})</h2>
                                <div className="details flex">
                                    <p className='text-gray-200 font-semibold bg-blue-600 mr-2 rounded-md pl-2 p-1'>Score : {animedet.score}</p>
                                    <p className='text-gray-200 font-semibold bg-green-600 mr-2 rounded-md pl-2 p-1'>Popularity : {animedet.popularity}</p>
                                    <p className='text-gray-200 font-semibold bg-orange-500 mr-2 rounded-md pl-2 p-1'>{animedet.users} users</p>
                                    <p className='text-gray-200 font-semibold bg-red-500 mr-2 rounded-md pl-2 p-1'>{animedet.members} members</p>
                                </div>

                                <div className='text-left w-4/5 pt-5 leading-7 text-gray-200 font-normal text-[15px] mb-10'>{animedet.synopsis}</div>
                                <div className='text-blue-100 font-semibold my-3 flex justify-center'>
                                    <h2 className='bg-blue-600/30 border-2 border-blue-700 py-2 px-3 rounded-full'>Premiered : {(animedet.season)} {animedet?.start_date?.getFullYear()}</h2>
                                </div>
                                {/* tag */}
                                <div className='flex justify-center flex-wrap'>
                                    {animedet.genres.map((genreLabel, index) => (
                                        <>
                                            <div key={index} className='text-white font-semibold bg-gray-800 rounded-full px-4 py-1 m-2'>{genreLabel}</div>
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
