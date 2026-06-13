import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { signUp } from '@/services/authService';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length >= 6 && password === confirmPassword;

  async function handleSignUp() {
    if (!canSubmit) return;
    setLoading(true);
    const { error } = await signUp(email.trim().toLowerCase(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error);
      return;
    }

    router.replace('/onboarding' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Pressable
            style={styles.backLink}
            accessibilityRole="button"
            onPress={() => router.canGoBack() ? router.back() : router.replace('/welcome' as Href)}>
            <Text style={styles.backLinkText}>← Back</Text>
          </Pressable>

          <View style={styles.headerSection}>
            <Text style={styles.title} accessibilityRole="header">Create your account</Text>
            <Text style={styles.subtitle}>
              Start your 7-day free trial. Cancel anytime.
            </Text>
          </View>

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
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor={SimulatorColors.textPlaceholder}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                accessibilityLabel="Password"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPassword.length > 0 && password !== confirmPassword && styles.inputError,
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter your password"
                placeholderTextColor={SimulatorColors.textPlaceholder}
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                accessibilityLabel="Confirm password"
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.errorText}>Passwords don't match</Text>
              )}
            </View>

            <Pressable
              style={[styles.submitButton, (!canSubmit || loading) && styles.submitButtonDisabled]}
              accessibilityRole="button"
              onPress={() => { void handleSignUp(); }}
              disabled={!canSubmit || loading}>
              {loading ? (
                <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
              ) : (
                <Text style={styles.submitButtonText}>Start Free Trial</Text>
              )}
            </Pressable>
          </View>

          <Text style={styles.termsNote}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/sign-in' as Href)}>
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    marginBottom: 28,
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
    lineHeight: 22,
  },
  form: {
    gap: 16,
    marginBottom: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: SimulatorColors.textBody,
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
  inputError: {
    borderColor: SimulatorColors.scoreRed,
  },
  errorText: {
    fontSize: 12,
    color: SimulatorColors.scoreRed,
    marginTop: 2,
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
  termsNote: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 20,
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
