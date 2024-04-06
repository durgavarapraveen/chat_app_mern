importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC3iGtqlw3cPNAeJCTrXOZFfu-NlB8ppaE",
  authDomain: "chat-app-84f82.firebaseapp.com",
  projectId: "chat-app-84f82",
  storageBucket: "chat-app-84f82.appspot.com",
  messagingSenderId: "847153028046",
  appId: "1:847153028046:web:edbc2dca2d15a5b673699f",
  measurementId: "G-79E0H8DNFS",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
