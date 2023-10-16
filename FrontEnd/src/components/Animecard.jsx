import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import noimage from '../assets/images/no-image.jpg'
import { motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Contextpage from '../Contextpage';
import axios from 'axios';
import config from '../config';

const HOST = config.host;

function Animecard({ anime }) {
    const { user } = useContext(Contextpage);

    const [isBookmarked, setIsBookmarked] = useState(!!anime?.is_added);
    const [showOptions, setShowOptions] = useState(false); // Define showOptions state

    // useEffect(() => {
    //     if (localStorage.getItem(anime.id)) {
    //         setIsBookmarked(true);
    //     } else {
    //         setIsBookmarked(false);
    //     }
    // }, [anime.id]);

    const BookmarkAnime = (type, remove) => {
        // if (!user) {
        //     toast.info("To bookmark this anime, please log in.");
        // } else {
        if (remove) {
            axios.delete(`${HOST}/user/${user.user_id}/list/${anime.anime_id}/delete`)
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
                anime_id: anime.anime_id,
                item_status: type  // Add the selected type to the request
            })
                .then(response => {
                    console.log(response.data);
                    setIsBookmarked(true);
                    setShowOptions(false);
                    window.location.reload();
                })
                .catch(function (error) {
                    console.error(error);
                });
        } else {
            axios.post(`${HOST}/user/${user.user_id}/list/add`, {
                anime_id: anime.anime_id,
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            layout
            className="card relative w-full md:w-60 h-[410px] md:h-[340px] my-3 mx-4 md:my-5 md:mx-0 cursor-pointer rounded-xl overflow-hidden"
        >
            {/* Bookmark buttons */}
            <button className="absolute bg-black text-white p-2 z-20 right-0 m-3 rounded-full text-xl" onClick={() => setShowOptions(!showOptions)}>
                {isBookmarked ? <AiFillStar /> : <AiOutlineStar />}
            </button>

            {!showOptions ? (
                <div className='absolute bottom-0 w-full flex justify-between items-end p-3 z-20'>
                    <h1 className='text-white text-xl font-semibold  break-normal break-words'>{anime.title || anime.name}</h1>

                    {anime.score ?
                        (anime.score > 7 ?
                            <h1 className='font-bold px-4 py-1 text-green-500 bg-zinc-900 rounded-full'>{anime.score.toFixed(1)}</h1> :
                            anime.score > 5.5 ?
                                <h1 className='font-bold px-4 py-1 text-orange-400 bg-zinc-900 rounded-full'>{anime.score.toFixed(1)}</h1> :
                                <h1 className='font-bold px-4 py-1 text-red-600 bg-zinc-900 rounded-full'>{anime.score.toFixed(1)}</h1>) :
                        <h1 className='font-bold px-4 py-1 text-red-600 bg-zinc-900 rounded-full'>N/A</h1>}
                </div>
            ) : (
                <div className="h-full w-full shadow absolute z-10" style={{pointerEvents: 'none'}}>

                    <div
                        className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-70"
                        style={{pointerEvents: 'auto'}}
                    >
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
                        {isBookmarked && (
                            <button
                                className="px-4 py-2 text-white bg-red-800 rounded-full"
                                onClick={() => BookmarkAnime('', true)}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="w-full h-full hover:scale-110 duration-700 ease-in-out">
                {showOptions ? (
                    <div className="h-full w-full shadow absolute z-10" style={{ pointerEvents: 'none' }}></div>
                ) : (
                    <Link to={`/animedetail/${anime.anime_id}`} className="h-full w-full shadow absolute z-10 h-full w-full shadow absolute z-10 bg-gradient-to-t from-black to-transparent hover:bg-none"></Link>
                )}

                {anime.poster_path === null ? (
                    <img src={noimage} alt="No Poster" />
                ) : (
                    <LazyLoadImage effect="blur" height={'100%'} width={'100%'} className="w-full md:h-full" src={anime.img_link} alt={anime.title || anime.name} />
                )}


            </div>
        </motion.div>
    );


}

export default Animecard
