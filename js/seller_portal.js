import { doc, getFirestore, collection, addDoc, query, where, getDocs, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

// checkUserLoginStatus().then((result) => {
//     const q = query(collection(db, "items"), where("userid", "==", result.user.uid));
//     getDocs(q).then((querySnapshot) => {
//         const items_array = [];
//         querySnapshot.forEach((doc) => {
//             let docData = doc.data();
//             docData['iid'] = doc.id;
//             items_array.push(docData);
//         });

//         const orders_array = [];
//         for(let item of items_array){
//             const o = query(collection(db, "orderdetails"), where("itemid", "==", item['iid']));
//             getDocs(o).then((order_det_querySnapshot) => {
//                 order_det_querySnapshot.forEach((order_det_doc) => {
//                     let order_det_doc_data = order_det_doc.data();
//                     order_det_doc_data['oid'] = order_det_doc.id;
//                     orders_array.push(order_det_doc_data);
//                 });
//             });
//         }

//         console.log("Orders array:");
//         console.log(orders_array);

//         const orders_tbff = [];
//         const orders_ff = [];
//         for(let order of orders_array){
//             console.log(order.status);
//             if(order.status == "pending pickup" || order.status == "pending delivery" || order.status == "dispatched"){
//                 orders_tbff.push(order);
//             }else{
//                 orders_ff.push(order);
//             }
//         }

//         console.log("Orders to be fulfilled:");
//         console.log(orders_tbff);
//         const app = Vue.createApp({
//             data() {
//                 return {
//                     items: items_array,
//                     orders: orders_array,
//                     orders_tbff: orders_tbff,
//                     orders_ff: orders_ff
//                 };
//             },
//             computed(){
//                 return {
//                     total_orders(){
//                         return this.orders.length;
//                     },
//                     total_items(){
//                         return this.items.length;
//                     }
//                 }
//             },
//             methods:{
//                 delete_item(itemid){
//                     console.log("Delete item clicked", itemid); 
//                     const is_confirmed = confirm("Are you sure you want to delete this item?");
//                     const item_ref = doc(collection(db, "items"), itemid);
//                     if (is_confirmed) {
//                     deleteDoc(item_ref)
//                       .then(() => {
//                         console.log("Document successfully deleted!");
//                         window.location.href = "seller_portal.html";
//                       })
//                       .catch((error) => {
//                         console.error("Error removing document: ", error);
//                       });
//                   }   
//                 }
//             }
//         });
//         app.mount("#users_product_listing");
//     });

// }).catch((error) => {});

checkUserLoginStatus().then(async (result) => {
    try {
        const q = query(collection(db, "items"), where("userid", "==", result.user.uid));
        const querySnapshot = await getDocs(q);
        const items_array = [];

        querySnapshot.forEach((doc) => {
            let docData = doc.data();
            docData['iid'] = doc.id;
            items_array.push(docData);
        });

        const orders_array = [];
        for (let item of items_array) {
            const o = query(collection(db, "orderdetails"), where("itemid", "==", item['iid']));
            const order_det_querySnapshot = await getDocs(o);

            order_det_querySnapshot.forEach((order_det_doc) => {
                
                let order_det_doc_data = order_det_doc.data();
                order_det_doc_data['oid'] = order_det_doc.id;
                order_det_doc_data['itemid'] = item['iid'];
                order_det_doc_data['item_name'] = item['name'];
                order_det_doc_data['item_image'] = item['photos'][0];
                
                orders_array.push(order_det_doc_data);
            });
        }

        for(let order of orders_array){
            console.log(order);
            const orig_ord = doc(collection(db, "orders"), order['orderid']);
            const orig_ord_doc = await getDoc(orig_ord);
            const orig_ord_doc_data = orig_ord_doc.data();
            order['buyer_userid'] = orig_ord_doc_data['userid'];
            order['date'] = orig_ord_doc_data['date'];

            const user_ref = doc(collection(db, "users"), order['buyer_userid']);
            const user_doc = await getDoc(user_ref);
            const user_doc_data = user_doc.data();
            order['buyer_username'] = user_doc_data['username'];
        }

        console.log("Items array: ", items_array);

        const orders_tbff = orders_array.filter((order) => order.status === "pending pickup" || order.status === "pending delivery" || order.status === "dispatched");
        const orders_ff = orders_array.filter((order) => !orders_tbff.includes(order));

        console.log("Orders array:", orders_array);
        console.log("Orders to be fulfilled:", orders_tbff);

        const app = Vue.createApp({
            data() {
                return {
                    items: items_array,
                    orders: orders_array,
                    orders_tbff: orders_tbff,
                    orders_ff: orders_ff,
                    delivery_date: null,
                };
            },
            computed: {
                total_orders() {
                    return this.orders.length;
                },
                total_items() {
                    return this.items.length;
                }
            },
            methods: {
                async delete_item(itemid) {
                    console.log("Delete item clicked", itemid);
                    const is_confirmed = confirm("Are you sure you want to delete this item?");
                    const item_ref = doc(collection(db, "items"), itemid);
                    if (is_confirmed) {
                        try {
                            await deleteDoc(item_ref);
                            console.log("Document successfully deleted!");
                            window.location.href = "seller_portal.html";
                        } catch (error) {
                            console.error("Error removing document: ", error);
                        }
                    }
                },
                convert_to_date(timestamp) {
                    let date = timestamp.toDate();
                    return date.toLocaleDateString("en-SG");
                  },
                dispatch_order(oid){
                    console.log(oid);
                    console.log(this.delivery_date);
                    console.log(new Date());
                    if(this.delivery_date == null){
                        alert("Please select a delivery date.");
                    }else {
                        let date = new Date(this.delivery_date);
                        if(date <= new Date()){
                            alert("Please select a future date.");
                        }else{
                            const is_confirmed = confirm("Are you sure you want to dispatch this order?");
                            if (is_confirmed) {
                                const to_update_order_ref = doc(db, "orderdetails", oid);
                                updateDoc(to_update_order_ref, {
                                    status: "dispatched",
                                    delivery_date: date
                                }).then(() => {
                                    console.log("Document successfully updated!");
                                    window.location.href = "seller_portal.html";
                                }).catch((error) => {
                                    console.error("Error updating document: ", error);
                                });
                            }
                        }
                    }
                }
            }
        });
        app.mount("#users_product_listing");
    } catch (error) {
        console.error("Error:", error);
    }
}).catch((error) => {
    console.error("Login status error:", error);
});
