using serverSide_Assignments.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace serverSide_Assignments.Models
{
    public class Preference
    {
        // ============ //
        //    Fields    //
        // ============ // 
        TVShow tvShow;
        Episode episode;
        int userID;

        // ============ //
        // Constructors //
        // ============ // 
        public Preference(TVShow tvshow, Episode episode, int userID)
        {
            TvShow = tvshow;
            Episode = episode;
            UserID = userID;
        }
        public Preference() { }

        // ============ //
        //  Properties  //
        // ============ // 

        public TVShow TvShow { get => tvShow; set => tvShow = value; }
        public Episode Episode { get => episode; set => episode = value; }
        public int UserID { get => userID; set => userID = value; }

        // ============ //
        //    Methods   //
        // ============ // 
    }
}