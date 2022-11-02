//==== INIT FUNCTIONS ====//

// to check if the user is in the shows fanclub (ajaxCall)
function checkFanClub() {
    let api = "../api/Users?userID=" + user.Id + "&showID=" + chosenShowID;
    ajaxCall("GET", api, "", checkFan_success, checkFan_error);

}
// init the chat if user registered to it
function checkFan_success(found) {
    initChat();
}
// render the 'join chat' button in case the user is not registered to the show fan club
function checkFan_error(err) {
    if (err.status == 404)
        renderJoinFanClub();
    else console.log(err);
}

// render the 'join fan club' button
function renderJoinFanClub() {
    hideChat();
    $joinChatPH.html('');
    let btn = "<button id='" + chosenShowID + "' class='button' onclick='JoinFanClub()'>Join " + chosenShowName + " Fan Club</button> ";
    $joinChatPH.append(btn);
}

// Join the fan club (ajaxCall)
function JoinFanClub() {
    let api = "../api/Users?userId=" + user.Id + "&showId=" + chosenShowID;
    ajaxCall("POST", api, "", JoinFan_success, JoinFan_error);
}
// init the chat after joined the fan club
function JoinFan_success(numAffected) {
    initChat();
}
// error CB
function JoinFan_error(e){
    console.log(e);
}

// initialize the chat
function initChat() {
    // global vars
    $msgPH = $("#msgPH");
    $msgTB = $("#MessageTB");
    msgArr = [];
    // clear chat to rerender per-show chat. 
    $msgPH.html('');
    // save the messages in the correct place in DB, creates a new one if doesnt exists
    ref = firebase.database().ref(chosenShowID);
    // init incoming messages listener
    listenToNewMessages();
    // append header of the chat.
    initChatHeader();
    // initial chat chars count
    countChars();
    // init the name of the user in the chat
    initName();
    // show the chat PH
    showChat();
}

//==== Listeners ====//
// listen to new messages
function listenToNewMessages() {
    // child_added will be evoked for every child that was added
    // on the first entry, it will bring all the childs
    ref.on("child_added", snapshot => {
        msg = {
            name: snapshot.val().name,
            content: snapshot.val().msg,
        }
        // if message content is empty do not print it
        if (strEmpty(msg.content)) return;
        msgArr.push(msg)
        printMessage(msg);
        $msgPH.scrollTop($msgPH[0].scrollHeight); // always show the latest message (scroll to bottom automatically)
    })
}

// add a message to the chat
function addMSG() {
    let msg = $msgTB.val();
    // only add messages with content
    if (!strEmpty(msg)) {
        ref.push().set({
            "msg": msg,
            "name": name
        });
        $msgTB.val(''); // reset input text box.
    }
    $("#chatForm").submit(function () { return false; });//prevent form from refreshing the page.
}

//==== PRINT FUNCTIONS ====//
function printMessage(msg) { //display user's enterend message
    $msgPH.append(buildMsgP(msg));
}

// builds the paragraph to insert into the msgPH
function buildMsgP(msg) {
    return $("<p>").html("<b>" + msg.name + ":</br> </b> " + msg.content);
    // return msg.name + ": "+ msg.content +"&#13;&#10";
}

//====HELPING FUNC====//
// show chat ph
function showChat() {
    $joinChatPH.hide();
    $chatPH.show(500); // 500ms to animate
}
// hide chat ph
function hideChat() {
    $chatPH.hide();
    $joinChatPH.show(500);
}
// create & append the chat header
function initChatHeader() {
    showname = $("#showsSLCT option:selected").text(); //get current tv show name
    $("#chatHeader").html(showname + " Chat");
}

//method will post message or count characters
function countChars() {
    let label = $('#MessageTBlbl'); // get label
    let len = $msgTB.val().length; // get current input length
    let maxlen = $msgTB.attr('maxLength');//get element's max length
    label.html(len + "/" + maxlen); // counting characters
}

// init the name of the user in the chat
function initName() {
    name = "";
    if (localStorage["user"] == null)
        name = "Annonymous";
    else
        name = user.First_name + " " + user.Last_name;
}
