/* eslint-disable promise/always-return */

//Import the Firebase-functions
const functions = require('firebase-functions');
//connection to admin  
const admin = require('firebase-admin');
//express module 
const app = require('express')();
//module admin 
admin.initializeApp()


const config = {
    apiKey: "AIzaSyBHhbHUFF32Tk8gH81DH87odLi5ePuzIlY",
    authDomain: "socialapse-9c028.firebaseapp.com",
    databaseURL: "https://socialapse-9c028.firebaseio.com",
    projectId: "socialapse-9c028",
    storageBucket: "socialapse-9c028.appspot.com",
    messagingSenderId: "91104181085",
    appId: "1:91104181085:web:35cee6ebe21fd934cf06b4",
    measurementId: "G-XLLQ0RLLWS"
};

//All this think provide the set for request
const firebase = require('firebase');
//module inizialize app 
firebase.initializeApp(config);

const db = admin.firestore();
// Simple function Hello word
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello word!");
});

//functions for get all the data in the app database 
app.get('/screams', (req, res) => {
    db // connection a la base de donnée firebase 
        .collection('screams')//connection to this projets 
        .orderBy('createdAt', 'desc')//database ordered by createdAt and desc
        .get()//funciton come from express
        .then((data) => {//promise a data 
            let screams = [];//create a tab for put all the data recover 
            data.forEach((doc) => {//we gonna fetch on the database for get
                screams.push({
                    screamId: doc.id,//we gonna genered a random id 
                    body: doc.data().body, // we recover the body from the storage 
                    userHandle: doc.data().userHandle, // recover the user from the storage 
                    createdAt: doc.data().createdAt  //recover the date from the storage 
                })
            });
            return res.json(screams)
        })
        .catch(err => console.error(err))
})

//function post 
app.post('/scream', (req, res) => {

    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };


    db
        .collection('screams')
        .add(newScream)
        .then((doc) => {
            res.json(doc.id)
        })
        .catch((err) => {
            res.status(500).json({ error: 'something went wrong' });
            console.error(err)
        })
})

const isEmail = (email) =>{

}

const isEmpty = (string) => {
    if(string.trim() ==='') return true; 
    else return false; 
}

//signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    };

    let errors  = {};  
    if(isEmpty(newUser.email)){
        errors.email = 'emal must not be empty'
    }else if()

    db.doc(`/users/${newUser.handle}`)
        .get()
        .then((doc) => {
            if (doc.exists) {
                return res.status(400).json({ handle: 'this handle is already taken' })
            }
            else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
 
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })

        .then((token) => {
            // eslint-disable-next-line no-self-assign
            token = token;
            const userCredentials ={
                handle : newUser.handle,
                email:newUser.email,
                createAt : new Date().toISOString,
                userId
            };
         return   db.doc(`/users/${newUser.handle}`).set(userCredentials)
        })
        .then((data)=>{
            return res.status(201).json({token});
        })
        .catch((err) => {
            console.error(err);
            if(err.code === 'auth/email-already-in-use'){
                return res.status(400).json({email: 'Email is already used '})
            }
            else{
                return res.status(500).json({ error: err.code })
            }
        })
})



//https://baseurl.com/api/
exports.api = functions.region('us-central1').https.onRequest(app);


