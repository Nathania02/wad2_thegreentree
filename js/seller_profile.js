import { collection, doc, getDoc, query, where, getDocs, deleteDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

checkUserLoginStatus().then((user) => {
    if (user.loggedIn) {
      const url_params = new URLSearchParams(window.location.search);
      const user_id = url_params.get('id');

      if(user.user.uid == user_id){
        window.location.href = "seller_portal.html";
      }else{
        fetch_data();
      }
    } else {
      fetch_data();
    }
});


async function fetch_data() {

    const url_params = new URLSearchParams(window.location.search);
    const user_id = url_params.get('id');

    const items_array = [];

    const user_ref = doc(collection(db, "users"), user_id);
    const user_doc = await getDoc(user_ref);
    const user_doc_data = user_doc.data();

    const items_query = query(collection(db, "items"), where("userid", "==", user_id));    
    try {
        const querySnapshot_items =  await getDocs(items_query);

        querySnapshot_items.forEach((item_doc) => {
            let doc_data = item_doc.data();
            doc_data['item_id'] = item_doc.id;

            if(doc_data['quantity'] != 0){
              items_array.push(doc_data);
            }

        });
    } catch (error) {
      alert(error.message, "Please try again later");
    }

    const app = Vue.createApp({
        data() {
          return {
            seller_info: user_doc_data,
            items: items_array,
            cart: JSON.parse(localStorage.getItem('cart')) || {},
            search: "",
            category: "all",
            price: "all",
          };
        },
        methods: {
          filter_items(){
            this.items = items_array;
            if(this.category == "all"){
              if(this.price == "all"){
                this.items = items_array;
              }else if(this.price == "twenty"){
                this.items = this.items.filter(item => item.price >= 0 && item.price <= 20).sort((a, b) => (a.price > b.price) ? 1 : -1);
              }else if(this.price == "fifty"){
                this.items = this.items.filter(item => item.price > 20 && item.price <= 50).sort((a, b) => (a.price > b.price) ? 1 : -1);
              }else{
                this.items = this.items.filter(item => item.price >= 51).sort((a, b) => (a.price > b.price) ? 1 : -1);
              }
            }else{
              const cat_query = this.category.toLowerCase();
              this.items = this.items.filter(item => item.category.toLowerCase().includes(cat_query));
              if(this.price == "all"){
                this.items = this.items;
              }else if(this.price == "twenty"){
                this.items = this.items.filter(item => item.price >= 0 && item.price <= 20).sort((a, b) => (a.price > b.price) ? 1 : -1);
              }else if(this.price == "fifty"){
                this.items = this.items.filter(item => item.price > 20 && item.price <= 50).sort((a, b) => (a.price > b.price) ? 1 : -1);
              }else{
                this.items = this.items.filter(item => item.price >= 51).sort((a, b) => (a.price > b.price) ? 1 : -1);
              }
            }
          },
          search_items() {
            if(this.category != "all" || this.price != "all"){
              this.filter_items();
              const search_query = this.search.toLowerCase();
              this.items = this.items.filter(item => item.name.toLowerCase().includes(search_query));
            }else{
              if (this.search.trim() === "") {
                this.items = items_array;
              }else{
                const search_query = this.search.toLowerCase();
                this.items = this.items.filter(item => item.name.toLowerCase().includes(search_query));
              }
            }
          },
          add_to_cart(item) {
            const existingCart = JSON.parse(localStorage.getItem('cart')) || {};
            existingCart[item.iid] = (existingCart[item.iid] || 0) + 1;
            localStorage.setItem('cart', JSON.stringify(existingCart));
            // Trigger event to update cart modal content
            this.$root.$emit("update-cart-modal", existingCart);
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
                  </div>
                </div>
              </div>
            `,
            methods: {
              showMoreInformation(){
                let newUrl = "item.html?iid=" + this.item.item_id;
                window.location.href = newUrl;
              },
              add_to_cart(){
                this.$root.add_to_cart(this.item);
              }
             
            },
          }
        }
      });
  
      app.mount("#product_listing");

};