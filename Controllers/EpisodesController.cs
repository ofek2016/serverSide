using serverSide_Assignments.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace serverSide_Assignments.Controllers
{
    public class EpisodesController : ApiController
    {
        // GET api/<controller>
        public Dictionary<string, int> GetAllTvShowNames(int userID)
        {
            Episode e = new Episode();
            Dictionary<string, int> tvShowNames = e.GetAllTvShowNames(userID);
            return tvShowNames;
        }
        public IEnumerable<TVShow> getAdminTvShows()
        {
            TVShow t = new TVShow();
            return t.GetAdminTvShows();
        }
        public IEnumerable<Episode> getAdminEpisodes(int show_id,int season_num) 
        {
            Episode e = new Episode();
            return e.GetAdminEpisodes(show_id, season_num);    
        }
        // GET api/<controller>/?tvShowID=5
        public IEnumerable<Episode> GetTVShowByID(int userID, int tvShowID)
        {
            Episode e = new Episode();
            List<Episode> episodes = e.GetTVShowByID(userID, tvShowID);
            return episodes;
        }

        // POST api/<controller>
        public void Post([FromBody] Preference p)
        {
            Episode e = new Episode();
            e.InsertPreference(p);
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}