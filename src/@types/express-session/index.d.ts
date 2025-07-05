import 'express-session';

declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
    flash?: {
      type: string;
      message: string;
      old?: any;
    };
  }
}
