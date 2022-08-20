import { createApp } from 'vue';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

import './index.css'
import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyD0me1PJsGqthpQn1Kfdx6O82zxoQJorGE",
    authDomain: "tugucci-7e545.firebaseapp.com",
    projectId: "tugucci-7e545",
    storageBucket: "tugucci-7e545.appspot.com",
    messagingSenderId: "971450414369",
    appId: "1:971450414369:web:72d629e1ed4fcb22bdba60",
    measurementId: "G-C8RL9YXWDK"  
};
   

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
export {db, auth};

const app = createApp(App)
app.use(router)
app.mount('#app')
