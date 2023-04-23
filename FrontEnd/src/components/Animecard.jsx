import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import noimage from '../assets/images/no-image.jpg'
import { motion } from 'framer-motion'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Contextpage from '../Contextpage';

function Animecard({ anime }) {
    const { user } = useContext(Contextpage);

    const [isBookmarked, setIsBookmarked] = useState(null);

    useEffect(() => {
        if (localStorage.getItem(anime.id)) {
            setIsBookmarked(true);
        } else {
            setIsBookmarked(false);
        }
    }, [anime.id]);

    const BookmarkAnime = () => {
        if (!user) {
            toast.info("To bookmark this anime, please log in.");
        } else {
            setIsBookmarked(!isBookmarked)
            if (isBookmarked) {
                localStorage.removeItem(anime.id);
            } else {
                localStorage.setItem(anime.id, JSON.stringify(anime));
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            layout
            className="card relative w-full md:w-60 h-[410px] md:h-[360px] my-3 mx-4 md:my-5 md:mx-0 cursor-pointer rounded-xl overflow-hidden">

            {/* bookmark buttons */}
            <button className="absolute bg-black text-white p-2 z-20 right-0 m-3 rounded-full text-xl" onClick={BookmarkAnime}> {isBookmarked ? <AiFillStar /> : <AiOutlineStar />}</button>


            <div className='absolute bottom-0 w-full flex justify-between items-end p-3 z-20'>
                <h1 className='text-white text-xl font-semibold  break-normal break-words'>{anime.title || anime.name}</h1>

                {anime.score ?
                    (anime.score > 7 ? <h1 className='font-bold px-4 py-1 text-green-500 bg-zinc-900 rounded-full'>{anime.score.toFixed(1)}</h1> :
                        anime.score > 5.5 ? <h1 className='font-bold px-4 py-1 text-orange-400 bg-zinc-900 rounded-full'>{anime.score.toFixed(1)}</h1> :
                            <h1 className='font-bold px-4 py-1 text-red-600 bg-zinc-900 rounded-full'>{anime.score.toFixed(1)}</h1>) :
                    <h1 className='font-bold px-4 py-1 text-red-600 bg-zinc-900 rounded-full'>N/A</h1>}
            </div>

            <Link to={`/animedetail/${anime.id}`} className='h-full w-full shadow absolute z-10'></Link>

            <div>
                {anime.poster_path === null ? <img className='img object-cover' src={noimage} /> :
                    <LazyLoadImage effect='blur' className='img object-cover' src={anime.img_link} />}
            </div>
        </motion.div>
    )
}

export default Animecard
