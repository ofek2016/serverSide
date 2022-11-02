CREATE TABLE [Comments_2021] (
	[comment_id] int identity(1,1) NOT NULL ,
	[episode_id] int foreign key references Episodes_2021(episode_id) NOT NULL ,
    [user_id] smallint foreign key references Users_2021(user_id) ,
	[parent_comment] int default 0,
	[content] nvarchar (255) NOT NULL,
	[post_datetime] datetime NOT NULL,
	Primary key (comment_id,user_id,episode_id)
)

DROP TABLE Comments_2021;


select * from Comments_2021
--insert Comment
INSERT INTO Comments_2021(comment_id, episode_id, user_id, content, post_datetime)
Values('admin', 'admin', 'admin@gmail.com', 'A123123', '060-1231231')
-- insert nested Comment
INSERT INTO Comments_2021(comment_id, episode_id, user_id, parent_comment, content, post_datetime)
Values('admin', 'admin', 'admin@gmail.com', 'A123123', '060-1231231', 'Male')


select * from Episodes_2021
select * from preferences_2021
select * from Users_2021

UPDATE Users_2021 SET first_name='yosi', last_name=test, password=A123123, isAdmin=0 WHERE user_id=1

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
select * from FanClub_2021



select * from TVShows_2021

INSERT INTO Users_2021 (first_name, last_name, email, password, cell_phone, gender, favorite_genre, address, birthyear)
					Values('yosi', 'levy', 'yosi@gmail.com', 'A123123', '060-1231231', 'Male', '122', '23', 1995)

INSERT INTO Users_2021 (first_name, last_name, email, password, cell_phone, gender, favorite_genre, address, birthyear,isAdmin)
Values('admin', 'admin', 'admin@gmail.com', 'A123123', '060-1231231', 'Male', '122', '23', 1995,1)

select * from users_2021
select * from TVShows_2021
select * from Episodes_2021
select * from preferences_2021






CREATE TABLE [FanClub_2021] (
	[user_id] smallint NOT NULL foreign key references Users_2021(user_id),
	[show_id] int not null foreign key references TVShows_2021(show_id),
	Primary key (user_id, show_id) ,
)

select * from FanClub_2021






DROP TABLE Users_2021
DROP TABLE Preferences_2021
DROP TABLE TVShows_2021
drop table Episodes_2021
