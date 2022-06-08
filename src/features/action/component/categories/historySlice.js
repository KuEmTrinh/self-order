import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
}

export const historySlice = createSlice({
    name: "history",
    initialState,
    reducers:{

    }
});

export default historySlice.actions;