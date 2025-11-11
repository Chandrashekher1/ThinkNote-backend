declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    MONGO_URI: string;
  }
}

declare namespace Express {
  export interface Request {
    userId?: string;
  }
}