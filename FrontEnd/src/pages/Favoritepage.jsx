import React, { useEffect, useContext, useState } from 'react'
import Header from '../components/Header';
import Contextpage from '../Contextpage';
import Animecard from '../components/Animecard';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import config from '../config';

const IP = config.ip;

function Favoritepage() {

    const { loader, user, GetFavorite } = useContext(Contextpage);
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        GetFavorite();
        fetch(`${IP}/user/${user.user_id}/list`, { headers: { 'user_id': user.user_id } })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setWatchlist(data.data);
                }
            })
            .catch(err => console.log(err));
    }, []);

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
                                            : watchlist.map((anime, index) => (<Animecard key={anime.anime_id} anime={anime} />))
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