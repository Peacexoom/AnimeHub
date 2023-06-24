import React, { useEffect, useContext } from 'react'
import Contextpage from '../Contextpage';
import { Helmet } from "react-helmet";

function Genre() {
    const { fetchGenre, activegenre, setActiveGenre, genres } = useContext(Contextpage);

    useEffect(() => {
        fetchGenre();
    }, [])

    const filterFunction = () => {
        if (activegenre === "") {

        } else {
            const filteredgenre = animes.filter((anime) =>
                anime.genre_ids.includes(activegenre)
            );
            setFiltered(filteredgenre);
        }
    }

    return (
        <>
            <Helmet>
                <title>AnimeHub | Genres</title>
            </Helmet>

            <div className='flex flex-wrap justify-center px-2'>
                {genres?.slice(0, 25)?.map((genre) => (
                    <button
                        onClick={() => setActiveGenre(genre)}
                        className={activegenre === genre ? 'active px-4 py-2 m-2 text-[15px] text-white font-semibold rounded-3xl' : 'px-4 py-2 m-2 text-[15px] bg-slate-800 text-white font-semibold rounded-3xl'} key={genre}>
                        {genre}
                    </button>
                ))
                }
            </div>
        </>
    )
}

export default Genre
