import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  successful: boolean;
  error_code: string;
  data: T | null;
}

export interface EncryptData {
  data1: string;
  data2: string;
}

export interface DecryptResponse {
  payload: string;
}
