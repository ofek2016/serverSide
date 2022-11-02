using serverSide_Assignments.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace serverSide_Assignments.Models
{
    public class User
    {
        // ============ //
        //    Fields    //
        // ============ // 
        string first_name, last_name, email, password, cell_phone, gender, favorite_genre, address;
        int birthyear,id;
        bool isAdmin;

        // ============ //
        // Constructors //
        // ============ //
        // new users ("INSERT") & get users ("GET") constructor
        public User(int id, string first_name, string last_name, string email, string password, string cell_phone, string gender, string favorite_genre, string address, int birthyear,bool isAdmin)
        {
            First_name = first_name;
            Last_name = last_name;
            Email = email;
            Password = password;
            Cell_phone = cell_phone;
            Gender = gender;
            Favorite_genre = favorite_genre;
            Address = address;
            Birthyear = birthyear;
            Id = id;
            IsAdmin = isAdmin;
        }
        // for user update ("PUT")
        public User(int id, string first_name, string last_name, string password, bool isAdmin)
        {
            Id = id;
            First_name = first_name;
            Last_name = last_name;
            Password = password;
            IsAdmin = isAdmin;
        }
        public User() { }

        // ============ //
        //  Properties  //
        // ============ //
        public string First_name { get => first_name; set => first_name = value; }
        public string Last_name { get => last_name; set => last_name = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }
        public string Cell_phone { get => cell_phone; set => cell_phone = value; }
        public string Gender { get => gender; set => gender = value; }
        public string Favorite_genre { get => favorite_genre; set => favorite_genre = value; }
        public string Address { get => address; set => address = value; }
        public int Birthyear { get => birthyear; set => birthyear = value; }
        public int Id { get => id; set => id = value; }
        public bool IsAdmin { get => isAdmin; set => isAdmin = value; }

        // ============ //
        //    Methods   //
        // ============ // 
        public User GetUser(string userEmail, string password)
        {
            DataServices ds = new DataServices();
            return ds.GetUser(userEmail, password);
        }
        public List<User> GetAll()
        {
            DataServices ds = new DataServices();
            return ds.GetAllUsers();
        }
        public int Insert()
        {
            DataServices ds = new DataServices();
            return ds.InsertUser(this);
        }

        public int GetFanClub(int userID, int showID)
        {
            DataServices ds = new DataServices();
            return ds.GetChatClub(userID, showID);
        }

        public int PostFanClub(int userID, int showID)
        {
            DataServices ds = new DataServices();
            return ds.InsertChatClub(userID, showID);
        }

        public int UpdateUser()
        {
            DataServices ds = new DataServices();
            return ds.UpdateUser(this);
        }
    }
}