import { getFirestore, collection, getDocs, setDoc, query, where, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

import { db, checkUserLoginStatus } from './firebase_profile.js';

// var stripe = Stripe('pk_test_51O7zgNGaFFEYCuk1j10y7KaPpX2Efoar2V6eHXVPduyuFUPyd1SJwUGpmJGPIw9em9D9lq3EsZU68CMouPgVDrQf00xRgdxHbL');


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
                    }
                },
                created(){
                    console.log(this.items[0]);

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
                        // let line_items = this.items.map(item => {
                        //     return {
                        //         price_data: {
                        //             currency: 'sgd',
                        //             product_data: {
                        //                 name: item.name,
                        //             },
                        //             unit_amount: item.price * 100, // Amount in cents
                        //         },
                        //         quantity: item.quantity,
                        //     };
                        // });
                    
                        // console.log(line_items);
                    
                        // stripe.redirectToCheckout({
                        //     lineItems: line_items,
                        //     mode: 'payment',
                        //     successUrl: 'https://wad2-6e3a1.web.app/success.html',
                        //     cancelUrl: 'https://wad2-6e3a1.web.app/cancel.html',
                        // }).then(function (result) {
                        //     if (result.error) {
                        //         var displayError = document.getElementById('error-message');
                        //         displayError.textContent = result.error.message;
                        //     }
                        // });
                        // fetch('/create-checkout-session', {
                        //     method: 'POST',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //     },
                        //     body: JSON.stringify({
                        //         items:this.items,
                        //     })
                        // }).then(res => {
                        //     if (res.ok) return res.json()
                        //     return res.json().then(json => Promise.reject(json))
                        // }).then(({url})=>{
                        //     window.location = url;
                        // }).catch(e=>{
                        //     console.error(e.error)
                        
                        // })

                        let order_ref = collection(db, "orders");
                        let order_details_ref = collection(db, "orderdetails");
                        let all_items = this.items;
                        console.log(all_items);
                        let required_additions = all_items.length;
                        let current_additions = 0;

                        let userid = result.user.uid;
                        let order_data = {
                            userid: userid,
                            status: "pending",
                            total: this.calculate_total_price(),
                            date: new Date(),
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
                                }
                                addDoc(order_details_ref, order_details_data)
                                    .then((doc_ref) => {
                                    console.log("Document written with ID: ", doc_ref.id);
                                    current_additions += 1;
                                    if(current_additions == required_additions){
                                        localStorage.removeItem('cart');
                                        window.location.href = 'success.html?orderid=' + doc_order_ref.id + '&total=' + this.calculate_total_price() + '&date=' + new Date() + '&status=pending';
                                        exit;
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