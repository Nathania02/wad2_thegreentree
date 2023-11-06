import { doc, getFirestore, collection, addDoc, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

checkUserLoginStatus().then((result) => {
    if(result.loggedIn){
        const q = query(collection(db, "orders"), where("userid", "==", result.user.uid));
        getDocs(q).then((querySnapshot) => {
            const orders_array = [];
            querySnapshot.forEach((ord_doc) => {
                let docData = ord_doc.data();
                docData['orderid'] = ord_doc.id;
                let order_details_array = [];
                const w = query(collection(db, "orderdetails"), where("orderid", "==", ord_doc.id));
                getDocs(w).then((order_querySnapshot) => {
                    order_querySnapshot.forEach((order_doc) => {
                        let order_data = order_doc.data();
                        order_data['orderdetailid'] = order_doc.id;
                        order_details_array.push(order_data);
                    });
                    for(let order_detail of order_details_array){
                        // do something with order_detail
                        console.log(order_detail['itemid']);
                        let item_ref = doc(collection(db, "items"), order_detail['itemid']);
                        // Fetch item document
                        let item_doc_promise = getDoc(item_ref);
                        console.log(item_doc_promise);
                        item_doc_promise.then((item_doc) => {
                            let item_data = item_doc.data();
                            order_detail['itemname'] = item_data['name'];
                            order_detail['item_ind_price'] = item_data['price'];
                            order_detail['item_owner_id'] = item_data['userid'];
                        
                            // Fetch user document
                            let user_ref = doc(collection(db, "users"), order_detail['item_owner_id']);
                            let user_doc_promise = getDoc(user_ref);
                            user_doc_promise.then((user_doc) => {
                                let user_data = user_doc.data();
                                order_detail['item_owner_name'] = user_data['username'];
                                // Now you can use the order_detail object with the required data here
                            }).catch((error) => {
                                // Handle errors while fetching user document
                            });
                        }).catch((error) => {
                            // Handle errors while fetching item document
                        });
                    }
                    docData['orderdetails'] = order_details_array;
                    orders_array.push(docData);
                });
            });
            console.log("Orders array:");
            console.log(orders_array);
            const app = Vue.createApp({
                data() {
                    return {
                        orders: orders_array,
                    };
                },
            });
            app.mount('#purchases_listing');
        });
        
    } else {
        window.location.href = 'login.html';
    }
});
