// Import the functions you need from the SDKs you need


  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
  import { getFirestore, collection, addDoc, getDocs, where,query } 
    from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

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
  console.log(db);
  

const fetchData = () => {
  const items_array = [];
  const reviews_array = [];
  getDocs(collection(db, "reviews"))
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let docData = doc.data();
      docData['reviewid'] = doc.id;
      reviews_array.push(docData);    });
  }).catch((error) => {
    console.error("Error getting documents: ", error);
  });
  getDocs(collection(db, "items"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        docData['iid'] = doc.id;
        items_array.push(docData);
      });

    const app = Vue.createApp({
      data() {
        return {
          items: items_array,
          reviews: reviews_array,
          cart: JSON.parse(localStorage.getItem('cart')) || {},
        };
      },
      methods: {
        hasReviews(iid) {
          console.log(this.reviews);
          console.log(this.reviews.some(review => review.itemid === iid));
          return this.reviews.some(review => review.itemid === iid);
        },
        average_rating(iid){
          let reviews = this.reviews.filter(review => review.itemid === iid);
          let total = 0;
          for (let review of reviews){
            total += review.rating;
          }
          return (Math.round((total/reviews.length) * 10) / 10);
        },
        number_of_reviews(iid){
          let reviews = this.reviews.filter(review => review.itemid === iid);
          return reviews.length;
        },
        add_to_cart(item) {
          const existingCart = JSON.parse(localStorage.getItem('cart')) || {};
          existingCart[item.iid] = (existingCart[item.iid] || 0) + 1;
          localStorage.setItem('cart', JSON.stringify(existingCart));
          // Trigger event to update cart modal content
          this.$root.$emit("update-cart-modal", existingCart);
          console.log(existingCart);
        },
        clear_cart(){
          localStorage.removeItem('cart');
          this.cart = {}
        }
      },
      components: {
        'item-card': {
          props: ['item'],
          data() {
            return {
              showButtons: false,
            };
          },
          template: `
            <div class="col">
              <div class="card border-0 mb-5 ms-4 rounded-0 position-relative h-100" style="width: 15rem;">
              <div class="img-container position-relative">
                <img @mouseenter="showButtons = true" @mouseleave="showButtons = false" class="rounded-0 item-img position-relative" :src="item.photos[0]" alt="Card image cap" >
                <div v-if="showButtons" class="overlay"></div>
                <div  @mouseenter="showButtons = true" @mouseleave="showButtons = false" v-if="showButtons" class="btn-container position-absolute w-100 h-100 d-flex justify-content-around ">
                  <button @click="showMoreInformation()" class="mi-btn ">More Information</button>
                  </div>
                </div>
                <div class="mt-3 ms-2 position-relative h-100 d-flex flex-column">
                  <div class="card-title start-0 item-name w-75">{{ item.name }} <span class=" position-absolute top-0 end-0 price"><b>S$`+`{{item.price}}</b></span></div>
                  <div class="card-subtitle text-muted short-desc">{{ item.shortdesc }}</div>
                  <p v-if="hasReviewsForItem" class="card-text review-summary position-absolute bottom-0">Average rating is {{average_rating}}, based on {{number_of_reviews}}.</p>
                  <p v-else class="card-text review-summary position-absolute bottom-0">No reviews yet</p>
                </div>
              </div>
            </div>
          `,
          methods: {
            showMoreInformation(){
              let newUrl = "item.html?iid=" + this.item.iid;
              window.location.href = newUrl;
            },
            add_to_cart(){
              this.$root.add_to_cart(this.item);
            }
           
          },

          computed:{
            hasReviewsForItem(){
              return this.$root.hasReviews(this.item.iid);
            },
            average_rating(){
              return this.$root.average_rating(this.item.iid);
            },
            number_of_reviews(){
              let num = this.$root.number_of_reviews(this.item.iid);
              if(num == 1){
                return num + " review";
              }else{
                return num + " reviews";
              }
            }
          }
        }
      }
    });

    app.mount("#product_listing");
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
};

fetchData();