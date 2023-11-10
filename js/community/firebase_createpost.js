// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

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
const storage = getStorage();
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

const communities = await getDocs(collection(db, 'communities'));
var communitiesList = communities.docs.map(doc => doc.data());

checkUserLoginStatus()
    .then((result) => {
        if(result.loggedIn){
            const createpost_app = Vue.createApp({
                data(){
                return{
                    user_id: result.user.uid,
                    community_id: "",
                    topic_title: "",
                    topic_about: "",
                }
            },
            methods: {
                async createPostInFirestore(){

                    const DEFAULT_IMAGE_URL = 'https://firebasestorage.googleapis.com/v0/b/wad2thegreentree.appspot.com/o/TheGreenTreeGreen.png?alt=media&token=c1c3c02e-7204-48a6-84f4-7d50507c3b09';

                    let imageUrls;

                    const images = Array.from(this.$refs.images_file.files)
                    console.log(imageUrls);

                    const lastPageURL = document.referrer;
                    var url  = lastPageURL.split("_");
                    var url = url[2].split(".");
                    var community_category = url[0];

                    if(this.topic_title.length == 0){
                        alert ("Please enter a topic title");
                        return;
                    }

                    if(this.topic_about.length == 0){
                        alert("Please enter a description for this topic");
                        return;
                    }

                    if(images.length==0){
                        imageUrls = [DEFAULT_IMAGE_URL];
                    }else{
                        imageUrls = await Promise.all(images.map(image => this.upload_image(image)));
                    }


                    for(var j of communitiesList){
                        var name = j.name;
                        if( /[0-9]/.test(name)) {
                            if(name==community_category){
                                this.community_id = j.id;
                                this.topic_title = document.getElementById("topic_title").value;
                                this.topic_about = document.getElementById("topic_about").value;
                                
                                let postRef = doc(collection(db, "posts"));
                                let postDataRef = {
                                    // postid: doc_ref.id,
                                    title: this.topic_title,
                                    desc: this.topic_about,
                                    communityid: this.community_id,
                                    followercount: 0,
                                    userid: this.user_id,
                                    images: imageUrls,
                                    dateposted: new Date(),                                    
                                };
                                await setDoc(postRef, postDataRef)
                                .then(() => {
                                    console.log("Document successfully written");
                                    alert("Post document created successfully");
                                    console.log(lastPageURL);
                                    window.location.href = lastPageURL;    
                                    
                                })
                                .catch((error) => {
                                    console.error("Error", error);
                                })    
                            }
                            
                        } else if(name.toLowerCase()==community_category){
                            this.community_id = j.id;
                            this.topic_title = document.getElementById("topic_title").value;
                            this.topic_about = document.getElementById("topic_about").value;
                        

                            let postRef = doc(collection(db, "posts"));
                            let postDataRef = {
                                title: this.topic_title,
                                desc: this.topic_about,
                                communityid: this.community_id,
                                followercount: 0,
                                userid: this.user_id,
                                images: imageUrls,
                                dateposted: new Date(),
                            };
                            await setDoc(postRef, postDataRef)
                            .then(() => {
                                console.log("Document successfully written");
                                alert("Post document created successfully");
                                console.log(lastPageURL);
                                window.location.href = lastPageURL;
                            })
                            .catch((error) => {
                                console.error("Error", error);
                            })
                        }
                    }
                },
                
                async upload_image(image_file){
                    if(image_file) {
                        const storage_ref = ref(storage, 'posts_images/'+ image_file.name);
                        await uploadBytes(storage_ref, image_file);
                        console.log("Image uploaded successfully!");
                        return await getDownloadURL(storage_ref);
                    }
                }
            }
        }).mount("#upload_form");
    }
})


