export interface ApiResponse<T = unknown> {
  success: boolean;
  body?: T;
  message: string;
}
