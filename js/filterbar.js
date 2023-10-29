// open filter bar, ensure to name moving container "main"
function open_filter() {
    document.getElementById("filterbar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

// close filter bar, ensure to name moving container "main"
function close_filter() {
    document.getElementById("filterbar").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
}

function createfilterbar_community() {
    document.write(`
    <button class="openbtn" onclick="open_filter()">Filters</button>

    <div id="filterbar">
        <a href="javascript:void(0)" class="closebtn" onclick="close_filter()"><img id="back" src="images/back.png"></a>
        <a href="community_general.html">General</a>
        <a href="community_fashion.html">Fashion</a>
        <a href="community_food.html">Food</a>
    </div>

    `)
}

// can continue to add respective filterbar functions below with the naming convention createFilterBar<nameofpage with first letter Uppercase> for standardization
function createFilterBarProfile() {
    document.write(`
    <button class="openbtn" onclick="open_filter()">Filters</button>

    <div id="filterbar">
        <a href="javascript:void(0)" class="closebtn" onclick="close_filter()"><img id="back" src="images/back.png"></a>
        <a href="profile.html">My Account</a>
        <a href="profile_my_purchases.html">My Purchases</a>
        <a href="profile_my_posts.html">My Posts</a>
    </div>
    `)
    let profile_filter_items = document.getElementById('filterbar');
    let a_items = profile_filter_items.getElementsByTagName('a');
    a_items[1].addEventListener('mouseover', function () {
        mouseover_acc(a_items[1]);
    });
    a_items[1].addEventListener('mouseout', function () {
        mouseout_acc(a_items[1]);
    });
    a_items[2].addEventListener('mouseover', function () {
        mouseover_purchase(a_items[2]);
    });
    a_items[2].addEventListener('mouseout', function () {
        mouseout_purchase(a_items[2]);
    });
    a_items[3].addEventListener('mouseover', function () {
        mouseover_post(a_items[3]);
    });
    a_items[3].addEventListener('mouseout', function () {
        mouseout_post(a_items[3]);
    });
}

function mouseover_acc(element) {
    element.style.backgroundColor = "#D8EAC7";
}

function mouseout_acc(element) {
    element.style.backgroundColor = "transparent";
}

function mouseover_purchase(element) {
    element.style.backgroundColor = "#D8EAC7";
}

function mouseout_purchase(element) {
    element.style.backgroundColor = "transparent";
}
function mouseover_post(element) {
    element.style.backgroundColor = "#D8EAC7";
}

function mouseout_post(element) {
    element.style.backgroundColor = "transparent";
}




