declare namespace Supabase {
  interface PostgrestResponse<T> {
    data: T | null;
    error: PostgrestError | null;
    count?: number;
    status: number;
    statusText: string;
  }
  
  interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {
    data: T | null;
  }
  
  interface PostgrestMaybeSingleResponse<T> extends PostgrestResponse<T> {
    data: T | null;
  }
  
  interface PostgrestError {
    message: string;
    details: string;
    hint: string;
    code: string;
  }
}

declare module '@supabase/supabase-js' {
  interface PostgrestFilterBuilder<T> {
    select<U extends keyof T = keyof T>(
      columns?: string,
      options?: { count?: null | 'exact' | 'planned' | 'estimated' }
    ): PostgrestTransformBuilder<T>;
    insert<U extends object>(
      values: U,
      options?: { count?: null | 'exact' | 'planned' | 'estimated' }
    ): PostgrestFilterBuilder<T>;
    update<U extends object>(
      values: U,
      options?: { count?: null | 'exact' | 'planned' | 'estimated' }
    ): PostgrestFilterBuilder<T>;
  }
}