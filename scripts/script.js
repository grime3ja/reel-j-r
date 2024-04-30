// This is where we will include our javascript
function OS() {
    var element = document.body;
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        dark();
    } else {
        light();
    }
    sessionStorage.setItem("background","os");
}

function dark() {
    sessionStorage.setItem("background","dark");
    var element = document.body;
    element.classList.add("black");
    var nav = document.getElementById("navbard");
    nav.classList.add("navbar-dark");
    nav.setAttribute("data-bs-theme","dark");
}

function light() {
    sessionStorage.setItem("background","light");
    var element = document.body;
    element.classList.remove("black");
    var nav = document.getElementById("navbard");
    nav.classList.remove("navbar-dark");
    nav.removeAttribute("data-bs-theme");
}

function searchPressed() {
    //placeholder for search button functionality.
    let searchText = document.getElementById('search-bar');
    let output = document.getElementById('figure');
    if (output) {
        output.innerHTML = "";
    } else {
        location.href = "./index.html?search=" + searchText.value;
    }
    sessionStorage.setItem("q", searchText.value);
    const q = sessionStorage.getItem("q");
    const urlSPObj = new URLSearchParams();
    urlSPObj.append("search", q);
    getMovieData(q);
}

async function updateRecents(item) {
    let storage = localStorage.getItem("recentSearches");
    let result = JSON.stringify(item);
    if(storage == null) {
        var recents = [];
        // console.log("First Item");
        recents.push(result);
        localStorage.setItem("recentSearches", JSON.stringify(recents));
    }
    else {
        // console.log(storage);
        let test = JSON.parse(storage);
        test.push(result);
        localStorage.setItem("recentSearches", JSON.stringify(test));
    }
}

async function changeGif(searchTerm, movieID) {
    try {
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
        let caption = document.createElement("figcaption");
        img.src = image;
        caption.textContent = searchTerm;
        let div = document.createElement("div");
        
        // Create an Object
        let store = new Object();
        store.movieid = movieID;
        store.name = searchTerm;
        store.gif = image;
        if(movieID != 0) {
            await updateRecents(store);
        }

        div.appendChild(img);
        div.appendChild(caption);
        output.appendChild(div);
    } catch (error) {
        console.log(error);
    }
}

// Don't bother until we can get recent's and favorites working
function getMoviefromID(id) {

}

async function getMovieData(searchTerm) {
    let queryString = new URLSearchParams({ query: searchTerm, page: 1 });
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhN2E1MTNjMjJlOTNlNmUyYTkzMDA5YzJlYTY1NjU5NiIsInN1YiI6IjY1ZGViMGE1YTliOWE0MDE4NjhlNmRhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4RERet9PDVIaOuYJUQbaeY_Yy9ycjqy6DizyVIOABnw'
        }
    };

    // we could use 'multi' instead of 'movie' if we want both tv and movies
    try {
        let titleDescriptionURL = 'https://api.themoviedb.org/3/search/movie?' + queryString.toString();
        let response = await fetch(titleDescriptionURL, options);
        let movie = (await response.json()).results[0];
        // if (!movie) {
        //     changeGif("404-Movie Not Found", 0);
        //     return;
        // }
        let id = movie.id;
        // gif is changed based off of the move title, thus interaction b/w TMDB and Gif API
        changeGif(movie.title, id);
        
        let whereURL = "https://api.themoviedb.org/3/movie/" + id + "/watch/providers";
        response = await fetch(whereURL, options);
        let temp = (await response.json()).results["US"];
        let where;
        if (temp.flatrate) {
            where = temp.flatrate[0].provider_name;
        } else if (temp.rent) {
            where = temp.rent[0].provider_name;
        } else if (temp.buy) {
            where = temp.buy[0].provider_name;
        }

        let actorURL = "https://api.themoviedb.org/3/movie/"+ id +"/credits";
        response = await fetch(actorURL, options);
        let actors = (await response.json()).cast;
        
        let article = document.getElementById("article");
        let div = document.getElementById("div");
        div.innerHTML = "";
        // let title = document.createElement("p");
        // title.textContent = "Title: " + movie.title;
        let description = document.createElement("p");
        description.textContent = "Description: " + movie.overview;
        let actor = document.createElement("p");
        actor.textContent = "Lead Actor: " + actors[0].name;

        // div.appendChild(title);
        div.appendChild(description);
        div.appendChild(actor);

        article.appendChild(div);

        let aside = document.getElementById("aside");
        let div1 = document.getElementById("tmdb");
        div1.innerHTML = "";
        let p1 = document.createElement("strong");
        p1.textContent = "Where to watch: " + where;
        let p2 = document.createElement("p");
        p2.innerHTML = "<strong>Notable Actors: </strong>";
        for (let i = 0; i < 4; i++) {
            p2.textContent += actors[i].name + ", ";
        }
        p2.textContent += actors[5].name;

        div1.appendChild(p1);
        div1.appendChild(p2);

        aside.appendChild(div1);
    } catch (error) {
        changeGif(searchTerm, 0);
        document.getElementById("div").textContent = "Movie not found, maybe try refining your search more.";
        document.getElementById("tmdb").textContent = "Or try again and pray it works this time.";
    }
}

async function loadPage() {
    const currentURLSearch = window.location.search;
    if (window.location.toString().includes("index.html")) {
        let btn = document.getElementById("btn");
        if (currentURLSearch.length > 0) {
            const decoded = new URLSearchParams(currentURLSearch);
            if (decoded.has("search")) {
                const items = decoded.getAll("search");
                sessionStorage.setItem("q", JSON.stringify(items));
                const q = sessionStorage.getItem("q");
                const urlSPObj = new URLSearchParams();
                urlSPObj.append("search", q);
                getMovieData(q);
                btn.style.visibility = "visible";
                btn.addEventListener("click", () => {
                    console.log("favorite clicked");
                });
            }
        }
        else {
            try {
                btn.style.visibility = "hidden";
            } catch (error) {

            }
            await changeGif("Movie", 0);
        }
    }
}

async function loadFooter() {
    let output = document.querySelector(".footer");
    const url = 'https://ron-swanson-quotes.herokuapp.com/v2/quotes';
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
}

function makeBlob() {
    if (window.location.toString().includes("user-favorites.html")) {
        console.log("on favorites page");
        document.getElementById("export").addEventListener("click", () => {
            console.log("share button pressed");
            let storage = localStorage.getItem("favorites");
            let lsJson = JSON.stringify(JSON.parse(storage));
            let blob = new Blob([lsJson], {type: "application/json"});
            let url = URL.createObjectURL(blob);
            let downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "favorites.json";
            downloadLink.click();
        });
    }
}

window.onload = ("load", async() => {
    loadPage();
    loadFooter();
    makeBlob();
    // sessionStorage.setItem("q", searchText.value);
});

document.addEventListener("DOMContentLoaded", (event) => {
    switch(sessionStorage.getItem("background")) {
        case "dark":
            dark();
            break;
        case "light":
            light();
            break;
        default:
            OS();
    }
});