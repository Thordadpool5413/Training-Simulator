# Release Checklist — Hospice Training Simulator v1.0

> **Use:** Run this checklist before any TestFlight or internal distribution build. Each item must pass or be explicitly deferred with a written reason.

---

## 1. Code Quality

- [ ] `npm test` — all 29 tests pass, zero failures
- [ ] `npx tsc --noEmit` — zero TypeScript errors
- [ ] `git status` — working tree clean, no uncommitted changes
- [ ] No console.log or debug statements left in production paths
- [ ] No hardcoded placeholder text (e.g., "TODO", "FIXME", "my-first-app")

---

## 2. App Identity

- [ ] `app.json` — `name` is `"Hospice Training Simulator"`
- [ ] `app.json` — `slug` is `"hospice-training-simulator"`
- [ ] `app.json` — iOS `bundleIdentifier` is `"com.thordadpool.hospicetraining"`
- [ ] `app.json` — Android `package` is `"com.thordadpool.hospicetraining"`
- [ ] `app.json` — `userInterfaceStyle` is `"light"` (dark mode not implemented)
- [ ] `app.json` — EAS `projectId` is `"e8fe2307-17f5-49dc-a59f-efe6cff67b1c"`
- [ ] `app.json` — splash `backgroundColor` is `"#2563EB"`
- [ ] `animated-icon.tsx` — `backgroundSolidColor.backgroundColor` is `'#2563EB'`

---

## 3. Assets

- [ ] `assets/images/icon.png` — exists and is a valid 1024×1024 PNG
- [ ] `assets/images/splash-icon.png` — exists and renders correctly on device
- [ ] `assets/images/android-icon-foreground.png` — exists
- [ ] `assets/images/android-icon-background.png` — exists
- [ ] `assets/images/android-icon-monochrome.png` — exists
- [ ] `assets/images/favicon.png` — exists

---

## 4. Content — Scenarios

- [ ] Clinical Liaison scenario 1 — "Hospice Means Giving Up" — loads and runs to completion
- [ ] Clinical Liaison scenario 2 — "Unfinished Business" — loads and runs to completion
- [ ] Clinical Liaison scenario 3 — "Cultural Resistance" — loads and runs to completion
- [ ] RN scenario 1 — "COPD Air Hunger at Home" — loads and runs to completion
- [ ] RN scenario 2 — "Terminal Dyspnea" — loads and runs to completion
- [ ] All scenarios produce a feedback report with at least one non-empty section
- [ ] All scenarios produce a dashboard with Skill Scores

---

## 5. Role Boundary Enforcement

- [ ] Clinical Liaison — medication guidance triggers Training Pause (not family response)
- [ ] Clinical Liaison — safe routing restores conversation
- [ ] RN — dose overstep triggers Training Pause
- [ ] RN — dose refusal (safe routing) continues conversation
- [ ] Safety Correction count appears on dashboard after a violation + recovery
- [ ] Safety Correction count is 0 when no violations occurred

---

## 6. Feedback Screen

- [ ] Subtitle shows the scenario title (not the scenario ID)
- [ ] "Overall Coaching Summary" section is populated
- [ ] "What Went Well" section — populated or correct empty state
- [ ] "What Changed the Room" section — populated or correct empty state
- [ ] "Missed Emotional Cues" section — populated or correct empty state
- [ ] "Role Boundary Review" section — populated
- [ ] "Medication Safety Review" section — populated
- [ ] "Hospice Language Review" section — populated or correct empty state
- [ ] "Suggested Wording" section — shows scenario-specific phrases
- [ ] "Skill Scores" section — shows 7 scored competencies for Clinical Liaison
- [ ] "Skill Scores" section — shows RN-specific categories for RN scenarios
- [ ] "Next Practice Focus" section — populated

---

## 7. Dashboard Screen

- [ ] Session card shows correct scenario title
- [ ] Skill Summary shows correct scores
- [ ] Safety Corrections badge is amber when count > 0
- [ ] Safety Corrections badge is not shown (or shows 0) when no corrections occurred
- [ ] "Next Steps" section shows recommended scenario and practice focus
- [ ] "Practice Again" button navigates to scenario selector with role preserved
- [ ] "Return to Role Selection" button navigates to role screen

---

## 8. Navigation

- [ ] Welcome screen → Role Selection → Scenario Selector → Briefing → Simulation → Feedback → Dashboard — full forward path works
- [ ] "← Back to Scenarios" on briefing screen works
- [ ] "Change Role" on scenario selector works
- [ ] No broken routes (no 404 or unmatched segment errors)

---

## 9. UI / Visual

- [ ] No raw role IDs shown to user (no "clinical_liaison", no "rn" in UI text)
- [ ] Role reminder banner visible on simulation screen
- [ ] Training Pause shown in amber, family message suppressed during pause
- [ ] Indigo role reminder banner text is readable
- [ ] No dark mode visual breakage (device set to light mode enforced by `userInterfaceStyle: "light"`)
- [ ] Animated splash overlay fades correctly on app open

---

## 10. Compliance and Safety Copy

- [ ] Welcome screen disclaimer is present and accurate
- [ ] "Fictional training tool" language visible before any scenario begins
- [ ] No real patient names, facility names, or clinical data
- [ ] No medication dose recommendations in any non-RN scenario response
- [ ] No medical advice language in any service or UI copy

---

## 11. Build Verification (EAS)

- [ ] `eas build --platform ios --profile preview` — build succeeds
- [ ] `eas build --platform android --profile preview` — build succeeds (optional for v1.0)
- [ ] TestFlight internal distribution — app installs on device
- [ ] App launches without crash on cold start

---

## Known Deferred Items (Not Blocking v1.0)

| Item | Reason Deferred |
|---|---|
| Dark mode | SimulatorColors has no dark token set; requires design |
| Session persistence | Sessions reset on close by design for v1.0 |
| Learner profile / name entry | Not in five-scenario MVP scope |
| Voice input | Not in MVP scope |
| Sixth scenario | No content defined yet |
| App Store public release | Internal training use only in v1.0 |

---

## Sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| Developer | | | |
| Clinical Reviewer | | | |
| Training Lead | | | |
