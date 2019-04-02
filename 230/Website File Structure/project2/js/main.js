//debugger;
const searchedTermKey = "jgm1844-searchedTerm";
window.onload = init;
function init() {
    let storedSearchTerm = localStorage.getItem(searchedTermKey);
    // Sets searchbar term to stored previous value
    if ((storedSearchTerm != null) && (storedSearchTerm != ""))
        document.querySelector("#searchterm").value = storedSearchTerm;
    document.querySelector("#search").onclick = searchDefault;
    document.querySelector("#searchByBreed").onclick = searchByBreed;
    document.querySelector("#clearDebug").onclick = (e) => {
        document.querySelector("#debug").innerHTML = "<b>Cleared.</b><br />";
    }
    document.querySelector("#searchterm").onfocus = (e) => {
        if (e.target.value == "not used")
            e.target.value = "";
    }
    document.querySelector("#searchterm").onblur = (e) => {
        if (e.target.value == "")
            e.target.value = "not used";
    }
}
function searchDefault() {
    // 1 - main entry point to web service
    const SERVICE_URL = "https://dog.ceo/api/breeds/image/random";

    // No API Key required!

    // 2 - build up our URL string; not necessary for this service endpoint
    let url = SERVICE_URL;
    getData(url);
}
function searchByBreed() {
    // 1 - main entry point to web service
    const SERVICE_URL = "https://dog.ceo/api/breed/";

    // No API Key required!

    // 2 - build up our URL string
    debugger;
    let temp = document.querySelector("#searchterm").value;
    // Tries to reformat multi-word breeds into applicable formats (i.e. "golden retriever" -> "retriever-golden")
    if (temp.includes(" ")) {
        let tempArr = temp.split(" ");
        temp = tempArr[tempArr.length - 1];
        for (let i = tempArr.length - 2; i >= 0; i--)
            temp += "-" + tempArr[i];
    }
    let url = SERVICE_URL + temp + "/images/random";
    getData(url);
}
function getData(url) {
    // 3 - parse the user entered term we wish to search; not necessary for this service endpoint

    // Store new last searched term.
    if (document.querySelector("#searchterm").value != "")
        localStorage.setItem(searchedTermKey, document.querySelector("#searchterm").value);
    // 4 - update the UI
    document.querySelector("#debug").innerHTML += `<br /><b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    // 5- call the web service, and prepare to download the file
    $.ajax({
        dataType: "json",
        url: url,
        data: null,
        success: jsonLoaded
    });
}
function jsonLoaded(obj) {
    // 6 - if there are no results, print a message and return
    // Here, we don't get an array back, but instead a single object literal with 2 properties
    if (obj.status != "success") {
        document.querySelector("#content").innerHTML = `<p><i>There was a problem!</i> message: ${obj.message}</p>`;
        return; // Bail out
    }

    // 7 - if there is an array of results, loop through them
    let results = obj.data
    let src = obj.message;
    let link = `<a href="${src}">${src}</a>`;
    document.querySelector("#debug").innerHTML += "<br />&nbsp&nbsp&nbsp&nbsp&nbsp<b>Retrieved: </b>" + link;
    let bigString = `<p><i>Here is the result!</i> ${link}</p>`;
    bigString += `<img src="${src}" alt="random dog" style="float:right;" />`

    // 8 - display final results to user
    document.querySelector("#content").innerHTML = bigString;
}