# MVP Status — Hospice Communication Training Simulator

> **Updated:** 2026-06-10. This document reflects the stable five-scenario MVP state after Packet 54 accessibility pass. It is maintained as a living status record updated at each stable checkpoint.

---

## 1. MVP Status Summary

| Field | Value |
|---|---|
| Status | Release Candidate — five scenarios, accessibility pass complete |
| Last Manual Test | 2026-06-10 (Packet 48 full regression — 50 of 50 checks passed) |
| Open Defects | 0 |
| TypeScript | Passes with zero errors |
| Automated Tests | 29 of 29 passing (Jest 29, npm test) |
| Backend Required | No |
| AI Required | No |
| External APIs Required | No |

Both learner paths — Clinical Liaison and RN — have been manually tested end-to-end and pass with no open defects. All simulation logic, medication safety, feedback, scoring, and dashboard behavior runs locally with no backend or AI required.

---

## 2. Supported Learner Roles

| Role | ID | Medication Access Level |
|---|---|---|
| Clinical Liaison | `clinical_liaison` | 0 — no medication guidance permitted |
| RN | `rn` | 2 — dose boundary safety enforced |

---

## 3. Supported Scenarios

### Hospice Means Giving Up

| Field | Value |
|---|---|
| Role | Clinical Liaison |
| Patient | Robert |
| Family | Daughter |
| Setting | Hospital room |
| Opening line | My dad is dying and you want to take away his care? |
| Core challenge | Hospice objection handling, emotional acknowledgment, medication routing |

### Hospice Is Only for the Last Few Days

| Field | Value |
|---|---|
| Role | Clinical Liaison |
| Patient | Gloria Santos, age 72 |
| Family | Son (Marcus Santos) |
| Setting | Hospital room |
| Opening line | The doctor says Mom might qualify for hospice, but she is still talking to us and eating a little. I thought hospice was only for the last few days. |
| Core challenge | Correcting hospice timing misconception, acknowledging fear of acting too soon, explaining what hospice provides, avoiding prognosis promises, and staying within Clinical Liaison role boundaries |

### COPD Air Hunger at Home

| Field | Value |
|---|---|
| Role | RN |
| Patient | Harold |
| Caregiver | Margaret |
| Setting | Home visit |
| Opening line | He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do. |
| Core challenge | Air hunger explanation, caregiver fear acknowledgment, comfort education, RN dose boundary |

### Can We Change Our Minds?

| Field | Value |
|---|---|
| Role | Clinical Liaison |
| Patient | Ruth Calloway, age 78 |
| Family speaker | Frank |
| Setting | Hospital room |
| Diagnosis | Advanced dementia |
| Opening line | The doctor says she might qualify for hospice, but I need to know, if we start this and I change my mind, or she gets better, can we undo it? Are we signing something we cannot take back? |
| Core challenge | Frank fears hospice is permanent and irreversible. He wants to know whether the family can change course if goals change. |

### Terminal Dyspnea Follow Up Conversation

| Field | Value |
|---|---|
| Role | RN |
| Patient | Eleanor Marsh, age 84 |
| Caregiver | Carol |
| Setting | Home visit |
| Diagnosis | End-stage COPD |
| Opening line | She keeps having these episodes where she looks like she cannot breathe. I have been sitting with her for two hours and I do not know what to do. Can we increase her medication? |
| Core challenge | Follow-up visit after prior comfort-care education. Carol is frightened and asking about a dose increase. RN must route the dose question safely, explain air hunger, describe non-pharmacologic comfort tools, and clarify when to call. |

---

## 4. Passing Manual Test Paths

| Path | Phrases | Responses Verified | Training Pause | Feedback | Scoring | Dashboard | Status |
|---|---|---|---|---|---|---|---|
| Clinical Liaison clean path | 7 | 7 exact matches | Fires on unsafe medication phrase | 10 sections | 7 CL categories | All 9 fields | Pass |
| Clinical Liaison medication safety | 2 | Training Pause verbatim + daughter acceptance | Fires and recovers | — | — | Safety Corrections = 1 | Pass |
| Hospice Is Only for the Last Few Days — formal path | 6 | Opening line, Marcus Rules 1–4, Training Pause, safe routing recovery verified | Fires on unsafe medication phrase | 10 sections | 7 CL categories | Safety Corrections = 1 | Smoke tested and formal deterministic path complete 2026-06-06 — 15 of 15 steps passed |
| Can We Change Our Minds? — smoke test | 7 | Opening line, Frank Rules 1–5, Training Pause, safe routing recovery, fallback verified | Fires on unsafe medication phrase | Renders | Renders | Safety Corrections = 1 | Smoke tested 2026-06-08 — 27 of 27 items passed |
| Scenario aware Suggested Wording — manual UI smoke test | — | Feedback Suggested Wording verified on all four scenarios | — | Scenario-specific wording confirmed, no raw IDs visible | — | — | Manually tested 2026-06-09 — 22 of 22 items passed, zero defects |
| Packet 28 UI polish baseline smoke test | — | SafeAreaView, SectionCard extraction, token fixes, margin standardization verified across all screens | — | Feedback and Dashboard section cards consistent, welcome screen safe area correct, training pause and all four opening lines confirmed | — | — | Manually tested 2026-06-09 — 36 of 36 items passed, zero defects |
| RN COPD clean path | 6 | 6 exact matches | None | 10 sections | 7 RN categories | All 9 fields | Pass |
| RN medication safety | 2 | Training Pause verbatim + Margaret response | Fires and recovers | — | — | Safety Corrections = 1 | Pass |
| Terminal Dyspnea Follow Up — smoke test | 19 | Response rules 1–7, patient state detection, feedback, scoring, dashboard verified by code trace | Fires on dose-increase phrase; recovery confirmed | 10 sections, 3 RN follow-up wording entries, no CL wording | 7 RN categories | Safety Corrections = 1 | Tested 2026-06-10 — 19 of 19 passed after D-RN-002 fix |

### Resolved Defects

| Defect ID | Description | Resolution |
|---|---|---|
| D-001 | Clinical Liaison opening line mismatch | Fixed — `openingLine` in `scenarioTemplates.ts` updated |
| D-002 | Clinical Liaison Safety Corrections counter showed 0 instead of 1 | Fixed — `'do not want to guess'` added to `MED_ROUTING_REFUSAL_TERMS` |
| D-RN-001 | RN air hunger explanation behavior not emitted for Phrase 2 | Fixed 2026-06-06 — `'fear makes sense'` added to `FEAR_ACK_TERMS` in `copdPatientStateService.ts` |
| D-RN-002 | Terminal Dyspnea Follow Up Safety Corrections counter showed 0 instead of 1 | Fixed 2026-06-10 — safe routing check moved to Rule 1 (before dose overstep); `'cannot change'` added to `MED_ROUTING_REFUSAL_TERMS` in `copdPatientStateService.ts` |

---

## 5. Safety Logic Implemented

| Rule ID | Applies To | Trigger | Severity | Behavior |
|---|---|---|---|---|
| `medication_outside_role` | Clinical Liaison — medication access level 0 | Direct medication guidance combined with instruction terms | `critical_simulation_stop` | Training Pause fires, patient does not respond |
| `rn_medication_dose_outside_orders` | RN — medication access level 2 | Specific dose amount, dose range, dose change instruction, or hold/stop/start order | `clinical_safety_concern` | Training Pause fires, patient does not respond |

Both rules use sequence-aware recovery detection. The dashboard `safetyFlagsResolved` field increments to 1 only when a recovery behavior snapshot is timestamped after the safety event in the same session.

---

## 6. Feedback and Scoring Implemented

### Feedback Sections (ten sections per scenario, rendered on the feedback screen)

1. Overall Coaching Summary
2. What Went Well
3. What Changed the Room
4. Missed Emotional Cues
5. Role Boundary Review
6. Medication Safety Review
7. Hospice Language Review (repurposed as air hunger and comfort language review for RN COPD)
8. Suggested Wording
9. Skill Scores
10. Next Practice Focus

### Suggested Wording — Scenario Aware (Packet 23, verified Packet 25)

Clinical Liaison Suggested Wording entries are selected by scenario ID. RN COPD Suggested Wording is handled by `rnFeedbackService` and is not affected by this map.

| Scenario | Suggested Wording Entries |
|---|---|
| Hospice Means Giving Up | Hospice fear response, medication routing response, repair language |
| Hospice Is Only for the Last Few Days | Too-soon validation, hospice timeline education, what hospice provides, medication routing response |
| Can We Change Our Minds? | Revocation plain language, hospice as choice framing, revocation repair language, medication routing response |
| COPD Air Hunger at Home | Handled by `rnFeedbackService` — air hunger acknowledgment, comfort reassurance, when to call |
| Terminal Dyspnea Follow Up Conversation | Handled by `terminalDyspneaFeedbackService` — air hunger acknowledgment, follow-up comfort reassurance, when to call |

### UI Polish Baseline (Packet 28, verified 2026-06-09)

UI polish baseline completed. No behavior, logic, or content was changed.

| Change | Detail |
|---|---|
| Shared `SectionCard` component | Created `src/components/SectionCard.tsx`. Feedback and Dashboard section cards now use the shared component — card styling standardized, local `SectionBlock` duplication removed |
| Welcome screen safe area | `src/app/index.tsx` now uses `SafeAreaView` — content respects the safe area on notched devices |
| Placeholder color token | `src/app/simulation.tsx` placeholder color references `SimulatorColors.textPlaceholder` instead of a hardcoded hex |
| Badge radius token | `src/app/dashboard.tsx` Safety Corrections amber badge uses `Radius.sm` instead of a hardcoded value |
| Screen title margin | `src/app/feedback.tsx` and `src/app/dashboard.tsx` screen title `marginBottom` standardized to 8 |

Manual UI smoke test passed 36 of 36 items. Zero defects found.

### App Identity Update (Packet 51, verified 2026-06-10)

App identity updated to production values. Two files modified: `app.json` and `src/components/animated-icon.tsx`.

| Field | Old Value | New Value |
|---|---|---|
| App name | `my-first-app` | `Hospice Training Simulator` |
| Slug | `my-first-app` | `hospice-training-simulator` |
| Scheme | `myfirstapp` | `hospicetraining` |
| userInterfaceStyle | `automatic` | `light` (dark mode not yet implemented) |
| iOS icon | `./assets/expo.icon` (broken) | `./assets/images/icon.png` |
| iOS bundleIdentifier | `com.thordadpool.myfirstapp` | `com.thordadpool.hospicetraining` |
| Android package | `com.thordadpool.myfirstapp` | `com.thordadpool.hospicetraining` |
| Splash backgroundColor | `#208AEF` (Expo default) | `#2563EB` (brand blue) |
| Animated overlay color | `#208AEF` | `#2563EB` (matches splash) |

Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `d24cba9`.

### Accessibility Pass (Packet 54, verified 2026-06-10)

Accessibility attributes added to all six screen files. No service, data, state, type, component, theme, or package changes.

| Screen | Changes |
|---|---|
| Welcome | `accessibilityRole="button"` on Continue |
| Role Selection | `accessibilityRole="button"` + `accessibilityLabel` on role card Pressables |
| Scenario Selector | `accessibilityRole="button"` + `accessibilityLabel` on Change Role and scenario card Pressables; `accessibilityRole="button"` on error state Pressables |
| Scenario Briefing | `accessibilityRole="header"` on title; `accessibilityRole="button"` + labels on Back, Start Simulation, and error state Pressables |
| Simulation | `accessibilityRole="button"` + `accessibilityLabel` on Finish and Send; `accessibilityLabel` on TextInput; `accessibilityState={{ disabled }}` on Send; `accessibilityRole="button"` on error state Pressables |
| Feedback | `accessibilityRole="header"` on title; `accessibilityRole="button"` on all action Pressables |
| Dashboard | `accessibilityRole="header"` on title; `accessibilityRole="button"` on all action Pressables |

Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `1241ffe`.

### Full Five Scenario Regression (Packet 48, verified 2026-06-10)

Full regression completed across all five scenarios and all polished screens. Automated suite plus deterministic code trace.

| Field | Result |
|---|---|
| Automated tests | 29 of 29 passed |
| TypeScript | Zero errors |
| Manual regression checks | 50 of 50 passed |
| Open defects | 0 |
| Commit at test | 3405e42 |

### Dashboard Polish (Packet 46, verified 2026-06-10)

Dashboard polish completed. One file modified: `src/app/dashboard.tsx`.

| Change | Detail |
|---|---|
| Practice Again button added | Outlined brand button above Return to Role Selection — routes to /scenario for fast repeat practice without role re-selection |

UI verification: 8 of 8 checks passed by code trace. Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `2e26ba3`.

### Feedback Screen Polish (Packet 43, verified 2026-06-10)

Feedback screen polish completed. One file modified: `src/app/feedback.tsx`.

| Change | Detail |
|---|---|
| Scenario subtitle added | Scenario title displayed below "Simulation Feedback" heading — makes the feedback screen contextual |
| Bullet consistency | `whatChangedTheRoom` items now use `• ` prefix matching `whatWentWell` style |
| Empty-state guard | `whatChangedTheRoom` now shows "Nothing specific detected yet" when empty, matching `whatWentWell` |

UI verification: 10 of 10 checks passed by code trace. Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `41ed6c8`.

### Simulation Screen Polish (Packet 40, verified 2026-06-10)

Simulation screen polish completed. One file modified: `src/app/simulation.tsx`.

| Change | Detail |
|---|---|
| Raw ID removed from header | Header meta fallback changed from `selectedRoleId` to `'Learner'` — prevents raw ID exposure if role lookup fails |
| Role reminder clamped | `numberOfLines={4}` added — prevents long reminder text from dominating the chat area |
| Finish button color | Border and text color changed from `textBody` gray to `brand` blue — clearer call to action |

UI verification: 10 of 10 checks passed by code trace. Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `ca0b886`.

### Scenario Briefing Polish (Packet 37, verified 2026-06-10)

Scenario briefing polish completed. One file modified: `src/app/scenario-briefing.tsx`.

| Change | Detail |
|---|---|
| Back link added | "← Back to Scenarios" text Pressable added above the scenario title — calls `router.back()` to return to scenario selector |

UI verification: 8 of 8 checks passed by code trace. Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `6a33054`.

### Scenario Selector Polish (Packet 34, verified 2026-06-10)

Scenario selector polish completed. No service logic, scenario data, state, types, components, or packages were changed. One file modified: `src/app/scenario.tsx`.

| Change | Detail |
|---|---|
| Role context label | Selected role name displayed near the top of the selector — "Role: Clinical Liaison" or "Role: RN" |
| Scenario count | Count of available scenarios displayed — "3 scenarios" (CL) or "2 scenarios" (RN) |
| Change Role action | Text Pressable routes to /role — allows role change without device back gesture |
| Full-card tap target | Scenario cards changed from View + inner Select button to single outer Pressable — consistent with role screen pattern |
| Card pressed state | brandTint background and brand border applied on press |
| Select button removed | Inner Select button eliminated — full card is the tap target |
| Learner objective clipped | `numberOfLines={2}` applied — full objective remains visible on briefing screen |
| No raw IDs exposed | Role name resolved via `roles` data; diagnosis resolved via `diagnoses` data; no internal ID strings rendered |

UI verification: 16 of 16 checks passed by deterministic code trace and clean Expo export compile. Automated tests: 29 of 29 passing. TypeScript: zero errors. Commit: `c22c8e5`.

### Automated Service Tests (Packet 30, extended Packet 32)

Automated service smoke test suite added in Packet 30 and extended in Packet 32 to cover the fifth scenario. Jest service tests cover medication safety, scenario response routing, patient state behavior detection, feedback Suggested Wording, scoring reports, and dashboard summary behavior. Tests run in a Node.js environment and do not require Expo Go, a simulator, or a device.

| Field | Detail |
|---|---|
| Commit | aaf711f |
| Test runner | Jest 29 + ts-jest |
| npm test | Passed 29 of 29 |
| TypeScript | Zero errors |
| Production dependencies added | None |
| UI coverage | Not claimed — automated tests cover service logic only |

Tests added in Packet 32: 7 total (1 scenarioResponse, 2 feedback, 1 scoring, 2 dashboard, 1 patientState).

---

### Skill Score Categories

Scores range from 0 to 4. The overall score is the mean of all seven categories, rounded to one decimal.

| # | Clinical Liaison | RN COPD |
|---|---|---|
| 1 | Emotional Attunement | Emotional Attunement |
| 2 | Hospice Education | Symptom Communication |
| 3 | Objection Handling | Comfort Education |
| 4 | Compliance Safe Language | Role Boundary Safety |
| 5 | Clinical Escalation Judgment | Caregiver Empowerment |
| 6 | Trust Building | Clinical Escalation Judgment |
| 7 | Role Boundary Safety | Trust Building |

---

## 7. Dashboard Behavior Implemented

Nine fields are rendered on the dashboard screen.

| Field | Source |
|---|---|
| Scenario | Scenario template title |
| Role | Learner role name |
| Scenarios Completed | 1 when the session contains at least one learner message |
| Average Score | Overall score from skill score report |
| Strongest Skill | Primary strength category from score report |
| Growth Area | Primary growth area category from score report |
| Safety Corrections | Sequence-aware count — scenario-specific |
| Next Recommended Scenario | Scenario-aware priority logic (see below) |
| Next Practice Focus | Next practice focus from feedback report |

### Next Recommended Scenario Logic

`nextRecommendedScenario` branches by active scenario ID.

**Clinical Liaison branch:** medication event → service first → missing hospice reframe → default (Hospital Discharge Planning Conversation).

**RN COPD branch (copd_air_hunger_at_home):** dose event or overstep → overpromise → missing fear acknowledgment → missing air hunger explanation → missing comfort education → missing caregiver empowerment → default (Terminal Dyspnea Follow Up Conversation).

**RN Terminal Dyspnea branch (terminal_dyspnea_follow_up):** happy path → default (Advanced Comfort Care Conversations).

---

## 8. Known Limitations

The following limitations apply to the current MVP build and are expected behavior, not defects.

- No AI response layer. All patient and caregiver responses are generated by local rule-based keyword matching.
- No backend. All logic runs locally on the device.
- No database. No session data is persisted between runs.
- No saved progress. Session state is lost when the app is closed or restarted.
- No authentication. No user accounts or login.
- No voice mode. All input is text only.
- No production deployment. The app runs in Expo Go only.
- No persistent learner history. There is no aggregate score, progress record, or history view across sessions.
- Dashboard reflects the current session only. There is no multi-session aggregate score.

---

## 9. Not Yet Implemented

- Additional hospice and palliative care scenarios beyond the current five
- Additional learner roles beyond Clinical Liaison and RN
- Persistent session storage and learner history
- User accounts and authentication
- Backend API and database
- AI or MCP-powered response generation
- Admin content management interface for adding and editing scenarios without code changes
- Voice input and output mode
- Production build and deployment pipeline
- Multi-session aggregate scoring and progress tracking

---

## 10. Recommended Next Build Lanes

Listed in suggested priority order. Some lanes can run in parallel once the scenario selector is in place.

1. **UI and UX polish** — Refine visual design, typography, layout, and interaction patterns before expanding content. Establishes the design baseline for all future screens.
2. **Scenario selector** *(complete — Packet 17)* — Learners can now choose from multiple scenarios per role. Clinical Liaison shows three scenarios. RN shows two scenarios.
3. **Persistence and learner history** — Add local or backend session storage so learners can track progress across runs.
4. **Additional hospice scenarios** — Expand the scenario library for both Clinical Liaison and RN. Each new scenario follows the established dispatcher pattern.
5. **AI or MCP integration** — Replace or augment rule-based response generation with AI-powered responses for more naturalistic conversations. Requires backend.
6. **Admin content management** — Interface for adding and editing scenarios, safe language entries, and safety rules without code changes.
7. **Voice mode** — Add speech input and text-to-speech output. Later lane; requires stable UI and content foundation first.
