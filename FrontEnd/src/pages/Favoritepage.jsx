import React, { useEffect, useContext, useState } from 'react'
import Header from '../components/Header';
import Contextpage from '../Contextpage';
import Animecard from '../components/Animecard';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import config from '../config';

const IP = config.host;

function Favoritepage() {
    const { loader, user, GetFavorite } = useContext(Contextpage);
    const [watchlist, setWatchlist] = useState([]);
    const [activeGenre, setActiveGenre] = useState('All'); // Initialize activeGenre with null

    useEffect(() => {
        GetFavorite();
        console.log(IP)
        fetch(`${IP}/user/${user.user_id}/list`, { headers: { 'user_id': user.user_id } })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setWatchlist(data.data);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const filterWatchlistByGenre = (anime) => {
        if (activeGenre === 'All') {
            return true; // Show all genres
        } else if (activeGenre === 'Finished') {
            return anime.list_type === 'COMPLETED';
        } else if (activeGenre === 'Watching') {
            return anime.list_type === 'CURRENT';
        } else if (activeGenre === 'Aim to see') {
            return anime.list_type === 'PLAN_TO_WATCH';
        }

        return false; // Default: Hide if no match
    };


    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     // Make the API call to add the anime details
    //     const response = await fetch(`/user/${user_id}/list`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ anime_id }),
    //     });

    //     // Handle the response from the API
    //     const data = await response.json();
    //     console.log(data);
    //   };

    // useEffect(() => {
    //     GetFavorite();
    //     const data = localStorage;
    //     setLocalStorageData(data);
    // }, []);

    return (
        <>
            <Helmet>
                <title>AnimeHub | WatchList</title>
            </Helmet>

            <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                <Header />
                <div className='flex flex-wrap justify-center px-2'>
                    {['All', 'Finished', 'Watching', 'Aim to see'].map((genre) => (
                        <button
                            onClick={() => setActiveGenre(genre)}
                            className={`${
                                activeGenre === genre
                                    ? 'active '
                                    : 'bg-slate-800 hover:bg-slate-700 '
                            }px-4 py-2 m-2 text-white font-semibold rounded-3xl`}
                            key={genre}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
                <motion.div
                    layout
                    className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                    <AnimatePresence>
                        {
                            loader ? <span className="loader m-10"></span> :
                                <>
                                    {
                                        watchlist.length === 0
                                            ? <p className="text-xl text-white">Watchlist is empty.</p>
                                            : watchlist.map((anime, index) => {
                                                // Check if the anime should be displayed based on the active genre
                                                if (filterWatchlistByGenre(anime)) {
                                                    return <Animecard key={anime.anime_id} anime={anime} />;
                                                }
                                                return null; // Don't render if it doesn't match the active genre
                                            })
                                    }
                                </>
                        }
                    </AnimatePresence>
                </motion.div>
            </div>
        </>
    )
}

export default Favoritepage