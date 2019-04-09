//debugger;
const SERVICE_URL = "https://dog.ceo/api/breed";
const searchedTermKey = "jgm1844-searchedTerm";
const favURLsKey = "jgm1844-favs";
// \/ \/ \/ Gets user favorites \/ \/ \/
let favs = localStorage.getItem(favURLsKey);
if (favs == null)
    favs = new Array();
else
    favs = JSON.parse(favs);
// /\ /\ /\ Gets user favorites /\ /\ /\
window.onload = init;
function init() {
    // \/ \/ \/ Handle storage loading \/ \/ \/
    let storedSearchTerm = localStorage.getItem(searchedTermKey);
    console.log(storedSearchTerm);
    // Sets searchbar term to stored previous value
    if ((storedSearchTerm != null) && (storedSearchTerm != ""))
        document.querySelector("#searchterm").value = storedSearchTerm;
    // /\ /\ /\ Handle storage loading /\ /\ /\

    // *** BIND EVENTS ***
    document.querySelector("#search").onclick = searchDefault;
    document.querySelector("#searchByBreed").onclick = searchByBreed;
    document.querySelector("#searchByBreedAll").onclick = searchByBreedAll;
    document.querySelector("#clearDebug").onclick = (e) => {
        document.querySelector("#debug").innerHTML = "<b>Cleared.</b><br />";
    }
    document.querySelector("#toggleDebug").onclick = (e) => {
        if (document.querySelector("#debug").style.display == "none") {
            document.querySelector("#debug").style.display = "block";
            document.querySelector("#clearDebug").style.display = "inline";
            document.querySelector("#toggleDebug").innerHTML = "Hide Debug Log";
        }
        else {
            document.querySelector("#debug").style.display = "none";
            document.querySelector("#clearDebug").style.display = "none";
            document.querySelector("#toggleDebug").innerHTML = "Show Debug Log";
        }
    }
    document.querySelector("#searchterm").onfocus = (e) => {
        if (e.target.value == "<Please enter a search term>")
            e.target.value = "";
    }
    document.querySelector("#searchterm").onblur = (e) => {
        if (e.target.value == "")
            e.target.value = "<Please enter a search term>";
    }
    // *** BIND EVENTS ***
}
function searchDefault() {
    let url = SERVICE_URL + "s/image/random";
    getData(url);
}
function searchByBreed() {
    //debugger;
    let temp = document.querySelector("#searchterm").value;
    // Tries to reformat multi-word breeds into applicable formats (i.e. "golden retriever" -> "retriever-golden")
    if (temp.includes(" ")) {
        let tempArr = temp.split(" ");
        temp = tempArr[tempArr.length - 1];
        for (let i = tempArr.length - 2; i >= 0; i--)
            temp += "-" + tempArr[i];
    }
    let url = SERVICE_URL + "/" + temp + "/images/random";
    getData(url);
}
function searchByBreedAll() {
    //debugger;
    let temp = document.querySelector("#searchterm").value;
    // Tries to reformat multi-word breeds into applicable formats (i.e. "golden retriever" -> "retriever-golden")
    if (temp.includes(" ")) {
        let tempArr = temp.split(" ");
        temp = tempArr[tempArr.length - 1];
        for (let i = tempArr.length - 2; i >= 0; i--)
            temp += "-" + tempArr[i];
    }
    let url = SERVICE_URL + "/" + temp + "/images";
    getData(url);
}
function getData(url) {
    if (document.querySelector("#searchterm").value != "")
        localStorage.setItem(searchedTermKey, document.querySelector("#searchterm").value);
    document.querySelector("#debug").innerHTML += `<br /><b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: jsonLoaded
    });
}
function jsonLoaded(obj) {
    // 6 - if there are no results, print a message and return
    //let imgTemplate = `<div class="result"><img src="${src}" alt="${src}" /><span><button class="favButton" data-img-url="${src}">Favorite?</button><br /><a class="imgLink" href="${src}">View Source</a></span></div>`;
    if (obj.status != "success") {
        document.querySelector("#content").innerHTML = "<p><i>There was a problem!</i></p>";
        document.querySelector("#debug").innerHTML = "<br />&nbsp&nbsp&nbsp&nbsp&nbsp<b><i>There was a problem!</i></b></p>";
        return; // Bail out
    }
    let bigString;
    // 7 - if there is an array of results, loop through them
    if (Array.isArray(obj.message)) {
        bigString = `<p><i>Here is the result!</i></p><div id="searchResults">`;
        let results = obj.message;
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            let src = result;
            if (!src) src = "media/no-image-found.png";
            let line = `<div class="result"><img src="${src}" alt="${src}" /><span><button class="favButton" data-img-url="${src}">Favorite?</button><br /><a class="imgLink" href="${src}">View Source</a></span></div>`;
            bigString += line;
        }
        bigString += "</div>";
        document.querySelector("#debug").innerHTML += "<br />&nbsp&nbsp&nbsp&nbsp&nbsp<b>Retrieved: LIST</b>";
    }
    else {
        let src = obj.message;
        let link = `<a href="${src}">${src}</a>`;
        document.querySelector("#debug").innerHTML += "<br />&nbsp&nbsp&nbsp&nbsp&nbsp<b>Retrieved: </b>" + link;
        bigString = `<p><i>Here is the result!</i> ${link}</p>`;
        bigString += `<div class="result"><img src="${src}" alt="${src}" /><span><button class="favButton" data-img-url="${src}">Favorite?</button><br /><a class="imgLink" href="${src}">View Source</a></span></div>`;
    }

    // 8 - display final results to user
    document.querySelector("#content").innerHTML = bigString;

    // \/ \/ \/ CONFIGURE FAVORITE BUTTON \/ \/ \/
    let favButtons = document.querySelectorAll(".favButton");
    for (let i = 0; i < favButtons.length; i++) {
        // if the current list of favs has this url
        if (favs.find((elem) => { return elem == favButtons[i].getAttributte("imgURL"); }) != undefined) {
            favButtons[i].innerHTML = "Favorited!";// TODO: CHANGE CSS TO MAKE IT CLEAR IT'S ALREADY BEEN FAVORITED
            favButtons[i].onclick = removeFavorite;
        }
        else
            favButtons[i].onclick = addFavorite;
    }
    // /\ /\ /\ CONFIGURE FAVORITE BUTTON /\ /\ /\
}

function addFavorite(e) {
    // e.target.getAttribute("imgURL");
    console.log(`addFavorite called`);
    console.log(`length before: ${favs.length}`);
    favs.push(e.target.getAttribute("imgURL"));
    console.log(`length after: ${favs.length}`);
    e.target.innerHTML = "Favorited!";
    e.target.onclick = removeFavorite;
}

function removeFavorite(e) {
    // e.target.getAttribute("imgURL");
    console.log(`removeFavorite called`);
    console.log(`length before: ${favs.length}`);
    favs = favs.filter((elem) => { return elem != e.target.getAttribute("imgURL"); });
    console.log(`length after: ${favs.length}`);
    e.target.innerHTML = "Favorite?";
    e.target.onclick = addFavorite;
}

//function parseMessage(src) {
//    let link = `<a href="${src}">${src}</a>`;
//    document.querySelector("#debug").innerHTML += "<br />&nbsp&nbsp&nbsp&nbsp&nbsp<b>Retrieved: </b>" + link;
//    let bigString = `<p><i>Here is the result!</i> ${link}</p>`;
//    bigString += `<img src="${src}" alt="${src}" style="float:right;" />`;
//}