// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getFirestore, collection, addDoc, getDocs, setDoc, query, where, doc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// import { set, ref } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
// import { ref as sRef } from 'firebase/storage'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// import { checkUserLoginStatus } from "../firebase_profile";

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


// console.log(user_id);
const communities = await getDocs(collection(db, 'communities'));
// const posts = await getDocs(collection(db, 'posts'));
// const comments = await getDocs(collection(db, 'comments'));

var communitiesList = communities.docs.map(doc => doc.data());
// var postList = posts.docs.map(doc => doc.data());
// var commentsList = comments.docs.map(doc => doc.data());

// const lastPageURL = document.referrer;

// var url  = lastPageURL.split("_");
// var url = url[2].split(".");
// var community_category = url[0];

// var rows = "";

// var upload_picture = document.getElementById("input_file");
// var post = document.getElementById("create_post");


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
                    const images = Array.from(this.$refs.images_file.files)
                    const imageUrls = await Promise.all(images.map(image => this.upload_image(image)));
                    console.log(imageUrls);

                    const lastPageURL = document.referrer;
                    var url  = lastPageURL.split("_");
                    var url = url[2].split(".");
                    var community_category = url[0];


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
                                };
                                await setDoc(postRef, postDataRef)
                                .then(() => {
                                    console.log("Document successfully written");
                                    alert("Post document created successfully");
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
                                // postid: doc_ref.id,
                                title: this.topic_title,
                                desc: this.topic_about,
                                communityid: this.community_id,
                                followercount: 0,
                                userid: this.user_id,
                                images: imageUrls,
                            };
                            await setDoc(postRef, postDataRef)
                            .then(() => {
                                console.log("Document successfully written");
                                alert("Post document created successfully");
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

// const createPostInFirestore = async() => {
//     // var storageRef = storage.ref();
//     // if(upload_picture.length == 1){
//     //     var imageRef = storageRef.child("images/" + upload_picture[0].name)
//     //     imageRef.put()
//     // } else{
//     //     for(var i=0;i<upload_picture.length; i++){
//     //         var imageRef = storageRef.child("images/" + upload_picture[i].name)
//     //     }
//     // }

//     const postRef = doc(collection(db, "posts"));
//     const postDataRef = {
//         // postid: doc_ref.id,
//         title: topic_title.value,
//         desc: topic_about.value,
//         communityid: id,
//         followercount: 0,
//         userid: result.user.uid,
//     }

//     // checkUserLoginStatus()
//     // .then((result) => {
//     //     var user_id = result.user.uid;
//     //     const postRef = doc(collection(db, "posts"));
//     //     const postDataRef = {
//     //         // postid: doc_ref.id,
//     //         title: topic_title.value,
//     //         desc: topic_about.value,
//     //         communityid: id,
//     //         followercount: 0,
//     //         userid: result.user.uid,
//     //         // picture: upload_picture.value
//     //     }
        

//         try{
//             Event.preventDefault();
//             await setDoc(postRef, postDataRef);
//             alert("Post document created successfully");
//             // rows += "<div class='modal fade' id='myModal' role='dialog'>"
//             // + "<div class='modal-dialog'>"
//             // + "<div class='modal-content'>"
//             // +"<div class='modal-header'>"
//             // +"<button type='button' class='close' data-dismiss='modal'>&times;</button>"
//             // +"<h4 class='modal-title'>Modal Header</h4>"
//             // +"</div><div class='modal-body'>"
//             // +"<p>Some text in the modal.</p></div>"
//             // +"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"
//             // +"</div></div>"
//             // +"<div class='modal-footer'>"
//             // +"<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button></div></div>"
//             // +"</div></div>";
//             // document.getElementById("button_create_post").innerHTML += rows;
//         } catch(error) {
//             Event.preventDefault();
//             console.log("Error creating post documnet:", error);
//         }


// if(document.getElementById("create_post")){
//     post.addEventListener("click", createPostInFirestore);
// }
// }




// function create_post() {
//   console.log("hello");
//   set(sRef(db, "posts/"), {
//     title: topic_title.value,
//     about: topic_about.value,
//   }
//   .then(()=>{
//     alert("Post uploaded successfully");
//   })
//   .catch(()=>{
//     alert("There were some issues, try again")
//   })
//   )
// }

// const create_post = async (topic_title, topic_about, upload_picture) => {
    // checkUserLoginStatus()
    // .then((result) => {
    //     if (result.loggedIn) {
    //         // User is logged in
    //         console.log('User is logged in:', result.user);
    //     } else {
    //         // User is not logged in
    //         console.log('User is not logged in.');
    //         profileLink.href = 'login.html';
    //     }
    // })
    // .catch((error) => {
    //     console.error('Error checking user login status:', error);
    // });

//   const postDocRef = doc(db, 'posts');
//   const postData = {
//       title: topic_title,
//       desc: topic_about,
//       resources: upload_picture,
//   };
//   console.log("hello");
//   try {
//       await setDoc(postDocRef, postData);
//       console.log('Post uploaded successfully.');
//   } catch (error) {
//       console.error('Error creating post:', error);
//   }
// };

// create_post()
//   .then(()=>{
//     alert("Post uploaded successfully");
//   })
//   .catch(()=>{
//     alert("There were some issues, try again")
//   })

// delete comment



