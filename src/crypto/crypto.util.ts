import * as fs from 'fs';
import * as path from 'path';

export function getPublicKey(): string {
  return fs.readFileSync(
    path.resolve(__dirname, '..', './keys/public.pem'),
    'utf8',
  );
}

export function getPrivateKey(): string {
  return fs.readFileSync(
    path.resolve(__dirname, '..', './keys/private.pem'),
    'utf8',
  );
}
