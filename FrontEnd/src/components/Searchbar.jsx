

  import React, { useContext, useState, useEffect } from 'react';
  import { Helmet } from 'react-helmet';
  import Contextpage from '../Contextpage';
  import { useNavigate } from 'react-router-dom';
  import './Searchbar.css';
  function Searchbar() {
    const navigate = useNavigate();
    const { filteredGenre, fetchSearch } = useContext(Contextpage);
    const [value, setValue] = useState('');
    

    const handleSearch = () => {
      const query = value.trim();
      try {
        if (query === '') {
          filteredGenre();
        } else {
          const results = fetchSearch(query);
          navigate(`/search?search_query=${query}`);
        }
      } catch (error) {
        console.error('Search query failed: ', error);
      }
    };

    

    const handleButtonClick = () => {
      // Call handleSearch when the button is clicked
      handleSearch();
    };


    return (
      <>
        <Helmet>
          <title>AnimeHub</title>
        </Helmet>

        <div className="w-full bg-gradient-to-r from-purple-800 to-teal-900">
          <div className="h-full w-full bg-black/30 flex justify-center items-center py-5">
            <input
              type="search"
              name="searchpanel"
              id="searchpanel"
              placeholder="Search anime"
              className="p-3 w-full mx-10 md:w-[40rem] rounded-xl outline-none"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <button
            className=" glow-on-hover "
            onClick={handleButtonClick}
            >
              Search
            </button>
          </div>
        </div>
      </>
    );
  }

  export default Searchbar;
