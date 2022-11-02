

// https://api.themoviedb.org/3/search/tv?api_key=1c107f2bd2f3fc2aee24aa4f2f8d8647&language=en-US&page=1&include_adult=false&query=Grey%27s%20Anatomy

// =============================== //
//         Document Ready
// =============================== //

$(document).ready(function () {
    user = JSON.parse(localStorage["user"]); //sets current user - as global variable
    if (user.IsAdmin) {
        renderAdminbtn();
    }
    appendWelcomeHeader(); 
    //global vars
    $ph = $("#ph");
    $showPH = $("#TvShowPH");
    $actorsPH = $("#actorsPH");
    //TheMovieDB API key
    key = "c8ecbb65a6a519c62b41d8332d3e6a6d";
    api_key = "api_key=" + key;
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    //https://api.themoviedb.org/3/tv/1416/season/0/episode/64467?api_key=1c107f2bd2f3fc2aee24aa4f2f8d8647&language=en-US
});

function renderAdminbtn() {
    let str = '<a class="button" href="admin.html">Admin Page</a>';
    $("#Container").prepend(str);
}

// start getting the requested show from the server
function getTV() {
    let name = $("#tvShowName").val();
    let method = "3/search/tv?";
    let moreParams = "&language=en-US&page=1&include_adult=false&";
    let query = "query=" + encodeURIComponent(name);
    let apiCall = url + method + api_key + moreParams + query;
    // ask the server for the tv show
    ajaxCall("GET", apiCall, "", getTV_SuccessCB, getTV_ErrorCB);
}
// callback of getting the tv show successfuly
function getTV_SuccessCB(tv) {
    // error checking
    if (tv['results'].length == 0) {
        showAlert('error', 'Oops...', 'TV Show was not found', "try searching again...");
        return;
    }

    // global vars
    chosenTvShow = tv.results[0];
    tvId = chosenTvShow.id;
    tvShowName = chosenTvShow.original_name;

    method = "3/tv/";
    apiPrefix = url + method + tvId;
    apiSuffix = "?" + api_key

    let seasonsApiCall = apiPrefix + "/season/" + 1 + apiSuffix;
    let actorsApiCall = apiPrefix + "/credits" + apiSuffix;

    // call first season
    ajaxCall("GET", seasonsApiCall, "", getEverySeason_SuccessCB, getEverySeason_ErrorCB);
    //get the actors of the tv show
    ajaxCall("GET", actorsApiCall, "", getActors_SuccessCB, getActors_ErrorCB);
    // clean the page every time we search for a new tv show
    clearPH($ph);
    clearPH($actorsPH);
    // add css for tv rendering
    wireTvShowCSS();
}
// callback function of the call to get the requested by user tv show
function getTV_ErrorCB(err) {
    console.log(err);
}

// render the show stats
function getActors_SuccessCB(actorsData) {
    // global var
    actors = actorsData.cast;

    let videosApiCall = apiPrefix + "/videos" + apiSuffix;
    // get the videos for tv show
    ajaxCall("GET", videosApiCall, "", getVideos_SuccessCB, getVideos_errorCB);
}
// error CB
function getActors_ErrorCB(err) {
    console.log(err);
}

// get the videos
function getVideos_SuccessCB(videos) {
    console.log(videos);
    // global var
    trailerKey = videos.results[0].key;
    // start render the show stats
    renderShowStats();
}
// error CB
function getVideos_errorCB(err) {
    console.log(err);
}

// callback to start recursion calls to get every season and render it
function getEverySeason_SuccessCB(season) {
    renderSeason(season);
    let seasonsApiCall = apiPrefix + "/season/" + (season.season_number + 1) + apiSuffix;
    // call the next season
    //let apiCall = url + method + tvId + "/season/" + (season.season_number + 1) + "?" + api_key;
    ajaxCall("GET", seasonsApiCall, "", getEverySeason_SuccessCB, getEverySeason_ErrorCB);
}
// callback to know when we finished rendering all the seasons
function getEverySeason_ErrorCB(err) {
    wireSeasonCSS();
    console.log(err);
}

// callback function to render a chosen season episodes
function getSpecificSeason_SuccessCB(season) { 
    //clear the place holder to render the episodes for each selected show
    clearPH($ph); 
    // remove the card container css for episodes rendering
    $ph.removeClass("card-list"); 
    renderEpisodes(season);
}
// callback function of the rendering of the specific season episodes
function getSpecificSeason_ErrorCB(err) {   
    showAlert('error', 'Oops...', 'failed to get this specific season!', 'try another one...');
}

// insert Episode to data services
function postEpisode(idx, btn) { 
    // keep track over current clicked button
    currentClickedBtn = btn;
    // tv show object to insert
    let tvshow = {
        Show_id: chosenTvShow.id,
        Popularity: chosenTvShow.popularity,
        First_air_date: chosenTvShow.first_air_date,
        Name: chosenTvShow.name,
        Origin_country: chosenTvShow.origin_country,
        Original_language: chosenTvShow.original_language,
        Overview: chosenTvShow.overview,
        Poster_path: chosenTvShow.poster_path
    }
    // episode object to insert
    let e = episodes[idx];

    let episode = {
        Show_id: chosenTvShow.id,
        Show_name: tvShowName,
        Episode_num: e.episode_number,
        Episode_id: e.id,
        Episode_name: e.name,
        Img: imagePath + e.still_path,
        Description: e.overview,
        Season_num: e.season_number,
        Date: e.air_date
    }
    let user = JSON.parse(localStorage["user"]);

    //complex object that holds episode, user ID and the tv show
    let p = {
        Episode: episode,
        UserID: user.Id,
        TvShow: tvshow
    }

    // the Preference object containing userID,episode,tvshow to POST
    let api = "../api/Episodes";
    ajaxCall("POST", api, JSON.stringify(p), postEpisode_SuccessCB, postEpisode_ErrorCB);

}

// callback to handle the successfull "POST" of an episode
function postEpisode_SuccessCB() {
    showAlert('success', 'YAY!', 'Episode inserted successfuly!', 'You can view it in "view" page...');
    currentClickedBtn.style.display = 'none';
}

// callback to handle the unsuccessfull "POST" of an episode
function postEpisode_ErrorCB(err) {
    showAlert('error', 'Oops...', 'Failed posting an episode!', 'Please try again...');
}

// =============================== //
//      Helping functions
// =============================== //

// append the welcome header
function appendWelcomeHeader() {
    let welcomeHeader = "";
    welcomeHeader = "<h1 id='welcomeHeader'>Welcome " + user.First_name + " " + user.Last_name + "</h1>";
    $("#Container").prepend(welcomeHeader);
}

// wire enter search event
function searchWithEnter(e) {
    if (e.keyCode == 13) {
        getTV()
    }
    return false;
}

// add CSS to seasons rendering
function wireSeasonCSS() {
    $("#ph div").hover( // add red shadow when hovering over a specific season
        function () {
            $(this).addClass("hoverBorder"); // add hover class when mouse enters
        },
        function () {
            $(this).removeClass("hoverBorder");  //remove hover class when mouse exits
        }
    )

    $("#ph div").click(function () {  // assign season clicking a specific season
        // ask for the season which was clicked
        let apiCall = url + method + tvId + "/season/" + this.id + "?" + api_key;
        ajaxCall("GET", apiCall, "", getSpecificSeason_SuccessCB, getSpecificSeason_ErrorCB);
    })
}

// wire CSS to tvshows after selecting one from the 'showsSelect'
function wireTvShowCSS() {
    // add the card container css for tv shows rendering
    $ph.addClass("card-list");
    $ph.addClass("background");
    $showPH.addClass("background");
    $actorsPH.addClass("background"); 
}

//====== Seasons & season Episodes Rendering =======
function renderSeason(season) {
    let sNum = season.season_number;
    let sName = season.name;
    let sPoster = imagePath + season.poster_path;

    // append season div
    let str = "<div id='" + sNum + "' class='card'><h3>" + sName + " </h3><img src='" + sPoster + "'/></div>"
    $ph.append(str);
}

//Render the episode to screen
function renderEpisodes(season) { 
    // global var
    episodes = season.episodes;
    //currentSeason = season;
    $season_head = $("<h3>").attr('id', '#eHeader' + tvShowName);
    $season_head.append($("<h2>").text(season.name));
    $ph.append($season_head);

    // start rendering the episodes
    for (let i = 0; i < episodes.length; i++) {//TODO convert to JQUERY
        let eName = "<b><u> Episode " + episodes[i].episode_number + '. "' + episodes[i].name + '"</u></b>';
        let eImg = imagePath + episodes[i].still_path;
        let eDesc = episodes[i].overview;
        let eDate = "<b>Air Date: </b>" + episodes[i].air_date;
        // create the add btn and wire it to function - giving i as the index to the episodes array.
        let button = "<button onclick='postEpisode(" + i + ",this)' class='addBTN button'>Save</button>";
        let str = "<div class='episodePH'>";
        str += "<div class='episodeDetails'>";
        str += "<div>";
        str += "<h3>" + eName + "</h3>";
        str += "<textarea rows='10' cols='35' readonly>" + eDesc + "</textarea>";
        str += "<time class='eDate'>" + eDate + "</time>";
        str += "</div>";
        str += button;
        str += "</div>";
        str += "<img class='eImg' src='" + eImg + "'/>";
        str += "</div>";

        $ph.append(str);
    };
}

//====== Show Stats Rendering =======
// ---main method---
function renderShowStats() {
    clearPH($showPH);
    renderDetails();
    renderRating();
    renderTrailer();
    renderCast();
    addRatingCSS();
}

// ---sub-methods---

//
function renderDetails() {
    let publishYear = chosenTvShow.first_air_date;
    let year = parseInt(publishYear);

    let showHeader = "<h3 class='header'>" + tvShowName + " (" + year + ")</h3>";
    let statsPH = "<div id='statsPH' class='background'></div>"
    let overview = "<p>" + chosenTvShow.overview + "</p>";

    let detailsDiv = "<div id='detailsPH'>" + showHeader + overview + statsPH + "</div>";

    let img = "<div><img src='" + imagePath + chosenTvShow.poster_path + "'></div>";

    let firstRow = "<div id='firstRow'>" + img + detailsDiv + "</div>";

    $showPH.append(firstRow);
}

// Render cast (Actors) of a TV show
function renderCast() {
    var str = "<h3> Actors </h3>";
    str += "<div class='card-list'>";
    // iterate over the cast and render each one
    for (var i in actors) {
        let img = imagePath + actors[i].profile_path;
        let real_name = actors[i].name;
        let character_name = actors[i].character;
        str += "<div class='card'>";


        str += '<h4><b>"' + character_name + '"</b></h4>';
        str += "<h5>" + real_name + "</h5>";

        str += "<img src='" + img + "'/>";
        str += "</div>";
    }
    str += "</div>";
    
    $actorsPH.append(str);
}

// Render single Rating
function renderRating() {
    let ratingPercentage = (chosenTvShow.vote_average * 10);
    $("#statsPH").append("<h5>Rating</h5><div class='rating'>" + ratingPercentage + "%</div>");
}

// add the Ratings CSS
function addRatingCSS() {
    // Find al rating items
    const ratings = document.querySelectorAll(".rating");

    // Iterate over all rating items
    ratings.forEach((rating) => {
        // Get content and get score as an int
        const ratingContent = rating.innerHTML;
        const ratingScore = parseInt(ratingContent, 10);

        // Define if the score is good, meh or bad according to its value
        const scoreClass =
            ratingScore < 40 ? "bad" : ratingScore < 60 ? "meh" : "good";

        // Add score class to the rating
        rating.classList.add(scoreClass);

        // After adding the class, get its color
        const ratingColor = window.getComputedStyle(rating).backgroundColor;

        // Define the background gradient according to the score and color
        const gradient = `background: conic-gradient(${ratingColor} ${ratingScore}%, transparent 0 100%)`;

        // Set the gradient as the rating background
        rating.setAttribute("style", gradient);

        // Wrap the content in a tag to show it above the pseudo element that masks the bar
        rating.innerHTML = `<span>${ratingScore} ${ratingContent.indexOf("%") >= 0 ? "<small>%</small>" : ""
            }</span>`;
    });
}

// render the trailer & popup trailer
function renderTrailer() {
    let str = "<div class='trailer'>";
    str += "<img href='#media-popup' data-media='//www.youtube.com/embed/" + trailerKey + "' src='../css/images/youtube.png'/>";
    str += '<div class="popup" id="media-popup">';
    str += "</div>";
    str += "</div>";
    $("#statsPH").append(str);
    // only for first time
    trailerWired = 0;
    wireTrailer();
}

// wire the trailer button behaviour
function wireTrailer() {
    // wire click
    $("[data-media]").on("click", function (e) {
        e.preventDefault();
        appendTrailerIframe();
        if (!trailerWired) {
            wireTrailerPopup();
            // change to 1 after first click to prevent unnecessary wiring in the second time
            trailerWired = 1;
        }

        var $this = $(this);
        var videoUrl = $this.attr("data-media");
        var popup = $this.attr("href");
        var $popupIframe = $(popup).find("iframe");

        $popupIframe.attr("src", videoUrl);
        $this.closest(".trailer").addClass("show-popup");
    });
}

// append the iframe itself (will be deleted when we close the popup, and reRendered when we open it again)
function appendTrailerIframe() {
    let str = '<iframe width="560" height="315" src="" frameborder="0" allowfullscreen></iframe>';
    $(".popup").append(str);
}

// wire the trailer popup behaviour
function wireTrailerPopup() {

    // press anywhere outside the trailer to close it
    $(".popup").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(".trailer").removeClass("show-popup");
        $(".popup").html("");
    });

    $(".popup > iframe").on("click", function (e) {
        e.stopPropagation();
    });
}