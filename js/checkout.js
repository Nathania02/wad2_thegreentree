import { collection, getDocs, query, where, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

const pickup_locations =  [
    {name: "Tekka Centre", latitude: 1.3060080621586347, longitude: 103.85104004231844},
    {name: "Tampines Mall", latitude: 1.353301, longitude: 103.945137},
    {name: "Jurong Point", latitude: 1.339636, longitude: 103.706926},
    {name: "NEX", latitude: 1.350772, longitude: 103.872650},
    {name: "Causeway Point", latitude: 1.436067, longitude: 103.786103},
    {name: "VivoCity", latitude: 1.264240, longitude: 103.822050},
    {name: "JEM", latitude: 1.333115, longitude: 103.743161},
    {name: "Compass One", latitude: 1.391590, longitude: 103.894650},
    {name: "Waterway Point", latitude: 1.406480, longitude: 103.902160},
    {name: "Northpoint City", latitude: 1.428440, longitude: 103.835110},
    {name: "White Sands", latitude: 1.372790, longitude: 103.949820},
    {name: "Tiong Bahru Plaza", latitude: 1.286350, longitude: 103.826820},
    {name: "Hougang Mall", latitude: 1.371260, longitude: 103.892530},
    {name: "Westgate", latitude: 1.334930, longitude: 103.743890},
    {name: "Parkway Parade", latitude: 1.301960, longitude: 103.905920},
    {name: "AMK Hub", latitude: 1.369970, longitude: 103.848570},
    {name: "Changi City Point", latitude: 1.334930, longitude: 103.743890},
];

const INITIAL_LATITUDE = 1.3521; // Example latitude value
const INITIAL_LONGITUDE = 103.8198; // Example longitude value
const INITIAL_ZOOM_LEVEL = 12;

// function initMap(pickup_locations) {
//     // Create a new map instance
//     const map = new google.maps.Map(document.getElementById('map-container'), {
//         center: { lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE }, // Set initial center of the map
//         zoom: INITIAL_ZOOM_LEVEL, // Set initial zoom level
//     });

//     // Example: Add markers for pickup locations
//     this.pickup_locations.forEach(location => {
//         new google.maps.Marker({
//             position: { lat: location.latitude, lng: location.longitude },
//             map: map,
//             title: location.name,
//         });
//     });
// }

// function initMap() {
//     // Create a new map instance
//     const map = new google.maps.Map(document.getElementById('map-container'), {
//         center: { lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE }, // Set initial center of the map
//         zoom: INITIAL_ZOOM_LEVEL, // Set initial zoom level
//     });
// }

checkUserLoginStatus()
    .then((result) => {
        if (result.loggedIn) {
        const q = query(collection(db, "users"), where("userId", "==", result.user.uid));
        getDocs(q).then((querySnapshot) => {
            let user = querySnapshot.docs[0].data();
            let new_array = [];
            var cart_items_json = JSON.parse(localStorage.getItem('cart'));
            console.log(cart_items_json);
            for (const [key, arr] of Object.entries(cart_items_json)) {
                console.log(key);
                new_array.push({"iid": key, "name": arr[0], "price": arr[1], "quantity": arr[2], "image": arr[3]});
            }
            cart_items_json = new_array;
            console.log(cart_items_json);

            const cust_app = Vue.createApp({
                data(){
                    return {
                        is_logged_in: true,
                        phone: user['phoneNo'],
                        email: user['email'],
                        address: user['address'],
                        postal: user['postal'],
                        fname: user['fname'],
                        lname: user['lname'],
                        items: cart_items_json,
                        total_price: 0,
                        d_or_pu: "delivery",
                        markers: [],
                        pickup_locations: [
                            {name: "Tekka Centre", latitude: 1.3060080621586347, longitude: 103.85104004231844, add_inf: "Tekka Centre, 665 Buffalo Rd, Singapore 210665 (Outside the entrance)"},
                            {name: "Tampines Mall", latitude: 1.353301, longitude: 103.945137, add_inf: "Tampines Mall, 4 Tampines Central 5, Singapore 529510 (B2, outside the fairprice finest entrance)"},
                            {name: "Jurong Point", latitude: 1.339636, longitude: 103.706926, add_inf: "Jurong Point, 1 Jurong West Central 2, Singapore 648886 (B1, outside the fairprice entrance)"},
                            {name: "NEX", latitude: 1.350772, longitude: 103.872650, add_inf: "NEX, 23 Serangoon Central, Singapore 556083 (Level 3, outside the Sushiro entrance)"},
                            {name: "Causeway Point", latitude: 1.436067, longitude: 103.786103, add_inf: "Causeway Point, 1 Woodlands Square, Singapore 738099 (Level 1, outside the fairprice entrance)"},
                            {name: "VivoCity", latitude: 1.264240, longitude: 103.822050, add_inf: "VivoCity, 1 Harbourfront Walk, Singapore 098585 (Rooftop)"},
                            {name: "JEM", latitude: 1.333115, longitude: 103.743161, add_inf: "JEM, 50 Jurong Gateway Rd, Singapore 608549 (Level 1, near the taxi stand)"},
                            {name: "Compass One", latitude: 1.391590, longitude: 103.894650, add_inf: "Compass One, 1 Sengkang Square, Singapore 545078 (Level 3, outside anytime fitness)"},
                            {name: "Waterway Point", latitude: 1.406480, longitude: 103.902160, add_inf: "Waterway Point, 83 Punggol Central, Singapore 828761 (West Wing, near the cheese shop)"},
                            {name: "Northpoint City", latitude: 1.428440, longitude: 103.835110, add_inf: "Northpoint City, 930 Yishun Ave 2, Singapore 769098 (South Wing, outside the fairprice entrance)"},
                            {name: "White Sands", latitude: 1.372790, longitude: 103.949820, add_inf: "White Sands, 1 Pasir Ris Central St 3, Singapore 518457 (Level 2, outside the eighteen chefs)"},
                            {name: "Tiong Bahru Plaza", latitude: 1.286350, longitude: 103.826820, add_inf: "Tiong Bahru Plaza, 302 Tiong Bahru Rd, Singapore 168732 (At the main entrance near the taxi stand)"},
                            {name: "Hougang Mall", latitude: 1.371260, longitude: 103.892530, add_inf: "Hougang Mall, 90 Hougang Ave 10, Singapore 538766 (Level 1, outside the coldstorage entrance)"},
                            {name: "Westgate", latitude: 1.334930, longitude: 103.743890, add_inf: "Westgate, 3 Gateway Dr, Singapore 608532 (Level 3, outside the library)"},
                            {name: "Parkway Parade", latitude: 1.301960, longitude: 103.905920, add_inf: "Parkway Parade, 80 Marine Parade Rd, Singapore 449269 (Level 1, outside the coldstorage entrance)"},
                            {name: "AMK Hub", latitude: 1.369970, longitude: 103.848570, add_inf: "AMK Hub, 53 Ang Mo Kio Ave 3, Singapore 569933 (Level 1, outside the fairprice entrance)"},
                            {name: "Changi City Point", latitude: 1.334930, longitude: 103.743890, add_inf: "Changi City Point, 5 Changi Business Park Central 1, Singapore 486038 (Near the post collector)"},
                            {name: "ION Orchard", latitude: 1.304510, longitude: 103.831960, add_inf: "ION Orchard, 2 Orchard Turn, Singapore 238801 (Level 3, outside Starbucks)"},
                            {name: "Plaza Singapura", latitude: 1.300740, longitude: 103.845480, add_inf: "Plaza Singapura, 68 Orchard Rd, Singapore 238839 (Level 1, near the smoking point)"},
                            {name: "Bugis Junction", latitude: 1.299650, longitude: 103.855000, add_inf: "Bugis Junction, 200 Victoria St, Singapore 188021 (Level 2, at the bridge between plus and junction)"},
                            {name: "Suntec City", latitude: 1.293350, longitude: 103.857340, add_inf: "Suntec City, 3 Temasek Blvd, Singapore 038983 (Level 1, outside the fairprice entrance)"},
                            {name: "Raffles City", latitude: 1.293350, longitude: 103.857340, add_inf: "Raffles City, 252 North Bridge Rd, Singapore 179103 (Main entrance, near the coffee bean)"},
                            {name: "Funan", latitude: 1.291100, longitude: 103.849860, add_inf: "Funan, 107 North Bridge Rd, Singapore 179105 (Main entrance, near Little Caesers)"},
                            {name: "Marina Square", latitude: 1.291100, longitude: 103.849860, add_inf: "Marina Square, 6 Raffles Blvd, Singapore 039594 (Level 1, outside the fairprice entrance)"},
                            {name: "Junction 8", latitude: 1.350770, longitude: 103.848570, add_inf: "Junction 8, 9 Bishan Pl, Singapore 579837 (Level 5, outside the fairprice entrance)"},
                            {name: "City Square Mall", latitude: 1.311260, longitude: 103.856510, add_inf: "City Square Mall, 180 Kitchener Rd, Singapore 208539 (Main entrance, near the Hong Kong cafe)"},
                            {name: "Hillion Mall", latitude: 1.378590, longitude: 103.762110, add_inf: "Hillion Mall, 17 Petir Rd, Singapore 678278 (Level 1, near the coconut bubble tea stall)"},
                            {name: "Lot One", latitude: 1.385170, longitude: 103.744260, add_inf: "Lot One, 21 Choa Chu Kang Ave 4, Singapore 689812 (Level 1, outside the fairprice entrance)"},
                            {name: "Bedok Mall", latitude: 1.324140, longitude: 103.929860, add_inf: "Bedok Mall, 311 New Upper Changi Rd, Singapore 467360 (Level 1, outside the fairprice entrance)"},
                            {name: "Dajie Makan Place", latitude: 1.324140, longitude: 103.929860, add_inf: "Dajie Makan Place, 311 New Upper Changi Rd, Singapore 467360 (Outside the restaurant)"},
                            {name: "The Clementi Mall", latitude: 1.315140, longitude: 103.764860, add_inf: "The Clementi Mall, 3155 Commonwealth Ave W, Singapore 129588 (Level 1, outside the coldstorage entrance)"},
                            {name: "The Clement Canopy", latitude: 1.315140, longitude: 103.764860, add_inf: "The Clement Canopy, 3155 Commonwealth Ave W, Singapore 129588 (Outside the entrance)"},
                            {name: "Ikea Alexandra", latitude: 1.289140, longitude: 103.805860, add_inf: "Ikea Alexandra, 317 Alexandra Rd, Singapore 159965 (Outside the entrance)"},
                            {name: "Ikea Tampines", latitude: 1.352140, longitude: 103.944860, add_inf: "Ikea Tampines, 60 Tampines North Drive 2, Singapore 528764 (Outside the entrance)"},
                            {name: "Junction 10", latitude: 1.380140, longitude: 103.765860, add_inf: "Junction 10, 1 Woodlands Rd, Singapore 677899 (Level 1, outside the fairprice entrance)"},
                            {name: "HDB Hub", latitude: 1.332140, longitude: 103.847860, add_inf: "HDB Hub, 480 Lor 6 Toa Payoh, Singapore 310480 (Main Entrance)"},
                            {name: "The Arcadia", latitude: 1.332140, longitude: 103.847860, add_inf: "The Arcadia, 480 Lor 6 Toa Payoh, Singapore 310480 (Main Entrance)"},
                            {name: "Astrid Meadows", latitude: 1.332140, longitude: 103.847860, add_inf: "Astrid Meadows, 480 Lor 6 Toa Payoh, Singapore 310480 (Main Entrance)"},
                            {name: "The Panorama", latitude: 1.332140, longitude: 103.847860, add_inf: "The Panorama, 480 Lor 6 Toa Payoh, Singapore 310480 (Main Entrance)"},
                            {name: "Hoodakak Korean Restaurant", latitude: 1.332140, longitude: 103.847860, add_inf: "Hoodakak Korean Restaurant, 480 Lor 6 Toa Payoh, Singapore 310480 (Main Entrance)"},
                        ],
                        map: null,
                        selected_location: "None",
                    }
                },
               watch: {
                    d_or_pu: function(){
                        if(this.d_or_pu == "pickup"){
                            this.init_map();
                        }
                    },
                    postal: function(){
                        if(this.d_or_pu == "pickup" && this.postal.length == 6){
                            console.log("triggered");
                            this.search_pickup_location();
                        }
                    }
                },
                methods: {
                    calculate_total_for_item(quantity, price){
                        this.total_price = quantity * price;
                        return this.total_price;
                    },
                    calculate_total_price(){
                        let total = 0;
                        for (let i = 0; i < this.items.length; i++){
                            total += this.items[i]['price'] * this.items[i]['quantity'];
                        }
                        return total;
                    },
                    checkout(){
                        if(this.fname.trim() == "" || this.lname.trim() == "" || this.phone.trim() == "" || this.email.trim() == "" ){
                            alert("Please fill in all the fields");
                            return;
                        }
                        if(this.d_or_pu == "delivery"){
                            if(this.address.trim() == "" || this.postal.trim() == ""){
                                alert("Please fill in all the fields");
                                return;
                            }
                        }
                        if(this.d_or_pu == "pickup"){
                            if(this.selected_location == "None"){
                                alert("Please select a pickup location");
                                return;
                            }
                        }

                        let order_ref = collection(db, "orders");
                        let order_details_ref = collection(db, "orderdetails");
                        let all_items = this.items;
                        console.log(all_items);
                        let required_additions = all_items.length;
                        let current_additions = 0;
                        let order_data = {};
                        console.log(this.selected_location);

                        let userid = result.user.uid;
                        if(this.d_or_pu == "delivery"){
                            order_data = {
                                userid: userid,
                                status: "pending delivery",
                                total: this.calculate_total_price(),
                                date: new Date(),
                                d_or_p: this.d_or_pu,
                                address: this.address,
                                postal: this.postal,
                            }
                        }else{
                            const today = new Date();
                            const current_day_of_week = today.getDay(); // 0 (Sunday) to 6 (Saturday)

                            // Calculate days until next Sunday
                            let days_until_next_sunday = 0;
                            if (current_day_of_week === 6) {
                                // If today is Saturday, next Sunday is tomorrow
                                days_until_next_sunday = 1;
                            } else {
                                // Calculate days until the next Sunday
                                days_until_next_sunday = 7 - current_day_of_week;
                            }

                            // Calculate the date of the next Sunday
                            const next_sunday = new Date(today);
                            next_sunday.setDate(today.getDate() + days_until_next_sunday);
                            order_data = {
                                userid: userid,
                                status: "pending pickup",
                                total: this.calculate_total_price(),
                                date: new Date(),
                                d_or_p: this.d_or_pu,
                                pickup_location: this.selected_location,
                                pickup_date: next_sunday,
                            }
                        }

                        addDoc(order_ref, order_data)
                            .then((doc_order_ref) => {
                            console.log("Document written with ID: ", doc_order_ref.id);
                            for(let order_item of all_items){
                                let order_details_data = {
                                    orderid: doc_order_ref.id,
                                    itemid: order_item['iid'],
                                    quantity: order_item['quantity'],
                                    price: order_item['price'],
                                    d_or_p: order_data['d_or_p'],
                                }
                                if(order_data['d_or_p'] == "delivery"){
                                    order_details_data['status'] = "pending delivery";
                                    order_details_data['address'] = order_data['address'];
                                    order_details_data['postal'] = order_data['postal'];
                                }else{
                                    order_details_data['status'] = "pending pickup";
                                    order_details_data['pickup_location'] = order_data['pickup_location'];
                                    order_details_data['pickup_date'] = order_data['pickup_date'];
                                }
                                addDoc(order_details_ref, order_details_data)
                                    .then((doc_ref) => {
                                    console.log("Document written with ID: ", doc_ref.id);
                                    current_additions += 1;
                                    if(current_additions == required_additions){
                                        console.log("all done");
                                        localStorage.removeItem('cart');
                                        window.location.href = 'success.html?orderid=' + doc_order_ref.id + '&total=' + this.calculate_total_price() + '&date=' + new Date() + '&status=pending';
                                    }
                                    })
                                    .catch((error) => {
                                    console.error("Error adding document: ", error);
                                    });
                            }
                            })
                            .catch((error) => {
                            console.error("Error adding document: ", error);
                            });
                    },
                    init_map(){
                        const vm = this;
                        Vue.nextTick(()=>{
                            console.log("creatin map");
                            const map = new google.maps.Map(document.getElementById('map') ,{
                                center: { lat: INITIAL_LATITUDE, lng: INITIAL_LONGITUDE }, // Set initial center of the map
                                zoom: INITIAL_ZOOM_LEVEL, // Set initial zoom level
                            });
                            console.log("map created");

                            this.map = map;

                            const info_window = new google.maps.InfoWindow();
    
                        
                            // Example: Add markers for pickup locations
                            this.pickup_locations.forEach(location => {
                                let marker = new google.maps.Marker({
                                    position: { lat: location.latitude, lng: location.longitude },
                                    map: map,
                                    title: location.name,
                                    additional_info: location.add_inf
                                });

                                marker.addListener('click', function() {
                                    info_window.setContent(this.additional_info);
                                    info_window.open(map, this);
                                    document.getElementById("selected_location").innerText = this.additional_info;
                                    vm.selected_location = this.title;
                                });
                            });
                        })

                    },
                    search_pickup_location(){
                        const geocoder = new google.maps.Geocoder();
                        geocoder.geocode({ address: this.postal }, (results, status) => {
                            if (status === 'OK') {
                                const userLocation = results[0].geometry.location;
                    
                                // Center the map to the user's location without clearing markers
                                this.map.setCenter(userLocation);
                                this.map.setZoom(17);
                            } else {
                                console.error('Error geocoding postal code:', status);
                            }
                        });
                    },
                    clear_markers(){
                        this.markers.forEach(marker => {
                            marker.setMap(null);
                        });
                        this.markers = [];
                    }
                    
                }
            }).mount('#cust_app');

            
        }).catch((error) => {
            console.error('Error getting user data:', error);
        });


        } else {
            // User is not logged in
            window.location.href = 'login.html';
           
        }
    })
    .catch((error) => {
        console.error('Error checking user login status:', error);
    });