import { createApi } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "@/types/artifact";
import { customBaseQuery } from "@/services/baseQuery";

export interface MindFile {
    id: string;
    ten: string;
    moTa: string | null;
    fileUrl: string;
  }

export const mindApi = createApi({
  reducerPath: "mindApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Mind"],
  endpoints: (builder) => ({
    getMindFiles: builder.query<MindFile[], void>({
      query: () => ({
        url: "/gwdevv5/csdldisan/v5/FileAR/GetFileARList",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<MindFile[]>) => {
        if (response.success) return response.data;
        throw new Error(response.error || "Failed to fetch Mind Files");
      },
      providesTags: ["Mind"],
    }),
  }),
});

export const {
  useGetMindFilesQuery,
} = mindApi;
