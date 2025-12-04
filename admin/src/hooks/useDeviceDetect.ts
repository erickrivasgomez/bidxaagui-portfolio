import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  userAgent: string;
}

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,
    userAgent: '',
  });

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || '';

    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(userAgent);
    const isWindows = /windows/i.test(userAgent);
    const isMacOS = /macintosh|mac os x/i.test(userAgent) && !isIOS;
    const isLinux = /linux/i.test(userAgent) && !isAndroid;

    const isMobile = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent.toLowerCase());

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      isIOS,
      isAndroid,
      isWindows,
      isMacOS,
      isLinux,
      userAgent,
    });
  }, []);

  return deviceInfo;
};
