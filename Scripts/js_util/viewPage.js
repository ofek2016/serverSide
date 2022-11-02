// ==== DOCUMENT READY ====//

$(document).ready(function () {
    // global vars
    user = JSON.parse(localStorage["user"]);
    $chatPH = $("#chatPH");
    $joinChatPH = $("#joinChatPH");

    // initialisation
    hideChat();
    // start ajaxCall (start the flow)
    getTvShows();
})

// ==== START FLOW ====//

// get all the tv shows of a user.
function getTvShows() {
    let api = "../api/Episodes?userID=" + user.Id;
    ajaxCall("GET", api, "", getTvShows_success, getTvShows_error);
}
// render DDL with the added tv shows.
function getTvShows_success(names) {
    renderShowsDDL(names);
    wireShowsDDL();
}
//ERROR CB: log the error & issue an error msg
function getTvShows_error(err) {
    console.log(err);
    showAlert('error', 'Oops...', "We couldn't get the tv show...", 'please try another one');
}

// render the tv shows ddl
function renderShowsDDL(names) {

    let show = "<select name='showsSLCT' id='showsSLCT'>";
    show += "<option value=-1>Choose A TV Show:</option>";

    if (names != null)
        for (var name in names)
            show += '<option value="' + names[name] + '">' + name + '</option>';

    show += "</select>";
    $("#selectPH").append(show);
    $("#selectPH").append("<a class='button' href='insert.html'>Search TV Show</a>");
}

// wire the tv shows ddl to its needed operations (including chat opening for the tvShow) (ajaxCall)
function wireShowsDDL() {
    $("#showsSLCT").change(function () {
        let $viewPH = $("#viewPH");
        if (this.value == -1) {
            $viewPH.hide();
            return;
        }

        if ($viewPH.is(":hidden"))
            $viewPH.show();

        if (!$viewPH.hasClass("background"))
            $viewPH.addClass("background");

        // global var
        chosenShowName = this.selectedOptions[0].label;
        chosenShowID = this.value;

        checkFanClub();
        getChosenShowEpisodes(chosenShowID);
    });
}

// get the chosen show episodes to render
function getChosenShowEpisodes(chosenShow) {
    if (chosenShow != "Choose A TV Show:") {
        let api = '../api/Episodes?userID=' + user.Id + '&tvShowID=' + chosenShow;
        ajaxCall("GET", api, "", getChosenShowEpisodes_success, getChosenShowEpisodes_error);
    }
}
// SUCCESS CB: call renderEpisodes with the episodes that came back
function getChosenShowEpisodes_success(episodes) { //?
    renderEpisodes(episodes);
}
//ERROR CB: log the error & issue an error msg
function getChosenShowEpisodes_error(err) {
    console.log(err);
    showAlert('error', 'Oops...', "Error Getting the show's Episodes", 'Please try again');
}

// given the episodes - render them to the PH
function renderEpisodes(episodes) {
    episodes.sort(compare); // compare so we get the season in ascending order

    // start rendering the seasons
    let str = "<h1 id='eHeader'>" + episodes[0].Show_name + "</h1>";
    str += "<h2>Season " + episodes[0].Season_num + "</h2>";

    for (let i = 0; i < episodes.length; i++) {
        if (i != 0 && (episodes[i - 1].Season_num != episodes[i].Season_num))
            str += "<h2>Season " + episodes[i].Season_num + "</h2>";

        let eName = "<b><u>" + episodes[i].Episode_num + ". " + episodes[i].Episode_name + "</u></b>";
        let eDesc = episodes[i].Description;
        let eDate = "<b>Air Date: </b>" + episodes[i].Date;
        let eImg = episodes[i].Img;

        str += "<div class='episodePH'>";
        str += "<div class='episodeDetails'>";
        str += "<h3>" + eName + "</h3>";
        str += "<textarea  readonly>" + eDesc + "</textarea></br>";
        str += "<time class='eDate'>" + eDate + "</time>";
        str += "</div>";
        str += "<img class='eImg' src='" + eImg + "'/>";
        str += "</div>";
    }

    $("#episodesPH").html(str);
}

// for sorting purposes (* when rendering the episodes after choosing tv show from showsSLCT)
function compare(a, b) {
    let first = a.Season_num;
    let second = b.Season_num;
    return first - second;
}