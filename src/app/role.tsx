import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PremiumPill, PremiumScreen, PremiumStatRail } from '@/components/premium-ui';
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
    router.push('/role-overview' as Href);
  }

  return (
    <PremiumScreen
      eyebrow="Role Selection"
      title="Select your clinical perspective"
      subtitle="Choose the role you want to practice so the simulator can frame the correct boundaries, language, and expectations."
      onBack={() => router.back()}
      backLabel="Back"
      headerRight={<PremiumPill label={`${roles.length} roles`} tone="indigo" />}
      scrollContentStyle={styles.container}>
      <PremiumStatRail
        items={[
          { label: 'Practice roles', value: String(roles.length), caption: 'Liaison, RN, social worker', tone: 'brand' },
          { label: 'Clinical lanes', value: '3', caption: 'Distinct workflows', tone: 'indigo' },
          { label: 'Role clarity', value: 'High', caption: 'Boundary-aware feedback', tone: 'success' },
        ]}
      />

      <View style={styles.cardList}>
        {roles.map((role) => (
          <Pressable
            key={role.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Select ${role.name}`}
            onPress={() => handleSelect(role.id)}>
            <View style={styles.cardTop}>
              <View style={styles.cardHeading}>
                <Text style={styles.roleName}>{role.name}</Text>
                {ROLE_BOUNDARY_NOTES[role.id] != null && (
                  <Text style={styles.boundaryNote}>{ROLE_BOUNDARY_NOTES[role.id]}</Text>
                )}
              </View>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{role.allowed.length} actions</Text>
              </View>
            </View>

            <View style={styles.allowedList}>
              {role.allowed.map((item, i) => (
                <View key={i} style={styles.allowedRow}>
                  <View style={styles.dot} />
                  <Text style={styles.allowedItem}>{item}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        ))}
      </View>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  cardList: {
    gap: 14,
  },
  card: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
    boxShadow: `0 18px 36px ${SimulatorColors.shadow}`,
    gap: 12,
  },
  cardPressed: {
    backgroundColor: SimulatorColors.brandTint,
    borderColor: SimulatorColors.brand,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  cardHeading: {
    flex: 1,
    gap: 4,
  },
  roleName: {
    fontSize: 17,
    fontWeight: '800',
    color: SimulatorColors.textPrimary,
  },
  boundaryNote: {
    fontSize: 12,
    color: SimulatorColors.textSecondary,
    lineHeight: 18,
  },
  countPill: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderWidth: 1,
    borderColor: `${SimulatorColors.indigoBorder}33`,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: '800',
    color: SimulatorColors.indigoLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  allowedList: {
    gap: 8,
  },
  allowedRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: SimulatorColors.brand,
    marginTop: 8,
  },
  allowedItem: {
    flex: 1,
    fontSize: 13,
    color: SimulatorColors.textBody,
    lineHeight: 20,
  },
});
