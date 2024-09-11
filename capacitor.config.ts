import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sopra.maya',
  appName: 'MAYA - AI ChatBot for Business',
  webDir: 'dist',
	plugins: {
    SplashScreen: {
      launchShowDuration: 0
    },
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
