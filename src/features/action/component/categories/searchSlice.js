import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  searching: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setFoodData: (state, action) => {
      state.data = action.payload;
    },
    setSearching: (state, action) => {
      state.searching = action.payload;
    },
    removeSearchingData: (state, action) => {
      state.searching = false;
    },
  },
});

export const { setFoodData, setSearching, removeSearchingData } =
  searchSlice.actions;

export default searchSlice.reducer;
