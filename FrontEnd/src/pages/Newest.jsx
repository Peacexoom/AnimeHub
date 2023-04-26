import React, { useEffect, useContext } from 'react'
import Contextpage from '../Contextpage';
import Animecard from '../components/Animecard';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import { Pagebtn } from '../components/Pagebtn';
import { Helmet } from 'react-helmet';
import Searchbar from '../components/Searchbar';

function Newest() {

    const { loader, page, fetchNewest, newest } = useContext(Contextpage);

    useEffect(() => {
        fetchNewest();
    }, [page])


    return (
        <>
            <Helmet>
                <title>AnimeHub | Newest</title>
            </Helmet>
            <Searchbar />
            <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
                <Header />
                <motion.div
                    layout
                    className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                    <AnimatePresence>
                        {
                            loader ? <span className="loader m-10"></span> :
                                <>
                                    {newest?.map((anime) => (
                                        <Animecard key={anime.anime_id} anime={anime} />
                                    ))}
                                </>
                        }
                    </AnimatePresence>
                </motion.div>
                <Pagebtn />

            </div>
        </>
    )
}

export default Newest