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

window.onload = ("load", async() => {
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