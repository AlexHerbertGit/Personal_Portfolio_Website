// import { db } from '../app/app.js'; 

// console.log('Script is running');

// document.addEventListener('DOMContentLoaded', () => {
//   // Initialize Firebase
//   const app = firebase.initializeApp(firebaseConfig);
//   const db = firebase.firestore(app);

//   const form = document.getElementById('contactForm');
//   if (form) {
//     form.addEventListener('submit', function (event) {
//       event.preventDefault();

//       const name = document.getElementById('name').value;
//       const phone = document.getElementById('phone').value;
//       const email = document.getElementById('email').value;
//       const company = document.getElementById('company').value;
//       const message = document.getElementById('message').value;

//       const messagesRef = db.collection('messages');

//       console.log("Sending message to Firestore...");

//       messagesRef.add({
//         name: name,
//         phone: phone,
//         email: email,
//         company: company,
//         message: message,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp()
//       })
//       .then((docRef) => {
//         console.log("Message sent with ID: ", docRef.id);
//         alert('Message sent successfully!');
//         form.reset();
//       })
//       .catch((error) => {
//         console.error("Error sending message: ", error);
//         alert('Error sending message. Please try again later.');
//       });
//     });
//   } else {
//     console.error('Form not found!');
//   }
// });