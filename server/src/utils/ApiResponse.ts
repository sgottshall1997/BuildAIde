export class ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;

  constructor(data: T, message?: string) {
    this.success = true;
    this.data = data;
    if (message) this.message = message;
  }
}
