import { Injectable } from '@nestjs/common';
import { EncryptData } from './types';

import * as crypto from 'crypto';
import { getPublicKey, getPrivateKey } from './crypto/crypto.util';

@Injectable()
export class AppService {
  private readonly publicKey = getPublicKey();
  private readonly privateKey = getPrivateKey();

  // get-encrypt-data
  getEncryptData(payload: string): EncryptData {
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedData = cipher.update(payload, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // privateEncrypt use RSA_PKCS1_PADDING as padding
    const encryptedKey = crypto.privateEncrypt(this.privateKey, aesKey);

    console.log('iv encrypt', iv.toString('hex'));
    return {
      data1: encryptedKey.toString('hex'),
      data2: iv.toString('hex') + encryptedData,
    };
  }

  // get-decrypt-data
  getDecryptData(data1: string, data2: string): string {
    const aesKey = crypto.publicDecrypt(
      { key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(data1, 'hex'),
    );

    console.log('data2', data2);

    const data2Buf = Buffer.from(data2, 'hex');

    const iv = data2Buf.subarray(0, 16);
    const encryptText = data2Buf.subarray(16);
    console.log('data2Buf', data2Buf.toString('hex'));

    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);

    console.log('here', encryptText.toString('hex'));

    let decrypted = decipher.update(encryptText.toString('hex'), 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    console.log('decrypted', decrypted);

    return decrypted;
  }
}
