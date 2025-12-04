import { useState, useEffect } from 'react';

interface CookieOptions {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export const useCookie = (
  cookieName: string
): [string | null, (value: string, options?: CookieOptions) => void, () => void] => {
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const setCookie = (value: string, options: CookieOptions = {}) => {
    let cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(
      value
    )}`;

    if (options.expires) {
      if (typeof options.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else if (options.expires instanceof Date) {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires}`;
      }
    }

    if (options.path) cookieString += `; path=${options.path}`;
    if (options.domain) cookieString += `; domain=${options.domain}`;
    if (options.secure) cookieString += '; secure';
    if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

    document.cookie = cookieString;
    setCookieValue(value);
  };

  const deleteCookie = () => {
    document.cookie = `${encodeURIComponent(cookieName)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    setCookieValue(null);
  };

  useEffect(() => {
    const value = getCookie(cookieName);
    setCookieValue(value);
  }, [cookieName]);

  return [cookieValue, setCookie, deleteCookie];
};
