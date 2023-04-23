import React, { useEffect, useContext, useState } from 'react'
import Header from '../components/Header';
import Contextpage from '../Contextpage';
import Animecard from '../components/Animecard';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';

function Favoritepage() {

    // const { loader, GetFavorite } = useContext(Contextpage);
    // const [localStorageData, setLocalStorageData] = useState([]);
    const [anime_id, setAnimeId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
      
        // Make the API call to add the anime details
        const response = await fetch(`/user/${user_id}/list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ anime_id }),
        });
      
        // Handle the response from the API
        const data = await response.json();
        console.log(data);
      };

    // useEffect(() => {
    //     GetFavorite();
    //     const data = localStorage;
    //     setLocalStorageData(data);
    // }, []);

    return (
        // <>
        //   <Helmet>
        //     <title>BlueBird Animes | Favorite Animes</title>
        //   </Helmet>
            
        //     <div className='w-full bg-[#10141e] md:p-10 mb-20 md:mb-0'>
        //         <Header />
        //         <motion.div
        //             layout
        //             className="w-full md:p-2 flex flex-wrap relative justify-evenly md:justify-around">
        //             <AnimatePresence>
        //                 {
        //                     loader ? <span className="loader m-10"></span> :
        //                         <>
        //                             {
        //                                 Object.keys(localStorageData).filter(key => !isNaN(key)).length == 0
        //                                     ?
        //                                     <p className="text-xl text-white">No Bookmark Yet!</p>
        //                                     :
        //                                     Object.keys(localStorageData).filter(key => !isNaN(key)).map((key, index) => (<Animecard key={index} anime={{ ...JSON.parse(localStorageData[key]) }} />))
        //                             }
        //                         </>
        //                 }
        //             </AnimatePresence>
        //         </motion.div>
        //     </div>
        // </>
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