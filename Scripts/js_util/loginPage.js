$(document).ready(function () {
    $("#registerForm").submit(postUser);
    $("#loginForm").submit(getUser);
    $('#loginFormModal').css("display", "block");

    // activate a custom validation function when the element looses focus.
    $("#birthYearTB").on("blur", birthYearValidator);
});

// login with enter
function loginEvent(e) {
    if (e.keyCode === 13)
        $("#loginForm").submit(getUser);
}

// post user to DB
function postUser() {
    fname = $("#fnameTB").val();
    lname = $("#lnameTB").val();
    email = $("#emailTB").val();
    password = $("#passwordTB").val();
    cellphone = $("#cellphoneTB").val();
    gender = $("#genderSelect").val();
    birthyear = $("#birthYearTB").val();
    fav_genre = $("#fav_genreTB").val();
    address = $("#addressTB").val();
    user = {
        First_name: fname,
        Last_name: lname,
        Email: email,
        Password: password,
        Cell_phone: cellphone,
        Gender: gender,
        Birthyear: birthyear,
        Favorite_genre: fav_genre,
        Address: address
        // IsAdmin: false
    }
    ajaxCall("POST", "../api/Users", JSON.stringify(user), postUser_SuccessCB, postUser_ErrorCB);

    return false; //disable default submit which rebuilds the page
}
// switch to login modal after registering
function postUser_SuccessCB(numEffected) {
    toggleForms('login');
}
// error CB
function postUser_ErrorCB(err) {
    showAlert('error', 'Oops...', 'Post User Failed!', 'Please Try Again');
    console.log(err);
}

// if user submits a login
function getUser() {
    let userEmail = $("#usernameTB").val();
    let password = $("#passTB").val();
    ajaxCall("GET", "../api/Users?userEmail=" + userEmail + "&password=" + password, "", getUser_SuccessCB, getUser_ErrorCB);
    return false;
}
// if user's login was successful
function getUser_SuccessCB(user) {
    user.Password = null;
    window.location.href = "insert.html"; //redirect page 
    localStorage['user'] = JSON.stringify(user); //save the logged in user to local storage
}
// if user's login failed
function getUser_ErrorCB(err) {
    console.log(err);
    if (err.status == 404)
        showAlert('error', 'Oops...', 'User name or password are incorrect...', 'please try again');
}

//toggle forms correctly
function toggleForms(toggleTo) {
    if (toggleTo == 'register') {
        $('#loginFormModal').hide();
        $('#registerFormModal').css("display", "block");
    } else {
        $('#registerFormModal').hide();
        $('#loginFormModal').css("display", "block");
    }
}

//validate birth year
function birthYearValidator() {
    year = new Date().getFullYear()
    if (this.value >= 1920 && this.value < year) {
        this.validity.valid = true;
        this.setCustomValidity('');
    }
    else {
        this.validity.valid = false; // must set it to false to prevent the submit to the server
        this.setCustomValidity('year is not valid, please enter a valid year');
    }
}
