import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

checkUserLoginStatus().then((result) => {
    if(result.loggedIn){
        const q = query(collection(db, "orders"), where("userid", "==", result.user.uid));
        getDocs(q).then((querySnapshot) => {
            const orders_array = [];
            const order_details_array = [];
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                docData['orderid'] = doc.id;
                orders_array.push(docData);
            });
            // console.log(orders_array);
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
