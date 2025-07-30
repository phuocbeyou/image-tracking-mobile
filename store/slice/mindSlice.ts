import { MindFile } from './../api/mindApi';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MindState {
  files: MindFile[];
  selectedFile: MindFile | null;
}

const initialState: MindState = {
  files: [],
  selectedFile: null,
};

const mindSlice = createSlice({
  name: "mind",
  initialState,
  reducers: {
    setFiles(state, action: PayloadAction<MindFile[]>) {
      state.files = action.payload;
    },
    selectFile(state, action: PayloadAction<MindFile>) {
      state.selectedFile = action.payload;
    },
    clearSelectedFile(state) {
      state.selectedFile = null;
    },
  },
});

export const { setFiles, selectFile, clearSelectedFile } = mindSlice.actions;

export default mindSlice.reducer;
