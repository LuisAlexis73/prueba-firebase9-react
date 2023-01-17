// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBvM_mxGIYXLxa_o616L1EG8OFrZQ8fVWw",
	authDomain: "tutorial-react-firebase-1f285.firebaseapp.com",
	projectId: "tutorial-react-firebase-1f285",
	storageBucket: "tutorial-react-firebase-1f285.appspot.com",
	messagingSenderId: "850809365735",
	appId: "1:850809365735:web:98942c24182f30395b6e42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;