import { doc, getFirestore, collection, addDoc, query, where, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

checkUserLoginStatus().then(async (result) => {
    if (result.loggedIn) {
        const q = query(collection(db, "orders"), where("userid", "==", result.user.uid));
        const orders_array = [];

        try {
            const querySnapshot = await getDocs(q);

            for (const ord_doc of querySnapshot.docs) {
                let docData = ord_doc.data();
                docData['orderid'] = ord_doc.id;
                const order_details_array = [];

                const w = query(collection(db, "orderdetails"), where("orderid", "==", ord_doc.id));
                const order_querySnapshot = await getDocs(w);

                for (const order_doc of order_querySnapshot.docs) {
                    let order_data = order_doc.data();
                    order_data['orderdetailid'] = order_doc.id;
                    order_details_array.push(order_data);
                }

                for (let order_detail of order_details_array) {
                    let item_ref = doc(collection(db, "items"), order_detail['itemid']);
                    let item_doc = await getDoc(item_ref);
                    let item_data = item_doc.data();
                    order_detail['itemname'] = item_data['name'];
                    order_detail['item_ind_price'] = item_data['price'];
                    order_detail['item_owner_id'] = item_data['userid'];
                    order_detail['item_image'] = item_data['photos'][0];

                    let user_ref = doc(collection(db, "users"), item_data['userid']);
                    let user_doc = await getDoc(user_ref);
                    let user_data = user_doc.data();
                    order_detail['item_owner_name'] = user_data['username'];
                }

                docData['orderdetails'] = order_details_array;
                orders_array.push(docData);
            }

            console.log("Orders array:", orders_array);

            const app = Vue.createApp({
                data() {
                    return {
                        orders: orders_array,
                        // sidebar
                        fontSize: '25px',
                        marginLeft: '',
                        width: '0px',
                        backgroundColorAcc: 'transparent',
                        backgroundColorPur: 'transparent',
                        backgroundColorSelPor: 'transparent',
                        filterButtonPosition: ''
                    };
                },
                methods: {
                    convert_to_date(timestamp) {
                        let date = timestamp.toDate();
                        return date.toLocaleDateString("en-SG");
                    },
                    on_mouseover(link) {
                        if (link === 'account') {
                            this.backgroundColorAcc = '#D8EAC7';
                        }
                        else if (link === 'purchases') {
                            this.backgroundColorPur = '#D8EAC7';
                        }
                        else if (link === 'seller_portal') {
                            this.backgroundColorSelPor = '#D8EAC7';
                        }
                    },
                    on_mouseout(link) {
                        if (link === 'account') {
                            this.backgroundColorAcc = 'transparent';
                        }
                        else if (link === 'purchases') {
                            this.backgroundColorPur = 'transparent';
                        }
                        else if (link === 'seller_portal') {
                            this.backgroundColorSelPor = 'transparent';
                        }
                    }
                }
            });

            app.mount('#purchases_listing');
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    } else {
        window.location.href = 'login.html';
    }
});

