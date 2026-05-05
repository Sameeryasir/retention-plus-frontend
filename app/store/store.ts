import { configureStore } from "@reduxjs/toolkit";
import campaignDraftReducer from "./campaignSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      campaignDraft: campaignDraftReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
