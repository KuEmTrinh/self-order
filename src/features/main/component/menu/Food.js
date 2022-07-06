import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import NewFood from "./NewFood";
import FoodList from "./FoodList";
import Modal from "./Modal";
export default function Food() {
  const params = useParams();
  const [createFoodToggle, setCreateFoodToggle] = useState(false);
  return (
    <div>
      <div className="createFoodHeader">
        <Link to="/menu" className="navlink">
          <div className="backListIcon">
            <KeyboardBackspaceIcon></KeyboardBackspaceIcon>
            <p>Quay lại</p>
          </div>
        </Link>
        <button
          className="button button-green"
          onClick={() => {
            setCreateFoodToggle(!createFoodToggle);
          }}
        >
          Tạo Món
        </button>
      </div>
      <p className="categoryFoodsTitle">Danh sách món của "{params?.name}"</p>
      <Modal
        show={createFoodToggle}
        onClose={() => {
          setCreateFoodToggle(!createFoodToggle);
        }}
      >
        <NewFood categoryId={params?.id} categoryName={params?.name}></NewFood>
      </Modal>
      <FoodList categoryId={params?.id}></FoodList>
    </div>
  );
}
