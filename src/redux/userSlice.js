import { createSlice } from "@reduxjs/toolkit";

// Starting state of a user
const initialState = {
  user: null,
  isLoading: true,
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUsername: (state, action) => {
      state.user.username = action.payload;
    },
    setProfilePicture: (state, action) => {
      state.user.photoURL = action.payload;
    },
    setBalance: (state, action) => {
      state.user.balance = action.payload;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  setLoading,
  setUsername,
  setProfilePicture,
  setBalance,
} = userSlice.actions;
