import React, { useEffect, useState } from "react";
import "./Info.css";
import { useSelector } from "react-redux";
import { db } from "../../../app/firebase";

export default function Info() {
  const userInfomation = JSON.parse(useSelector((state) => state.login.data));
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const queryData = () => {
    db.collection("user")
      .doc(userInfomation.uid)
      .get()
      .then((snapshot) => {
        let name = snapshot.data().name;
        let imageUrl = snapshot.data().photoURL;
        setUserImage(imageUrl);
        setUserName(name);
      });
  };
  useEffect(() => {
    queryData();
  }, []);
  return (
    <div className="userInfo flex flex-row align-center">
      <img src={userImage} className="photo" />
      <p className="name">{userName}</p>
    </div>
  );
}
