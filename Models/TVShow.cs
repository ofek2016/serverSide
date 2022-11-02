using serverSide_Assignments.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace serverSide_Assignments.Models
{
    public class TVShow
    {
        // ============ //
        //    Fields    //
        // ============ // 
        int show_id;
        float popularity;
        string name, original_language, overview, poster_path, first_air_date;
        string[] origin_country;
        int ruppinPopularity;
        List<int> season_nums;

        // ============ //
        // Constructors //+
        // ============ //
        // user tv shows
        public TVShow(int show_id, float popularity, string first_air_date, string name, string[] origin_country, string original_language, string overview, string poster_path)
        {
            Season_nums = new List<int>();
            Show_id = show_id;
            Popularity = popularity;
            First_air_date = first_air_date;
            Name = name;
            Origin_country = origin_country;
            Original_language = original_language;
            Overview = overview;
            Poster_path = poster_path;
            ruppinPopularity = 0;
        }
        // admin tv shows
        public TVShow(int show_id, float popularity, string first_air_date, string name, string origin_country, string original_language, string overview, string poster_path,int ruppinPopularity, List<int> season_nums)
        {
            Origin_country = new string[1];
            Show_id = show_id;
            Popularity = popularity;
            First_air_date = first_air_date;
            Name = name;
            Origin_country[0] = origin_country;
            Original_language = original_language;
            Overview = overview;
            Poster_path = poster_path;
            RuppinPopularity = ruppinPopularity;
            Season_nums = season_nums;
        }
        public TVShow() { }

        // ============ //
        //  Properties  //
        // ============ //
        public List<TVShow> GetAdminTvShows(){
            DataServices ds = new DataServices();
            return ds.GetAdminTvShows();
        }


        public int Show_id { get => show_id; set => show_id = value; }
        public float Popularity { get => popularity; set => popularity = value; }
        public string First_air_date { get => first_air_date; set => first_air_date = value; }
        public string Name { get => name; set => name = value; }
        public string[] Origin_country { get => origin_country; set => origin_country = value; }
        public string Original_language { get => original_language; set => original_language = value; }
        public string Overview { get => overview; set => overview = value; }
        public string Poster_path { get => poster_path; set => poster_path = value; }
        public int RuppinPopularity { get => ruppinPopularity; set => ruppinPopularity = value; }

        public List<int> Season_nums { get => season_nums; set => season_nums = value; }

        // ============ //
        //    Methods   //
        // ============ // 

    }
}