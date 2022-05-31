import React from "react";
import "./Login.css";
import { authentication } from "../../app/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState, useEffect } from "react";
import { firebase } from "../../app/firebase";
import { useDispatch } from "react-redux";
import { setUserInfomation } from "./loginSlice";
import Home from "../home/Home";
import { db } from "../../app/firebase";
export default function Login() {
  const [checkUserToggle, setCheckUserToggle] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userInfomation = JSON.stringify(user);
        dispatch(setUserInfomation(userInfomation));
        return setIsUserSignedIn(true);
      }
      return setIsUserSignedIn(false);
    });
  }, []);
  const setUser = (user) => {
    const userId = user.uid;
    console.log(user);
    db.collection("user").doc(userId).set({
      name: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
      uid: user.uid,
      photoURL: user.photoURL,
    });
  };
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res) => {
        setUser(res.user);
        console.log("Da dang nhap");
      })
      .catch((error) => {
        console.log("Login Failed");
      });
  };
  return (
    <>
      {isUserSignedIn ? (
        <Home></Home>
      ) : (
        <div className="center">
          <button
            className="button button-m"
            onClick={() => {
              loginWithGoogle();
            }}
          >
            Login with Google
          </button>
        </div>
      )}
    </>
  );
}
