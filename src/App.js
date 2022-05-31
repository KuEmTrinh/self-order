import React from "react";
import Login from "./features/login/Login";
import { Routes, Route } from "react-router-dom";
import Action from "./features/action/Action"
import "./App.css";
import "./Reset.css";
import "./Style.css";
function App() {
  return (
    <>
      <Routes>
        <Route path="/table/:id/:code" element={<Action />} />
        <Route path="*" element={<Login></Login>} />
      </Routes>
    </>
  );
}

export default App;
