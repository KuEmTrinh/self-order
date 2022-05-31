import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import NewFood from "./NewFood";
import FoodList from "./FoodList";
export default function Food() {
  const params = useParams();
  return (
    <div>
      <Link to="/menu" className="navlink">
        <KeyboardBackspaceIcon></KeyboardBackspaceIcon>
      </Link>
      <NewFood categoryId={params?.id} categoryName={params?.name}></NewFood>
      <FoodList categoryId={params?.id}></FoodList>
    </div>
  );
}
