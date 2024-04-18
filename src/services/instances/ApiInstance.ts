import { Maybe } from '@/types/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiInstance {
  private baseURL: string;
  private axiosInstance: AxiosInstance;

  constructor(baseURL: Maybe<string>) {
    if (!!baseURL) {
      this.baseURL = baseURL;
      this.axiosInstance = axios.create({ baseURL });
    } else {
      throw new Error(`Base URL is not defined, got: '${baseURL}'`);
    }
  }
  public setInterceptor(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        return config;
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Do something with response data
        return response;
      },
      (error: AxiosError) => {
        // Do something with response error
        if (error.response && error.response.status === 401) {
          // Handle unauthorized error
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(path: string): Promise<T> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(path);
      return response.data;
    } catch (error) {
      console.error(`Error during GET request to ${this.baseURL}${path}:`, error);
      throw error;
    }
  }

  public async post<T>(path: string, payload: T): Promise<void> {
    try {
      await this.axiosInstance.post(path, payload);
    } catch (error) {
      console.error(`Error during POST request to ${this.baseURL}${path}:`, error);
      throw error;
    }
  }

  public async put<T>(path: string, payload: T): Promise<void> {
    try {
      await this.axiosInstance.put(path, payload);
    } catch (error) {
      console.error(`Error during PUT request to ${this.baseURL}${path}:`, error);
      throw error;
    }
  }

  public async patch<T>(path: string, payload: Partial<T>): Promise<void> {
    try {
      await this.axiosInstance.patch(path, payload);
    } catch (error) {
      console.error(`Error during PATCH request to ${this.baseURL}${path}:`, error);
      throw error;
    }
  }

  public async delete<T>(path: string): Promise<void> {
    try {
      await this.axiosInstance.delete(path);
    } catch (error) {
      console.error(`Error during DELETE request to ${this.baseURL}${path}:`, error);
      throw error;
    }
  }
}

export default ApiInstance;