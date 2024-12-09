importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDtRRsnTSPvBIFXbQIyAUz2hbGL6DtwvXk",
    authDomain: "ebonitefitout.firebaseapp.com",
    projectId: "ebonitefitout",
    storageBucket: "ebonitefitout.appspot.com",
    messagingSenderId: "989887258839",
    appId: "1:989887258839:web:e609fb8b6177d327cb5092",
    measurementId: "G-HJFRR7D34R"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});