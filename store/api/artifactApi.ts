import { createApi } from "@reduxjs/toolkit/query/react";
import type { ArtifactItem, ApiResponse, FilterRequest } from "@/types/artifact";
import { customBaseQuery } from "@/services/baseQuery";

export const artifactApi = createApi({
  reducerPath: "artifactApi",
  baseQuery: customBaseQuery,
  tagTypes: ["Artifact"],
  endpoints: (builder) => ({
    getArtifacts: builder.query<ArtifactItem[], void>({
      query: () => "/gwdevv5/csdldisan/v5/HienVat3D/GetHienVat3DList",
      transformResponse: (response: ApiResponse<ArtifactItem[]>) => {
        if (response.success) return response.data;
        throw new Error(response.error || "Failed to fetch artifacts");
      },
      providesTags: ["Artifact"],
    }),

    getArtifactById: builder.query<ArtifactItem, string>({
      query: (id) => `/gwdevv5/csdldisan/v5/HienVat3D/GetHienVat3DById/${id}`,
      transformResponse: (response: ApiResponse<ArtifactItem>) => {
        if (response.success) return response.data;
        throw new Error(response.error || "Failed to fetch artifact");
      },
      providesTags: (result, error, id) => [{ type: "Artifact", id }],
    }),

    searchArtifacts: builder.query<ArtifactItem[], string>({
      query: (searchTerm) => `/gwdevv5/csdldisan/v5/HienVat3D/SearchHienVat3D?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response: ApiResponse<ArtifactItem[]>) =>
        response.success ? response.data : [],
    }),

    filterArtifacts: builder.query<ArtifactItem[], FilterRequest>({
      query: (body) => ({
        url: "/gwdevv5/csdldisan/v5/HienVat3D/GetData/FilterByHienVat",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ArtifactItem[]>) => {
        if (response.success) return response.data;
        throw new Error(response.error || "Failed to filter artifacts");
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const idFilter = queryArgs.filters?.find((f) => f.field === "id");
        return idFilter?.value ? `id-${idFilter.value}` : JSON.stringify(queryArgs);
      },
    }),
  }),
});

export const {
  useGetArtifactsQuery,
  useGetArtifactByIdQuery,
  useSearchArtifactsQuery,
  useFilterArtifactsQuery,
} = artifactApi;
