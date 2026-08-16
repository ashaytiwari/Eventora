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
    return alert("Network Error. Your request can't be processed.");
  }

  const _error: any = error.response;

  if (!_error) {
    return error;
  }

  console.log(_error);

  if (_error.data.statusCode === 401) {
    await handleUnauthorized();
    return _error;
  }

  if (_error.data.statusCode !== 500) {
    return _error;
  }

  throw new Error(`Something went wrong. Internal server error: ${_error}`);

};