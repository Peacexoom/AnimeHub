import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Contextpage from '../Contextpage';
import {useNavigate} from "react-router-dom";
import useDebounce  from '../hooks/useDebounce';

function Searchbar() {
  const navigate = useNavigate();
  const { filteredGenre, fetchSearch} = useContext(Contextpage);
  const [value, setValue] = useState("");
  const debouncedSearch = useDebounce(value, 1500);

  useEffect(()=>{
    console.log("run")
    const search = async () => {
        const query = value.trim();
        try {
          if (query === "") {
            filteredGenre();
          } else {
            const results = await fetchSearch(query);
            // setGenres(results);
            // setBackGenre(true);
            navigate(`/search?search_query=${query}`);
          }
        } catch (error) {
          console.error("Search query failed: ", error);
        }
    };

    search();
  },[debouncedSearch]);

  return (
    <>
      <Helmet>
        <title>AnimeHub</title>
      </Helmet>

      <div className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500">
        <div className='h-full w-full bg-black/30 flex justify-center items-center py-5'>
          <input
            type="search"
            name="searchpanel"
            id="searchpanel"
            placeholder='Search anime'
            className='p-3 w-full mx-10 md:w-[40rem] rounded-xl outline-none'
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Searchbar;