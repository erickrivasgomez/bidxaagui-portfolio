import { useState, useEffect } from 'react';

interface Position {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [position, setPosition] = useState<Position>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const successHandler = (pos: GeolocationPosition) => {
    setPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      timestamp: pos.timestamp,
    });
    setIsLoading(false);
  };

  const errorHandler = (err: GeolocationPositionError) => {
    setError(err.message);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, options);
  }, [options]);

  return { position, error, isLoading };
};
