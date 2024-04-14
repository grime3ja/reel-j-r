// This is where we will include our javascript
function OS() {
    var element = document.body;
    if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
        element.classList.add("black");
    } else {
        element.classList.remove("black");
    }
}

function dark() {
    var element = document.body;
    element.classList.add("black");
}

function light() {
    var element = document.body;
    element.classList.remove("black");
}

function search() {
    //placeholder for search button functionality.
}

async function changeGif(searchTerm) {
    let key = "GfikMeEJM8FxK5c55WN20VdX1OiG564a";
    let limitNumber = 1;
    let queryString = new URLSearchParams({api_key: key, q: searchTerm, limit: limitNumber, rating: "g", rating: "pg", rating: "pg-13"});
    const options = {
        method: "GET",
        query: queryString,
    }
    const url = 'https://corsproxy.io/?' + encodeURIComponent("https://api.giphy.com/v1/gifs/search?" + queryString.toString());
    let response = await fetch(url, options);
    let image = (await response.json()).data[0].images.original.url;
    let output = document.getElementById("figure");
    let img = document.createElement("img");
    img.src = image;
    let div = document.createElement("div");
    div.appendChild(img);
    output.appendChild(div);
}

window.onload = ("load", async() => {
    await changeGif("movie");
    let output = document.querySelector(".footer");
    const url = 'http://ron-swanson-quotes.herokuapp.com/v2/quotes';
    const options = {
        method: 'GET',
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        output.textContent = "\"" + result + "\"" + "-Ron Swanson";
    } catch (error) {
        console.error(error);
    }
});

OS();