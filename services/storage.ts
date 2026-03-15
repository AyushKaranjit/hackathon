import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FullVerificationResult } from './api';

const VERIFICATIONS_KEY = '@nagarik_verifications';

export async function saveVerification(result: FullVerificationResult): Promise<void> {
  const existing = await getStoredVerifications();
  existing.unshift(result);
  // Keep only the latest 50 verifications
  const trimmed = existing.slice(0, 50);
  await AsyncStorage.setItem(VERIFICATIONS_KEY, JSON.stringify(trimmed));
}

export async function getStoredVerifications(): Promise<FullVerificationResult[]> {
  const data = await AsyncStorage.getItem(VERIFICATIONS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export async function clearVerifications(): Promise<void> {
  await AsyncStorage.removeItem(VERIFICATIONS_KEY);
}
