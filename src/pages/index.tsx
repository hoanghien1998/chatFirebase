import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import ChatRoom from "components/ChatRoom/ChatRoom";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock_key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
const auth = getAuth(app);

const db = firebase.firestore();
export default function Home() {
  // initial states
  const [user, setUser] = useState(() => auth.currentUser);
  console.log("user", user);

  // automatically check a user's auth status
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      // update the user current state
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // sign in
  const signInWithGoogle = async () => {
    // get the google provider object
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.useDeviceLanguage();

    // signing in user
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  // signout
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <main>
        {user ? (
          <>
            <nav id="sign_out">
              <h2>Chat With Friends</h2>
              <button onClick={signOut}>Sign Out</button>
            </nav>
            <ChatRoom user={user} db={db} />
          </>
        ) : (
          <section id="sign_in">
            <h1>Welcome to Chat Room</h1>
            <button onClick={signInWithGoogle}>Sign In With Google</button>
          </section>
        )}
      </main>
    </div>
  );
}
