const { default: axios } = require("axios");
const mysql = require("mysql2/promise");
require("dotenv").config();

async function connectToDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "anime_hub",
        password: process.env.PASSWORD,
    });
}

const ANIME_ID_REQUEST_LIMIT = 500;

// connectToDB();

async function seedDB() {
    const { data: response } = await axios({
        method: "get",
        url: `https://api.myanimelist.net/v2/anime/ranking?offset=3000&ranking_type=all&limit=${ANIME_ID_REQUEST_LIMIT}`,
        headers: {
            "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
        },
    });
    let animeID = [];
    animeID = response.data.map((node) => node.node.id);
    console.log(animeID);

    const connection = await connectToDB();

    // gettting data
    for (let i = 0; i < animeID.length; i++) {
        let [rows, fields] = await connection.execute(
            "SELECT anime_id FROM anime WHERE anime_id=?",
            [animeID[i]],
            (err, res, fields) => {
                err ? console.log(err) : console.log(res);
            }
        );
        if (rows.length > 0) continue;
        const { data } = await axios({
            method: "get",
            url: `https://api.myanimelist.net/v2/anime/${animeID[i]}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,num_episodes,start_season,source,average_episode_duration,rating,background,studios`,
            headers: {
                "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
            },
        });
        let title = data.title;
        let anime_id = data.id;
        let alt_title = data.alternative_titles.en || data.title;
        let img_link = data.main_picture.large;
        let synopsis = data.synopsis;
        let start_date;
        if(data.start_date==null) {
            start_date = null;
        } else if(data.start_date.length<10) {
            start_date= null;
        } else {
            start_date = data.start_date;
        }
        let end_date;
        if (data.end_date == null) {
            end_date = null;
        } else if (data.end_date.length < 10) {
            end_date = null;
        } else {
            end_date = data.end_date;
        }
        let num_episodes = data.num_episodes;
        let average_episode_duration = data.average_episode_duration;
        let rating = data.rating?.toUpperCase();
        let type = data.media_type.toUpperCase();
        let status = data.status.toUpperCase();
        let source = data.source?.toUpperCase();
        let season = data.start_season?.season?.toUpperCase();
        let nsfw = data.nsfw.toUpperCase();
        let studio_id = data.studios[0]?.id;
        let score = data.mean;
        let users = data.num_scoring_users;
        let rank = data.rank;
        let popularity = data.popularity;
        let members = data.num_list_users;

        for (let j = 0; j < data.studios.length; j++) {
            try {
                await connection.query("INSERT INTO studio VALUE(?,?,?)", [
                    data.studios[j].id,
                    data.studios[j].name,
                    null,
                ]);
            } catch (err) {
                if (err.code === "ER_DUP_ENTRY") continue;
                else throw err;
            }
        }
        // let queryString = `${anime_id},'${title}','${alt_title}','${img_link}','${synopsis}','${start_date}','${end_data}',${num_episodes},${average_episode_duration},'${rating}','${type}','${status}','${source}','${season}','${nsfw}',${studio_id},${score},${users},${rank},${popularity},${members}`;
        // console.log(queryString);
        // queryString = `INSERT INTO anime values(${queryString})`;
        await connection.query("INSERT INTO anime VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
            anime_id,
            title,
            alt_title,
            img_link,
            synopsis,
            start_date,
            end_date,
            num_episodes,
            average_episode_duration,
            rating,
            type,
            status,
            source,
            season,
            nsfw,
            studio_id,
            score,
            users,
            rank,
            popularity,
            members,
        ]);
        if(data.genres)
        for (let j = 0; j < data.genres.length; j++) {
            await connection.query("INSERT INTO anime_genre VALUE(?,?)", [anime_id, data.genres[j].name]);
            try {
                await connection.query("INSERT INTO genre VALUE(?,?)", [data.genres[j].id, data.genres[j].name]);
            } catch (err) {
                if (err.code === "ER_DUP_ENTRY") continue;
                else throw err;
            }
        }
    }
    console.log('DONE');
}

seedDB();

module.exports = {connectToDB}