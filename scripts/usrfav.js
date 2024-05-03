
function makeBlob() {
    document.getElementById("export").addEventListener("click", () => {
        console.log("share button pressed");
        let storage = localStorage.getItem("favorites");
        let lsJson = JSON.stringify(JSON.parse(storage));
        let blob = new Blob([lsJson], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "favorites.json";
        downloadLink.click();
    });
}

function populateFavoritesFromStorage() {
    console.log('populateFromLocalStorage');
    clearList()
    //handle loading from localStorage
    const items = localStorage.getItem('recentSearches');
    if (items) {
        JSON.parse(items).forEach(addItemToList)
    }
}

function addItemToList(item) {
    const list = document.getElementById('items')
    // CREATE THE GALLERY HERE FROM THE STORAGE
    // Consider using bootstrap components.
    newLi.textContent = item;
    list.append(newLi)
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
    console.log('initialize user-favorite page')
    // populateLocalStorageFromURLSearch() // Added so that the page doesn't need a refresh to work
    populateFromLocalStorage()
    // document.getElementById('import-form').addEventListener('submit', importFromFile)
}