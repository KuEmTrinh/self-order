import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  specialData: [],
  total: "",
  totalCount: 0,
};

export const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    addFoodToCart: (state, action) => {
      const item = JSON.parse(action.payload);
      if (item.properties) {
        state.specialData.push(item);
        console.log(item);
      } else {
        console.log(item);
        item.count = 1;
        state.data.push(item);
        state.totalCount = state.data.length;
      }
    },
    deleteFoodCart: (state, action) => {
      const idItemCart = action.payload;
      const result = state.data.filter((item) => {
        return item.id !== idItemCart;
      });
      state.data = result;
      state.totalCount = state.data.length;
    },
    plusFoodCart: (state, action) => {
      const idItemCart = action.payload;
      const findItemCart = state.data.find((item) => {
        return item.id === idItemCart;
      });
      state.data.push(findItemCart);
      state.totalCount = state.data.length;
    },
    minusFoodCart: (state, action) => {
      const idItemCart = action.payload;
      let sliceIndex = null;
      for (let i = 0; i < state.data.length; i++) {
        if (state.data[i].id === idItemCart) {
          sliceIndex = i;
          break;
        }
      }
      state.data.splice(sliceIndex, 1);
      state.totalCount = state.data.length;
    },
    minusSpecialFood: (state, action) => {
      state.specialData[action.payload].countNumber -= 1;
      state.specialData[action.payload].total -=
        state.specialData[action.payload].basePrice;
    },
    plusSpecialFood: (state, action) => {
      state.specialData[action.payload].countNumber += 1;
      state.specialData[action.payload].total +=
        parseInt(state.specialData[action.payload].basePrice);
    },
    deleteSpecialFood: (state, action) => {
      state.specialData.splice(action.payload, 1);
    },
    setTotalCart: (state, action) => {
      state.total = action.payload;
    },
    clearCart: (state) => {
      state.data = [];
      state.specialData = [];
    },
  },
});

export const {
  addFoodToCart,
  deleteFoodCart,
  plusFoodCart,
  minusFoodCart,
  setTotalCart,
  clearCart,
  minusSpecialFood,
  plusSpecialFood,
  deleteSpecialFood
} = foodSlice.actions;

export default foodSlice.reducer;
