let storage = JSON.parse(localStorage.getItem('favorites'));

function makeBlob() {
    document.getElementById("export").addEventListener("click", () => {
        console.log("share button pressed");
        let storage = localStorage.getItem("favorites");
        let blob = new Blob([storage], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "favorites.json";
        downloadLink.click();
    });
}

function findTheme() {
    switch (sessionStorage.getItem('background')) {
        case 'light':
            return 'light';
        default:
            return 'dark';
    }
}

function clearList() {
    console.log('clearFavorites')
    let temp = document.getElementById('gallery');
    temp.innerHTML = '';
}

function populateFavoritesFromStorage() {
    console.log('populateFromLocalStorage');
    clearList()
    //handle loading from localStorage
    const items = localStorage.getItem('favorites');
    if (items) {
        JSON.parse(items).forEach(addItemToList)
    }
}

function addItemToList(item) {
    item = JSON.parse(item);
    console.log(item);
    let list = document.getElementById('gallery');

    let card = document.createElement('div');
    card.classList.add('card');
    card.style.width = "18rem";
    card.setAttribute('data-bs-theme', findTheme());

    // Add the Image
    let img = document.createElement('img');
    img.src = item.gif;
    img.classList.add('card-img-top');
    img.alt = item.name + item.movieid;
    card.appendChild(img);

    // Add the Text
    let content = document.createElement('div');
    content.classList.add('card-body');
    let title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = item.name;
    let service = document.createElement('p');
    service.classList.add('card-text');
    service.textContent = 'Watch on ' + item.service;
    let searchAgainBtn = document.createElement('a');
    searchAgainBtn.classList.add('btn', 'btn-primary');
    searchAgainBtn.textContent = 'Search Again';
    searchAgainBtn.href = './index.html?search=' + item.name;
    let removeBtn = document.createElement('btn');
    removeBtn.classList.add('btn', 'btn-secondary');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', function () {
        console.log('removePressed');
        console.log(storage);
        console.log(storage.indexOf(JSON.stringify(item)));
        storage.splice(storage.indexOf(JSON.stringify(item)), 1);
        if (storage.length == 0) {
            localStorage.removeItem('favorites');
        } else {
            localStorage.setItem('favorites', JSON.stringify(storage));
        }
        location.reload();
    });

    content.appendChild(title);
    content.appendChild(service);
    content.appendChild(searchAgainBtn);
    content.appendChild(removeBtn);
    card.appendChild(content);

    list.append(card);
}

function populateFromLocalStorage() {
    console.log('populateFromLocalStorage')
    clearList()
    //handle loading from localStorage
    const items = localStorage.getItem('favorites');
    if (items) {
        JSON.parse(items).forEach(addItemToList)
    }
}

function init() {
    counter = 0;
    console.log('initialize user-favorite page')
    // populateLocalStorageFromURLSearch() // Added so that the page doesn't need a refresh to work
    populateFromLocalStorage()
    // document.getElementById('import-form').addEventListener('submit', importFromFile)
}

init();