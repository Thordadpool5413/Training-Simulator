import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, SimulatorColors } from '@/constants/theme';
import { roles } from '@/data/roles';
import { useSimulator } from '@/state/SimulatorContext';

const ROLE_BOUNDARY_NOTES: Record<string, string> = {
  clinical_liaison: 'Medication guidance: not in scope for this role',
  rn: 'Medication dose orders: follow hospice orders only',
};

export default function RoleScreen() {
  const { setSelectedRoleId, resetSimulationSession } = useSimulator();

  function handleSelect(roleId: string) {
    resetSimulationSession();
    setSelectedRoleId(roleId);
    router.push('/scenario' as Href);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title} accessibilityRole="header">Select Your Role</Text>
        <Text style={styles.subtitle}>
          Choose the role you will practice in this simulation.
        </Text>
        {roles.map((role) => (
          <Pressable
            key={role.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Select ${role.name}`}
            onPress={() => handleSelect(role.id)}>
            <Text style={styles.roleName}>{role.name}</Text>
            {ROLE_BOUNDARY_NOTES[role.id] != null && (
              <Text style={styles.boundaryNote}>{ROLE_BOUNDARY_NOTES[role.id]}</Text>
            )}
            <View style={styles.allowedList}>
              {role.allowed.map((item, i) => (
                <Text key={i} style={styles.allowedItem}>
                  {item}
                </Text>
              ))}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  cardPressed: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
    marginBottom: 10,
  },
  allowedList: {
    gap: 4,
  },
  boundaryNote: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  allowedItem: {
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
});
