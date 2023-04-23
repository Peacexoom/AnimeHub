import React, { useEffect, useContext, useState } from 'react'
import Header from '../components/Header';
import Contextpage from '../Contextpage';
import Animecard from '../components/Animecard';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';

function Favoritepage() {

    const { loader, GetFavorite } = useContext(Contextpage);
    const [localStorageData, setLocalStorageData] = useState([]);

    useEffect(() => {
        GetFavorite();

        const data = localStorage;
        setLocalStorageData(data);
    }, []);

    return (
        <>
          <Helmet>
            <title>BlueBird Animes | Favorite Animes</title>
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
                                        Object.keys(localStorageData).filter(key => !isNaN(key)).length == 0
                                            ?
                                            <p className="text-xl text-white">No Bookmark Yet!</p>
                                            :
                                            Object.keys(localStorageData).filter(key => !isNaN(key)).map((key, index) => (<Animecard key={index} anime={{ ...JSON.parse(localStorageData[key]) }} />))
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