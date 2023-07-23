// Import necessary libraries and types
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import axios from "axios";

// Ensuring that cookies are sent with requests
axios.defaults.withCredentials = true;

// Types for custom error handling
interface CustomError {
  name: string;
  message: string;
  code: string;
}

// Interface for user state
interface UserState {
  data?: any;
  error?: CustomError | null;
}

// Initial state for user
const initialState: UserState = {};

// Thunk to get current user data
const me = createAsyncThunk("user/me", async () => {
  const response = await axios.get("http://localhost:8080/auth/me", {
    withCredentials: true,
  });
  if (!response.data) throw new Error("Error");
  return response.data;
});

// Thunk to sign up a new user
const signup = createAsyncThunk(
  "user/signup",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post("http://localhost:8080/auth/signup", {
      email,
      password,
    });
    if (!response.data) throw new Error("User not created");
    return response.data;
  }
);

// Thunk to log in a user
const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: { email: string; password: String }) => {
    const response = await axios.post("http://localhost:8080/auth/login", {
      email,
      password,
    });
    if (!response.data) throw new Error("Error");
    return response.data;
  }
);

// Thunk to log out a user
const logout = createAsyncThunk("user/logout", async () => {
  const response = await axios.post("http://localhost:8080/auth/logout");
  if (!response.data) throw new Error("Error");
  return response.data;
});

// User slice for Redux store
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fulfilled and rejected states for "me", "signup", "login", and "logout"
    builder
      .addCase(me.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(me.rejected, (state, { error }) => {
        state.error = (error as CustomError) || {
          name: "Request Failed",
          message: "Error",
          code: "500",
        };
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, { error }) => {
        state.error = (error as CustomError) || {
          name: "Request Failed",
          message: "Error",
          code: "500",
        };
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, { error }) => {
        state.error = (error as CustomError) || {
          name: "Request Failed",
          message: "Error",
          code: "500",
        };
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = {};
        state.error = null;
      })
      .addCase(logout.rejected, (state, { error }) => {
        state.error = (error as CustomError) || {
          name: "Request Failed",
          message: "Error",
          code: "500",
        };
      });
  },
});

// Export thunks, types, and reducer
export { login, signup, logout, me };
export type { UserState };

export default userSlice.reducer;
