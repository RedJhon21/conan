import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.499490ea3a8c498a954415207375a69e',
  appName: 'conan-saudi-fraud-guard',
  webDir: 'dist',
  server: {
    url: 'https://499490ea-3a8c-498a-9544-15207375a69e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;