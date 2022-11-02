//===== DOCUMENT READY =====//

$(document).ready(function () {
    // init global data
    key = "c8ecbb65a6a519c62b41d8332d3e6a6d";
    url = "https://api.themoviedb.org/";
    imagePath = "https://image.tmdb.org/t/p/w500/";
    lastRowSelected = null;
    episodesTbl = null;

    // admin page init functions
    hideAdminPHs();
    getAllUsers();
    getTVShows();
})


//===== USERS =====//

// get the Users to render (ajaxCall)
function getAllUsers() {
    ajaxCall("GET", "../api/Users", "", getAllUsers_SuccessCB, getAllUsers_ErrorCB);
}
//call renderUsersTable func
function getAllUsers_SuccessCB(usersData) {
    users = usersData;
    renderUsersTable();
    wireEditBtns();

}
// ERROR CB: log the error
function getAllUsers_ErrorCB(e) {
    console.log(e);
}

//render the users table
function renderUsersTable() {
    let $header = $("<h2>").text("Users Table");
    let div = $("<div class='header'>").append($header);
    $("#usersDiv").prepend(div);
    try {
        userTbl = $("#usersTable").DataTable({
            data: users,
            pageLength: 5,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        return "<button id='" + row.Id + "' class = 'editbtn btn btn-success'> edit </button>";
                    }
                },
                { data: "Id" },
                {
                    render: function (data, type, row, meta) {
                        return "<div style='text-align:center' class='editable'>" + row.First_name + "</div>";
                    }
                },
                {
                    render: function (data, type, row, meta) {
                        return "<div style='text-align:center' class='editable'>" + row.Last_name + "</div>";
                    }
                },
                {
                    render: function (data, type, row, meta) {
                        return "<div style='text-align:center' class='editable'>" + row.Email + "</div>";
                    }
                },
                {
                    render: function (data, type, row, meta) {
                        return "<div style='text-align:center' class='editable'>" + row.Password + "</div>";
                    }                },
                { data: "Cell_phone" },
                { data: "Gender" },
                { data: "Favorite_genre" },
                { data: "Address" },
                { data: "Birthyear" },
                {
                    render: function (data, type, row, meta) {
                        let isChecked = row.IsAdmin ? "checked" : "";
                        return "<input class='editableCB' disabled type='checkbox' "+isChecked+">";
                    }
                }
            ]
        })
    }
    catch (err) {
        console.log(err);
    }
}

// handle edit buttons behaviour and table behaviour while pressing the edit button
function wireEditBtns() {
    // keep track whether the first 
    prevBtn = null;
    // keep track whether a change was made in the table (different updating behaviour)
    changeFlag = false;
    resetMode = false;

    $(".editable").attr("text-align:center");

    $(".editbtn").click(function () {
        let btn = this;
        if (resetMode) {
            btn.innerHTML = "Submit";
            resetMode = false;
            renderEdit(btn);
            return;
        }

        if (btn.innerHTML == "Submit") {
            updateUser(btn.id);
            changeFlag = false;
            return;
        }

        if (prevBtn != null) {
            clearLastUserEdit();
            changeFlag = true;
            updateUser(prevBtn.id);
        }

        btn.innerHTML = "Submit";
        renderEdit(btn);
    })
}
// perform gui changes in table while updating & keep track over prev choice
function renderEdit(btn) {
    let editRow = btn.parentNode.parentNode;
    let name = editRow.cells[2].childNodes[0];
    let lastname = editRow.cells[3].childNodes[0];
    let password = editRow.cells[5].childNodes[0];
    let isAdminCB = editRow.cells[11].childNodes[0];
    // make editable content where we allowed
    name.contentEditable = true;
    name.style.background = 'lightblue';
    lastname.contentEditable = true;
    lastname.style.background = 'lightblue';
    password.contentEditable = true;
    password.style.background = 'lightblue';
    isAdminCB.disabled = false;
    markSelected(btn);
    // keep track over prev choice
    prevBtn = btn
    prevName = name;
    prevLast = lastname;
    prevPassword = password;
    previsAdminCB = isAdminCB;
}
// update the user in DB (ajaxCall)
function updateUser(user_id) {
    user = {
        Id: user_id,
        First_name: prevName.innerHTML,
        Last_name: prevLast.innerHTML,
        Password: prevPassword.innerHTML,
        IsAdmin: previsAdminCB.checked
    }
    ajaxCall("PUT", "../api/Users", JSON.stringify(user), updateUser_success, updateUser_error);
}
// update callback (alert of the change successfuly interted)
function updateUser_success(user_id) {
    showAlert('success', 'Update Success!', 'User ID: ' + user_id + ' updated successfuly!', '');
    if (!changeFlag) {
        clearLastUserEdit();
        lastRowSelected.classList.remove("selected");
        resetMode = true;
    }
}
// update success
function updateUser_error(err) {
    console.log(err);
}

// clear the last row which was selected for editing
function clearLastUserEdit() {
    prevName.contentEditable = false;
    prevName.style.background = '';
    prevLast.contentEditable = false;
    prevLast.style.background = '';
    prevPassword.contentEditable = false;
    prevPassword.style.background = '';
    previsAdminCB.disabled = true;
    prevBtn.innerHTML = "edit";
}


//===== TV SHOWS =====//

// get all the tvshows to render (ajaxCall)
function getTVShows() {
    ajaxCall("GET", "../api/Episodes", "", getTVShows_SuccessCB, getTVShows_ErrorCB);
}
// SUCCESS CB: start rendering tvshows and save tvShows Global, will also wire tbl btns
function getTVShows_SuccessCB(tvShowsData) {
    tvShows = tvShowsData;
    renderTVTable(tvShows);
    wireTableButtons();
}
// ERROR CB: log the error
function getTVShows_ErrorCB(err) {
    console.log(err);
}
// render the TV Table
function renderTVTable(tvShows) {
    let $header = $("<h2>").text("TV Shows Table");
    let div = $("<div class='header'>").append($header);
    $("#TvShowsDiv").prepend(div);
    try {
        tvTbl = $("#TvShowsTable").DataTable({
            data: tvShows,
            pageLength: 3,
            columns: [
                {
                    render: function (data, type, row, meta) {
                        let dataTV = "data-tvID='" + row.Show_id + "'";

                        viewTvBtn = "<button onclick='fillTvDescPH(this.id)' id='" + row.Show_id + "' type='button' class = 'viewOverview tvBtn btn btn-success' " + dataTV + "> Overview </button>"; //overview buttons

                        viewEpisodeDDL = "<select onclick='getAdminEpisodes(this.id, this.value)' id='" + row.Show_id + "' class='viewSeasons btn'>";//onchange event cant re-render the already selected item, once clicked again. therefore we want to use the onclick event instead.
                        viewEpisodeDDL += "<option selected value=''>Seasons</option>";

                        for (var i = 0; i < row.Season_nums.length; i++) {
                            viewEpisodeDDL += "<option value='" + row.Season_nums[i] + "'>Season " + row.Season_nums[i] + "</option>";
                        }
                        viewEpisodeDDL += "</select>";

                        return viewTvBtn + viewEpisodeDDL;
                    }
                },
                { data: "Show_id" },
                { data: "Name" },
                { data: "First_air_date" },
                { data: "Origin_country" },
                { data: "Original_language" },
                { data: "Popularity" },
                { data: "RuppinPopularity" },
                {
                    data: "Poster_path",
                    render: function (data, type, row, meta) {
                        return '<img class="thumbnail" src="' + imagePath + data + '">';
                    }
                }
            ]
        })
    }
    catch (err) {
        console.log(err);
    }
}

// fill the overview ph under the tvshows table
function fillTvDescPH(show_id) {
    tv = getTVByID(show_id);
    $("#TVoverview").text(tv.Name + " Overview: \n" + tv.Overview);
    showTvOverview();
}

// hide Episodes PH and view Overview PH
function showTvOverview() {
    $("#adminEpisodePH").hide();
    $("#TVeditDiv").show();
}

//===== EPISODES =====//

// get the episodes for episodes in a season table rendering (ajaxCall)
function getAdminEpisodes(show_id, season_num) {
    ajaxCall("GET", "../api/Episodes?show_id=" + show_id + "&season_num=" + season_num, "", getAdminEpisodes_success, getAdminEpisodes_error);
}
// behaviour after getting the the episodes to render in episodes table
function getAdminEpisodes_success(episodesData) {
    // save the episodes for global usage
    episodes = episodesData;

    // if the table does not exit yet (hasnt been rendered yet), than render it.
    if (episodesTbl == null)
        renderEpisodesTable(episodes);
    else // else redraw the table from the last season of the tvshow that was rendered.
        redrawEpisodesTbl(episodesTbl, episodes);

    // switch the ph's to show the table instead of the overview.
    showEpisodesTable();
}
// ERROR CB: log the err
function getAdminEpisodes_error(e) {
    console.log(e);
}
// render the episodes table for the first time
function renderEpisodesTable(episodes) {
    if (episodes == undefined || episodes == null) {
        return null;
    }
    drawEpisodesHeader();
    try {
        episodesTbl = $("#EpisodesTable").DataTable({
            data: episodes,
            pageLength: 5,
            columns: [
                { data: "Episode_num" },
                { data: "Episode_name" },
                { data: "RuppinPopularity" },
                { data: "Date" },
                {
                    data: "Img",
                    render: function (data, type, row, meta) {
                        return '<img class="thumbnail" src="' + imagePath + data + '">';
                    }
                }
            ]
        })
    }
    catch (err) {
        console.log(err);
    }
}
// redraw the existing season of a tv show rendered in the episodes table
function redrawEpisodesTbl(tbl, episodes) {
    // dont redraw a table that does not exists
    if (episodesTbl == null)
        return;
    // the table exists
    $("#adminEpisodePH .header").html("");
    drawEpisodesHeader();

    episodesTbl.clear();
    for (var i = 0; i < episodes.length; i++) {
        episodesTbl.row.add({
            Episode_num: episodes[i].Episode_num,
            Episode_name: episodes[i].Episode_name,
            RuppinPopularity: episodes[i].RuppinPopularity,
            Date: episodes[i].Date,
            Img: episodes[i].Img
        });
    }
    episodesTbl.draw();
}
// draw the episodes table header when choosing a specific tv show season to present
function drawEpisodesHeader() {
    let $header = $("<h2>").text(episodes[0].Show_name + " - Season " + episodes[0].Season_num);
    let div = $("<div class='header'>").append($header);
    $("#adminEpisodePH").prepend(div);
}

// hide Overview PH and view Episodes PH
function showEpisodesTable() {
    $("#TVeditDiv").hide();
    $("#adminEpisodePH").show();
}



//===== HELPING FUNCTIONS =====//

// hide the redundant ph's when loading the page
function hideAdminPHs() {
    $("#editUser").hide();
    $("#TVeditDiv").hide();
    $("#adminEpisodePH").hide();

    $("#usersDiv").hide();
    $("#TvShowsDiv").hide();
}

//===== TABLES CONFIG =====//

// wire the button behaviour for all the tables
function wireTableButtons() {
    // wire every table button
    $(".btn").click(function () {
        markSelected(this);
        $("#TVeditDiv :input").attr("disabled", "disabled"); // view mode: disable all controls in the form
    })
}

// mark the last selected row in dataTables.
function markSelected(btn) {
    if (lastRowSelected != null)
        lastRowSelected.classList.remove("selected");// remove the last row selected(last row = DOM element)
    let row = (btn.parentNode).parentNode; // button is in TD which is in Row
    row.className = 'selected'; // mark as selected
    lastRowSelected = row;
}

function toggleTables(val) {
    if (val == "users") {
        $("#usersDiv").show();
        $("#TvShowsDiv").hide();
    } else if (val == "tvshows") {
        $("#usersDiv").hide();
        $("#TvShowsDiv").show();
    }
}