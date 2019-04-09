//debugger;
const SERVICE_URL = "https://dog.ceo/api/breed";
const searchedTermKey = "jgm1844-searchedTerm";
const favURLsKey = "jgm1844-dog-finder-favs";

// \/ \/ \/ Gets user favorites \/ \/ \/
let favs = localStorage.getItem(favURLsKey);
if (favs == null || favs == undefined)
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

    // \/ \/ \/ BIND EVENTS \/ \/ \/
    document.querySelector("#search").onclick = searchDefault;
    document.querySelector("#searchByBreed").onclick = searchByBreed;
    document.querySelector("#searchByBreedAll").onclick = searchByBreedAll;
    document.querySelector("#clearDebug").onclick = (e) => {
        document.querySelector("#debug").innerHTML = "<b>Cleared.</b><br />";
    }
    document.querySelector("#displayLocalStorage").onclick = (e) => {
        document.querySelector("#debug").innerHTML += "<br /><br /><b>Favorites:</b>";
        let tempFavs = localStorage.getItem(favURLsKey);
        if (tempFavs == null || tempFavs == undefined)
            document.querySelector("#debug").innerHTML += "&nbspEMPTY";
        else {
            tempFavs = JSON.parse(tempFavs);
            document.querySelector("#debug").innerHTML += "&nbspLength = " + tempFavs.length;
            for (let i = 0; i < tempFavs.length; i++)
                document.querySelector("#debug").innerHTML += `<br />&nbsp&nbsp&nbsp&nbsp&nbsp<a href="${tempFavs[i]}">${tempFavs[i]}</a>`;
        }
        document.querySelector("#debug").innerHTML += `<br /><br /><b>Last Search Term:</b>&nbsp${localStorage.getItem(searchedTermKey)}`;
    }
    document.querySelector("#toggleDebug").onclick = (e) => {
        if (document.querySelector("#debug").style.display == "none") {
            document.querySelector("#debug").style.display = "block";
            document.querySelector("#clearDebug").style.display = "inline";
            document.querySelector("#displayLocalStorage").style.display = "inline";
            document.querySelector("#toggleDebug").innerHTML = "Hide Debug Log";
        }
        else {
            document.querySelector("#debug").style.display = "none";
            document.querySelector("#clearDebug").style.display = "none";
            document.querySelector("#displayLocalStorage").style.display = "none";
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
    // /\ /\ /\ BIND EVENTS /\ /\ /\
}

function searchDefault() {
    console.log(`searchDefault called`);

    // Construct url
    let url = SERVICE_URL + "s/image/random";
    getData(url);
}
function searchByBreed() {
    console.log(`searchByBreed called`);

    // Process user input
    let userInput = formatUserString(document.querySelector("#searchterm").value);

    // Construct url
    let url = SERVICE_URL + "/" + userInput + "/images/random";
    getData(url);
}
function searchByBreedAll() {
    console.log(`searchByBreedAll called`);

    // Process user input
    let userInput = formatUserString(document.querySelector("#searchterm").value);

    // Construct url
    let url = SERVICE_URL + "/" + userInput + "/images";
    getData(url);
}
// ****************************TODO: THIS*************************************************
function showFavorites() {

}

// Tries to reformat multi-word breeds into applicable formats (i.e. "golden retriever" -> "retriever-golden")
function formatUserString(userInput) {
    // Tries to reformat multi-word breeds into applicable formats (i.e. "golden retriever" -> "retriever-golden")
    if (userInput.includes(" ")) {
        let inputStrArr = userInput.split(" ");
        userInput = inputStrArr[inputStrArr.length - 1];
        for (let i = inputStrArr.length - 2; i >= 0; i--)
            userInput += "-" + inputStrArr[i];
    }
    return userInput;
}

function getData(url) {
    console.log(`getData called`);

    // Store last search term
    if (document.querySelector("#searchterm").value != "")
        localStorage.setItem(searchedTermKey, document.querySelector("#searchterm").value);

    // Log debug
    document.querySelector("#debug").innerHTML += `<br /><b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: jsonLoaded
    });
}
function jsonLoaded(obj) {
    console.log(`jsonLoaded called`);

    // 6 - if there are no results, print a message and return
    if (obj.status != "success") {
        document.querySelector("#content").innerHTML = "<p><i>There was a problem!</i></p>";
        document.querySelector("#debug").innerHTML = "<br />&nbsp&nbsp&nbsp&nbsp&nbsp<b><i>There was a problem!</i></b></p>";
        return; // Bail out
    }
    let bigString;

    // Process results
    //let imgTemplate = `<div class="result"><img src="${src}" alt="${src}" /><span><button class="favButton" data-img-url="${src}">Favorite?</button><br /><a class="imgLink" href="${src}">View Source</a></span></div>`;
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

    // CONFIGURE FAVORITE BUTTON
    let favButtons = document.querySelectorAll(".favButton");
    for (let i = 0; i < favButtons.length; i++) {
        // if the current list of favs has this url
        if (favs.find(function (elem) { return elem == getImgURLAttrib(favButtons[i])/*favButtons[i].getAttribute("imgURL")*/; }) != undefined) {
            favButtons[i].innerHTML = "Favorited!";// TODO: CHANGE CSS TO MAKE IT CLEAR IT'S ALREADY BEEN FAVORITED AND CLICKING WILL UNFAVORITE
            favButtons[i].onclick = removeFavorite;
        }
        else
            favButtons[i].onclick = addFavorite;
    }
}

function addFavorite(e) {
    console.log(`addFavorite called`);

    console.log(`length before: ${favs.length}`);
    favs.push(getImgURLAttrib(e.target)/*e.target.getAttribute("imgURL")*/);
    console.log(`length after: ${favs.length}`);
    e.target.innerHTML = "Favorited!";
    e.target.onclick = removeFavorite;
    storeFavs();
}

function removeFavorite(e) {
    console.log(`removeFavorite called`);
    console.log(`length before: ${favs.length}`);
    favs = favs.filter((elem) => { return elem != getImgURLAttrib(e.target)/*(e.target.getAttribute("imgURL"))*/; });
    console.log(`length after: ${favs.length}`);
    e.target.innerHTML = "Favorite?";
    e.target.onclick = addFavorite;
    storeFavs();
}

function storeFavs() {
    console.log(`storeFavs called`);
    let temp = JSON.stringify(favs);
    console.log(temp);
    localStorage.setItem(favURLsKey, temp);
}

function getImgURLAttrib(elem) {
    if (!elem.hasAttributes) return undefined;
    for (var i = 0; i < elem.attributes.length; i++) {
        if (elem.attributes[i].name == "imgUrl" || elem.attributes[i].name == "img-url" || /*Y THIS 1*/elem.attributes[i].name == "data-img-url") {
            return elem.attributes[i].value;
        }
    }
    return undefined;
}