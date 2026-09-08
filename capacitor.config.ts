import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phobdan.app',
  appName: 'พบด่าน',
  webDir: 'public',
  server: {
    url: 'https://phobdan.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
