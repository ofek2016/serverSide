using serverSide_Assignments.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace serverSide_Assignments.Models
{
    public class Episode
    {
        // ============ //
        //    Fields    //
        // ============ // 
        int show_id, episode_id,episode_num, season_num,ruppinPopularity;
        string episode_name, img, description, show_name, date;

        // ============ //
        // Constructors //
        // ============ // 
        // for regular user rendering
        public Episode(int show_id, string show_name, int episode_id,int episode_num, string episode_name, string img, string description, int season_num, string date)
        {
            Show_id = show_id;
            Show_name = show_name;
            Episode_id = episode_id;
            Episode_num = episode_num;
            Episode_name = episode_name;
            Img = img;
            Description = description;
            Season_num = season_num;
            Date = date;
            RuppinPopularity = 0;
        }
        // for admin rendering
        public Episode(string show_name, int episode_num, string episode_name, string img, string description, int season_num, string date,int ruppinPopularity)
        {
            Show_name = show_name;
            Episode_name = episode_name;
            Episode_num = episode_num;
            Img = img;
            Description = description;
            Season_num = season_num;
            Date = date;
            RuppinPopularity = ruppinPopularity;
        }
        public Episode() { }

        // ============ //
        //  Properties  //
        // ============ //
        public int Show_id { get => show_id; set => show_id = value; }
        public string Show_name { get => show_name; set => show_name = value; }
        public int Episode_id { get => episode_id; set => episode_id = value; }
        public int Episode_num { get => episode_num; set => episode_num = value; }
        public string Episode_name { get => episode_name; set => episode_name = value; }
        public string Img { get => img; set => img = value; }
        public string Description { get => description; set => description = value; }
        public int Season_num { get => season_num; set => season_num = value; }
        public string Date { get => date; set => date = value; }
        public int RuppinPopularity { get => ruppinPopularity; set => ruppinPopularity = value; }

        // ============ //
        //    Methods   //
        // ============ // 
        public void InsertPreference(Preference p)
        {
            DataServices ds = new DataServices();
            ds.InsertEpisode(p);
        }

        public Dictionary<string,int> GetAllTvShowNames(int userID)
        {
            DataServices ds = new DataServices();
            return ds.GetAllTvShowNames(userID);
        }

        public List<Episode> GetTVShowByID(int userID,int tvShowID)
        {
            DataServices ds = new DataServices();
            return ds.GetTVShowByID(userID, tvShowID);
        }

        public List<Episode> GetAdminEpisodes(int show_id,int season_num)
        {
            DataServices ds = new DataServices();
            return ds.GetAdminEpisodes(show_id, season_num);
        }
    }
}