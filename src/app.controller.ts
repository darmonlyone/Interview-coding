import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';

import type { ApiResponse, DecryptResponse, EncryptData } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('get-encrypt-data')
  @ApiBody({ type: EncryptDataDto })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns encrypted data as data1 & data2',
    schema: {
      example: {
        successful: true,
        error_code: '',
        data: {
          data1: 'abc123...',
          data2: 'xyz456...',
        },
      },
    },
  })
  getEncryptData(@Body() body: EncryptDataDto): ApiResponse<EncryptData> {
    try {
      return {
        successful: true,
        error_code: '',
        data: this.appService.getEncryptData(body.payload),
      };
    } catch {
      return {
        successful: false,
        error_code: 'ENCRYPTION_FAILED',
        data: null,
      };
    }
  }

  @Post('get-decrypt-data')
  @ApiBody({ type: DecryptDataDto })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Returns decrypted payload',
    schema: {
      example: {
        successful: true,
        error_code: '',
        data: {
          payload: 'Decrypted string here',
        },
      },
    },
  })
  getDecryptData(@Body() body: DecryptDataDto): ApiResponse<DecryptResponse> {
    try {
      return {
        successful: true,
        error_code: '',
        data: {
          payload: this.appService.getDecryptData(body.data1, body.data2),
        },
      };
    } catch {
      return {
        successful: false,
        error_code: 'DECRYPTION_FAILED',
        data: null,
      };
    }
  }
}
