import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { db, checkUserLoginStatus } from './firebase_profile.js';

const storage = getStorage();

checkUserLoginStatus().then((result) => {
    if(result.loggedIn){
        const item_app = Vue.createApp({
            data(){
                return{
                    is_logged_in: true,
                    userid: result.user.uid,
                    product_name: "",
                    product_category: "",
                    short_desc: "",
                    long_desc: "",
                    price: 0,
                    quantity: 1,
                }
            },
            methods: {
                async list_item(){
                    const images = Array.from(this.$refs.images_input.files);

                    if(this.product_name.length == 0){
                        alert("Please enter a product name!");
                        return;
                    }
                    if(this.product_name.length > 30){
                        alert("Product name cannot be more than 30 characters!");
                        return;
                    }
                    if(this.short_desc.length == 0){
                        alert("Please enter a short description!");
                        return;
                    }
                    if(this.short_desc.length > 50){
                        alert("Short description cannot be more than 50 characters!");
                        return;
                    }
                    if(this.long_desc.length == 0){
                        alert("Please enter a full description!");
                        return;
                    }
                    if(this.long_desc.length > 1000){
                        alert("Short description cannot be more than 1000 characters!");
                        return;
                    }
                    if(this.price == 0){
                        alert("Please enter a price!");
                        return;
                    }
                    if(this.quantity == 0){
                        alert("Please enter a quantity!");
                        return;
                    }

                    // Limit the number of files to 5
                    if (images.length == 0) {
                        alert("Please upload at least one image.");
                        return;
                    }
                    if (images.length > 5) {
                        alert("You can upload up to 5 files.");
                        return;
                    }

                    const imageUrls = await Promise.all(images.map(image => this.upload_image(image)));
                    console.log(imageUrls);

                    let item_data = {
                        userid: this.userid,
                        name: this.product_name,
                        category: this.product_category,
                        shortdesc: this.short_desc,
                        longdesc: this.long_desc,
                        price: this.price,
                        quantity: this.quantity,
                        photos: imageUrls,
                    };
                    let item_ref = collection(db, "items");
                    addDoc(item_ref, item_data).then((doc_ref) => {
                        console.log("Document written with ID: ", doc_ref.id);
                        alert("Item listed successfully!");
                        window.location.href = 'marketplace.html';
                    })
                    .catch((error) => {
                        alert(error.message, "Please try again later");
                    });
                },

                async upload_image(image_file){
                    if (image_file) {
                        const storage_ref = ref(storage, 'item_images/'+ image_file.name);
                        await uploadBytes(storage_ref, image_file);
                        console.log("Image uploaded successfully!");
                        return await getDownloadURL(storage_ref);
                    }
                    return null;
                }
            }
        }).mount("#item_form");
    } else {
        window.location.href = 'login.html';
    }
});
