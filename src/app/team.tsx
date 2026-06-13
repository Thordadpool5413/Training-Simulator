import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SectionCard } from '@/components/SectionCard';
import { Radius, SimulatorColors } from '@/constants/theme';
import { fetchOrgMembers } from '@/services/cloudSyncService';
import { joinOrg } from '@/services/authService';
import { useAuth } from '@/state/AuthContext';
import { useSimulator } from '@/state/SimulatorContext';
import type { OrgMember } from '@/types/auth';

export default function TeamScreen() {
  const { userId, email, orgId, isAdmin, isSignedIn, refreshSubscription } = useAuth();
  const { completedSessions } = useSimulator();

  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [orgCodeInput, setOrgCodeInput] = useState('');
  const [joiningOrg, setJoiningOrg] = useState(false);

  const authConfigured = !!(process.env.EXPO_PUBLIC_SUPABASE_URL);

  useEffect(() => {
    if (!orgId || !isAdmin) return;
    setLoadingMembers(true);
    void fetchOrgMembers(orgId).then((m) => {
      setMembers(m);
      setLoadingMembers(false);
    });
  }, [orgId, isAdmin]);

  async function handleJoinOrg() {
    const code = orgCodeInput.trim().toUpperCase();
    if (!code || !userId) return;
    setJoiningOrg(true);
    const { error } = await joinOrg(userId, code);
    setJoiningOrg(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert('Joined!', `You've joined org "${code}".`);
      setOrgCodeInput('');
      await refreshSubscription();
    }
  }

  async function handleShareOrgCode() {
    if (!orgId) return;
    await Share.share({
      message: `Join my team on the Hospice Communication Simulator. Use org code: ${orgId}`,
    });
  }

  const mySessionCount = completedSessions.length;
  const myAvgScore =
    mySessionCount > 0
      ? completedSessions.reduce((s, c) => s + c.overallScore, 0) / mySessionCount
      : 0;

  if (!authConfigured) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable style={styles.backLink} accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.backLinkText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Team</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Team features require an account. Set up Supabase and add your credentials to enable team management.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable style={styles.backLink} accessibilityRole="button" onPress={() => router.back()}>
            <Text style={styles.backLinkText}>← Back</Text>
          </Pressable>
          <Text style={styles.title}>Team</Text>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Sign in to access team features.</Text>
            <Pressable
              style={styles.actionButton}
              accessibilityRole="button"
              onPress={() => router.push('/sign-in')}>
              <Text style={styles.actionButtonText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable style={styles.backLink} accessibilityRole="button" onPress={() => router.back()}>
          <Text style={styles.backLinkText}>← Back</Text>
        </Pressable>

        <Text style={styles.title} accessibilityRole="header">Team</Text>

        <SectionCard title="Your Account">
          <Text style={styles.accountEmail}>{email}</Text>
          {orgId ? (
            <View style={styles.orgPill}>
              <Text style={styles.orgPillText}>Org: {orgId}</Text>
            </View>
          ) : (
            <Text style={styles.noOrgText}>Not in an organization</Text>
          )}
        </SectionCard>

        <SectionCard title="Your Stats">
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{mySessionCount}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {mySessionCount > 0 ? myAvgScore.toFixed(1) : '—'}
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </SectionCard>

        {!orgId && (
          <SectionCard title="Join a Team">
            <Text style={styles.joinDesc}>
              Enter an org code from your manager to join your organization's team view.
            </Text>
            <View style={styles.joinRow}>
              <TextInput
                style={styles.orgCodeInput}
                value={orgCodeInput}
                onChangeText={setOrgCodeInput}
                placeholder="ORG CODE"
                placeholderTextColor={SimulatorColors.textPlaceholder}
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabel="Organization code"
              />
              <Pressable
                style={[styles.joinButton, (!orgCodeInput.trim() || joiningOrg) && styles.joinButtonDisabled]}
                accessibilityRole="button"
                onPress={() => { void handleJoinOrg(); }}
                disabled={!orgCodeInput.trim() || joiningOrg}>
                {joiningOrg ? (
                  <ActivityIndicator size="small" color={SimulatorColors.textOnBrand} />
                ) : (
                  <Text style={styles.joinButtonText}>Join</Text>
                )}
              </Pressable>
            </View>
          </SectionCard>
        )}

        {orgId && isAdmin && (
          <SectionCard title="Team Overview">
            <View style={styles.adminHeader}>
              <Text style={styles.adminOrgId}>Org code: {orgId}</Text>
              <Pressable
                style={styles.shareOrgButton}
                accessibilityRole="button"
                onPress={() => { void handleShareOrgCode(); }}>
                <Text style={styles.shareOrgButtonText}>Share Invite</Text>
              </Pressable>
            </View>

            {loadingMembers ? (
              <ActivityIndicator size="small" color={SimulatorColors.brand} style={styles.memberLoader} />
            ) : members.length === 0 ? (
              <Text style={styles.noMembersText}>
                No team members yet. Share your org code to invite colleagues.
              </Text>
            ) : (
              <>
                <View style={styles.memberListHeader}>
                  <Text style={styles.memberColEmail}>Member</Text>
                  <Text style={styles.memberColStat}>Done</Text>
                  <Text style={styles.memberColStat}>Avg</Text>
                </View>
                {members.map((m) => (
                  <View key={m.userId} style={styles.memberRow}>
                    <View style={styles.memberEmailCol}>
                      <Text style={styles.memberEmail} numberOfLines={1}>
                        {m.displayName ?? m.email}
                      </Text>
                      {m.lastActiveAt && (
                        <Text style={styles.memberLastActive}>
                          {new Date(m.lastActiveAt).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.memberStat}>{m.completedCount}</Text>
                    <Text style={styles.memberStat}>
                      {m.completedCount > 0 ? m.avgScore.toFixed(1) : '—'}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </SectionCard>
        )}

        {orgId && !isAdmin && (
          <View style={styles.memberCard}>
            <Text style={styles.memberCardText}>
              You're a member of org <Text style={styles.memberCardOrg}>{orgId}</Text>. Contact your admin for team reports.
            </Text>
          </View>
        )}

        <Pressable
          style={styles.paywallLink}
          accessibilityRole="button"
          onPress={() => router.push('/paywall')}>
          <Text style={styles.paywallLinkText}>View subscription options →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: SimulatorColors.screenBackground,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },
  backLink: {
    alignSelf: 'flex-start',
  },
  backLinkText: {
    fontSize: 14,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: SimulatorColors.textPrimary,
  },
  emptyCard: {
    backgroundColor: SimulatorColors.surface,
    borderRadius: Radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: SimulatorColors.border,
  },
  emptyText: {
    fontSize: 15,
    color: SimulatorColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    color: SimulatorColors.textOnBrand,
    fontWeight: '700',
    fontSize: 15,
  },
  accountEmail: {
    fontSize: 15,
    color: SimulatorColors.textBody,
    marginBottom: 8,
  },
  orgPill: {
    alignSelf: 'flex-start',
    backgroundColor: SimulatorColors.indigoBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.indigoBorder,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orgPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.indigoLabel,
  },
  noOrgText: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  statLabel: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: SimulatorColors.border,
  },
  joinDesc: {
    fontSize: 13,
    color: SimulatorColors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  joinRow: {
    flexDirection: 'row',
    gap: 10,
  },
  orgCodeInput: {
    flex: 1,
    backgroundColor: SimulatorColors.surface,
    borderWidth: 1,
    borderColor: SimulatorColors.borderInput,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: SimulatorColors.textPrimary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  joinButton: {
    backgroundColor: SimulatorColors.brand,
    borderRadius: Radius.md,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  joinButtonDisabled: {
    backgroundColor: SimulatorColors.brandDisabled,
  },
  joinButtonText: {
    color: SimulatorColors.textOnBrand,
    fontWeight: '700',
    fontSize: 15,
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adminOrgId: {
    fontSize: 13,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
  },
  shareOrgButton: {
    backgroundColor: SimulatorColors.brandTint,
    borderWidth: 1,
    borderColor: SimulatorColors.brand,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareOrgButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: SimulatorColors.brand,
  },
  memberLoader: {
    marginVertical: 16,
  },
  noMembersText: {
    fontSize: 14,
    color: SimulatorColors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  memberListHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
    marginBottom: 4,
  },
  memberColEmail: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberColStat: {
    width: 48,
    fontSize: 11,
    fontWeight: '700',
    color: SimulatorColors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: SimulatorColors.borderDivider,
  },
  memberEmailCol: {
    flex: 1,
    gap: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: SimulatorColors.textBody,
    fontWeight: '500',
  },
  memberLastActive: {
    fontSize: 11,
    color: SimulatorColors.textSecondary,
  },
  memberStat: {
    width: 48,
    fontSize: 14,
    fontWeight: '700',
    color: SimulatorColors.brand,
    textAlign: 'center',
  },
  memberCard: {
    backgroundColor: SimulatorColors.indigoBackground,
    borderWidth: 1,
    borderColor: SimulatorColors.indigoBorder,
    borderRadius: Radius.md,
    padding: 14,
  },
  memberCardText: {
    fontSize: 13,
    color: SimulatorColors.indigoText,
    lineHeight: 19,
  },
  memberCardOrg: {
    fontWeight: '700',
  },
  paywallLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  paywallLinkText: {
    fontSize: 13,
    color: SimulatorColors.brand,
    fontWeight: '600',
  },
});
