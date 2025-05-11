import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import {authApi} from "../features/api/authApi"; // Import the authApi slice
import {courseApi} from "../features/api/courseApi"; // Import the courseApi slice
import {purchaseApi} from "../features/api/purchaseApi"; // Import the purchaseApi slice
import {courseProgressApi} from "../features/api/courseProgressApi"; // Import the courseProgressApi slice


export const appStore = configureStore({
  reducer: rootReducer, // Use the combined reducer
  middleware: (defaultMiddleware) => defaultMiddleware().concat(authApi.middleware,courseApi.middleware,purchaseApi.middleware,courseProgressApi.middleware), // Add any additional middleware if needed
});

const initializeApp = async ()=>{
await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));// Force refetch the user data
}

initializeApp();