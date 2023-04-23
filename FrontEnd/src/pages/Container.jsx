import React,{useEffect} from "react";
import Animes from "../components/Anime";
import Searchbar from "../components/Searchbar";

function Container() {
    return (
        <section>
            <Searchbar />
            <Animes/>
        </section>
    )
}

export default Container;