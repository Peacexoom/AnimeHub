CREATE DATABASE anime_hub;

USE anime_hub;
drop database anime_hub;
CREATE TABLE `song`(
    `song_id` INT NOT NULL AUTO_INCREMENT,
    `anime_id` INT NOT NULL,
    `artist` varchar(100) NOT NULL,
    `duration` TEXT,
    PRIMARY KEY(`song_id`)
);

CREATE TABLE `voice_artist`(
    `voice_artist_id` INT NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `gender` enum('M','F','N') NOT NULL,
    `image` TEXT NOT NULL,
    PRIMARY KEY(`voice_artist_id`)
);

CREATE TABLE `genre`(
    `genre_id` INT NOT NULL AUTO_INCREMENT,
    `label` varchar(20) NOT NULL,
    PRIMARY KEY(`genre_id`)
);

CREATE TABLE `character`(
    `character_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `gender` BINARY(16) NOT NULL,
    `age` DATE NOT NULL,
    `image` TEXT NOT NULL,
    `anime_id` INT NOT NULL,
    `voice_artist_id` INT NOT NULL,
    PRIMARY KEY(`character_id`)
);

CREATE TABLE `user`(
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL,
    PRIMARY KEY(`user_id`)
);

CREATE TABLE `anime_genre_junction`(
    `anime_id` INT NOT NULL,
    `genre_id` INT NOT NULL,
    PRIMARY KEY(`anime_id`,`genre_id`)
);

CREATE TABLE `anime`(
    `anime_id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `release_date` DATE NOT NULL,
    `synopsis` MEDIUMTEXT NOT NULL,
    `img_link` TEXT NOT NULL,
    `rating` INT NOT NULL,
    `studio` TEXT NOT NULL,
    `watching` INT NOT NULL,
    `type` ENUM('TV','MOVIE') NOT NULL,
    `english_title` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`anime_id`)
);

CREATE TABLE `list_item`(
    `user_id` INT NOT NULL,
    `type` ENUM('CURRENT','COMPLETED','ON_HOLD','DROPPED','PLAN_TO_WATCH') NOT NULL,
    `anime_id` INT NOT NULL,
    PRIMARY KEY (`user_id`,`anime_id`)
);

ALTER TABLE
    `list_item` ADD CONSTRAINT `list_item_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user`(`user_id`);
ALTER TABLE
    `song` ADD CONSTRAINT `song_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
    `character` ADD CONSTRAINT `character_voice_artist_id_foreign` FOREIGN KEY(`voice_artist_id`) REFERENCES `voice_artist`(`voice_artist_id`);
ALTER TABLE
    `character` ADD CONSTRAINT `character_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
    `anime_genre_junction` ADD CONSTRAINT `anime_genre_junction_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
    `anime_genre_junction` ADD CONSTRAINT `anime_genre_junction_genre_id_foreign` FOREIGN KEY(`genre_id`) REFERENCES `genre`(`genre_id`);
ALTER TABLE
    `list_item` ADD CONSTRAINT `list_item_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);