import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CampaignDraftState = {
  campaignName: string;
  websiteUrl: string;
  okayimageUrl: string;
  offer: string;
  price: string;
};

const initialState: CampaignDraftState = {
  campaignName: "",
  websiteUrl: "",
  okayimageUrl: "",
  offer: "",
  price: "",
};

const campaignSlice = createSlice({
  name: "campaignDraft",
  initialState,
  reducers: {
    setCampaignName(state, action: PayloadAction<string>) {
      state.campaignName = action.payload;
    },
    setWebsiteUrl(state, action: PayloadAction<string>) {
      state.websiteUrl = action.payload;
    },
    setOkayimageUrl(state, action: PayloadAction<string>) {
      state.okayimageUrl = action.payload;
    },
    setOffer(state, action: PayloadAction<string>) {
      state.offer = action.payload;
    },
    setPrice(state, action: PayloadAction<string>) {
      state.price = action.payload;
    },
    resetCampaignDraft() {
      return { ...initialState };
    },
  },
});

export const {
  setCampaignName,
  setWebsiteUrl,
  setOkayimageUrl,
  setOffer,
  setPrice,
  resetCampaignDraft,
} = campaignSlice.actions;

export default campaignSlice.reducer;
