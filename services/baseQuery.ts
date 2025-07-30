// services/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "@/store/store";
import { base_url } from "@/configs/url-config";

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const baseUrl = `${base_url}`;
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const result = await rawBaseQuery(args, api, extraOptions);
  console.log("Base query result:", result);
  // Optional: tự động logout nếu token hết hạn (401)
  if (result.error && result.error.status === 401) {
    // api.dispatch(logout());
  }

  return result;
};
