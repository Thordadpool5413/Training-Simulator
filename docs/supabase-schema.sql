-- Run this in your Supabase SQL Editor (Project > SQL Editor > New Query)

-- Extended user profiles (auth.users is managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  org_id TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completed training sessions synced from device
CREATE TABLE IF NOT EXISTS public.completed_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scenario_id TEXT NOT NULL,
  scenario_title TEXT NOT NULL,
  role_id TEXT NOT NULL,
  overall_score NUMERIC(4,2) NOT NULL,
  skill_scores JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learner profiles synced from device
CREATE TABLE IF NOT EXISTS public.learner_profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  years_in_role TEXT,
  hospice_experience_level TEXT,
  primary_setting TEXT,
  comfort_hospice_conversations INTEGER,
  comfort_family_objections INTEGER,
  comfort_medication_questions INTEGER,
  comfort_death_and_dying INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- View for admin team reporting (org members with aggregated stats)
CREATE OR REPLACE VIEW public.org_member_stats AS
SELECT
  up.id AS user_id,
  up.org_id,
  up.display_name,
  u.email,
  COUNT(cs.id) AS completed_count,
  ROUND(COALESCE(AVG(cs.overall_score), 0), 2) AS avg_score,
  MAX(cs.completed_at) AS last_active_at
FROM public.user_profiles up
JOIN auth.users u ON u.id = up.id
LEFT JOIN public.completed_sessions cs ON cs.user_id = up.id
WHERE up.org_id IS NOT NULL
GROUP BY up.id, up.org_id, up.display_name, u.email;

-- Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users manage own profile"
  ON public.user_profiles FOR ALL
  USING (auth.uid() = id);

-- completed_sessions policies
CREATE POLICY "Users manage own sessions"
  ON public.completed_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view org sessions"
  ON public.completed_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles admin_up
      WHERE admin_up.id = auth.uid()
        AND admin_up.is_admin = TRUE
        AND admin_up.org_id = (
          SELECT member_up.org_id FROM public.user_profiles member_up WHERE member_up.id = user_id
        )
    )
  );

-- learner_profiles policies
CREATE POLICY "Users manage own learner profile"
  ON public.learner_profiles FOR ALL
  USING (auth.uid() = user_id);

-- Trigger to auto-create a user_profiles row on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id) VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
