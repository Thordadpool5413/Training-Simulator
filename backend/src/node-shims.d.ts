declare const process: {
  env: Record<string, string | undefined>;
  exit(code?: number): never;
};

declare const Buffer: {
  alloc(size: number): any;
  from(value: string | number[] | ArrayBuffer, encoding?: string): any;
  concat(list: any[]): any;
  isBuffer(value: unknown): boolean;
  byteLength(value: string, encoding?: string): number;
};

declare module 'node:http' {
  export const createServer: any;
}
