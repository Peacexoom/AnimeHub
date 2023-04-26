import React, { useEffect, useContext } from 'react'
import Contextpage from '../Contextpage';
import Animecard from './Animecard';
import { motion, AnimatePresence } from 'framer-motion';
import Genre from './Genre';
import Header from './Header';
import { Pagebtn } from './Pagebtn';

function Animes() {

    const { genreAnimes, fetchGenreAnime, activegenre, loader, page } = useContext(Contextpage);

    useEffect(() => {
        console.log(activegenre)
        fetchGenreAnime(activegenre);
    }, [activegenre, page])

    return (

        <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
            <Header />
            <Genre />
            <motion.div
                layout
                className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
                <AnimatePresence>
                    {
                        loader ? <span className="loader m-10"></span> :
                            <>
                                {genreAnimes?.map((anime) => (
                                    <Animecard key={anime.id} anime={anime} />
                                ))}
                            </>
                    }
                </AnimatePresence>
            </motion.div>
            <Pagebtn />

        </div>
    )
}

export default Animes


//   `https://api.theanimedb.org/3/trending/all/day?api_key=b454aa11fb4b5fc5b515d2e80a898a1c&page=${page}`