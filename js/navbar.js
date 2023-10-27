function createNavbarGreen() {
    document.write(`
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg fixed-top">
            <a class="navbar-brand ps-4" href="index.html">
                <img src="rsrc/the_green_tree_white.png" alt="Company Logo" height="60" width="60">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item px-3"><div title="Marketplace">
                        <a class="nav-link" href="marketplace.html">
                        <img src="rsrc/navbar/marketplace.png" height="40" width="40">
                        </a></div>
                    </li>
                    <li class="nav-item px-3"><div title="Community">
                    <a class="nav-link" href="community_mainpage.html">
                    <img src="rsrc/navbar/community.png" height="40" width="40">
                    </a></div>
                    </li>
                    <li class="nav-item px-3"><div title="Profile">
                    <a class="nav-link" href="login.html">
                    <img src="rsrc/navbar/profile.png" height="40" width="40">
                    </a></div>
                    </li>
                    <li class="nav-item px-3 me-1"><div title="Inbox">
                    <a class="nav-link" href="inbox.html">
                    <img src="rsrc/navbar/inbox.png" height="40" width="40">
                    </a></div>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    `);

    let list_items = document.getElementsByTagName('li');
    list_items[0].addEventListener('mouseover',function(){
        mk_to_green(list_items[0]);
    });
    list_items[0].addEventListener('mouseout',function(){
        mk_to_white(list_items[0]);
    }); 
    list_items[1].addEventListener('mouseover',function(){
        comm_to_green(list_items[1]);
    });
    list_items[1].addEventListener('mouseout',function(){
        comm_to_white(list_items[1]);
    }); 
    list_items[2].addEventListener('mouseover',function(){
        prof_to_green(list_items[2]);
    });
    list_items[2].addEventListener('mouseout',function(){
        prof_to_white(list_items[2]);
    }); 
    list_items[3].addEventListener('mouseover',function(){
        inbox_to_green(list_items[3]);
    });
    list_items[3].addEventListener('mouseout',function(){
        inbox_to_white(list_items[3]);
    }); 
}

function mk_to_green(element){
    element.style.backgroundColor = "white";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/marketplace_green.png");
}

function mk_to_white(element){
    element.style.backgroundColor = "transparent";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/marketplace.png");
}

function comm_to_green(element){
    element.style.backgroundColor = "white";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/community_green.png");
}

function comm_to_white(element){
    element.style.backgroundColor = "transparent";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/community.png");
}
function prof_to_green(element){
    element.style.backgroundColor = "white";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/profile_green.png");
}

function prof_to_white(element){
    element.style.backgroundColor = "transparent";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/profile.png");
}
function inbox_to_green(element){
    element.style.backgroundColor = "white";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/inbox_green.png");
}

function inbox_to_white(element){
    element.style.backgroundColor = "transparent";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "rsrc/navbar/inbox.png");
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('d-md-block');
    sidebar.classList.toggle('d-none');
  }

function createNavbarWhite() {
    document.write(`
        <nav class="navbar navbar-expand-lg fixed-top">
            <a class="navbar-brand ps-3" href="#">
                <img src="rsrc/TheGreenTreeGreen.png" alt="Company Logo" height="60" width="60">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item px-3">
                        <a class="nav-link" href="marketplace.html">
                        <img src="rsrc/navbar/marketplace_green.png" height="40" width="40">
                        </a>
                    </li>
                    <li class="nav-item px-3">
                    <a class="nav-link" href="community.html">
                    <img src="rsrc/navbar/community_green.png" height="40" width="40">
                    </a>
                    </li>
                    <li class="nav-item px-3">
                    <a class="nav-link" href="profile.html">
                    <img src="rsrc/navbar/profile_green.png" height="40" width="40">
                    </a>
                    </li>
                    <li class="nav-item ps-3 pe-5">
                    <a class="nav-link" href="inbox.html">
                    <img src="rsrc/navbar/inbox_green.png" height="40" width="40">
                    </a>
                    </li>
                </ul>
            </div>
        </nav>
    `);
}

