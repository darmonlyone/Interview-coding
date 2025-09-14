import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EncryptDataDto } from './dto/encrypt-data.dto';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getEncryptData: jest.fn(),
            getDecryptData: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getEncryptData', () => {
    it('should return successful response with data from service', () => {
      const dto: EncryptDataDto = { payload: 'test-payload' };
      const mockResult = { data1: 'abc123', data2: 'xyz456' };

      jest.spyOn(appService, 'getEncryptData').mockReturnValue(mockResult);

      const result = appController.getEncryptData(dto);

      expect(appService.getEncryptData).toHaveBeenCalledWith('test-payload');
      expect(result).toEqual({
        successful: true,
        error_code: '',
        data: mockResult,
      });
    });

    it('should return error response if service throws', () => {
      const dto: EncryptDataDto = { payload: 'test-payload' };

      jest.spyOn(appService, 'getEncryptData').mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      const result = appController.getEncryptData(dto);

      expect(result).toEqual({
        successful: false,
        error_code: 'ENCRYPTION_FAILED',
        data: null,
      });
    });
  });

  describe('getDecryptData', () => {
    it('should return successful response with decrypted payload', () => {
      const dto: DecryptDataDto = { data1: 'abc123', data2: 'xyz456' };
      jest
        .spyOn(appService, 'getDecryptData')
        .mockReturnValue('decrypted-text');

      const result = appController.getDecryptData(dto);

      expect(appService.getDecryptData).toHaveBeenCalledWith(
        'abc123',
        'xyz456',
      );
      expect(result).toEqual({
        successful: true,
        error_code: '',
        data: { payload: 'decrypted-text' },
      });
    });

    it('should return error response if service throws', () => {
      const dto: DecryptDataDto = { data1: 'abc123', data2: 'xyz456' };
      jest.spyOn(appService, 'getDecryptData').mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      const result = appController.getDecryptData(dto);

      expect(result).toEqual({
        successful: false,
        error_code: 'DECRYPTION_FAILED',
        data: null,
      });
    });
  });

  // Test validation
  describe('EncryptDataDto validation', () => {
    it('should pass validation with valid payload', async () => {
      const dto = plainToInstance(EncryptDataDto, { payload: 'valid string' });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when payload is empty', async () => {
      const dto = plainToInstance(EncryptDataDto, { payload: '' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation when payload is not string', async () => {
      const dto = plainToInstance(EncryptDataDto, { payload: 12345 as any });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isString).toBeDefined();
    });
  });

  describe('DecryptDataDto validation', () => {
    it('should pass validation with valid data1 and data2', async () => {
      const dto = plainToInstance(DecryptDataDto, {
        data1: 'abc',
        data2: 'xyz',
      });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation when data1 is missing', async () => {
      const dto = plainToInstance(DecryptDataDto, { data2: 'xyz' });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('data1');
    });

    it('should fail validation when data2 is not string', async () => {
      const dto = plainToInstance(DecryptDataDto, {
        data1: 'abc',
        data2: 123 as any,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('data2');
    });
  });
});
