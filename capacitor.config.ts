import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'top.lookupy.app',
  appName: 'Lookupy',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
