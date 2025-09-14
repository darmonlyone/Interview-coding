import { AppService } from './app.service';
import * as cryptoUtil from './crypto/crypto.util';
import * as crypto from 'crypto';

describe('AppService', () => {
  let service: AppService;
  let privateKey: string;
  let publicKey: string;

  beforeAll(() => {
    const { publicKey: pub, privateKey: priv } = crypto.generateKeyPairSync(
      'rsa',
      {
        modulusLength: 2048,
      },
    );

    publicKey = pub.export({ type: 'pkcs1', format: 'pem' }).toString();
    privateKey = priv.export({ type: 'pkcs1', format: 'pem' }).toString();

    // mock getPublicKey / getPrivateKey so AppService uses these instead of reading from disk
    jest.spyOn(cryptoUtil, 'getPublicKey').mockReturnValue(publicKey);
    jest.spyOn(cryptoUtil, 'getPrivateKey').mockReturnValue(privateKey);

    service = new AppService();
  });

  describe('getEncryptData', () => {
    it('should return data1 and data2 as hex strings', () => {
      const result = service.getEncryptData('hello world');

      expect(result).toHaveProperty('data1');
      expect(result).toHaveProperty('data2');
      expect(result.data1).toMatch(/^[0-9a-f]+$/i);
      expect(result.data2).toMatch(/^[0-9a-f]+$/i);
    });
  });

  describe('getDecryptData', () => {
    it('should decrypt what getEncryptData encrypted', () => {
      const payload = 'Hello from unit test';
      const encrypted = service.getEncryptData(payload);

      const decrypted = service.getDecryptData(
        encrypted.data1,
        encrypted.data2,
      );

      expect(decrypted).toBe(payload);
    });

    it('should throw if data1 is corrupted', () => {
      const payload = 'test';
      const encrypted = service.getEncryptData(payload);

      const badData1 = encrypted.data1.slice(0, -4) + 'abcd';

      expect(() => service.getDecryptData(badData1, encrypted.data2)).toThrow();
    });

    it('should throw if data2 is corrupted', () => {
      const payload = 'test';
      const encrypted = service.getEncryptData(payload);

      const badData2 = encrypted.data2.slice(0, -4) + 'abcd';

      expect(() => service.getDecryptData(encrypted.data1, badData2)).toThrow();
    });
  });
});
