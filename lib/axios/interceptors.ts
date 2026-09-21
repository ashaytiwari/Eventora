import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { handleUnauthorized } from "./utilities";

export const requestHandler = (request: InternalAxiosRequestConfig) => {
  return request;
}

export const responseHandler = (response: AxiosResponse) => {
  return response;
}

export const errorHandler = async (error: AxiosError) => {

  if (error.code === "ERR_NETWORK") {
    alert("Network Error. Your request can't be processed.");
    return Promise.reject(error);
  }

  const _error: any = error.response;

  if (!_error) {
    return Promise.reject(error);
  }

  if (_error.status === 401 || _error.data?.statusCode === 401) {
    await handleUnauthorized();
    return Promise.reject(error);
  }

  return Promise.reject(error);

};