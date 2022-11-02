/*
 * This page contains GLOBAL js methods 
 */

function showAlert(icon, title, text, footer) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        footer: footer
    })
}

// checks whether a string is empty 
// returns true if it is and false if it isn't
function strEmpty(str) {
    let len = str.replace(/\s/g, '').length;
    if (len == 0) return true;
    return false;
}

// get the tv object via its ID
function getTVByID(id) {
    for (i in tvShows) {
        if (tvShows[i].Show_id == id)
            return tvShows[i];
    }
    return null;
}


// cleaner
function clearPH(ph) {
    ph.html("");
}

//==SCROLL-BAR==
$(document).ready(function () {
    if (!$.browser.webkit) {
        $('.wrapper').html('<p>Sorry! Non webkit users. :(</p>');
    }
});


