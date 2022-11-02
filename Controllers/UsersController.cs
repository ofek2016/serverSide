using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using serverSide_Assignments.Models;

namespace serverSide_Assignments.Controllers
{
    public class UsersController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<User> GetAll()
        {
            User u = new User();
            return u.GetAll();
        }

        public User GetUser(string userEmail, string password)
        {
            User u = new User();
            return u.GetUser(userEmail, password);
        }

        // POST api/<controller>
        public int PostUser([FromBody] User user)
        {
            return user.Insert();
        }

        public int GetFanClub(int userID, int showID)
        {
            User u = new User();
            return u.GetFanClub(userID, showID);
        }

        public int PostFanClub(int userId, int showId)
        {
            User u = new User();
            return u.PostFanClub(userId, showId);
        }

        // PUT api/<controller>/5
        public int Put([FromBody] User user)
        {
            return user.UpdateUser();
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}