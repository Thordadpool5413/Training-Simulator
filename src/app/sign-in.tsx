import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PremiumPill, PremiumScreen } from '@/components/premium-ui';
import { Radius, SimulatorColors } from '@/constants/theme';
import { resetPassword, signIn } from '@/services/authService';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  async function handleSignIn() {
    if (!canSubmit) return;
    setLoading(true);
    const { error } = await signIn(email.trim().toLowerCase(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error);
      return;
    }

    router.replace('/' as Href);
  }

  async function handleForgotPassword() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Alert.alert('Enter your email first', 'Type your email address above, then tap Forgot Password.');
      return;
    }
    const { error } = await resetPassword(trimmed);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setResetSent(true);
    }
  }

  return (
    <PremiumScreen
      eyebrow="Secure Access"
      title="Welcome back"
      subtitle="Sign in to sync your hospice training progress across devices."
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/welcome' as Href))}
      backLabel="Back"
      headerRight={<PremiumPill label="Supabase" tone="success" />}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          {resetSent && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                Password reset email sent. Check your inbox.
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@hospital.org"
                placeholderTextColor={SimulatorColors.textPlaceholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                accessibilityLabel="Email address"
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => { void handleForgotPassword(); }}>
                  <Text style={styles.forgotLink}>Forgot password?</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={SimulatorColors.textPlaceholder}
                secureTextEntry
                textContentType="password"
                autoComplete="current-password"
                accessibilityLabel="Password"
                onSubmitEditing={() => { void handleSignIn(); }}
                returnKeyType="go"
              />
            </View>

            <Pressable
              style={[styles.submitButton, (!canSubmit || loading) && styles.submitButtonDisabled]}
              accessibilityRole="button"
              onPress={() => { void handleSignIn(); }}
              disabled={!canSubmit || loading}>
              {loading ? (
                <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
              ) : (
                <Text style={styles.submitButtonText}>Sign In</Text>
              )}
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/sign-up' as Href)}>
              <Text style={styles.footerLink}>Start free trial</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  backLinkText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: 24,
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
  },
  successBanner: {
    backgroundColor: SimulatorColors.greenBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.greenBorder,
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 16,
  },
  successBannerText: {
    fontSize: 13,
    color: SimulatorColors.greenText,
    lineHeight: 19,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textBody,
  },
  forgotLink: {
    fontSize: 12,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  input: {
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: SimulatorColors.textPrimary,
  },
  submitButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  submitButtonText: {
    color: SimulatorColors.textOnBrand,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
});
