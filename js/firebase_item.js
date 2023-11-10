// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
// import { getFirestore, collection, addDoc, getDocs, getDoc, doc, deleteDoc } 
//   from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
// import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB930wEyfKpI2gBvgAUprBKWqhcbmcKJzk",
//   authDomain: "wad2thegreentree.firebaseapp.com",
//   databaseURL: "https://wad2thegreentree-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "wad2thegreentree",
//   storageBucket: "wad2thegreentree.appspot.com",
//   messagingSenderId: "731944801799",
//   appId: "1:731944801799:web:ac8492d32f75b71ba3fca2",
//   measurementId: "G-M4GNGPS1MD"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // User Authentication
// const auth = getAuth();

import { getFirestore, collection, addDoc, getDocs, getDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

const auth = getAuth();


// Get the item.iid from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const iid = urlParams.get('iid');

// Fetch the item data from the database
const fetchData = (iid) => {
  const item_ref = doc(collection(db, "items"), iid);
  let reviews_array = [];

  const fetchReviewsPromise = getDocs(collection(db, "reviews"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        if (docData['itemid'] == iid) {
          docData['reviewid'] = doc.id;
          reviews_array.push(docData);
        }
      });
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });

  Promise.all([fetchReviewsPromise])
    .then(() => {
      return Promise.all(
        reviews_array.map((review) => {
          const userRef = doc(collection(db, "users"), review['userid']);
          return getDoc(userRef)
            .then((doc) => {
              if (doc.exists()) {
                let userData = doc.data();
                review['reviewer'] = userData['username'];
              }
            })
            .catch((error) => {
              console.error("Error getting document:", error);
            });
        })
      );
    })
    .then(() => {
      return getDoc(item_ref)
        .then((doc) => {
          if (doc.exists()) {
            const itemData = doc.data();
            itemData['iid'] = doc.id;
            const app = Vue.createApp({
              data() {
                return {
                  item: itemData,
                  activeIndex: 0,
                  reviews: reviews_array,
                  quantity: 1,
                  same_user: false
                };
              },
              mounted() {
                if(auth.currentUser){
                  this.same_user = this.item.userid == auth.currentUser.uid;
                }
              },
              methods: {
                get_rating() {
                  if (reviews_array.length > 0) {
                    let average_rating = reviews_array.reduce(
                      (sum, rev) => sum + rev.rating,
                      0
                    );
                    average_rating /= reviews_array.length;
                    let rounded_rating = Math.round(average_rating * 10) / 10;
                    return rounded_rating;
                  }
                  return null;
                },
                get_number_of_reviews() {
                  if (reviews_array.length === 1) {
                    return reviews_array.length + " review";
                  } else if (reviews_array.length === 0) {
                    return 0;
                  } else {
                    return reviews_array.length + " reviews";
                  }
                },
                incrementQuantity() {
                  this.quantity++;
                },
                decrementQuantity() {
                  if (this.quantity > 1) {
                    this.quantity--;
                  }
                },
                convert_to_date(timestamp) {
                  let date = timestamp.toDate();
                  return date.toLocaleDateString("en-SG");
                },
                redirect_login(){
                  window.location.href = "login.html";
                },
                add_to_cart(){
                  if(this.item.quantity < this.quantity){
                    alert("You have exceeded the available quantity for this item");
                    return;
                  }else{
                    const existing_cart = JSON.parse(localStorage.getItem('cart')) || {};

                    const item_name = this.item.name;
                    const item_price = this.item.price;
                    const item_quantity = existing_cart[iid] ? existing_cart[iid][2] + this.quantity : this.quantity;
                    const item_first_image = this.item.photos[0];

                    existing_cart[iid] = [item_name, item_price, item_quantity, item_first_image];

                    localStorage.setItem('cart', JSON.stringify(existing_cart));

                    alert("Item added to cart!");
                  }
                },
                edit_item(){

                },
                delete_item(){
                  const is_confirmed = confirm("Are you sure you want to delete this item?");
                  if (is_confirmed) {
                  deleteDoc(item_ref)
                    .then(() => {
                      console.log("Document successfully deleted!");
                      window.location.href = "marketplace.html";
                    })
                    .catch((error) => {
                      console.error("Error removing document: ", error);
                    });
                }
              }
              },
            });

            app.mount("#item_information");
          } else {
            console.log("No such document exists!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    });
};

checkUserLoginStatus()
    .then((result) => {
        if (result.loggedIn) {
            // User is logged in
            const atc_btn_item = document.getElementById('atc_btn_item');
            const error_btn = document.getElementById('error_btn');
            atc_btn_item.style.display = 'block';   
            error_btn.style.display = 'none';
            const review_app = Vue.createApp({
              data() {
                return {
                  review_title: "",
                  review_rating: 0,
                  review_desc: "",
                  is_logged_in: true,
                  same_user: false
                };
              },
              mounted() {
                getDoc(doc(collection(db, "items"), iid)).then((doc) => {
                  if (doc.exists()) {
                    const itemData = doc.data();
                    itemData['iid'] = doc.id;
                    this.same_user = itemData.userid == auth.currentUser.uid;
                  }
                });
              },
              methods: {
                submit_review(event) {
                  event.preventDefault();
                  let reviewRef = collection(db, "reviews");

                  let user = result.user;
                  let userid = user.uid;

                  let itemid = iid;

                  let rev_rating = Number(this.review_rating);

                  let reviewData = {
                    userid: userid,
                    itemid: itemid,
                    title: this.review_title,
                    rating:rev_rating,
                    desc: this.review_desc,
                    date: new Date(),
                  };

                  addDoc(reviewRef, reviewData)
                    .then((docRef) => {
                      console.log("Document written with ID: ", docRef.id);
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.error("Error adding document: ", error);
                    });
                },
                
              },
            });

            review_app.mount("#review_form");
        } else {
          const review_app = Vue.createApp({
            data(){
              return {
                is_logged_in: false,
              };
            }
          })
          review_app.mount("#review_form");
          console.log('User is not logged in.');
        }
    })
    .catch((error) => {
        console.error('Error checking user login status:', error);
    });


fetchData(iid);