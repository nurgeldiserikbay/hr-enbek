import { z } from 'zod';

export const NCA_LAYER_URL = 'wss://127.0.0.1:13579/';
const RESPONSE_TIMEOUT_MS = 120_000;
const CANCELLED_MESSAGE = 'action.canceled';

export const KEY_STORAGES = ['PKCS12', 'AKKaztokenStore', 'AKKZIDCardStore', 'JKS'] as const;
export type KeyStorage = (typeof KEY_STORAGES)[number];

export type NcaLayerFailure = 'unavailable' | 'cancelled' | 'timeout' | 'rejected';

export class NcaLayerError extends Error {
  readonly reason: NcaLayerFailure;

  constructor(reason: NcaLayerFailure, message = '') {
    super(message);
    this.name = 'NcaLayerError';
    this.reason = reason;
  }
}

const versionMessageSchema = z.object({ result: z.object({ version: z.string() }) });

const signatureResponseSchema = z.object({
  code: z.union([z.string(), z.number()]).transform(String),
  message: z.string().optional(),
  responseObject: z.string().optional(),
});

interface NcaLayerRequest {
  module: string;
  method: string;
  args: unknown[];
}

const callNcaLayer = (request: NcaLayerRequest) =>
  new Promise<unknown>((resolve, reject) => {
    const socket = new WebSocket(NCA_LAYER_URL);
    const timer = setTimeout(() => {
      socket.close();
      reject(new NcaLayerError('timeout'));
    }, RESPONSE_TIMEOUT_MS);

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(request));
    });
    socket.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new NcaLayerError('unavailable'));
    });
    socket.addEventListener('message', (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as unknown;
      if (versionMessageSchema.safeParse(data).success) return;
      clearTimeout(timer);
      socket.close();
      resolve(data);
    });
  });

export async function signWithNcaLayer(dataToSignBase64: string, storage: KeyStorage): Promise<string> {
  const response = signatureResponseSchema.parse(
    await callNcaLayer({
      module: 'kz.gov.pki.knca.commonUtils',
      method: 'createCMSSignatureFromBase64',
      args: [storage, 'AUTHENTICATION', dataToSignBase64, true],
    }),
  );
  if (response.code === '200' && response.responseObject !== undefined) {
    return response.responseObject.replaceAll(/\s+/gu, '');
  }
  if (response.message === CANCELLED_MESSAGE) throw new NcaLayerError('cancelled');
  throw new NcaLayerError('rejected', response.message ?? '');
}
