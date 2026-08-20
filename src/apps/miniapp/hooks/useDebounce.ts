import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // تنظیم یک تایمر برای آپدیت مقدار پس از گذشت delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // پاک کردن تایمر اگر قبل از اتمام زمان، مقدار دوباره تغییر کند
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
