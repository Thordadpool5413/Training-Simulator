import Constants from 'expo-constants';

export const BACKEND_URL: string =
  (Constants.expoConfig?.extra?.backendUrl as string | undefined) ?? 'http://localhost:3000';

export const CLIENT_ID = 'client_hospice_simulator';
