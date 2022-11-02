CREATE TABLE [TVShows_2021] (
	[show_id] int NOT NULL ,
	[first_air_date] date NOT NULL ,
    [name] nvarchar (30) NOT NULL ,
	[origin_country] nvarchar (30) NOT NULL ,
	[original_language] nvarchar (30) NOT NULL ,
	[overview] nvarchar (2000) ,
	[popularity] int NOT NULL ,
    [poster_path] nvarchar (200) NOT NULL ,
	Primary key (show_id)
)
CREATE TABLE [Episodes_2021] (
	[show_id] int NOT NULL ,
	[episode_id] int NOT NULL ,
	[episode_num] int NOT NULL,
	[episode_name] nvarchar (30) NOT NULL ,
    [img] nvarchar (200) NOT NULL ,
	[description] nvarchar (3000) NOT NULL ,
	[season_num] tinyint NOT NULL,
	[date] date not null ,
	Primary key (episode_id) ,
	FOREIGN KEY (show_id) REFERENCES TVShows_2021(show_id) on delete cascade
)
CREATE TABLE [Users_2021] (
	[user_id] smallint identity(1,1) NOT NULL ,
	[first_name] nvarchar (30) NOT NULL check(len(first_name)>1) ,
	[last_name] nvarchar (30) NOT NULL check(len(last_name)>1),
    [email] nvarchar (50) UNIQUE NOT NULL ,
	[password] nvarchar (30) NOT NULL ,
	[cell_phone] char (11) NOT NULL ,
	[gender] nvarchar (10),
    [favorite_genre] nvarchar (50) ,
	[address] nvarchar (200) ,
	[birthyear] int NOT NULL ,
	[isAdmin] bit DEFAULT 0,
	Primary key (user_id)
)
CREATE TABLE [Preferences_2021] (
	[user_id] smallint NOT NULL foreign key references Users_2021(user_id),
	[episode_id] int not null ,
	Primary key (user_id, episode_id) ,
	Foreign key (episode_id) references Episodes_2021(episode_id) on delete cascade
)



select t.name,e.*, count(user_id) as ruppin_Popularity
from Preferences_2021 p inner join Episodes_2021 e on p.episode_id = e.episode_id inner join TVShows_2021 t on e.show_id = t.show_id
group by e.show_id,e.episode_id,e.episode_id,e.episode_num,e.episode_name,e.img,e.description,e.season_num,e.date, t.name
order by ruppin_Popularity desc

select t.show_id,e.season_num
from Episodes_2021 e inner join TVShows_2021 t on e.show_id = t.show_id
group by t.show_id,e.season_num


select t.*,count (distinct user_id) as ruppin_Popularity
from Preferences_2021 p inner join Episodes_2021 e on p.episode_id = e.episode_id inner join TVShows_2021 t on e.show_id = t.show_id
group by t.show_id,t.first_air_date,t.name,t.origin_country,t.original_language,t.overview,t.popularity,t.poster_path
order by ruppin_Popularity desc


select 
from Preferences_2021 p inner join Episodes_2021 e on p.episode_id = e.episode_id inner join TVShows_2021 t on e.show_id = t.show_id

select * from Episodes_2021
SELECT * FROM TVShows_2021
SELECT * FROM Users_2021
SELECT * FROM Preferences_2021











DROP TABLE Users_2021
DROP TABLE Preferences_2021
DROP TABLE TVShows_2021
drop table Episodes_2021
