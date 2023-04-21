CREATE DATABASE anime_hub;
USE anime_hub;

CREATE TABLE `song`(
    `song_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `anime_id` INT UNSIGNED NOT NULL,
    `artist` VARCHAR(255) NULL,
    `duration` VARCHAR(255) NULL,
    `title` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`song_id`)
);

select * from voice_artist;
alter table voice_artist drop column gender;
alter table `voice_artist` add img_url VARCHAR(255) NULL;
alter table voice_artist add info text null;
alter table voice_artist modify `name` VARCHAR(255) NULL;
CREATE TABLE `voice_artist`(
    `voice_artist_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `info` TEXT NULL,
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

select * from `character`;
alter table `character` modify voice_artist_id INT UNSIGNED NULL;
CREATE TABLE `character`(
    `character_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `voice_artist_id` INT UNSIGNED	 NULL,
    `description` TEXT NULL,
    `img_url` VARCHAR(255) NOT NULL,
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

alter table anime modify `source` ENUM('OTHER','ORIGINAL','MANGA','4_KOMA_MANGA','MIXED_MEDIA','WEB_MANGA','WEB_NOVEL','DIGITAL_MANGA','NOVEL','LIGHT_NOVEL','VISUAL_NOVEL','GAME','CARD_GAME','BOOK','PICTURE_BOOK','RADIO','MUSIC') NULL;
alter table anime modify `rating` ENUM('G','PG','PG_13','R','R+','RX') NULL;
ALTER TABLE `character` DROP COLUMN anime_id;
select * from anime;
select * from studio;
select * from anime_genre;
select * from genre;
select * from `character`;
SELECT * FROM anime ORDER BY `rank`;
select * from `voice_artist`;
select * from `anime_character_junction`;
alter table anime add `has_character_data` BOOLEAN DEFAULT FALSE;
update anime set has_character_data =0 where anime_id=501;
CREATE TABLE `anime`(
    `anime_id` INT UNSIGNED NULL,
    `title` VARCHAR(255) NOT NULL,
    `alt_title` VARCHAR(255) NOT NULL,
    `img_link` VARCHAR(255) NULL,
    `synopsis` TEXT NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `num_episodes` SMALLINT NULL,
    `average_episode_duration` INT NULL,
    `rating` ENUM('G','PG','PG_13','R','R+','RX') NULL,
    `type` ENUM('TV','OVA','MOVIE','SPECIAL','ONA','MUSIC') NOT NULL,
    `status` ENUM('FINISHED_AIRING','CURRENTLY_AIRING','NOT_YET_AIRED') NOT NULL,
    `source` ENUM('OTHER','ORIGINAL','MANGA','4_KOMA_MANGA','WEB_MANGA','WEB_NOVEL','DIGITAL_MANGA','NOVEL','LIGHT_NOVEL','VISUAL_NOVEL','GAME','CARD_GAME','BOOK','PICTURE_BOOK','RADIO','MUSIC') NULL,
    `season` ENUM('WINTER','SPRING','SUMMER','FALL') NULL,
    `nsfw` ENUM('WHITE','GRAY','BLACK') NOT NULL,
    `studio_id` INT UNSIGNED NULL,
    `score` FLOAT NOT NULL,
    `users` INT NOT NULL,
    `rank` INT NOT NULL,
    `popularity` INT NOT NULL,
    `members` INT NOT NULL,
    `has_character_data` BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(`anime_id`)
);

CREATE TABLE `list_item`(
    `user_id` INT UNSIGNED NOT NULL,
    `type` ENUM('CURRENT','COMPLETED','ON_HOLD','DROPPED','PLAN_TO_WATCH') NOT NULL,
    `anime_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY(`user_id`,`anime_id`)
);

select * from anime_character_junction;
CREATE TABLE `anime_character_junction` (
	`anime_id` INT UNSIGNED NOT NULL,
    `character_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`anime_id`,`character_id`)
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
ALTER TABLE
	`anime_character_junction` ADD CONSTRAINT `anime_character_junction_anime_id_foreign` FOREIGN KEY(`anime_id`) REFERENCES `anime`(`anime_id`);
ALTER TABLE
	`anime_character_junction` ADD CONSTRAINT `anime_character_junction_character_id_foreign` FOREIGN KEY(`character_id`) REFERENCES `character`(`character_id`);

