// See https://authjs.dev/getting-started/typescript?frameworks=core#module-augmentation

import type { Session as OGSession, DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  // user 에 id 속성 추가 (interface 확장)
  interface Session extends OGSession {
    user?: {
      id: string;
    } & DefaultSession['user'];
  }
}

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: Session;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
