// Import the functions you need from the SDKs you need


  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
  // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
  import { getFirestore, collection, addDoc, getDocs } 
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
  
//   const fetchData = async ()=>{
//     try{
//       let items_array = [];
//     const querySnapshot = await getDocs(collection(db, "items"));
//     querySnapshot.forEach((doc)=>{
//       items_array.push(doc.data());
//         console.log(doc.id, " => ", doc.data());
//     })
//     console.log(items_array);

//     displayItems(items_array);
//   }catch(error){
//     console.log(error);
//   }
// }

const fetchData = () => {
  const items_array = [];
  getDocs(collection(db, "items"))
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        docData['iid'] = doc.id;
        items_array.push(docData);
        console.log(doc.id, " => ", doc.data());
      });
      console.log(items_array);
      const product_app = Vue.createApp({
        data(){
            return{
                items: items_array,
                item: "",
            }
      },
    mounted(){
      console.log(this.items[0]);
    }}).mount("#product_listing");
    })
    .catch((error) => {
      console.error("Error getting documents: ", error);
    });
};

fetchData();


  // Items Data
  // var items_array = [];
  // querySnapshot.forEach((doc) => {
  //     items_array.push(doc.data());
  // });

  // console.log(items_array);
  // export {items_array};
  
  // function initializeVue(){
  //   const product_app = Vue.createApp({
  //     data(){
  //         return{
  //             items: items_array
  //         }
  //   }}).mount("#product_listing");
  // }

  //const analytics = getAnalytics(app);