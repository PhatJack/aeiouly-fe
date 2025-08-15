import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";
import { refreshTokenApi } from "@/service/(auth)/refresh-token.api";
const client = axios.create({
  baseURL: process.env.DJANGO_SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = {
  post: <TResponse = unknown, RRequest = unknown>(
    url: string,
    data: RRequest,
    config?: AxiosRequestConfig<RRequest>
  ): Promise<AxiosResponse<TResponse, RRequest>> => {
    const res = client.post<TResponse, AxiosResponse<TResponse>, RRequest>(
      url,
      data,
      config
    );
    return res;
  },

  get: <TResponse = unknown, TQueryParams = unknown>(
    url: string,
    params?: TQueryParams,
    config?: AxiosRequestConfig<TQueryParams>
  ): Promise<AxiosResponse<TResponse, TQueryParams>> => {
    return client.get<TResponse, AxiosResponse<TResponse, TQueryParams>>(url, {
      params,
      ...config,
    });
  },

  put: <TResponse = unknown, RRequest = unknown>(
    url: string,
    data: RRequest,
    config?: AxiosRequestConfig<RRequest>
  ): Promise<AxiosResponse<TResponse, RRequest>> => {
    return client.put<TResponse, AxiosResponse<TResponse>, RRequest>(
      url,
      data,
      config
    );
  },
  patch: <TResponse = unknown, RRequest = unknown>(
    url: string,
    data: RRequest,
    config?: AxiosRequestConfig<RRequest>
  ): Promise<AxiosResponse<TResponse, RRequest>> => {
    return client.patch<TResponse, AxiosResponse<TResponse>, RRequest>(
      url,
      data,
      config
    );
  },
  delete: <TResponse = unknown, RRequest = unknown>(
    url: string,
    config?: AxiosRequestConfig<RRequest>
  ): Promise<AxiosResponse<TResponse, RRequest>> => {
    return client.delete<TResponse, AxiosResponse<TResponse>, RRequest>(
      url,
      config
    );
  },
};

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;
    if (
      error.response?.data?.code === "token_not_valid" &&
      !originalRequest?._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshTokenApi();
        return client(originalRequest);
      } catch (error) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    if (isAxiosError(error)) {
      // console.log(error)
      if (error.code === "ERR_NETWORK") {
        throw {
          type: "NetworkError",
          message: "Failed to connect to the server",
        };
      }
      throw error.response?.data;
    }
    throw {
      type: "UnknownError",
      message: "An unknown error occurred",
    };
  }
);
