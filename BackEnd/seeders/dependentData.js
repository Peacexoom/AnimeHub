const mysql = require("mysql2/promise");
require("dotenv").config();
const puppeteer = require("puppeteer-core");
const fs = require("fs");
let { character_ids } = require("./anime_id.json");
const path = require("path");

process.on("SIGINT", (evt) => {
    let data = JSON.stringify({ character_ids: character_ids });
    fs.writeFileSync(path.join(__dirname,"anime_id.json"), data, (err) => {
        if (err) throw err;
    });
    console.log("Quitting...");
});

let browser = null;

async function getBrowser() {
    if (browser) return browser;
    else return launchBrowser();
}

async function closeBrowser() {
    if (browser) return browser.close();
    else return null;
}

async function launchBrowser() {
    return puppeteer.launch({
        // headless: false,
        executablePath: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        defaultViewport: { width: 1536, height: 864 },
        // args: ["--profile-directory=Default"],
        // userDataDir: "C:\\Users\\MOON\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data",
    });
}

async function scrapeStudioDetails(studio_id) {
    let url = `https://myanimelist.net/anime/producer/${studio_id}/`;
    browser = await getBrowser();
    let page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log("PAGE LOADED");

    let studio_description = null;

    let studio_metadata = await page.$$(".mb16 .spaceit_pad");
    if (studio_metadata.length == 4) {
        studio_description = await studio_metadata[3].$eval("span", (node) => node.innerHTML?.replaceAll("<br>", "\n"));
    }

    await page.close();

    return { studio_description };
}

async function connectToDB() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "anime_hub",
        password: process.env.PASSWORD,
    });
}

async function seedStudioDetails() {
    let studioID = [],
        fields;
    const connection = await connectToDB();
    [studioID] = await connection.query("SELECT studio_id FROM studio");
    studioID = studioID.map((id) => id.studio_id);

    browser = await getBrowser();

    for (let i = 0; i < studioID.length; i++) {
        let [studioData] = await connection.query("SELECT description FROM studio WHERE studio_id=?", [studioID[i]]);
        // console.log(studioData[0].description);
        if (studioData[0].description !== null || studioData[0].description === "NO_DESC") {
            console.log("Skipping....");
            continue;
        }

        const { studio_description } = await scrapeStudioDetails(studioID[i]);
        await connection.query("UPDATE studio SET description=? WHERE studio_id=?", [studio_description, studioID[i]]);
    }

    await closeBrowser();
    console.log("DONE");
}

async function scrapeCharacterDetails(characterID) {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(`https://myanimelist.net/character/${characterID}/`);

    let imgURL = await page.$eval("table td:nth-child(1) div:nth-child(1) a img", (node) => node.src);
    let character_name = await page.$eval(".title-name", (node) => node.innerText);
    let va_id = await page.evaluate(
        "(() => {let node = document.querySelectorAll('#content > table > tbody > tr > td:nth-child(2) table');for(let i=0; i<node.length; i++) {if(node[i].innerText.includes('Japanese')) return parseInt(node[i].querySelector('.picSurround a').href.slice(31).split('/')[0]);}})()"
    );
    // await page.$$eval("table td:nth-child(2) table td:nth-child(2)", (nodes) => {
    //     nodes.forEach(node => {
    //         if (node.innerText.includes("Japanese")) {
    //             va_id = parseInt(node.children[0].href.slice(31).split("/")[0]);
    //             console.log(va_id);
    //         }
    //     })
    // });
    let description = await page.$eval("#content > table > tbody > tr > td:nth-child(2)", (node) =>
        node.innerText.split("\n").slice(3).join("\n")
    );
    await page.close();
    return { character_id: characterID, name: character_name, img_url: imgURL, voice_artist_id: va_id, description };
}

async function getCharactersID(animeID) {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(`https://myanimelist.net/anime/${animeID}/`);

    let characterIDs = [];
    let char_url;
    try {
        char_url = await page.$eval("#horiznav_nav li:nth-child(2) a", (node) => node.href);
    } catch(err) {
        console.log(err);
        throw err;
    }
    await page.goto(char_url);
    characterIDs = await page.$$eval(".anime-character-container .js-anime-character-table .fw-n", (nodes) => {
        return nodes.map((node) => parseInt(node.href.slice(34).split("/")[0]));
    });
    await page.close();
    // console.log(characterIDs);
    return characterIDs;
}

async function seedCharacterDetails() {
    browser = await getBrowser();
    let animeID = [];
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "anime_hub",
        password: 'patelmoon',
    });

    [animeID] = await connection.query("SELECT anime_id FROM anime ORDER BY `rank`");
    animeID = animeID.map((id) => id.anime_id);

    for (let i = 0; i < animeID.length ; i++) {
        let [has_character_data] = await connection.query("SELECT has_character_data FROM anime WHERE anime_id = ?", [
            animeID[i],
        ]);
        has_character_data = has_character_data.map((elem) => elem.has_character_data)[0];
        if (has_character_data) continue;
        else {
            let characterIDs = await getCharactersID(animeID[i]);
            console.log("Fetching character ids of anime:", animeID[i]);
            for (let j = 0; j < (characterIDs.length > 20 ? 20 : characterIDs.length); j++) {
                if (characterIDs[j] in character_ids) continue;
                // let result = await connection.query("SELECT * FROM `character` WHERE character_id = ?", [
                //     characterIDs[j],
                // ]);
                // if (result) continue;
                let { character_id, name, img_url, voice_artist_id, description } = await scrapeCharacterDetails(
                    characterIDs[j]
                );
                try {
                    voice_artist_id &&
                        (await connection.query("INSERT INTO `voice_artist` VALUES (?,?,?,?,?)", [
                            voice_artist_id,
                            null,
                            null,
                            null,
                            null,
                        ]));
                } catch (err) {
                    if (err.code !== "ER_DUP_ENTRY") throw err;
                }
                try {
                    await connection.query("INSERT INTO `character` VALUES (?,?,?,?,?)", [
                        character_id,
                        name,
                        voice_artist_id,
                        description,
                        img_url,
                    ]);
                } catch (err) {
                    if (err.code !== "ER_DUP_ENTRY") throw err;
                }
                try {
                    await connection.query("INSERT INTO anime_character_junction VALUES (?,?)", [
                        animeID[i],
                        character_id,
                    ]);
                } catch (err) {
                    if (err.code !== "ER_DUP_ENTRY") throw err;
                }
                // console.log("char_id:", characterIDs[j]);
                character_ids.push(characterIDs[j]);
            }
            console.log("Characters of anime_id", animeID[i], "added.");
            // set has_character_data to true
            let [result] = await connection.query("UPDATE anime SET has_character_data=1 WHERE anime_id=?", [
                animeID[i],
            ]);
        }
    }
}

seedCharacterDetails();
