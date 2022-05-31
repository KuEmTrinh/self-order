import React from "react";
import { useState } from "react";
import { storage } from "../../../../app/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { db } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
export default function NewFood({ categoryId, categoryName }) {
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [resultBox, setResultBox] = useState(false);
  const [foodVietnamese, setFoodVietnamese] = useState("");
  const [foodJapanese, setFoodJapanese] = useState("");
  const [foodPrice, setPrice] = useState("");
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
      imgUrl: downloadURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  const handleChange = (event) => {
    setFile(event.target.files[0]);
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
    }, "3500");
  };

  return (
    <div>
      <p className="componentTitle">
        Tạo Sản Phẩm Cho {String(categoryName)}
      </p>
      <table>
        <tbody>
          <tr>
            <td>
              <p className="inputBoxTitle">Tên Tiếng Việt</p>
            </td>
            <th>
              <div className="inputBox flex align-center">
                <input
                  value={foodVietnamese}
                  className="inputBoxEnter"
                  onChange={foodVietnameseChangeValue}
                />
              </div>
            </th>
          </tr>
          <tr>
            <td>
              <p className="inputBoxTitle">Tên Tiếng Nhật</p>
            </td>
            <td>
              <div className="inputBox flex align-center">
                <input
                  value={foodJapanese}
                  className="inputBoxEnter"
                  onChange={foodJapaneseChangeValue}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p className="inputBoxTitle">Giá</p>
            </td>
            <td>
              <div className="inputBox flex align-center">
                <input
                  value={foodPrice}
                  className="inputBoxEnter"
                  onChange={foodPriceChangeValue}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <p className="inputBoxTitle">Hình Ảnh</p>
            </td>
            <td>
              <div className="inputBox flex align-center">
                <input
                  type="file"
                  onChange={handleChange}
                  accept=""
                  className="selectImageButton"
                />
              </div>
            </td>
          </tr>
          <button className="button button-green" onClick={handleUpload}>
            Tạo
          </button>
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
        </tbody>
      </table>
    </div>
  );
}
