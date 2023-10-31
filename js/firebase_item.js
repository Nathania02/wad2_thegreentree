import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, where,query, getDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB930wEyfKpI2gBvgAUprBKWqhcbmcKJzk",
  authDomain: "wad2thegreentree.firebaseapp.com",
  databaseURL: "https://wad2thegreentree-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wad2thegreentree",
  storageBucket: "wad2thegreentree.appspot.com",
  messagingSenderId: "731944801799",
  appId: "1:731944801799:web:ac8492d32f75b71ba3fca2",
  measurementId: "G-M4GNGPS1MD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// User Authentication
const auth = getAuth();

function checkUserLoginStatus() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                resolve({ loggedIn: true, user });
            } else {
                // User is not logged in
                resolve({ loggedIn: false, user: null });
            }
        }, (error) => {
            // An error occurred while checking the login status
            reject(error);
        });
    });
}

// Get the item.iid from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const iid = urlParams.get('iid');

// Fetch the item data from the database
const fetchData = (iid) => {
  const db = getFirestore(app);
  const itemRef = doc(collection(db, "items"), iid);
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
      return getDoc(itemRef)
        .then((doc) => {
          if (doc.exists()) {
            const itemData = doc.data();
            const app = Vue.createApp({
              data() {
                return {
                  item: itemData,
                  activeIndex: 0,
                  reviews: reviews_array,
                  quantity: 1,
                };
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
            const review_app = Vue.createApp({
              data() {
                return {
                  review_title: "",
                  review_rating: 0,
                  review_desc: "",
                  is_logged_in: true,
                };
              },
              methods: {
                submit_review(event) {
                  event.preventDefault();
                  // const db = getFirestore(app);
                  let reviewRef = collection(db, "reviews");
                  // const userRef = collection(db, "users");
                  // const itemRef = collection(db, "items");
                  let user = result.user;
                  let userid = user.uid;

                  let itemid = iid;

                  let reviewData = {
                    userid: userid,
                    itemid: itemid,
                    title: this.review_title,
                    rating: this.review_rating,
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
            console.log('User is logged in:', result.user.uid);
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