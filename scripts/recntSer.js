let badData = false;

async function importFromFile() {
    console.log('import form was submitted')
    let fileInput = document.getElementById('import-file');
    let file = fileInput.files;
    if (file.length == 0) {
        alert("There is no file");
    }
    else {
        let contents = await file[0].text();
        localStorage.setItem('recentSearches', contents);
        populateFromLocalStorage() ? appendAlert('✅ Import Success', 'success'): appendAlert('⚠️Import Failure', 'warning');
    }
}

function clearList() {
    console.log('clearList')
    let temp = document.getElementById('recentList');
    temp.innerHTML = '';
}

async function addItemToList(item) {
    let list = document.getElementById('recentList')
    let newLi = document.createElement('li')
    try {
        item = await JSON.parse(item);

        let itemLink = document.createElement('a');
        itemLink.href = "./index.html?search=" + item.name;
        itemLink.textContent = item.name;
        newLi.append(itemLink);
    } catch (error) {
        // console.log(error);
        appendAlert('this item cannot be created', 'danger');
        badData = true;
        return false;
    }
    list.appendChild(newLi);
    return true;
}

function populateFromLocalStorage() {
    console.log('populateFromLocalStorage')
    clearList()
    //handle loading from localStorage
    const items = localStorage.getItem('recentSearches');
    if (items) {
        JSON.parse(items).forEach(addItemToList);
    }
    if (badData) {
        clearList();
        localStorage.removeItem('recentSearches');
        badData = false;
        return false;
    }
    return true;
}

function init() {
    console.log('initialize the page')
    // populateLocalStorageFromURLSearch() // Added so that the page doesn't need a refresh to work
    populateFromLocalStorage()
    // document.getElementById('import-form').addEventListener('submit', importFromFile)
}

init();


// Bootstrap component for alert functionality.
function appendAlert(message, type) {
    let alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    let wrapper = document.createElement('div');
    wrapper.setAttribute("class", "alert alert-" + type + " alert-dismissible fade show");
    wrapper.setAttribute("role", "alert");
    wrapper.textContent = message;
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn-close");
    button.setAttribute("data-bs-dismiss", "alert");
    button.setAttribute("aria-label", "Close");
    wrapper.appendChild(button);
    alertPlaceholder.appendChild(wrapper);
}

function confirmClear() {
    console.log("Clear Confirm pressed.");
    clearList();
    localStorage.removeItem("recentSearches");
    appendAlert('You Have Deleted Your Recent History', 'success');
}
