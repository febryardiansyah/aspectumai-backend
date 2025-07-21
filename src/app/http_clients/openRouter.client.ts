import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import env from "../../config/env";

class OpenRouterClient {
  private client: AxiosInstance;
  private baseURL: string = "https://openrouter.ai/api/v1/chat/completions";

  constructor(
    baseURL: string = "https://openrouter.ai/api/v1/chat/completions",
    config?: AxiosRequestConfig
  ) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://slm-store.vercel.app/",
        "X-Title": "SLM Store",
      },
      ...config,
    });
  }

  public async get<T = any>(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(this.baseURL, config);
  }

  public async post<T = any>(
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    if (!data.model) {
      data.model = "openai/gpt-4o-mini";
    }

    return this.client.post<T>(this.baseURL, data, config);
  }

  public async put<T = any>(
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(this.baseURL, data, config);
  }

  public async delete<T = any>(
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(this.baseURL, config);
  }
}

export default OpenRouterClient;
