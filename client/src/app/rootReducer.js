import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice"; // Import the auth reducer
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer, // Add the authApi reducer to the root reducer
    auth: authReducer, // Add the auth reducer to the root reducer
    // Add other reducers here as needed
    [courseApi.reducerPath]: courseApi.reducer, // Add the courseApi reducer to the root reducer
    auth: authReducer, // Add the auth reducer to the root reducer
});
export default rootReducer; // Export the combined reducer