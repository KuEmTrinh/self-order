import React from "react";
import "./FoodEdit.css";
import { db } from "../../../../app/firebase";
import { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../app/firebase";
import { firebase } from "../../../../app/firebase";
import RadioList from "./RadioList";
import CheckboxList from "./CheckboxList";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import imageCompression from "browser-image-compression";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
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
  const [propertyType, setPropertyType] = useState("");
  const [propertyRadioTitle, setPropertyRadioTitle] = useState("");
  const [propertyRadioInput, setPropertyRadioInput] = useState("");
  const [propertyRadioPriceInput, setPropertyRadioPriceInput] = useState("");
  const [propertyRadioList, setPropertyRadioList] = useState("");
  const [radioList, setRadioList] = useState("");
  const [propertyCheckboxName, setPropertyCheckboxName] = useState("");
  const [propertyCheckboxPrice, setPropertyCheckboxPrice] = useState("");
  const [propertyCheckboxList, setPropertyCheckboxList] = useState("");
  useEffect(() => {
    setFoodVietnamese(editFood.vietnamese);
    setFoodJapanese(editFood.japanese);
    setFoodPrice(editFood.price);
    radioListQuery();
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
  const changePropertiesValue = () => {
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(editFood.id)
      .update({
        properties: !editFood.properties,
      });
  };
  const propertyRadioElementChangeValue = (e) => {
    setPropertyRadioInput(e.target.value);
  };
  const propertyRadioElemnentPriceChangeValue = (e) => {
    setPropertyRadioPriceInput(e.target.value);
  };
  const propertyRadioTitleChangeValue = (e) => {
    setPropertyRadioTitle(e.target.value);
  };
  const propertyCheckboxNameValue = (e) => {
    setPropertyCheckboxName(e.target.value);
  };
  const propertyCheckboxPriceValue = (e) => {
    setPropertyCheckboxPrice(e.target.value);
  };
  const createRadioElement = () => {
    let price = "";
    if (propertyRadioPriceInput === "") {
      price = 0;
    } else {
      price = propertyRadioPriceInput;
    }
    let property = {
      name: propertyRadioInput,
      price: price,
    };
    let list = [...propertyRadioList];
    list.push(property);
    setPropertyRadioList([...list]);
    setPropertyRadioPriceInput("");
    setPropertyRadioInput("");
  };
  const createCheckboxElement = () => {
    let price = "";
    if (propertyCheckboxPrice === "") {
      price = 0;
    } else {
      price = propertyCheckboxPrice;
    }
    let property = {
      name: propertyCheckboxName,
      price: price,
    };
    let list = [...propertyCheckboxList];
    list.push(property);
    setPropertyCheckboxList([...list]);
    setPropertyCheckboxName("");
    setPropertyCheckboxPrice("");
  };
  const createRadioItem = () => {
    const foodInfo = JSON.parse(props.food);
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(foodInfo.id)
      .collection("radio")
      .add({
        name: propertyRadioTitle,
        list: propertyRadioList,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setPropertyRadioTitle("");
    setPropertyRadioList("");
    setTimeout(() => {
      radioListQuery("");
    }, 500);
  };
  const createCheckboxItem = () => {
    const foodInfo = JSON.parse(props.food);
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(foodInfo.id)
      .update({
        checkbox: propertyCheckboxList,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    setPropertyCheckboxList("");
    // setTimeout(() => {
    //   radioListQuery("");
    // }, 500);
  };
  const radioListQuery = () => {
    const foodInfo = JSON.parse(props.food);
    const query = db
      .collection("category")
      .doc(props.categoryId)
      .collection("food")
      .doc(foodInfo.id)
      .collection("radio")
      .get()
      .then((snapshot) => {
        const data = [];
        snapshot.docs.map((doc) => {
          data.push({
            id: doc.id,
            name: doc.data().name,
            list: doc.data().list,
          });
        });
        // console.log(data);
        setRadioList(data);
      });
  };
  return (
    <div className="foodEditBox">
      <p className="componentTitle">T??y ch???nh m??n</p>
      <div className="foodEditMainBox">
        <div className="foodEdit">
          <p className="subTitleComponent">C??i ?????t ch??nh</p>
          <div className="foodImage">
            {preview === "" ? (
              <img src={editFood.imgUrl} />
            ) : (
              <img src={preview} />
            )}
          </div>
          <div className="inputBox flex align-center">
            <label for="accountSettingInput">
              <div className="accountSettingInputUpload">
                <FileUploadIcon></FileUploadIcon>
                <p>Thay ???nh</p>
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
              S???a
            </button>
          </div>
        </div>
        <div className="foodEditSubBox">
          <p className="subTitleComponent">C??i ?????t ph???</p>
          {editFood.properties ? (
            <div
              className="propertiesToggleButton propertiesToggleButtonDisable"
              onClick={() => {
                changePropertiesValue();
              }}
            >
              <p>T???t c??i ?????t chi ti???t</p>
            </div>
          ) : (
            <div
              className="propertiesToggleButton propertiesToggleButtonActive"
              onClick={() => {
                changePropertiesValue();
              }}
            >
              <p>B???t c??i ?????t chi ti???t</p>
            </div>
          )}
          {editFood.properties ? (
            <div className="propertiesBox">
              <p className="subTitleComponent">Lo???i thu???c t??nh</p>
              <div className="propertiesCreateBox">
                <div
                  className="propertiesNewButton"
                  onClick={() => {
                    setPropertyType("radio");
                  }}
                >
                  <RadioButtonCheckedIcon
                    color="action"
                    fontSize="small"
                  ></RadioButtonCheckedIcon>
                  <p className="propertiesButtonTitle">Ch???n ????n</p>
                </div>
                <div
                  className="propertiesNewButton"
                  onClick={() => {
                    setPropertyType("checkBox");
                  }}
                >
                  <CheckBoxIcon color="action" fontSize="small"></CheckBoxIcon>
                  <p className="propertiesButtonTitle">Ch???n k??p</p>
                </div>
              </div>
              <p className="subTitleComponent">Chi ti???t</p>
              {propertyType !== "" ? (
                <>
                  {propertyType === "radio" ? (
                    <>
                      <div className="propertyRadioBox">
                        <TextField
                          label="T??n t??y ch???n ????n"
                          id="outlined-start-adornment"
                          sx={{ m: 1, width: "22ch" }}
                          onChange={(e) => {
                            propertyRadioTitleChangeValue(e);
                          }}
                          value={propertyRadioTitle}
                        />
                        <div className="propertyRadioElement">
                          <TextField
                            label="T??n thu???c t??nh"
                            id="outlined-start-adornment"
                            sx={{ m: 1, width: "25ch" }}
                            size="small"
                            onChange={(e) => {
                              propertyRadioElementChangeValue(e);
                            }}
                            value={propertyRadioInput}
                          />
                          <TextField
                            label="gi??"
                            id="outlined-start-adornment"
                            sx={{ m: 1, width: "10ch" }}
                            size="small"
                            onChange={(e) => {
                              propertyRadioElemnentPriceChangeValue(e);
                            }}
                            value={propertyRadioPriceInput}
                          />
                          {propertyRadioInput !== "" ? (
                            <AddBoxIcon
                              fontSize="large"
                              onClick={() => {
                                createRadioElement();
                              }}
                            ></AddBoxIcon>
                          ) : (
                            <AddBoxIcon
                              fontSize="large"
                              color="action"
                            ></AddBoxIcon>
                          )}
                        </div>
                        <p className="propertySubtitle">Danh s??ch thu???c t??nh</p>
                        <div className="propertyRadioList">
                          <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">
                              {propertyRadioTitle}
                            </FormLabel>
                            {propertyRadioList ? (
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue={propertyRadioList[0].name}
                                name="radio-buttons-group"
                              >
                                {propertyRadioList.map((el) => {
                                  return (
                                    <div className="radioListItem">
                                      <FormControlLabel
                                        value={el.name}
                                        control={<Radio size="small" />}
                                        label={el.name}
                                      />
                                      {el.price !== 0 ? (
                                        <p className="radioPriceText">
                                          ({el.price})
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  );
                                })}
                              </RadioGroup>
                            ) : (
                              ""
                            )}
                          </FormControl>
                        </div>
                      </div>
                      {propertyRadioTitle !== "" &&
                      propertyRadioList.length >= 2 ? (
                        <div
                          className="propertyCreateButton"
                          onClick={() => {
                            createRadioItem();
                          }}
                        >
                          T???o thu???c t??nh
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                  {propertyType === "checkBox" ? (
                    <div className="propertyRadioBox">
                      <div className="propertyRadioElement">
                        <TextField
                          label="T??n thu???c t??nh"
                          id="outlined-start-adornment"
                          sx={{ m: 1, width: "25ch" }}
                          size="small"
                          onChange={(e) => {
                            propertyCheckboxNameValue(e);
                          }}
                          value={propertyCheckboxName}
                        />
                        <TextField
                          label="gi??"
                          id="outlined-start-adornment"
                          sx={{ m: 1, width: "10ch" }}
                          size="small"
                          onChange={(e) => {
                            propertyCheckboxPriceValue(e);
                          }}
                          value={propertyCheckboxPrice}
                        />
                        {propertyCheckboxName !== "" ? (
                          <AddBoxIcon
                            fontSize="large"
                            onClick={() => {
                              createCheckboxElement();
                            }}
                          ></AddBoxIcon>
                        ) : (
                          <AddBoxIcon
                            fontSize="large"
                            color="action"
                          ></AddBoxIcon>
                        )}
                      </div>
                      <p className="propertySubtitle">Danh s??ch thu???c t??nh</p>
                      <div className="propertyRadioList">
                        <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">
                            Kh??c
                          </FormLabel>
                          {propertyCheckboxList ? (
                            <FormGroup>
                              {propertyCheckboxList.map((el) => {
                                return (
                                  <div className="radioListItem">
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label={el.name}
                                    />
                                    {el.price !== 0 ? (
                                      <p className="radioPriceText">
                                        ({el.price})
                                      </p>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                );
                              })}
                            </FormGroup>
                          ) : (
                            ""
                          )}
                        </FormControl>
                      </div>
                      {propertyCheckboxList.length >= 1 ? (
                        <div
                          className="propertyCreateButton"
                          onClick={() => {
                            createCheckboxItem();
                          }}
                        >
                          T???o thu???c t??nh
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="foodEditPreviewBox">
          <p className="subTitleComponent">Xem tr?????c</p>
          <RadioList radioList={radioList}></RadioList>
          <CheckboxList checkboxList={editFood.checkbox}></CheckboxList>
        </div>
      </div>
    </div>
  );
}
