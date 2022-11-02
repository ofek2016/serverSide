using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Net;
using System.Text;
using System.Web.Configuration;
using System.Web.Http;
using System.Data;

namespace serverSide_Assignments.Models.DAL
{
    public class DataServices
    {
        //public SqlDataAdapter data_adapter;
        //public DataTable data_table;

        // ================ //
        //    Users_2021    //
        // ================ // 
        public int InsertUser(User user)
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            String insert_helper = BuildInsertUser(user); // helper method to build the insert string

            sql_command = CreateCommand(insert_helper, sql_connection); // create the command

            try
            {
                int affected_rows = sql_command.ExecuteNonQuery(); // execute the command
                return affected_rows;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
        }
        // Build USER Insert command String
        private String BuildInsertUser(User u)
        {
            String inserUserCommand;
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}', '{7}', {8}, {9})",
                u.First_name, u.Last_name, u.Email, u.Password, u.Cell_phone, u.Gender, u.Favorite_genre, u.Address, u.Birthyear, 0);
            String prefix = "INSERT INTO Users_2021 " + "(first_name, last_name, email, password, cell_phone, gender, favorite_genre, address, birthyear, isAdmin) ";
            inserUserCommand = prefix + sb.ToString();

            return inserUserCommand;
        }
        public User GetUser(string userEmail, string password)
        {

            SqlConnection sql_connection;
            SqlCommand sql_command;
            User user;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            String commandStr = BuildGetUser(userEmail, password);   // helper method to build the get string
            sql_command = CreateCommand(commandStr, sql_connection); // create the command

            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read())
                {
                    user = new User(
                                    Convert.ToInt32(reader["user_id"]),
                                    Convert.ToString(reader["first_name"]),
                                    Convert.ToString(reader["last_name"]),
                                    Convert.ToString(reader["email"]),
                                    Convert.ToString(reader["password"]),
                                    Convert.ToString(reader["cell_phone"]),
                                    Convert.ToString(reader["gender"]),
                                    Convert.ToString(reader["favorite_genre"]),
                                    Convert.ToString(reader["address"]),
                                    Convert.ToInt32(reader["birthyear"]),
                                    Convert.ToBoolean(reader["isAdmin"])
                                    );

                    return user;
                }
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
        private String BuildGetUser(string email, string pass)
        {
            String command = "SELECT * FROM Users_2021 WHERE email = '" + email + "' and password = '" + pass + "'";
            return command;
        }
        public List<User> GetAllUsers()
        {

            SqlConnection sql_connection;
            SqlCommand sql_command;
            List<User> users = new List<User>();

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            String commandStr = "select * from users_2021";   // helper method to build the get string
            sql_command = CreateCommand(commandStr, sql_connection); // create the command

            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read()) //freach user in the DB, create a new user object and add it to the list
                {
                    users.Add(new User(//generating user object
                                    Convert.ToInt32(reader["user_id"]),
                                    Convert.ToString(reader["first_name"]),
                                    Convert.ToString(reader["last_name"]),
                                    Convert.ToString(reader["email"]),
                                    Convert.ToString(reader["password"]),
                                    Convert.ToString(reader["cell_phone"]),
                                    Convert.ToString(reader["gender"]),
                                    Convert.ToString(reader["favorite_genre"]),
                                    Convert.ToString(reader["address"]),
                                    Convert.ToInt32(reader["birthyear"]),
                                    Convert.ToBoolean(reader["isAdmin"])
                                    ));
                }
                return users;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
            throw new HttpResponseException(HttpStatusCode.NotFound);

        }
        public int UpdateUser(User user)
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }
            int isAdmin = user.IsAdmin ? 1 : 0;
            String insert_helper = "UPDATE Users_2021"; // helper method to build the insert string
            insert_helper += " SET first_name='" + user.First_name + "', last_name='"+user.Last_name+"', password='"+user.Password+"', isAdmin="+ isAdmin;
            insert_helper += " WHERE user_id=" + user.Id;
            sql_command = CreateCommand(insert_helper, sql_connection); // create the command

            try
            {
                sql_command.ExecuteNonQuery(); // execute the command
                return user.Id;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
        }
        public int GetChatClub(int userID, int showID)
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            String commandStr = "select * from FanClub_2021 where user_id=" + userID + " and show_id=" + showID;  // helper method to build the get string
            sql_command = CreateCommand(commandStr, sql_connection); // create the command

            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read())
                {
                    return 1;
                }
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
        public int InsertChatClub(int userID, int showID)
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            String insert_helper = "insert into FanClub_2021 (user_id, show_id) Values('"+ userID + "', '"+ showID + "')"; // helper method to build the insert string

            sql_command = CreateCommand(insert_helper, sql_connection); // create the command

            try
            {
                int affected_rows = sql_command.ExecuteNonQuery(); // execute the command
                return affected_rows;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
        }

        // ==================== //
        //   TVShows_2021       //
        //   Episodes_2021      //
        //   Preferences_2021   //
        // ==================== //
        public int InsertEpisode(Preference p)
        {
            int affected_rows = 0;
            SqlConnection sql_connection;
            SqlCommand sql_cmd_tv, sql_cmd_ep, sql_cmd_p;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            //----- insert TVSHOW ------//
            String insert_helper = BuildInsertTvShow();      // helper method to build the insert string
            sql_cmd_tv = CreateCommand(insert_helper, sql_connection); // create command
            sql_cmd_tv = AddInsertTVShowCmdParams(sql_cmd_tv, p.TvShow); // assign the parameters to the command
            try
            {
                affected_rows += sql_cmd_tv.ExecuteNonQuery(); // execute the command
            }
            catch (Exception e)
            {
                if (!e.Message.Contains("duplicate"))
                    throw (e);
            }

            //----- insert EPISODE ------//
            insert_helper = BuildInsertEpisode();      // helper method to build the insert string
            sql_cmd_ep = CreateCommand(insert_helper, sql_connection);             // create the command
            sql_cmd_ep = AddInsertEpisodeCmdParams(sql_cmd_ep, p.Episode); // assign the parameters to the command

            try
            {
                affected_rows += sql_cmd_ep.ExecuteNonQuery(); // execute the command
            }
            catch (Exception e)
            {
                if (!e.Message.Contains("duplicate"))
                    throw (e);
            }

            //----- insert EPISODE ------//

            insert_helper = BuildInsertPreference(p);      // helper method to build the insert string

            sql_cmd_p = CreateCommand(insert_helper, sql_connection);
            try
            {
                affected_rows += sql_cmd_p.ExecuteNonQuery(); // execute the command
                return affected_rows;
            }
            catch (Exception e)
            {
                if (!e.Message.Contains("duplicate")) 
                    throw (e);
                return 0;
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
        }
        private String BuildInsertEpisode()
        {
            String insertTvShow;
            insertTvShow = "INSERT INTO Episodes_2021 ";
            insertTvShow += "(show_id, episode_id, episode_num, episode_name, img, description, season_num, date) ";
            insertTvShow += "VALUES(@show_id, @episode_id, @episode_num, @name, @img, @desc, @season_num, @date)";
            return insertTvShow;
        }
        private String BuildInsertTvShow()
        {
            String insertTvShow;
            string table = "TVShows_2021";
            insertTvShow = "INSERT INTO " + table;
            insertTvShow += "(show_id, first_air_date, name, origin_country, original_language, overview, popularity, poster_path) ";
            insertTvShow += "VALUES(@id, @date, @name, @country, @language, @overview, @popularity, @poster)";
            return insertTvShow;
        }
        private String BuildInsertPreference(Preference p)
        {
            String command;
            StringBuilder sb = new StringBuilder(); // use a string builder to create the dynamic string
            sb.AppendFormat("Values({0}, {1})", p.UserID, p.Episode.Episode_id);
            String prefix = "INSERT INTO Preferences_2021 " + "(user_id, episode_id) ";
            command = prefix + sb.ToString();
            return command;
        }
        private SqlCommand AddInsertTVShowCmdParams(SqlCommand sql_command, TVShow t)
        {
            sql_command.Parameters.AddWithValue("@id", t.Show_id);
            sql_command.Parameters.AddWithValue("@date", t.First_air_date);
            sql_command.Parameters.AddWithValue("@name", t.Name);
            sql_command.Parameters.AddWithValue("@country", t.Origin_country[0]);
            sql_command.Parameters.AddWithValue("@language", t.Original_language);
            sql_command.Parameters.AddWithValue("@overview", t.Overview);
            sql_command.Parameters.AddWithValue("@popularity", t.Popularity);
            sql_command.Parameters.AddWithValue("@poster", t.Poster_path);
            return sql_command;
        }
        private SqlCommand AddInsertEpisodeCmdParams(SqlCommand sql_command, Episode e)
        {
            sql_command.Parameters.AddWithValue("@show_id", e.Show_id);
            sql_command.Parameters.AddWithValue("@episode_id", e.Episode_id);
            sql_command.Parameters.AddWithValue("@episode_num", e.Episode_num);
            sql_command.Parameters.AddWithValue("@name", e.Episode_name);
            sql_command.Parameters.AddWithValue("@img", e.Img);
            sql_command.Parameters.AddWithValue("@desc", e.Description);
            sql_command.Parameters.AddWithValue("@season_num", e.Season_num);
            sql_command.Parameters.AddWithValue("@date", e.Date);
            return sql_command;
        }
        // get all tv shows (mainly used for admin)
        public List<TVShow> GetAdminTvShows()
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;
            Dictionary<int, List<int>> seasons = new Dictionary<int, List<int>>();
            List<TVShow> t = new List<TVShow>();
            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }
            String commandStr = "select t.show_id,e.season_num " +
                                "from Episodes_2021 e inner " +
                                "join TVShows_2021 t on e.show_id = t.show_id " +
                                "group by t.show_id,e.season_num";
            sql_command = CreateCommand(commandStr, sql_connection); // create the command

            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read()) //freach user in the DB, create a new user object and add it to the list
                {
                    if (!seasons.ContainsKey(Convert.ToInt32(reader["show_id"])))// checks if the key exists in the dictionary
                        seasons[Convert.ToInt32(reader["show_id"])] = new List<int>();// add the key to the dictionary if doesnt exists
                    seasons[Convert.ToInt32(reader["show_id"])].Add(Convert.ToInt32(reader["season_num"]));
                }
            }
            catch (Exception e)
            {
                throw (e);
            }

            commandStr = "select t.*,count (distinct user_id) as ruppin_Popularity " +
                         "from Preferences_2021 p inner join Episodes_2021 e on p.episode_id = e.episode_id " +
                         "inner join TVShows_2021 t on e.show_id = t.show_id " +
                         "group by t.show_id,t.first_air_date,t.name,t.origin_country,t.original_language,t.overview,t.popularity,t.poster_path " +
                         "order by ruppin_Popularity desc";
            sql_command = CreateCommand(commandStr, sql_connection); // create the command
            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read()) //freach user in the DB, create a new user object and add it to the list
                {
                    t.Add(new TVShow(//generating user object
                                    Convert.ToInt32(reader["show_id"]),
                                    Convert.ToInt32(reader["popularity"]),
                                    Convert.ToDateTime(reader["first_air_date"]).ToString("dd/MM/yyyy"),
                                    Convert.ToString(reader["name"]),
                                    Convert.ToString(reader["origin_country"]),
                                    Convert.ToString(reader["original_language"]),
                                    Convert.ToString(reader["overview"]),
                                    Convert.ToString(reader["poster_path"]),
                                    Convert.ToInt32(reader["ruppin_Popularity"]),
                                    seasons[Convert.ToInt32(reader["show_id"])]
                                    ));
                }
                return t;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
        }
        public List<Episode> GetAdminEpisodes(int show_id,int season_num)
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;
            List<Episode> ep = new List<Episode>();
            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }
            String commandStr = "select t.name,e.*, count(user_id) as ruppin_Popularity " +
                                "from Preferences_2021 p inner join Episodes_2021 e on p.episode_id = e.episode_id " +
                                "inner join TVShows_2021 t on e.show_id = t.show_id " +
                                "where t.show_id = " + show_id + " and e.season_num = " + season_num + " " +
                                "group by e.show_id, e.episode_id, e.episode_id, e.episode_num, e.episode_name, e.img,e.description, e.season_num, e.date, t.name " +
                                "order by ruppin_Popularity desc";
            sql_command = CreateCommand(commandStr, sql_connection); // create the command
            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read()) //freach user in the DB, create a new user object and add it to the list
                {
                    ep.Add(new Episode(//generating episode object
                                    Convert.ToString(reader["name"]),
                                    Convert.ToInt32(reader["episode_num"]),
                                    Convert.ToString(reader["episode_name"]),
                                    Convert.ToString(reader["img"]),
                                    Convert.ToString(reader["description"]),
                                    Convert.ToInt32(reader["season_num"]),
                                    Convert.ToDateTime(reader["date"]).ToString("dd/MM/yyyy"),
                                    Convert.ToInt32(reader["ruppin_Popularity"])
                                    ));
                }
                return ep;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }

        }
        // Returns all the stored tvshow names for a specific user.
        public Dictionary<string, int> GetAllTvShowNames(int userID)
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;
            Dictionary<string, int> dict = new Dictionary<string, int>();

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            String commandStr = "SELECT DISTINCT t.show_id ,t.name " +
                                "FROM Preferences_2021 p INNER JOIN Episodes_2021 e on p.episode_id = e.episode_id " +
                                "INNER JOIN TVShows_2021 t on t.show_id = e.show_id " +
                                "WHERE user_id = " + userID;

            sql_command = CreateCommand(commandStr, sql_connection); // create the command

            try
            {
                SqlDataReader reader = sql_command.ExecuteReader(CommandBehavior.CloseConnection); // execute the command
                while (reader.Read())
                {
                    dict[(string)reader["name"]] = Convert.ToInt32(reader["show_id"]);
                }
                return dict;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }
        //Returns all the Episodes following the tvShowName
        public List<Episode> GetTVShowByID(int userID, int showID) 
        {
            SqlConnection sql_connection;
            SqlCommand sql_command;
            List<Episode> list = new List<Episode>();
            // string tvName;

            try
            {
                sql_connection = connect("DBConnectionString"); // create the connection
            }
            catch (Exception e)
            {
                throw (e);
            }

            //  String selectShowName = "SELECT distinct name from TVShows_2021 WHERE show_id = " + showID;

            String commandStr = "SELECT * " +
                                "FROM Preferences_2021 p INNER JOIN Episodes_2021 e on p.episode_id = e.episode_id " +
                                "INNER JOIN TVShows_2021 t on t.show_id = e.show_id " +
                                "WHERE user_id = " + userID + " and t.show_id = " + showID + " " +
                                "ORDER BY e.episode_num";
                                

            sql_command = CreateCommand(commandStr, sql_connection);// create the command

            try
            {

                SqlDataReader reader = sql_command.ExecuteReader(); // execute the command

                while (reader.Read())
                {
                    list.Add(new Episode(
                        Convert.ToInt32(reader["show_id"]),
                        (string)reader["name"],
                        Convert.ToInt32(reader["episode_id"]),
                        Convert.ToInt32(reader["episode_num"]),
                        (string)reader["episode_name"],
                        (string)reader["img"],
                        (string)reader["description"],
                        Convert.ToInt32(reader["season_num"]),
                        Convert.ToDateTime(reader["date"]).ToString("dd/MM/yyyy")
                        ));
                }
                return list;
            }
            catch (Exception e)
            {
                throw (e);
            }
            finally
            {
                if (sql_connection != null) //if connection is not closed, close it anyway
                    sql_connection.Close();
            }
            throw new HttpResponseException(HttpStatusCode.NotFound);
        }

        // ======================================= //
        //     DB Comminication Configuration      //
        // ======================================= // 
        public SqlConnection connect(String conString)  // read the connection string from the configuration file
        {
            string insert_helper = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection sql_connection = new SqlConnection(insert_helper);
            sql_connection.Open();
            return sql_connection;
        }
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection sql_connection)//create the SQL command and giving it attributes
        {
            SqlCommand sql_command = new SqlCommand();              // create the command object
            sql_command.Connection = sql_connection;                // assign the connection to the command object
            sql_command.CommandText = CommandSTR;                   // can be Select, Insert, Update, Delete 
            sql_command.CommandTimeout = 10;                        // Time to wait for the execution' The default is 30 seconds
            sql_command.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure
            return sql_command;
        }
    }
}