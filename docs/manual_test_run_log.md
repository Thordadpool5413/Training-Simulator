# Manual Test Run Log — Hospice Communication Training Simulator

> **Template only.** This document does not run tests automatically. The tester fills in each field and table during a live test run.

---

## 1. Test Run Information

| Field | Value |
|---|---|
| Tester Name | Nick Lynch |
| Date | 2026-06-05 |
| App Version or Commit | cc918a7 |
| Device | iPhone (iOS) |
| Operating System | iOS |
| Expo Go or Build Type | Expo Go SDK 54 |
| Test Environment | Local — no backend, no AI, no external APIs |
| Start Time | TBD |
| End Time | TBD |
| Overall Result | In Progress |

---

## 2. Scope of Test

This log records execution results for the current local MVP deterministic manual test path. The test covers the full Clinical Liaison learner journey from the welcome screen through the dashboard using only local rule-based logic.

Reference test script: [docs/manual_test_script.md](manual_test_script.md)

A second RN COPD run log (Part II, Sections 13–21) covers the RN learner journey and medication safety test.

---

## 3. Deterministic Test Path Reminder

> The tester should send the exact phrases in the documented order with no extra turns during the deterministic test path. Extra learner turns may trigger different rule-based responses and will produce results that differ from the expected values in this log.

---

## 4. Step-by-Step Execution Log

| Step # | Test Area | Expected Result | Actual Result | Pass / Fail | Notes |
|---|---|---|---|---|---|
| 1 | Welcome Screen | App loads. Welcome screen displays a Continue button. | Welcome screen loaded. Continue button visible. | Pass | |
| 2 | Role Selection | Role selection screen loads. Clinical Liaison is listed as a selectable option. | Role selection screen loaded. Clinical Liaison listed. | Pass | |
| 3 | Learner Profile | Learner profile form accepts input and allows the tester to proceed. | Form accepted input. Tapping Continue advanced to scenario briefing. | Pass | |
| 4 | Scenario Briefing | Scenario briefing displays the correct scenario title, patient name, setting, and role reminder. | Scenario title, patient name, setting, and role reminder all visible. Start Simulation button present. | Pass | |
| 5 | Simulation Opening Line | Simulation starts. Daughter's opening line appears as the first conversation message. Expected: "My dad is dying and you want to take away his care?" | First message displayed: "Before you start, I just want to say I am not ready to give up on my dad." Wrong opening line. | Fail | See D-001 |
| 6 | Service First Response | After sending the service first phrase, the daughter responds with the guarded objection (exact text per Section 6). | Daughter responded with exact expected text. | Pass | |
| 7 | Repair and Reframe Response | After sending the repair and reframe phrase, the daughter responds with the fear reframe question (exact text per Section 6). | Daughter responded with exact expected text. | Pass | |
| 8 | Intermediate Support Response | After sending the intermediate support phrase, the daughter asks the practical home hospice question (exact text per Section 6). | Daughter responded with exact expected text. | Pass | Restarted after phone-off interruption. |
| 9 | Robert Disclosure | After sending the second support phrase, Robert's quiet disclosure appears (exact text per Section 6). | Robert's disclosure appeared with exact expected text. | Pass | |
| 10 | Medication Question | After sending the Robert response follow-up, the daughter's medication question appears (exact text per Section 6). | Daughter's medication question appeared with exact expected text. | Pass | |
| 11 | Training Pause | After sending the unsafe medication response, the Training Pause system message appears (exact text per Section 6). | Training Pause system message appeared with exact expected text. | Pass | |
| 12 | Safe Medication Routing Response | After sending the safe routing phrase, the daughter accepts that someone should explain it (exact text per Section 6). | Daughter responded with exact expected text. | Pass | |
| 13 | Finish Scenario | Tapping Finish navigates to the feedback screen without error. | Tapped Finish. Navigated to feedback screen without error. | Pass | |
| 14 | Feedback Sections | All ten feedback sections are visible on the feedback screen (see Section 7). | All ten sections visible on feedback screen. | Pass | |
| 15 | Skill Scores Section | Seven skill score rows appear in canonical order. Each row has a category name, score, evidence, and coaching note (see Section 8). | All seven rows present in correct order. Overall Score, Primary Strength, and Primary Growth Area visible. All text human readable. No raw codes or IDs visible. | Pass | |
| 16 | Dashboard Summary | Dashboard displays all nine required fields with expected values (see Section 9). | All nine fields present. All values human readable. Safety Corrections shows 0 instead of expected 1, despite Training Pause firing at Step 11 and safe routing accepted at Step 12. | Fail | See D-002 |
| 17 | Negative Feedback Route | Navigating to the feedback screen before completing a simulation shows: No completed simulation found. | Welcome screen shows only a blue Continue button on a black background. No way to navigate directly to feedback without completing the flow. Negative test not executable via UI. | Blocked | Stack navigation design prevents direct deep-link to /feedback. Empty state cannot be verified without a UI shortcut or deep link. |
| 18 | Negative Dashboard Route | Navigating to the dashboard screen before completing a simulation shows: No completed simulation yet. | Same navigation constraint as Step 17. No UI path to dashboard without completing the flow. Negative test not executable via UI. | Blocked | Stack navigation design prevents direct deep-link to /dashboard. Empty state cannot be verified without a UI shortcut or deep link. |
| 19 | Session Reset on New Role Selection | After completing a simulation, returning to role selection and selecting Clinical Liaison again clears the prior session. | Returned to role selection, selected Clinical Liaison again. Simulation started with empty conversation. No prior session data visible. | Pass | |

---

## 5. Exact Phrase Verification

Confirm that each phrase was sent verbatim during the test run.

| Phrase Label | Expected Phrase | Was Used Exactly | Notes |
|---|---|---|---|
| Service first response | Hospice provides nurses, aides, equipment, medications, and supplies. | Yes / No | |
| Repair and reframe response | I hear that. I should have started there. You are trying to protect him, and hospice can sound like giving up. Hospice does not mean people stop caring. It means the support changes toward comfort, safety, and making sure your family is not alone. | Yes / No | |
| Intermediate support response | That is right. The hospice team would visit at home to make sure he is comfortable and that your family is not alone. | Yes / No | |
| Second support response | The hospice team visits regularly to manage his comfort, and they make sure your family knows what to expect. | Yes / No | |
| Robert response follow-up | Robert, that makes complete sense. Your comfort at home is what matters most. | Yes / No | |
| Unsafe medication response | Yes, give the morphine if he cannot breathe. | Yes / No | |
| Safe medication routing response | That is an important medication question. I do not want to guess about something that important. The hospice nurse or provider should walk through that with you directly. | Yes / No | |

---

## 6. Expected Response Verification

| Trigger | Expected Response | Actual Response | Pass / Fail | Notes |
|---|---|---|---|---|
| Service first response | That sounds like services, but it still sounds like you are saying we stop trying. | | | |
| Repair and reframe response | So you are saying hospice does not mean everyone stops caring for him? | | | |
| Intermediate support response | What would actually happen if we went home with hospice? | | | |
| Second support response | I just do not want to keep coming back here like this. | | | |
| Robert response follow-up | If he gets short of breath at home, am I supposed to give morphine? | | | |
| Unsafe medication response | That response gives medication guidance outside your selected role. Try again by validating the concern and connecting the family with the hospice nurse or provider. | | | |
| Safe medication routing response | Okay. I would want someone to explain that before we are home and scared. | | | |

---

## 7. Feedback Verification

Check each item after navigating to the feedback screen.

**Section presence**
- [ ] Overall Coaching Summary appears
- [ ] What Went Well appears
- [ ] What Changed the Room appears
- [ ] Missed Emotional Cues appears
- [ ] Role Boundary Review appears
- [ ] Medication Safety Review appears
- [ ] Hospice Language Review appears
- [ ] Suggested Wording appears
- [ ] Skill Scores appears
- [ ] Next Practice Focus appears

**Content themes**
- [ ] Feedback mentions the opening daughter statement as an emotional cue
- [ ] Feedback mentions the service first response as leading with services before addressing fear
- [ ] Feedback mentions the repair and reframe response as improving the conversation
- [ ] Feedback mentions the unsafe medication response as a Clinical Liaison role boundary issue
- [ ] Feedback mentions safe medication routing as the correct recovery behavior

---

## 8. Skill Score Verification

Check each item in the Skill Scores section of the feedback screen.

**Summary fields**
- [ ] Overall score appears
- [ ] Primary strength appears
- [ ] Primary growth area appears

**Seven category rows — verify in this order**
- [ ] Emotional Attunement appears
- [ ] Hospice Education appears
- [ ] Objection Handling appears
- [ ] Compliance Safe Language appears
- [ ] Clinical Escalation Judgment appears
- [ ] Trust Building appears
- [ ] Role Boundary Safety appears

**Per-row content**
- [ ] Each score shows a number from zero to four
- [ ] Each score row has human-readable evidence text
- [ ] Each score row has a human-readable coaching note

**No raw data visible**
- [ ] No raw hidden patient state values appear (e.g., numeric trust or fear scores)
- [ ] No raw behavior codes appear (e.g., `emotional_acknowledgment`, `service_explanation_before_emotion`)
- [ ] No internal IDs appear

---

## 9. Dashboard Verification

Check each item on the dashboard screen.

**Field presence**
- [ ] Scenario appears
- [ ] Role appears
- [ ] Scenarios Completed appears
- [ ] Average Score appears
- [ ] Strongest Skill appears
- [ ] Growth Area appears
- [ ] Safety Corrections appears
- [ ] Next Recommended Scenario appears
- [ ] Next Practice Focus appears

**Expected values**
- [ ] Scenario shows: Hospice Means Giving Up
- [ ] Role shows: Clinical Liaison
- [ ] Scenarios Completed shows: 1
- [ ] Average Score uses x.x / 4 format
- [ ] Safety Corrections shows 1 (only when the unsafe medication response was followed by safe medication routing in the same session)

---

## 10. Defect Log

**Severity options:** Critical · High · Medium · Low · Cosmetic

| Defect ID | Step or Area | Description | Expected Behavior | Actual Behavior | Severity | Screenshot or Recording | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|---|---|
| D-001 | Step 5 — Simulation Opening Line | Wrong opening line displayed | "My dad is dying and you want to take away his care?" | "Before you start, I just want to say I am not ready to give up on my dad." | High | None | Fixed | — | Fixed: scenarioTemplates.ts openingLine updated to match test script. |
| D-002 | Step 16 — Dashboard Safety Corrections | Safety Corrections counter shows 0 instead of 1 | 1 (Training Pause fired at Step 11, safe routing accepted at Step 12 in same session) | 0 | High | None | Fixed | — | Fixed: added 'do not want to guess' to MED_ROUTING_REFUSAL_TERMS in patientStateService.ts. |

| D-RN-001 | Part II Step 15 — Dashboard Next Recommended Scenario | Wrong next recommended scenario displayed on clean RN COPD path | Terminal Dyspnea Follow Up Conversation | Plain Language Air Hunger Explanation Practice | Medium | None | Fixed | — | Fixed: added 'fear makes sense' to FEAR_ACK_TERMS in copdPatientStateService.ts. Rule 3 now fires for Phrase 2 and emits air_hunger_explanation. Retested 2026-06-06 — Pass. |

*Add rows as defects are found. Use Defect IDs in format D-001, D-002, etc.*

---

## 11. Retest Log

| Defect ID | Fix Summary | Retest Date | Retest Result | Notes |
|---|---|---|---|---|
| D-001 | openingLine in scenarioTemplates.ts changed to "My dad is dying and you want to take away his care?" | 2026-06-05 | Pass | Opening line confirmed on retest. |
| D-002 | 'do not want to guess' added to MED_ROUTING_REFUSAL_TERMS in patientStateService.ts | 2026-06-05 | Pass | Safety Corrections shows 1 on dashboard after full deterministic path. |

*Add a row for each defect that has been fixed and retested.*

---

## 12. Final Signoff

| Field | Value |
|---|---|
| Overall Pass or Fail | Pass |
| Critical Defects Open | 0 |
| High Defects Open | 0 |
| Ready for Next Packet | Yes |
| Tester Signoff | Nick Lynch — 2026-06-05 |
| Reviewer Signoff | |
| Final Notes | D-001 and D-002 fixed and retested 2026-06-05. Steps 17 and 18 blocked by Stack navigation design — negative test coverage gap, not a defect. All other steps pass. |

---

## Part II: RN — COPD Air Hunger at Home

---

## 13. RN COPD: Test Run Information

| Field | Value |
|---|---|
| Tester Name | Nick Lynch |
| Date | 2026-06-05 |
| App Version or Commit | cc918a7 |
| Device | iPhone (iOS) |
| Operating System | iOS |
| Expo Go or Build Type | Expo Go SDK 54 |
| Test Environment | Local — no backend, no AI, no external APIs |
| Start Time | 2026-06-05 |
| End Time | 2026-06-05 |
| Overall Result | Pass — all defects resolved |

---

## 14. RN COPD: Step-by-Step Execution Log

| Step # | Test Area | Expected Result | Actual Result | Pass / Fail | Notes |
|---|---|---|---|---|---|
| 1 | Welcome Screen | App loads. Continue button visible. | Welcome screen loaded. Blue Continue button visible on black background. | Pass | |
| 2 | Role Selection | RN listed as selectable option. | Role selection screen loaded. Clinical Liaison and RN both listed as selectable options. | Pass | |
| 3 | Learner Profile | Form accepts input. Tapping Continue advances to scenario briefing. | Profile form accepted input. Tapping Continue advanced to scenario briefing. | Pass | |
| 4 | Scenario Briefing | COPD Air Hunger at Home title, Harold, Margaret, and role reminder visible. Start Simulation button present. | COPD Air Hunger at Home briefing appeared. Harold, Margaret, role reminder, and Start Simulation button all confirmed visible. | Pass | |
| 5 | Simulation Opening Line | Margaret's opening line appears: "He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do." | Exact match. | Pass | |
| 6 | Phrase 1 — Fear Acknowledgment | No Training Pause. Margaret responds: "I just keep thinking he is going to suffocate right in front of me." | Exact match. No Training Pause. | Pass | |
| 7 | Phrase 2 — Air Hunger Explanation | No Training Pause. Margaret responds: "But the oxygen is already on. If the oxygen is not fixing it, what else can we even do?" | Exact match. No Training Pause. | Pass | |
| 8 | Phrase 3 — Comfort Tools | No Training Pause. Margaret responds: "Are you talking about the morphine? I am scared that will make his breathing stop." | Exact match. No Training Pause. | Pass | |
| 9 | Phrase 4 — Safe Medication Routing | No Training Pause. Margaret responds: "Okay. I need someone to tell me exactly what to do because I feel like I am going to make the wrong choice." | Exact match. No Training Pause. | Pass | |
| 10 | Phrase 5 — Caregiver Empowerment | No Training Pause. Harold responds: "Please do not leave her alone with this." | Exact match. Harold was the speaker. No Training Pause. | Pass | |
| 11 | Phrase 6 — Harold Acknowledgment | No Training Pause. Margaret responds: "Okay. I can do that if someone stays with me through the first steps." | Exact match. Margaret was the speaker. No Training Pause. | Pass | |
| 12 | Finish Scenario | Tapping Finish navigates to the feedback screen without error. | Navigated to feedback screen without error. | Pass | |
| 13 | Feedback Sections | All ten feedback sections visible with RN COPD themes. | All ten sections present. Content confirmed RN COPD specific. | Pass | |
| 14 | Skill Scores Section | Seven RN rows in order: Emotional Attunement, Symptom Communication, Comfort Education, Role Boundary Safety, Caregiver Empowerment, Clinical Escalation Judgment, Trust Building. All text human readable. No raw codes or IDs visible. | All seven rows present in correct order. Scores, evidence, and coaching notes human readable. No raw codes visible. | Pass | |
| 15 | Dashboard Summary | Scenario: COPD Air Hunger at Home. Role: RN. Safety Corrections: 0. Next Recommended Scenario: Terminal Dyspnea Follow Up Conversation. All nine fields present and human readable. | Scenario, Role, Scenarios Completed, Safety Corrections all correct. Next Recommended Scenario shows "Plain Language Air Hunger Explanation Practice" instead of "Terminal Dyspnea Follow Up Conversation." | Fail | See D-RN-001. |

---

## 15. RN COPD: Phrase Verification

Confirm that each phrase was sent verbatim during the test run.

| Phrase Label | Expected Phrase | Was Used Exactly | Notes |
|---|---|---|---|
| Phrase 1 — Fear acknowledgment | I can hear how scared you are. Watching someone struggle to breathe is terrifying. I am going to stay with you and help you focus on what we can do right now. | Yes / No | |
| Phrase 2 — Air hunger explanation | That fear makes sense. Air hunger can look terrifying, and it can feel terrifying for him. It does not always mean he is suffocating the way it looks. Our goal is to ease that feeling and help his body settle. | Yes / No | |
| Phrase 3 — Comfort tools | Oxygen helps some people, but air hunger is not always fixed by turning oxygen higher. Right now we can help him sit upright, keep the room cool, use calm breathing with him, and follow the hospice comfort plan. | Yes / No | |
| Phrase 4 — Safe medication routing | I understand why that scares you. Comfort medication is used to ease the feeling of air hunger, not to abandon him. I do not want to guess at amounts. We follow the hospice orders and call the on-call provider if there is any question. | Yes / No | |
| Phrase 5 — Caregiver empowerment | You are not alone in this. First, sit him upright and stay beside him. I will help you call the hospice team now so we can review the comfort plan and make sure you know the next step. | Yes / No | |
| Phrase 6 — Harold acknowledgment | Harold, I hear you. We are not leaving Margaret alone with this. We are going to stay focused on your comfort and make sure she has the hospice team with her. | Yes / No | |

---

## 16. RN COPD: Expected Response Verification

| Trigger | Expected Response | Actual Response | Pass / Fail | Notes |
|---|---|---|---|---|
| Phrase 1 | I just keep thinking he is going to suffocate right in front of me. | | | |
| Phrase 2 | But the oxygen is already on. If the oxygen is not fixing it, what else can we even do? | | | |
| Phrase 3 | Are you talking about the morphine? I am scared that will make his breathing stop. | | | |
| Phrase 4 | Okay. I need someone to tell me exactly what to do because I feel like I am going to make the wrong choice. | | | |
| Phrase 5 | Please do not leave her alone with this. | | | |
| Phrase 6 | Okay. I can do that if someone stays with me through the first steps. | | | |

---

## 17. RN COPD: Feedback Verification

Check each item after navigating to the feedback screen.

**Section presence**
- [ ] Overall Coaching Summary appears
- [ ] What Went Well appears
- [ ] What Changed the Room appears
- [ ] Missed Emotional Cues appears
- [ ] Role Boundary Review appears
- [ ] Medication Safety Review appears
- [ ] Hospice Language Review appears (repurposed as air hunger and comfort language review for RN COPD)
- [ ] Suggested Wording appears
- [ ] Skill Scores appears
- [ ] Next Practice Focus appears

**Content themes**
- [ ] Margaret's opening line is referenced as a statement of terror, not a clinical question
- [ ] Fear acknowledgment before clinical education is noted
- [ ] Air hunger explanation in plain language is noted
- [ ] Comfort tools and caregiver empowerment are noted
- [ ] Safe medication routing is noted as correct role boundary behavior
- [ ] Suggested wording examples reference RN COPD language, not Clinical Liaison hospice objection language

---

## 18. RN COPD: Skill Score Verification

Check each item in the Skill Scores section of the feedback screen.

**Summary fields**
- [ ] Overall score appears
- [ ] Primary strength appears
- [ ] Primary growth area appears

**Seven category rows — verify in this order**
- [ ] Emotional Attunement appears
- [ ] Symptom Communication appears
- [ ] Comfort Education appears
- [ ] Role Boundary Safety appears
- [ ] Caregiver Empowerment appears
- [ ] Clinical Escalation Judgment appears
- [ ] Trust Building appears

**Per-row content**
- [ ] Each score shows a number from zero to four
- [ ] Each row has human-readable evidence text
- [ ] Each row has a human-readable coaching note

**No raw data visible**
- [ ] No raw behavior codes appear (e.g., `fear_acknowledgment`, `air_hunger_explanation`)
- [ ] No raw patient state values appear
- [ ] No internal IDs appear

---

## 19. RN COPD: Dashboard Verification

Check each item on the dashboard screen.

**Field presence**
- [ ] Scenario appears
- [ ] Role appears
- [ ] Scenarios Completed appears
- [ ] Average Score appears
- [ ] Strongest Skill appears
- [ ] Growth Area appears
- [ ] Safety Corrections appears
- [ ] Next Recommended Scenario appears
- [ ] Next Practice Focus appears

**Expected values (clean path)**
- [ ] Scenario shows: COPD Air Hunger at Home
- [ ] Role shows: RN
- [ ] Scenarios Completed shows: 1
- [ ] Average Score uses x.x / 4 format
- [ ] Safety Corrections shows: 0
- [ ] Next Recommended Scenario shows: Terminal Dyspnea Follow Up Conversation

---

## 20. RN Medication Safety Test: Execution Log

Reset the app before this test. Select the **RN** role. Start the **COPD Air Hunger at Home** simulation. Send Phrase 1 to establish conversation context before testing unsafe input.

| Step # | Test Area | Expected Result | Actual Result | Pass / Fail | Notes |
|---|---|---|---|---|---|
| 1 | Start RN COPD session | RN role selected. COPD Air Hunger at Home briefing appears. Simulation starts. Margaret's opening line appears. | | | |
| 2 | Send Phrase 1 | No Training Pause. Margaret responds with suffocation fear line. | | | |
| 3 | Send unsafe dose phrase | Training Pause fires. Margaret does not respond. Exact message verified (see below). | Training Pause fired. Margaret did not respond. Verbatim message confirmed. | Pass | |
| 4 | Send safe recovery phrase | No Training Pause. Margaret or fallback response appears. | No Training Pause. Margaret responded: "Okay. I need someone to tell me exactly what to do because I feel like I am going to make the wrong choice." | Pass | |
| 5 | Tap Finish and view Dashboard | Safety Corrections shows 1. | Safety Corrections shows 1. | Pass | |

**Unsafe phrase sent at Step 3:**
> Give him 2 milligrams of morphine.

**Expected Training Pause message — verify verbatim:**
> That response states or changes a medication dose, which goes beyond what can be confirmed without the hospice orders in front of us. Try again by validating the concern, confirming that comfort medications are part of the plan of care, and routing exact dose instructions to the hospice orders or on call provider.

**Safe recovery phrase sent at Step 4:**
> I do not want to guess at amounts. We follow the hospice orders and call the on call provider so we can review the exact instructions together.

---

## 21. Part II Final Signoff

| Field | Value |
|---|---|
| Overall Pass or Fail | Pass |
| Critical Defects Open | 0 |
| High Defects Open | 0 |
| Ready for Next Packet | Yes |
| Tester Signoff | Nick Lynch — 2026-06-06 |
| Reviewer Signoff | |
| Final Notes | RN COPD path passed after D-RN-001 retest 2026-06-06. Next Recommended Scenario confirmed: Terminal Dyspnea Follow Up Conversation. Safety Corrections confirmed: 0. Zero open defects across both Clinical Liaison and RN COPD paths. |

---

## Part III: Clinical Liaison — Hospice Is Only for the Last Few Days

---

## 22. CL Hospice Too Soon: Test Run Information

| Field | Value |
|---|---|
| Tester Name | Nick Lynch |
| Date | 2026-06-06 |
| App Version or Commit | 0516031 |
| Device | iPhone (iOS) |
| Operating System | iOS |
| Expo Go or Build Type | Expo Go SDK 54 |
| Test Environment | Local — no backend, no AI, no external APIs |
| Test Type | Smoke test — Packet 18 acceptance |
| Formal Deterministic Path | Pending |
| Overall Result | Smoke tested — no defects found |

---

## 23. CL Hospice Too Soon: Scope of Test

This log records the Packet 18 acceptance smoke test for the Hospice Is Only for the Last Few Days scenario. A formal deterministic path run following the test script in Part III of manual_test_script.md has not yet been executed.

Reference test script: [docs/manual_test_script.md](manual_test_script.md) — Part III, Sections 21–28.

---

## 24. CL Hospice Too Soon: What Was Verified in the Smoke Test

| Check | Result |
|---|---|
| TypeScript passes with zero errors | Pass |
| CL scenario selector shows exactly two cards: Hospice Means Giving Up and Hospice Is Only for the Last Few Days | Pass |
| Briefing shows Gloria Santos, age 72, Hospital room, Advanced pancreatic cancer, correct learner objective, correct role reminder | Pass |
| Simulation opens with Marcus's opening line (exact text verified) | Pass |
| Speaker label on opening message is Marcus, not Daughter | Pass |
| Phrase with emotional validation terms produces Rule 1 Marcus response — I just do not want to give up on her too soon. She is still herself. | Pass |
| Phrase with hospice timing terms produces Rule 2 Marcus response — So hospice can start before someone is down to the last few days? | Pass |
| Unsafe medication phrase fires Clinical Liaison Training Pause | Pass |
| Feedback screen renders without crash | Pass |
| Skill Scores section renders without crash | Pass |
| Dashboard renders without crash | Pass |
| Dashboard scenario title shows Hospice Is Only for the Last Few Days | Pass |
| Hospice Means Giving Up scenario still opens and responds correctly (regression) | Pass |
| RN COPD scenario still opens and responds correctly (regression) | Pass |

---

## 25. CL Hospice Too Soon: What Was Not Verified in the Smoke Test

The following items were not covered in the Packet 18 acceptance smoke test. They require the full deterministic path test per manual_test_script.md Part III.

- Full six-phrase deterministic path (only Phrases 1 and 2 were tested)
- Marcus Rule 3 response — Would she still get help with symptoms, or does that stop when treatment stops?
- Marcus Rule 4 response — She keeps telling me she just wants to feel like herself. I thought there was more time.
- Marcus Rule 5 (reframe) response
- Marcus fallback response after safe medication routing (Phrase 6)
- Exact dashboard Safety Corrections value after the full deterministic path including Phrase 5 and Phrase 6
- Exact Next Recommended Scenario value on dashboard
- All ten feedback section themes specific to this scenario
- Seven skill score rows in correct order with human-readable content
- Negative tests for this scenario

---

## 26. CL Hospice Too Soon: Defect Log

No defects found during smoke test.

| Defect ID | Step or Area | Description | Expected Behavior | Actual Behavior | Severity | Screenshot or Recording | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|---|---|

*Add rows as defects are found using format D-P3-001, D-P3-002, etc.*

---

## 27. Part III Signoff

| Field | Value |
|---|---|
| Smoke Test Result | Pass |
| Formal Deterministic Path | Pending |
| Critical Defects Open | 0 |
| High Defects Open | 0 |
| Tester Signoff | Nick Lynch — 2026-06-06 |
| Reviewer Signoff | |
| Final Notes | Packet 18 acceptance smoke test passed on 2026-06-06 at commit 0516031. Zero defects found. Full deterministic path per manual_test_script.md Part III not yet executed. |
