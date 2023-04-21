CREATE DATABASE anime_hub;
USE anime_hub;

DROP DATABASE anime_hub;

CREATE TABLE `song`(
    `song_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `anime_id` INT UNSIGNED NOT NULL,
    `artist` VARCHAR(255) NULL,
    `duration` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`song_id`)
);

CREATE TABLE `voice_artist`(
    `voice_artist_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE','FEMALE','OTHER','UNKNOWN') NOT NULL,
    `image` TEXT NULL,
    PRIMARY KEY(`voice_artist_id`)
);

CREATE TABLE `anime_genre`(
    `anime_id` INT UNSIGNED NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`anime_id`,`label`)
);

CREATE TABLE `genre`(
    `genre_id` INT UNSIGNED NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`genre_id`)
);

CREATE TABLE `studio`(
    `studio_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    PRIMARY KEY(`studio_id`)
);

CREATE TABLE `character`(
    `character_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `gender` ENUM('MALE','FEMALE','OTHER','UNKNOWN') NULL,
    `age` DATE NULL,
    `image` TEXT NOT NULL,
    `anime_id` INT UNSIGNED NOT NULL,
    `voice_artist_id` INT UNSIGNED NOT NULL,
    `description` TEXT NULL,
    PRIMARY KEY(`character_id`)
);

CREATE TABLE `user`(
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL,
    `is_admin` BOOLEAN NOT NULL,
    PRIMARY KEY(`user_id`)
);

CREATE TABLE `anime`(
    `anime_id` INT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `alt_title` VARCHAR(255) NOT NULL,
    `img_link` VARCHAR(255) NOT NULL,
    `synopsis` TEXT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `num_episodes` SMALLINT NOT NULL,
    `average_episode_duration` INT NOT NULL,
    `rating` ENUM('G','PG','PG_13','R','R+','RX') NOT NULL,
    `type` ENUM('TV','OVA','MOVIE','SPECIAL','ONA','MUSIC') NOT NULL,
    `status` ENUM('FINISHED','AIRING','NOT_YET_AIRED') NOT NULL,
    `source` ENUM('OTHER','ORIGINAL','MANGA','4_KOMA_MANGA','WEB_MANGA','DIGITAL_MANGA','NOVEL','LIGHT_NOVEL','VISUAL_NOVEL','GAME','CARD_GAME','BOOK','PICTURE_BOOK','RADIO','MUSIC') NOT NULL,
    `season` ENUM('WINTER','SPRING','SUMMER','FALL') NOT NULL,
    `nsfw` ENUM('WHITE','GRAY','BLACK') NOT NULL,
    `studio_id` INT UNSIGNED NOT NULL,
    `score` FLOAT NOT NULL,
    `users` INT NOT NULL,
    `rank` INT NOT NULL,
    `popularity` INT NOT NULL,
    `members` INT NOT NULL,
    PRIMARY KEY(`anime_id`)
);

CREATE TABLE `list_item`(
    `user_id` INT UNSIGNED NOT NULL,
    `type` ENUM('CURRENT','COMPLETED','ON_HOLD','DROPPED','PLAN_TO_WATCH') NOT NULL,
    `anime_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`user_id`,`anime_id`)
);

ALTER TABLE
    `anime` ADD CONSTRAINT `anime_studio_id_foreign` FOREIGN KEY(`studio_id`) REFERENCES `studio`(`studio_id`);
ALTER TABLE
    `list_item` ADD CONSTRAINT `list_item_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user`(`user_id`);
ALTER TABLE
    `list_item` ADD CONSTRAINT `list_item_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
    `song` ADD CONSTRAINT `song_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
    `anime_genre` ADD CONSTRAINT `anime_genre_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
    `character` ADD CONSTRAINT `character_voice_artist_id_foreign` FOREIGN KEY(`voice_artist_id`) REFERENCES `voice_artist`(`voice_artist_id`);
ALTER TABLE
    `character` ADD CONSTRAINT `character_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);