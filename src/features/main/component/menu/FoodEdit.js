import React from "react";
import "./FoodEdit.css";
import { db } from "../../../../app/firebase";
import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../app/firebase";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import imageCompression from "browser-image-compression";
export default function FoodEdit(props) {
  const editFood = JSON.parse(props.food);
  const [foodVietnamese, setFoodVietnamese] = useState("");
  const [foodJapanese, setFoodJapanese] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState();
  const [imageChange, setImageChange] = useState(false);
  const [resultBox, setResultBox] = useState(false);
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    setFoodVietnamese(editFood.vietnamese);
    setFoodJapanese(editFood.japanese);
    setFoodPrice(editFood.price);
  }, []);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  const foodVietnameseChangeValue = (e) => {
    setFoodVietnamese(e.target.value);
  };
  const foodJapaneseChangeValue = (e) => {
    setFoodJapanese(e.target.value);
  };
  const foodPriceChangeValue = (e) => {
    setFoodPrice(e.target.value);
  };
  const handleChange = async (event) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    };
    try {
      const file = event.target.files[0];
      const compressedFile = await imageCompression(file, options);
      setFile(compressedFile);
      setImageChange(true);
    } catch (err) {
      console.log(err);
    }
  };
  const imageUpload = () => {
    if (!file) {
      alert("Please choose a file first!");
    }
    setResultBox(true);
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          saveNewImageUrl(url);
        });
      }
    );
  };
  const saveNewImageUrl = (url) => {
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(editFood.id)
      .update({
        imgUrl: url,
      });
  };
  const editThisFood = () => {
    if (imageChange) {
      imageUpload();
    }
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(editFood.id);
    const update = query.update({
      vietnamese: foodVietnamese,
      japanese: foodJapanese,
      price: foodPrice,
    });
    props.onClose();
    return update;
  };
  return (
    <div className="foodEdit">
      <div className="foodImage">
        {preview === "" ? <img src={editFood.imgUrl} /> : <img src={preview} />}
      </div>
      <div className="inputBox flex align-center">
        <label for="accountSettingInput">
          <div className="accountSettingInputUpload">
            <FileUploadIcon></FileUploadIcon>
            <p>Thay ảnh</p>
            <input
              className="inputSetting"
              onChange={handleChange}
              id="accountSettingInput"
              type="file"
            ></input>
          </div>
        </label>
      </div>
      <div className="foodContent w-100">
        <div className="foodDetail flex flex-column">
          <input
            className="inputBoxEnter"
            value={foodVietnamese}
            onChange={foodVietnameseChangeValue}
          />
          <input
            className="inputBoxEnter mt-1"
            onChange={foodJapaneseChangeValue}
            value={foodJapanese}
          />
          <input
            className="inputBoxEnter mt-1"
            onChange={foodPriceChangeValue}
            value={foodPrice}
          />
        </div>
        <button className="foodEditButton" onClick={editThisFood}>
          Sửa
        </button>
      </div>
    </div>
  );
}
