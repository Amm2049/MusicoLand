import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCxmoB35-MWcX-K3EYNwe-lYWvGLrhoi5k",
    authDomain: "musico-land.firebaseapp.com",
    projectId: "musico-land",
    storageBucket: "musico-land.appspot.com",
    messagingSenderId: "447588657806",
    appId: "1:447588657806:web:bde79aca3acaf3ac7ab7df"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export { projectAuth, projectFirestore, projectStorage, timestamp }