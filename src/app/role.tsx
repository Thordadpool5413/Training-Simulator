import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    router.push('/profile' as Href);
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
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 28,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardPressed: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  roleName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  allowedList: {
    gap: 4,
  },
  boundaryNote: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
    lineHeight: 18,
  },
  allowedItem: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },
});
