import React from "react";
import { useState, useEffect } from "react";
import { storage } from "../../../../app/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import "./NewFood.css";
import imageCompression from "browser-image-compression";
import TextField from "@mui/material/TextField";

export default function NewFood({ categoryId, categoryName }) {
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [resultBox, setResultBox] = useState(false);
  const [foodVietnamese, setFoodVietnamese] = useState("");
  const [foodJapanese, setFoodJapanese] = useState("");
  const [foodPrice, setPrice] = useState("");
  const [preview, setPreview] = useState();
  useEffect(() => {
    if (!file) {
      setPreview(undefined);
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
    setPrice(e.target.value);
  };
  const setNomarl = () => {
    setResultBox(false);
    setFile("");
    setFoodVietnamese("");
    setFoodJapanese("");
    setPrice("");
    setPercent("");
  };
  const createNewFood = (downloadURL) => {
    db.collection("category").doc(categoryId).collection("food").add({
      vietnamese: foodVietnamese,
      japanese: foodJapanese,
      price: foodPrice,
      status: true,
      properties: false,
      imgUrl: downloadURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
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
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpload = () => {
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
          createNewFood(url);
        });
      }
    );
    setTimeout(() => {
      setNomarl();
    }, "1500");
  };

  return (
    <div>
      <p className="componentTitle">
        Tạo Sản Phẩm Cho "{String(categoryName)}"
      </p>
      <div className="mainNewFood">
        <div className="textFieldInputBox">
          <div className="textFieldInputItem">
            <TextField
              id="outlined-name"
              label="Nhập tên tiếng việt"
              onChange={(e) => {
                foodVietnameseChangeValue(e);
              }}
              value={foodVietnamese}
            />
          </div>
          <div className="textFieldInputItem">
            <TextField
              id="outlined-name"
              label="Nhập tên nhật"
              onChange={(e) => {
                foodJapaneseChangeValue(e);
              }}
              value={foodJapanese}
            />
          </div>
          <div className="textFieldInputItem">
            <TextField
              id="outlined-name"
              label="Nhập giá"
              onChange={(e) => {
                foodPriceChangeValue(e);
              }}
              value={foodPrice}
            />
          </div>
          <div className="inputBox flex align-center">
            <label for="accountSettingInput">
              <div className="accountSettingInputUpload">
                <FileUploadIcon></FileUploadIcon>
                <p>Chọn ảnh</p>
                <input
                  className="inputSetting"
                  onChange={handleChange}
                  id="accountSettingInput"
                  type="file"
                ></input>
              </div>
            </label>
          </div>
          {resultBox ? (
            <div className="resultBox">
              {percent === 100 ? (
                <CheckIcon color="success" fontSize="large"></CheckIcon>
              ) : (
                <div className="indexTop">
                  <CircularProgress variant="determinate" value={percent} />
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>

        <div className="createFoodPreview">
          <div className="food">
            {preview ? (
              <div className="foodImage">{file && <img src={preview} />}</div>
            ) : (
              ""
            )}
            <div className="foodContent">
              <div className="foodDetail">
                <p className="foodVietnamese">{foodVietnamese}</p>
                <p className="foodJapanese">{foodJapanese}</p>
                <p className="foodPrice">{foodPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="centerButton">
        {file !== "" &&
        foodVietnamese !== "" &&
        foodJapanese !== "" &&
        foodPrice !== "" ? (
          <button className="button button-green" onClick={handleUpload}>
            Tạo
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
