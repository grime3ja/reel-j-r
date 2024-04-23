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

function searchPressed() {
    //placeholder for search button functionality.
    let searchText = document.getElementById('search-bar');
    let output = document.getElementById('figure');
    output.innerHTML = "";
    changeGif(searchText.value);
    getMovieData(searchText.value);
}

async function changeGif(searchTerm) {
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
        img.src = image;
        let div = document.createElement("div");
        div.appendChild(img);
        output.appendChild(div);
    } catch (error) {
        
    }
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
    let titleDescriptionURL = 'https://api.themoviedb.org/3/search/movie?' + queryString.toString();
    let response = await fetch(titleDescriptionURL, options);
    let movie = (await response.json()).results[0];
    console.log(movie);
    let id = movie.id;
    let whereURL = "https://api.themoviedb.org/3/movie/" + id + "/watch/providers"
    response = await fetch(whereURL, options);
    let where = (await response.json()).results["US"].flatrate[0].provider_name;
    
    let article = document.getElementById("article");
    let div = document.getElementById("div");
    div.innerHTML = "";
    let title = document.createElement("p");
    if (movie.media_type === "tv") {
        title.textContent = "Title: " + movie.name;
    } else {
        title.textContent = "Title: " + movie.original_title;
    }
    let description = document.createElement("p");
    description.textContent = "Description: " + movie.overview;

    div.appendChild(title);
    div.appendChild(description);

    article.appendChild(div);

    let aside = document.getElementById("aside");
    let div1 = document.getElementById("tmdb");
    // let p1 = document.createElement("p");
    // p1.textContent = "test";
    let p2 = document.createElement("p");
    p2.textContent = "Where to watch: " + where;

    // div1.appendChild(p1);
    div1.appendChild(p2);

    aside.appendChild(div1);
}

window.onload = ("load", async() => {
    await changeGif("movie");
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
});

OS();