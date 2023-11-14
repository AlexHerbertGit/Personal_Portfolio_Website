console.log('Script is running');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqK9IvCrDrD5dtJx-e7oED2Ph2F4156zg",
  authDomain: "personal-portfoilio-fb.firebaseapp.com",
  projectId: "personal-portfoilio-fb",
  storageBucket: "personal-portfoilio-fb.appspot.com",
  messagingSenderId: "232316565480",
  appId: "1:232316565480:web:b2b751d2172f81302f565d"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let ui = new firebaseui.auth.AuthUI(auth);
let uiConfig;

document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('user-info');
  const accountName = document.getElementById('account-name');
  const logoutButton = document.getElementById('logout-button');
  const firebaseLogin = document.querySelector('.firebase-login');

  if (userInfo && accountName && logoutButton && firebaseLogin) {
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        accountName.textContent = user.displayName || user.email;
        userInfo.style.display = 'block';
        firebaseLogin.style.display = 'none';
      } else {
        // No user is signed in.
        userInfo.style.display = 'none';
        firebaseLogin.style.display = 'block';
      }
    });

    // Add event listener for logout button
    logoutButton.addEventListener('click', () => {
      // Sign out the user
      auth.signOut().then(() => {
        // Update UI after signing out
        userInfo.style.display = 'none';
        firebaseLogin.style.display = 'block';
      });
    });
  }

  const commentsContainer = document.getElementById('comments-container');
  if (commentsContainer) {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');

    // Reference to Firestore comments collection
    const commentsRef = db.collection('comments');

    // Listen for comments added to Firestore
    commentsRef.orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      commentsContainer.innerHTML = '';
      snapshot.forEach((doc) => {
        const comment = doc.data();
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.setAttribute('data-id', doc.id);  // Set the data-id attribute here
        commentDiv.innerHTML = `
          <div class="comment-author">${comment.userName || 'Anonymous'}</div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-timestamp">${comment.timestamp ? comment.timestamp.toDate().toLocaleString() : ''}</div>
        `;
        // Check if the current user is the author of the comment
        if (auth.currentUser && auth.currentUser.uid === comment.userId) {
          commentDiv.innerHTML += `
            <button class="edit-comment" data-id="${doc.id}">Edit</button>
            <button class="delete-comment" data-id="${doc.id}">Delete</button>
          `;
        }
        commentsContainer.appendChild(commentDiv);
      });
    
      document.querySelectorAll('.edit-comment').forEach(button => {
        button.addEventListener('click', () => editComment(button.dataset.id));
      });
      document.querySelectorAll('.delete-comment').forEach(button => {
        button.addEventListener('click', () => deleteComment(button.dataset.id));
      });
    });
    

    // Edit comment function
function editComment(commentId) {
  const commentDiv = document.querySelector(`.comment[data-id="${commentId}"] .comment-text`);
  if (commentDiv) {
    const newText = prompt('Edit your comment:', commentDiv.textContent);
    if (newText !== null) {
      commentsRef.doc(commentId).update({ text: newText })
        .then(() => {
          console.log('Comment updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating comment: ', error);
        });
    }
  } else {
    console.error('Comment not found');
  }
}

    // Delete comment function
    function deleteComment(commentId) {
      if (confirm('Are you sure you want to delete this comment?')) {
        commentsRef.doc(commentId).delete();
      }
    }

    // Post a new comment
    if (commentForm && commentInput) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (auth.currentUser) {
          if (auth.currentUser.emailVerified) {
            if (commentInput.value.trim() !== '') {
              commentsRef.add({
                text: commentInput.value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName
              });
              commentInput.value = '';
            }
          } else {
            alert('Please verify your email before posting comments.');
          }
        } else {
          alert('Please create an account or log in to leave comments');
        }
      });
    }
  }

  //Contact Form Event Listener and Message compiler
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (auth.currentUser && auth.currentUser.emailVerified) {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const company = document.getElementById('company').value;
        const message = document.getElementById('message').value;

        const messagesRef = db.collection('messages');

        console.log("Sending message to Firestore...");

        messagesRef.add({
          name: name,
          phone: phone,
          email: email,
          company: company,
          message: message,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
          console.log("Message sent with ID: ", docRef.id);
          alert('Message sent successfully!');
          form.reset();
        })
        .catch((error) => {
          console.error("Error sending message: ", error);
          alert('Error sending message. Please try again later.');
        });
      } else {
        alert('Please log in and verify your email to send messages.');
      }
    });
  } else {
    console.error('Form not found!');
  }

  uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        return true;
      },
      signInFailure: function(error) {
        // For email/password sign-in, handle the error here and provide a way for the user to continue
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.email;
          const pendingCred = error.credential;

          // The user has already signed up with a different provider for that email.
          // Instruct the user to log in with that provider.
          // Here is an example of how to handle this error:
          auth.fetchSignInMethodsForEmail(email).then(function(methods) {
            if (methods[0] === 'password') {
              // User can sign in with email/password.
              return auth.signInWithEmailAndPassword(email, promptForPassword())
                .then(function(user) {
                  // Step 4a.
                  return user.linkWithCredential(pendingCred);
                });
            }
          });
        }
        return Promise.reject(error);
      },
      uiShown: function() {
        const loaderElement = document.getElementById('loader');
        if (loaderElement) {
          loaderElement.style.display = 'none';
        }
      }
    },
    // Sign in options for the Firebase UI, configured in the Firesbase Console also.
    signInFlow: 'popup',
    // Update this with correct url when hosted.
    signInSuccessUrl: '<index.html>', 
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true
      }
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
  };

  ui.start('#firebaseui-auth-container', uiConfig);
});

let isFirebaseUIDisplayed = false;

const firebaseLoginIcon = document.getElementById('firebase-login-icon');
if (firebaseLoginIcon) {
  firebaseLoginIcon.addEventListener('click', function() {
    const firebaseUIContainer = document.getElementById('firebaseui-auth-container');
    if (firebaseUIContainer) {
      firebaseUIContainer.style.display = isFirebaseUIDisplayed ? 'none' : 'block';
      isFirebaseUIDisplayed = !isFirebaseUIDisplayed;
    }
  });
}

//Search Bar content index for searches
const contentIndex = [
  {
    id: 'javascript',
    title: 'JavaScript Projects',
    keywords: ['javascript', 'project', 'skills', 'programming', 'language'],
    description: 'Projects that use JavaScript programming Language',
    url: 'skill.html'
  },
  {
    id: 'html',
    title: 'HTML Projects',
    keywords: ['html', 'web', 'development', 'skills', 'project'],
    description: 'HTML and Web Developement skills and projects',
    url: 'skill.html',
  },
  {
    id: 'css',
    title: 'CSS Projects',
    keywords: ['css', 'web', 'development', 'skills', 'project'],
    description: 'CSS and Web Development skills and projects',
    url: 'skill.html',
  },
  {
    id: 'sql',
    title: 'SQL Projects',
    keywords: ['sql', 'database', 'backend', 'development', 'skills', 'projects'],
    description: 'SQL database projects',
    url: 'skill.html',
  }
];

//Event Listener for Search Bar queries
document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search-bar');
  const resultsContainer = document.getElementById('search-results');

  searchBar.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const results = contentIndex.filter(item => 
      item.keywords.some(keyword => keyword.includes(query)) ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
    displayResults(results);
  });

  window.addEventListener('click', function(event) {
    if (!event.target.matches('#search-bar')) {
      resultsContainer.style.display = 'none';
    }
  });
});

//Display Results
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');
  if (results.length > 0) {
    resultsContainer.innerHTML = results.map(item => `<div onclick="window.location.href='${item.url}'">${item.title}</div>`).join('');
    resultsContainer.style.display = 'block';
  } else {
    resultsContainer.style.display = 'none';
  }
}