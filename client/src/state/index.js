import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: "63701cc1f03239b7f700000e",
  user: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    logout: (state) => {
      state.user = null; // 
    },
    setUser: (state, action) => {
      state.user = action.payload; 
    },
  },
});

// Export actions
export const { setMode, logout, setUser } = globalSlice.actions;

// Export reducer
export default globalSlice.reducer;
