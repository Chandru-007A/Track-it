import { DatabaseSchema } from '@/types/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Use in-memory storage when rendering on server (web SSR) to avoid "window is not defined"
const isServer = typeof window === 'undefined';
const ssrMemoryStorage = {
  getItem: async (_key: string) => null as string | null,
  setItem: async (_key: string, _value: string) => {},
  removeItem: async (_key: string) => {},
};

export const supabase = createClient<DatabaseSchema>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: isServer ? (ssrMemoryStorage as any) : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  }
);

// Database table names
export const TABLES = {
  TRACK_FITTINGS: 'track_fittings',
  INSPECTIONS: 'inspections',
  VENDORS: 'vendors',
  QR_CODES: 'qr_codes',
  USERS: 'users',
  PERFORMANCE_ANALYTICS: 'performance_analytics',
} as const;
