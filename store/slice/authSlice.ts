// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  access_token: string | null
  expires_in: number | null
  token_type: string | null
  scope: string | null
}

const initialState: AuthState = {
  access_token: null,
  expires_in: null,
  token_type: null,
  scope: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<AuthState>) {
      state.access_token = action.payload.access_token
      state.expires_in = action.payload.expires_in
      state.token_type = action.payload.token_type
      state.scope = action.payload.scope
    },
    clearAuthData(state) {
      state.access_token = null
      state.expires_in = null
      state.token_type = null
      state.scope = null
    },
  },
})

export const { setAuthData, clearAuthData } = authSlice.actions
export default authSlice.reducer
