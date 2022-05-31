import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: "List",
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigation: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setNavigation } = navigationSlice.actions;

export default navigationSlice.reducer;
