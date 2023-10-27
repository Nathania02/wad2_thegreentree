// open filter bar, ensure to name moving container "main"
function open_filter(){
    document.getElementById("filterbar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

// close filter bar, ensure to name moving container "main"
function close_filter(){
    document.getElementById("filterbar").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
}

function createfilterbar_community(){
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



