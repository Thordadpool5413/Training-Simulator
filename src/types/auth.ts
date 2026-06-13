export interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  orgId: string | null;
  isAdmin: boolean;
}

export type SubscriptionPlan = 'free' | 'pro' | 'team';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'none';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: string | null;
}

export interface OrgMember {
  userId: string;
  email: string;
  displayName: string | null;
  completedCount: number;
  avgScore: number;
  lastActiveAt: string | null;
}
