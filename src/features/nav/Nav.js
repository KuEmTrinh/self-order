import React from "react";
import "./Nav.css";
import Info from "./component/Info";
import NavLink from "./component/NavLink";

export default function Nav() {
  return (
    <div className="navigation">
      <Info></Info>
      <NavLink></NavLink>
    </div>
  );
}
