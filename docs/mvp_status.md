# MVP Status — Hospice Communication Training Simulator

> **Checkpoint date:** 2026-06-06. This document captures the stable two-scenario MVP state before new features are added. It is a point-in-time snapshot, not a living document.

---

## 1. MVP Status Summary

| Field | Value |
|---|---|
| Status | Stable MVP — two scenarios passing |
| Last Manual Test | 2026-06-06 |
| Open Defects | 0 |
| TypeScript | Passes with zero errors |
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

### COPD Air Hunger at Home

| Field | Value |
|---|---|
| Role | RN |
| Patient | Harold |
| Caregiver | Margaret |
| Setting | Home visit |
| Opening line | He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do. |
| Core challenge | Air hunger explanation, caregiver fear acknowledgment, comfort education, RN dose boundary |

---

## 4. Passing Manual Test Paths

| Path | Phrases | Responses Verified | Training Pause | Feedback | Scoring | Dashboard | Status |
|---|---|---|---|---|---|---|---|
| Clinical Liaison clean path | 7 | 7 exact matches | Fires on unsafe medication phrase | 10 sections | 7 CL categories | All 9 fields | Pass |
| Clinical Liaison medication safety | 2 | Training Pause verbatim + daughter acceptance | Fires and recovers | — | — | Safety Corrections = 1 | Pass |
| RN COPD clean path | 6 | 6 exact matches | None | 10 sections | 7 RN categories | All 9 fields | Pass |
| RN medication safety | 2 | Training Pause verbatim + Margaret response | Fires and recovers | — | — | Safety Corrections = 1 | Pass |

### Resolved Defects

| Defect ID | Description | Resolution |
|---|---|---|
| D-001 | Clinical Liaison opening line mismatch | Fixed — `openingLine` in `scenarioTemplates.ts` updated |
| D-002 | Clinical Liaison Safety Corrections counter showed 0 instead of 1 | Fixed — `'do not want to guess'` added to `MED_ROUTING_REFUSAL_TERMS` |
| D-RN-001 | RN air hunger explanation behavior not emitted for Phrase 2 | Fixed 2026-06-06 — `'fear makes sense'` added to `FEAR_ACK_TERMS` in `copdPatientStateService.ts` |

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

**RN COPD branch:** dose event or overstep → overpromise → missing fear acknowledgment → missing air hunger explanation → missing comfort education → missing caregiver empowerment → default (Terminal Dyspnea Follow Up Conversation).

---

## 8. Known Limitations

The following limitations apply to the current MVP build and are expected behavior, not defects.

- No AI response layer. All patient and caregiver responses are generated by local rule-based keyword matching.
- No backend. All logic runs locally on the device.
- No database. No session data is persisted between runs.
- No saved progress. Session state is lost when the app is closed or restarted.
- No authentication. No user accounts or login.
- No voice mode. All input is text only.
- No multi-scenario selector beyond the first scenario per role. The learner cannot choose between multiple scenarios for the same role.
- No production deployment. The app runs in Expo Go only.
- No persistent learner history. There is no aggregate score, progress record, or history view across sessions.
- Dashboard reflects the current session only. There is no multi-session aggregate score.

---

## 9. Not Yet Implemented

- Scenario selector UI allowing learners to choose from multiple scenarios per role
- Additional hospice and palliative care scenarios beyond the current two
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
2. **Scenario selector** — Add a screen that lets learners choose from multiple scenarios per role. Required before adding new scenarios.
3. **Persistence and learner history** — Add local or backend session storage so learners can track progress across runs.
4. **Additional hospice scenarios** — Expand the scenario library for both Clinical Liaison and RN. Each new scenario follows the established dispatcher pattern.
5. **AI or MCP integration** — Replace or augment rule-based response generation with AI-powered responses for more naturalistic conversations. Requires backend.
6. **Admin content management** — Interface for adding and editing scenarios, safe language entries, and safety rules without code changes.
7. **Voice mode** — Add speech input and text-to-speech output. Later lane; requires stable UI and content foundation first.
