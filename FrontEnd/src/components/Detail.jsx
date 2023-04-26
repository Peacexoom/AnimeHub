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
                        <div className='relative h-auto md:h-[82vh] flex justify-center'>
                            <div className='h-full w-full shadowbackdrop absolute'></div>
                            <h1 className='text-white absolute bottom-0 p-10 text-2xl md:text-6xl font-bold text-center'></h1>
                            {animedet.backdrop_path === null ? <img src={noimage} className='h-full w-full' /> : <img src={animedet.img_link} className='h-full' />}
                            {/* <iframe className="h-full w-full bg-cover iframe js-fancybox-video video-unit promotion" href="https://www.youtube.com/embed/Jc-Uiz0y2d8?enablejsapi=1&amp;wmode=opaque&amp;autoplay=1" style={{backgroundImage:"url('https://i.ytimg.com/vi/Jc-Uiz0y2d8/mqdefault.jpg')"}} rel="gallery"></iframe> */}
                        </div>

                        {/* overview */}
                        <div className='flex h-full'>
                            <div className='w-1/4 h-full'>
                                <img src={animedet.img_link} className='' alt={animedet.title} />
                            </div>
                            <div className='w-3/4 px-10 flex flex-col items-start'>
                                <h2 className='text-white text-left pt-5 font-Roboto text-[36px]'>{animedet.title} ({animedet.alt_title})</h2>
                                {/* <h2 className='text-gray-500 text-left font-Roboto text-[21px]'>{animedet.alt_title}</h2> */}
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



                                {/* cast */}
                                {/* <div className='flex flex-col items-center'>
                                    <h1 className="text-3xl text-blue-300 font-semibold text-center p-2">Cast</h1>

                                    <div className="md:px-5 flex flex-row my-5 max-w-full flex-start overflow-x-auto relative scrollbar-thin scrollbar-thumb-gray-500/20 scrollbar-track-gray-900/90 md:pb-3">
                                        {castdata.map((cast) => (
                                            <>
                                                {cast.profile_path !== null ? <>
                                                    <div className='flex min-w-[9rem] md:min-w-[10rem] max-w-[9rem] md:max-w-[10rem] h-full items-center text-center flex-col mx-1'>
                                                        <LazyLoadImage effect='blur' src={"https://image.tmdb.org/t/p/w500" + cast.profile_path} className="w-full h-full rounded-xl" />
                                                        <p className='text-white'>{cast.name}</p>
                                                        <p className='text-blue-300'>({cast.character})</p>
                                                    </div>
                                                </> : null}
                                            </>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        {/* trailer */}
                        {/* <div className='flex justify-center items-center mb-10 gap-5 flex-wrap'>
                            {video.map((trail) => (
                                <>
                                    {trail.type === "Trailer" ?
                                        <>
                                            <a key={trail.id} href={'https://www.youtube.com/watch?v=' + trail.key} target="_blank" className='flex border-2 border-red-600 bg-red-600/40 p-3 items-center justify-center gap-2 text-xl font-semibold rounded-full text-white'>
                                                <FaPlay />Watch trailer
                                            </a>
                                        </>
                                        : null}
                                </>
                            ))
                            }
                        </div> */}
                        <div className='h-[200px]'></div>

                    </>
            }
        </>
    )
}
