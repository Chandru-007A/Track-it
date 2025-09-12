// Silence TypeScript module resolution errors for Deno remote imports in local editors.
declare module 'https://esm.sh/@supabase/supabase-js@2';
declare module 'https://esm.sh/*';

// Provide a minimal Deno type so editors stop erroring locally.
// The real global is available at runtime in Supabase Edge Functions.
declare const Deno: {
  env: { get(name: string): string | undefined };
};


