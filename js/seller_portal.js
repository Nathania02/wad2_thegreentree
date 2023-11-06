import { doc, getFirestore, collection, addDoc, query, where, getDocs, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

checkUserLoginStatus().then((result) => {
    const q = query(collection(db, "items"), where("userid", "==", result.user.uid));
    getDocs(q).then((querySnapshot) => {
        const items_array = [];
        querySnapshot.forEach((doc) => {
            let docData = doc.data();
            docData['iid'] = doc.id;
            items_array.push(docData);
        });

        const o = query(collection(db, "orders"), where("userid", "==", result.user.uid));
        console.log("Items array:");
        console.log(items_array);
        const app = Vue.createApp({
            data() {
                return {
                    items: items_array,
                };
            },
            methods:{
                delete_item(itemid){
                    console.log("Delete item clicked", itemid); 
                    const is_confirmed = confirm("Are you sure you want to delete this item?");
                    const item_ref = doc(collection(db, "items"), itemid);
                    if (is_confirmed) {
                    deleteDoc(item_ref)
                      .then(() => {
                        console.log("Document successfully deleted!");
                        window.location.href = "seller_portal.html";
                      })
                      .catch((error) => {
                        console.error("Error removing document: ", error);
                      });
                  }   
                }
            }
        });
        app.mount("#users_product_listing");
    });

}).catch((error) => {});