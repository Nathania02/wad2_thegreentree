function createNavbarGreen() {

    document.write(`
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg fixed-top">
            <a class="navbar-brand ps-4" href="index.html">
                <img src="images/the_green_tree_white.png" alt="Company Logo" height="40" width="40">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse ul-bg justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item px-3 dropdown">
                        <div title="Marketplace" class="nav-link" id="marketplaceDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="images/navbar/marketplace.png" height="30" width="30">
                        </div>
                        <ul class="dropdown-menu" aria-labelledby="marketplaceDropdown">
                            <li><a class="dropdown-item" href="marketplace.html">Marketplace</a></li>
                            <li><a class="dropdown-item list-item" id="list_item" href="list_item.html">List an Item</a></li>                            
                        </ul>
                    </li>
                    <li class="nav-item px-3"><div title="Community">
                        <a class="nav-link" href="community_mainpage.html">
                        <img src="images/navbar/community.png" height="30" width="30">
                        </a></div>
                    </li>
                    <li class="nav-item px-3 shopping-cart" id="shopping_cart"><div title="Cart">
                        <a class="nav-link" >
                        <img src="images/navbar/cart.png" height="30" width="30">
                        </a></div>
                    </li>

                    <li class="nav-item px-3"><div title="Profile">
                        <a class="nav-link" id="profile_link" href="login.html">
                        <img id="profile_image" src="images/navbar/profile.png" height="30" width="30">
                        </a></div>
                    </li>
                </ul>
            </div>
        </nav>
    </div>

    <div class="modal fade" id="cart_modal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="cartModalLabel">Shopping Cart</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="cart_items">
                <!-- Cart items will be displayed here -->
                </div>
                <div class="modal-footer">
                <button type="button" onclick="checkout()" class="btn cart-checkout-btn">Checkout</button>
                </div>
            </div>
        </div>
    </div>
        `);

    let list_items = document.getElementsByTagName('li');
    list_items[0].addEventListener('mouseover', function () {
        mk_to_green(list_items[0]);
    });
    list_items[0].addEventListener('mouseout', function () {
        mk_to_white(list_items[0]);
    });
    list_items[3].addEventListener('mouseover', function () {
        comm_to_green(list_items[3]);
    });
    list_items[3].addEventListener('mouseout', function () {
        comm_to_white(list_items[3]);
    });
    list_items[5].addEventListener('mouseover', function () {
        prof_to_green(list_items[5]);
    });
    list_items[5].addEventListener('mouseout', function () {
        prof_to_white(list_items[5]);
    });
}

$(document).ready(function () {
    // When the shopping cart button is clicked, show the modal
    $("#shopping_cart").click(function () {
        populate_shopping_cart();
        $("#cart_modal").modal("show");
    });
});

function mk_to_green(element) {
    element.style.backgroundColor = "white";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "images/navbar/marketplace_green.png");
}

function mk_to_white(element) {
    element.style.backgroundColor = "transparent";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "images/navbar/marketplace.png");
}

function comm_to_green(element) {
    element.style.backgroundColor = "white";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "images/navbar/community_green.png");
}

function comm_to_white(element) {
    element.style.backgroundColor = "transparent";
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "images/navbar/community.png");
}

function prof_to_green(element) {
    element.style.backgroundColor = "white";
    let link = element.getElementsByTagName('a')[0];
    console.log(link.href);
    if(link.href.includes("login.html")) {
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute("src", "images/navbar/profile_green.png");
    }
    
}

function prof_to_white(element) {
    element.style.backgroundColor = "transparent";
    let link = element.getElementsByTagName('a')[0];
    if(link.href.includes("login.html")) {
    var image = element.getElementsByTagName('img')[0];
    image.setAttribute('src', 'images/navbar/profile.png');
    }
}


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('d-md-block');
    sidebar.classList.toggle('d-none');
}

// Function to populate shopping cart modal
function populate_shopping_cart() {
    // Retrieve cart items from localStorage
    var cartItems = JSON.parse(localStorage.getItem('cart'));
    console.log(cartItems);

    // Get the element where cart items will be displayed
    var cartItemsContainer = document.getElementById('cart_items');

    // Clear previous content in the modal body
    cartItemsContainer.innerHTML = '';

    // Check if there are items in the cart
    if (cartItems && Object.keys(cartItems).length > 0) {
        var tt_price = 0;

        // Iterate through cart items and display them in the modal
        for (const [key, arr] of Object.entries(cartItems)) {
            var cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';

            var imgElement = document.createElement('img');
            imgElement.src = arr[3];
            imgElement.className = 'cart-item-image';

            var contentContainer = document.createElement('div');
            contentContainer.className = 'cart-item-content';

            var nameElement = document.createElement('div');
            nameElement.textContent = arr[0];
            nameElement.className = 'cart-item-name';

            var quantityElement = document.createElement('div');
            quantityElement.textContent = 'Quantity: ' + arr[2];
            quantityElement.className = 'cart-item-quantity';

            var priceElement = document.createElement('div');
            var totalPrice = arr[1] * arr[2];
            priceElement.textContent = '$' + totalPrice.toFixed(2);
            priceElement.className = 'cart-item-total-price';

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.setAttribute('data-key', key);
            deleteButton.addEventListener('click', function () {
                // Call a function to handle item deletion, passing the key (or item identifier) as an argument
                var itemKey = this.getAttribute('data-key');

                tt_price -= (cartItems[itemKey][1] * cartItems[itemKey][2]);
                if (tt_price <= 0) {
                    tt_price_element.textContent = 'Your cart is empty.';
                } else {
                    tt_price_element.textContent = 'Total: $' + tt_price.toFixed(2);
                }

                delete cartItems[itemKey];
                // Update localStorage
                localStorage.setItem('cart', JSON.stringify(cartItems));

                // Remove the corresponding cart item element from the DOM
                this.closest('.cart-item').remove();

                // Refresh the modal
                populate_shopping_cart();

            });

            contentContainer.appendChild(nameElement);
            contentContainer.appendChild(quantityElement);
            contentContainer.appendChild(deleteButton);
            contentContainer.appendChild(priceElement);

            cartItemElement.appendChild(imgElement);
            cartItemElement.appendChild(contentContainer);

            cartItemsContainer.appendChild(cartItemElement);

            tt_price += totalPrice;
            var divider = document.createElement('hr');
            divider.className = 'cart-item-divider';
            cartItemsContainer.appendChild(divider);
        }
        var tt_price_element = document.createElement('div');
        tt_price_element.className = 'cart-total-price';
        tt_price_element.textContent = 'Total: $' + tt_price.toFixed(2);
        cartItemsContainer.appendChild(tt_price_element);
    } else {
        // If cart is empty, display a message in the modal
        cartItemsContainer.textContent = 'Your cart is empty.';
        document.getElementsByClassName('cart-checkout-btn')[0].disabled = true;
        document.getElementsByClassName('cart-checkout-btn')[0].style.backgroundColor = 'grey';
        document.getElementsByClassName('cart-checkout-btn')[0].style.color = 'white';
    }
}

function checkout() {
    window.location.href = "checkout.html";
}
