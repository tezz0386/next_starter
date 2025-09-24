import { createSlice, PayloadAction, createAsyncThunk, Slice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface AuthenticationUserInterface {
  is_auth: boolean;
  user: object;
  email: string | null;
  password: string | null;
  loading?: boolean; 
  error?: string | null; 
}

const initialState: AuthenticationUserInterface = {
  is_auth: false,
  user: {},
  email: null,
  password: null,
  loading: false,
  error: null,
};

// Define the payload for login
interface LoginPayload {
  email: string;
  password: string;
}

interface ApiError {
  message: string;
}


// Create an async thunk for login
const login = createAsyncThunk(
  "authentication/login",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      // Example: Make an API call to authenticate the user
      const response = await axios.post("https://your-api-endpoint/login", {
        email,
        password,
      });

      // Assuming the API returns { user, token } on success
      return {
        is_auth: true,
        user: response.data.user,
        email,
        password,
      };
    } catch (error) {
     const err = error as AxiosError<ApiError>;
      // Check if the error is an Axios error and extract the message
      if (err.response) {
        return rejectWithValue(err.response.data?.message || "Login failed");
      }
      // Handle non-Axios errors (e.g., network issues)
      return rejectWithValue("An unexpected error occurred");
    }
  }
);



const authenticationSlice: Slice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthenticationUserInterface>) => {
      state.is_auth = action.payload.is_auth;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<AuthenticationUserInterface>) => {
      state.loading = false;
      state.is_auth = action.payload.is_auth;
      state.user = action.payload.user;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setAuth } = authenticationSlice.actions;
export default authenticationSlice.reducer;
export {login};