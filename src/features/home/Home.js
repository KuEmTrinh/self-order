import React from "react";
import Nav from "../nav/Nav";
import Main from "../main/Main";
import "./Home.css";
export default function Home() {
  return (
    <div className="appWrapper">
      <div className="home flex flex-between">
        <Nav></Nav>
        <Main></Main>
      </div>
    </div>
  );
}
