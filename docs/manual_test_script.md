# Manual Test Script — Hospice Communication Training Simulator

> **Deterministic path note:** For the deterministic path test, send the test phrases in the documented order with no extra turns between them. Extra learner turns may trigger different rule-based responses and should be tested separately.

---

## 1. Test Purpose

This script validates the full local MVP learner loop from the welcome screen through the dashboard. It confirms that every stage of the Clinical Liaison learner journey — role selection, learner profile, scenario briefing, simulation, feedback, skill scoring, and dashboard — behaves correctly using local rule-based logic with no backend or AI required.

A second path covers the RN role using the COPD Air Hunger at Home scenario (Sections 12–20).

---

## 2. Pre-Test Conditions

- The app runs locally on a device or simulator.
- The learner starts from the welcome screen.
- No backend is required.
- No AI is required.
- No external APIs are required.
- The test uses the **Clinical Liaison** role.
- The test uses the **Hospice Means Giving Up** scenario.
- The tester must send the deterministic test phrases in the documented order with no extra turns between them.

> This section describes pre-test conditions for the **Clinical Liaison** path (Sections 3–10). RN COPD pre-test conditions are in Section 12.

---

## 3. Full Learner Journey Test

1. Open the app.
2. On the welcome screen, tap **Continue**.
3. On the role selection screen, select **Clinical Liaison**.
4. Complete the learner profile form and tap **Continue** to proceed.
5. Review the scenario briefing for the Hospice Means Giving Up scenario. Confirm the patient name, setting, and role reminder are visible.
6. Tap **Start Simulation**.
7. Confirm the daughter's opening line appears as the first message in the conversation.
8. Send the **service first response** (see Section 4).
9. Confirm the daughter remains guarded (see Section 5 for expected text).
10. Send the **repair and reframe response** (see Section 4).
11. Confirm the daughter softens and asks whether hospice means people stop caring (see Section 5).
12. Send the **intermediate support response** (see Section 4).
13. Confirm the daughter asks the practical home hospice question (see Section 5).
14. Send the **second support response** (see Section 4).
15. Confirm Robert's quiet disclosure appears (see Section 5).
16. Send the **Robert response follow-up** (see Section 4).
17. Confirm the daughter's medication question appears (see Section 5).
18. Send the **unsafe medication response** (see Section 4).
19. Confirm the Training Pause system message appears (see Section 5).
20. Send the **safe medication routing response** (see Section 4).
21. Confirm the daughter accepts that someone should explain it (see Section 5).
22. Tap **Finish** to end the simulation.
23. On the feedback screen, review all feedback sections (see Section 6).
24. Scroll to the Skill Scores section and review all seven score rows (see Section 7).
25. Tap **View Dashboard**.
26. On the dashboard screen, review all summary fields (see Section 8).

---

## 4. Exact Test Phrases

Send these phrases verbatim in the order listed. Do not add extra turns between them.

**Service first response**
> Hospice provides nurses, aides, equipment, medications, and supplies.

**Repair and reframe response**
> I hear that. I should have started there. You are trying to protect him, and hospice can sound like giving up. Hospice does not mean people stop caring. It means the support changes toward comfort, safety, and making sure your family is not alone.

**Intermediate support response**
> That is right. The hospice team would visit at home to make sure he is comfortable and that your family is not alone.

**Second support response**
> The hospice team visits regularly to manage his comfort, and they make sure your family knows what to expect.

**Robert response follow-up**
> Robert, that makes complete sense. Your comfort at home is what matters most.

**Unsafe medication response**
> Yes, give the morphine if he cannot breathe.

**Safe medication routing response**
> That is an important medication question. I do not want to guess about something that important. The hospice nurse or provider should walk through that with you directly.

---

## 5. Expected Simulation Results

| After this learner message | Expected response |
|---|---|
| Service first response | That sounds like services, but it still sounds like you are saying we stop trying. |
| Repair and reframe response | So you are saying hospice does not mean everyone stops caring for him? |
| Intermediate support response | What would actually happen if we went home with hospice? |
| Second support response | I just do not want to keep coming back here like this. |
| Robert response follow-up | If he gets short of breath at home, am I supposed to give morphine? |
| Unsafe medication response | That response gives medication guidance outside your selected role. Try again by validating the concern and connecting the family with the hospice nurse or provider. |
| Safe medication routing response | Okay. I would want someone to explain that before we are home and scared. |

**Notes:**
- The response after the unsafe medication response is a **Training Pause** system message, not a daughter message.
- The response after the safe medication routing response comes from **Daughter** with sender `family`.

---

## 6. Expected Feedback Results

After tapping Finish, the feedback screen should display all ten of the following sections:

- Overall Coaching Summary
- What Went Well
- What Changed the Room
- Missed Emotional Cues
- Role Boundary Review
- Medication Safety Review
- Hospice Language Review
- Suggested Wording
- Skill Scores
- Next Practice Focus

**Expected feedback themes to verify:**

- The opening daughter statement ("My dad is dying and you want to take away his care?") is identified as an emotional cue.
- The learner's first response is noted as leading with services before addressing the emotional concern.
- The repair and reframe response is acknowledged as improving the conversation.
- The unsafe medication response is flagged as a Clinical Liaison role boundary issue.
- Safe medication routing is noted as the correct recovery behavior.
- Suggested wording examples remain within the Clinical Liaison role and do not include medication instructions.

---

## 7. Expected Skill Score Results

The Skill Scores section should display:

- An **Overall Score** shown as a decimal out of 4 (for example, 2.1 / 4).
- A **Primary Strength** label identifying the highest-scoring category.
- A **Primary Growth Area** label identifying the lowest-scoring category.
- **Seven score rows** in the following order:

| # | Category |
|---|---|
| 1 | Emotional Attunement |
| 2 | Hospice Education |
| 3 | Objection Handling |
| 4 | Compliance Safe Language |
| 5 | Clinical Escalation Judgment |
| 6 | Trust Building |
| 7 | Role Boundary Safety |

**For each row, verify:**
- The category name is human readable (matches the list above exactly).
- The score is a number from 0 to 4.
- The evidence text is human readable (no raw behavior codes such as `emotional_acknowledgment` or `service_explanation_before_emotion`).
- The coaching note is human readable.
- No raw patient state values, raw safety event objects, or internal IDs are visible.

**Exact numeric scores are not required** for this test unless the deterministic path makes a specific score obvious. The tester should confirm all seven rows appear and all text is human readable.

---

## 8. Expected Dashboard Results

The dashboard should display the following fields. Tap **View Dashboard** from the feedback screen to reach it.

| Field | Expected value |
|---|---|
| Scenario | Hospice Means Giving Up |
| Role | Clinical Liaison |
| Scenarios Completed | 1 |
| Average Score | Displayed as x.x / 4 |
| Strongest Skill | Human readable category name |
| Growth Area | Human readable category name |
| Safety Corrections | 1 (because the unsafe medication response was followed by safe medication routing in the same session) |
| Next Recommended Scenario | Human readable scenario name |
| Next Practice Focus | Human readable coaching text |

**Safety Corrections notes:**
- Safety Corrections shows **1** only when the unsafe medication response occurred and was followed by safe medication routing in the same session. This is the expected result for the deterministic test path.
- If the tester skips the unsafe medication step, Safety Corrections should show 0.

---

## 9. Negative Tests

Run these tests independently from the main journey test. Reset the app between each negative test.

---

**Negative test 1: Feedback screen before completing a simulation**

1. Open the app and navigate directly to the feedback screen without completing a simulation.

Expected result:
> No completed simulation found.

The screen should display this message and a button to return to role selection.

---

**Negative test 2: Dashboard screen before completing a simulation**

1. Open the app and navigate directly to the dashboard screen without completing a simulation.

Expected result:
> No completed simulation yet.

The screen should display this message and a button to start practice.

---

**Negative test 3: Session reset on new role selection**

1. Complete a full simulation session.
2. Navigate back to the role selection screen.
3. Select Clinical Liaison again to start a new session.

Expected result: The prior simulation session is cleared. The conversation, safety events, and patient state snapshots from the previous session do not appear in the new simulation.

---

**Negative test 4: Safe routing phrase before medication question appears**

1. Start a simulation but do not progress past the opening line.
2. Send the safe medication routing phrase before the daughter has asked the morphine question:
   > That is an important medication question. I do not want to guess about something that important. The hospice nurse or provider should walk through that with you directly.

Expected result: The daughter does **not** respond with "Okay. I would want someone to explain that before we are home and scared." The safe medication routing acceptance response requires the medication question to already appear in conversation history.

---

## 10. Pass or Fail Checklist

Use this checklist when executing the full learner journey test.

- [ ] Welcome screen loads and displays a Continue button.
- [ ] Role selection screen lists Clinical Liaison as a selectable option.
- [ ] Learner profile form accepts input and allows the tester to proceed.
- [ ] Scenario briefing displays the correct scenario title, patient name, and role reminder.
- [ ] Simulation starts and the daughter's opening line appears as the first message.
- [ ] After the service first response, the daughter responds with the guarded objection (exact text verified).
- [ ] After the repair and reframe response, the daughter responds with the fear reframe question (exact text verified).
- [ ] After the intermediate support response, the daughter asks the practical home hospice question (exact text verified).
- [ ] After the second support response, Robert's quiet disclosure appears (exact text verified).
- [ ] After the Robert response follow-up, the daughter's medication question appears (exact text verified).
- [ ] After the unsafe medication response, the Training Pause system message appears (exact text verified).
- [ ] After the safe medication routing response, the daughter accepts that someone should explain it (exact text verified).
- [ ] Feedback screen displays all ten required sections.
- [ ] Seven skill score rows appear in the correct order: Emotional Attunement, Hospice Education, Objection Handling, Compliance Safe Language, Clinical Escalation Judgment, Trust Building, Role Boundary Safety.
- [ ] Each skill score row displays a human-readable category name, a score from 0 to 4, human-readable evidence, and a human-readable coaching note. No raw codes or IDs are visible.
- [ ] Dashboard displays all nine required fields with expected values.
- [ ] Navigating to feedback before completing a simulation shows the correct empty state message.
- [ ] Navigating to dashboard before completing a simulation shows the correct empty state message.
- [ ] Starting a new role selection after a completed simulation clears the prior session.

---

## 11. Known Limitations

The following limitations apply to the current MVP build and are expected behavior, not defects.

- No AI response layer yet. All daughter and Robert responses are generated by local rule-based logic.
- No saved progress yet. Session state is lost when the app is closed or restarted.
- No backend yet. All logic runs locally on the device.
- No database yet. No session history is persisted between runs.
- No voice mode yet. All input is text only.
- Three scenarios are active: Hospice Means Giving Up (Clinical Liaison), Hospice Is Only for the Last Few Days (Clinical Liaison), and COPD Air Hunger at Home (RN).
- All logic is local and rule-based. Response rules fire based on keyword matching and conversation history flags, not natural language understanding.
- Dashboard reflects the current session only. There is no multi-session aggregate score.
- This manual script validates the current deterministic MVP path, not all possible learner wording. Learners using different phrasing may trigger different rule-based responses.

---

## 12. RN COPD: Pre-Test Conditions

- The app runs locally on a device or simulator.
- The learner starts from the welcome screen.
- No backend is required. No AI is required. No external APIs are required.
- The test uses the **RN** role.
- The test uses the **COPD Air Hunger at Home** scenario.
- The tester must send the deterministic test phrases in the documented order with no extra turns between them.

---

## 13. RN COPD: Full Learner Journey Test

1. Open the app.
2. On the welcome screen, tap **Continue**.
3. On the role selection screen, confirm **RN** is listed as a selectable option. Select **RN**.
4. Complete the learner profile form and tap **Continue** to proceed.
5. Review the scenario briefing for the COPD Air Hunger at Home scenario. Confirm the patient name (Harold), caregiver name (Margaret), setting, and role reminder are visible.
6. Tap **Start Simulation**.
7. Confirm Margaret's opening line appears as the first message in the conversation.
8. Send **Phrase 1** (fear acknowledgment — see Section 14).
9. Confirm Margaret responds with the suffocation fear line (see Section 15 for expected text).
10. Send **Phrase 2** (air hunger explanation — see Section 14).
11. Confirm Margaret responds with the oxygen question (see Section 15 for expected text).
12. Send **Phrase 3** (comfort tools — see Section 14).
13. Confirm Margaret raises the morphine fear (see Section 15 for expected text).
14. Send **Phrase 4** (safe medication routing — see Section 14).
15. Confirm Margaret expresses she needs direction (see Section 15 for expected text).
16. Send **Phrase 5** (caregiver empowerment — see Section 14).
17. Confirm Harold responds asking not to leave Margaret alone (see Section 15 for expected text).
18. Send **Phrase 6** (Harold acknowledgment — see Section 14).
19. Confirm Margaret gives the closing response (see Section 15 for expected text).
20. Confirm no Training Pause fired during any of steps 8–19.
21. Tap **Finish** to end the simulation.
22. On the feedback screen, review all feedback sections (see Section 16).
23. Scroll to the Skill Scores section and review all seven RN score rows (see Section 17).
24. Tap **View Dashboard**.
25. On the dashboard screen, review all summary fields (see Section 18).

---

## 14. RN COPD: Exact Test Phrases

Send these phrases verbatim in the order listed. Do not add extra turns between them.

**Phrase 1 — Fear acknowledgment**
> I can hear how scared you are. Watching someone struggle to breathe is terrifying. I am going to stay with you and help you focus on what we can do right now.

**Phrase 2 — Air hunger explanation**
> That fear makes sense. Air hunger can look terrifying, and it can feel terrifying for him. It does not always mean he is suffocating the way it looks. Our goal is to ease that feeling and help his body settle.

**Phrase 3 — Comfort tools**
> Oxygen helps some people, but air hunger is not always fixed by turning oxygen higher. Right now we can help him sit upright, keep the room cool, use calm breathing with him, and follow the hospice comfort plan.

**Phrase 4 — Safe medication routing**
> I understand why that scares you. Comfort medication is used to ease the feeling of air hunger, not to abandon him. I do not want to guess at amounts. We follow the hospice orders and call the on-call provider if there is any question.

**Phrase 5 — Caregiver empowerment**
> You are not alone in this. First, sit him upright and stay beside him. I will help you call the hospice team now so we can review the comfort plan and make sure you know the next step.

**Phrase 6 — Harold acknowledgment**
> Harold, I hear you. We are not leaving Margaret alone with this. We are going to stay focused on your comfort and make sure she has the hospice team with her.

---

## 15. RN COPD: Expected Simulation Results

Margaret's opening line (first message in simulation):
> He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do.

| After this learner phrase | Expected response | Speaker |
|---|---|---|
| Phrase 1 — Fear acknowledgment | I just keep thinking he is going to suffocate right in front of me. | Margaret (family) |
| Phrase 2 — Air hunger explanation | But the oxygen is already on. If the oxygen is not fixing it, what else can we even do? | Margaret (family) |
| Phrase 3 — Comfort tools | Are you talking about the morphine? I am scared that will make his breathing stop. | Margaret (family) |
| Phrase 4 — Safe medication routing | Okay. I need someone to tell me exactly what to do because I feel like I am going to make the wrong choice. | Margaret (family) |
| Phrase 5 — Caregiver empowerment | Please do not leave her alone with this. | Harold (patient) |
| Phrase 6 — Harold acknowledgment | Okay. I can do that if someone stays with me through the first steps. | Margaret (family) |

**Notes:**
- No Training Pause fires during the clean path.
- Harold speaks after Phrase 5. All other responses are from Margaret.

---

## 16. RN COPD: Expected Feedback Results

After tapping Finish, the feedback screen should display all ten of the following sections:

- Overall Coaching Summary
- What Went Well
- What Changed the Room
- Missed Emotional Cues
- Role Boundary Review
- Medication Safety Review
- Hospice Language Review
- Suggested Wording
- Skill Scores
- Next Practice Focus

**Expected RN COPD feedback themes to verify:**

- Margaret's opening line is identified as a statement of terror, not a question about clinical steps.
- Fear acknowledgment before clinical education is noted as the correct first move.
- Air hunger explanation in plain language is noted as a key moment.
- Comfort tools and caregiver empowerment are noted as concrete next steps.
- Safe medication routing is noted as correct role boundary behavior.
- Suggested wording examples reference RN COPD language (not Clinical Liaison hospice objection language).
- Hospice Language Review is repurposed as an air hunger and comfort language review for this scenario.

---

## 17. RN COPD: Expected Skill Score Results

The Skill Scores section should display:

- An **Overall Score** shown as a decimal out of 4 (for example, 3.1 / 4).
- A **Primary Strength** label identifying the highest-scoring category.
- A **Primary Growth Area** label identifying the lowest-scoring category.
- **Seven score rows** in the following order:

| # | Category |
|---|---|
| 1 | Emotional Attunement |
| 2 | Symptom Communication |
| 3 | Comfort Education |
| 4 | Role Boundary Safety |
| 5 | Caregiver Empowerment |
| 6 | Clinical Escalation Judgment |
| 7 | Trust Building |

**For each row, verify:**
- The category name is human readable (matches the list above exactly).
- The score is a number from 0 to 4.
- The evidence text is human readable (no raw behavior codes such as `fear_acknowledgment` or `air_hunger_explanation`).
- The coaching note is human readable.
- No raw patient state values, raw safety event objects, or internal IDs are visible.

**Exact numeric scores are not required** for this test. Confirm all seven rows appear and all text is human readable.

---

## 18. RN COPD: Expected Dashboard Results

The dashboard should display the following fields. Tap **View Dashboard** from the feedback screen to reach it.

| Field | Expected value |
|---|---|
| Scenario | COPD Air Hunger at Home |
| Role | RN |
| Scenarios Completed | 1 |
| Average Score | Displayed as x.x / 4 |
| Strongest Skill | Human readable category name |
| Growth Area | Human readable category name |
| Safety Corrections | 0 (clean path — no unsafe dose language sent) |
| Next Recommended Scenario | Terminal Dyspnea Follow Up Conversation |
| Next Practice Focus | Human readable coaching text |

**Safety Corrections notes:**
- Safety Corrections shows **0** on the clean path because no unsafe dose language was sent.
- Safety Corrections shows **1** only when an unsafe dose phrase occurred and was followed by safe recovery behavior in the same session. See Section 19 for the medication safety test.

---

## 19. RN COPD: Medication Safety Test

Run this test independently from the main journey test. Reset the app before running it.

**Setup:** Select the **RN** role. Start the **COPD Air Hunger at Home** simulation. Send Phrase 1 to establish conversation context before testing unsafe input.

**Step 1 — Send the unsafe dose phrase:**
> Give him 2 milligrams of morphine.

**Expected result:** Training Pause system message appears. Margaret does not respond. Verify the message text is exactly:
> That response states or changes a medication dose, which goes beyond what can be confirmed without the hospice orders in front of us. Try again by validating the concern, confirming that comfort medications are part of the plan of care, and routing exact dose instructions to the hospice orders or on call provider.

**Step 2 — Send the safe recovery phrase:**
> I do not want to guess at amounts. We follow the hospice orders and call the on call provider so we can review the exact instructions together.

**Expected result:** No Training Pause fires. Margaret or a fallback response appears in the conversation.

**Step 3 — Tap Finish and view the dashboard.**

**Expected result:** Safety Corrections shows **1** (unsafe dose phrase occurred and was followed by safe recovery behavior in the same session).

---

## 20. RN COPD: Pass or Fail Checklist

Use this checklist when executing the RN COPD learner journey test and the medication safety test.

- [ ] Welcome screen loads and displays a Continue button.
- [ ] Role selection screen lists **RN** as a selectable option.
- [ ] Learner profile form accepts input and allows the tester to proceed.
- [ ] Scenario briefing displays the COPD Air Hunger at Home title, patient name (Harold), caregiver name (Margaret), and role reminder.
- [ ] Simulation starts and Margaret's opening line appears as the first message: "He keeps saying he cannot breathe. I am scared he is suffocating and I do not know what to do."
- [ ] After Phrase 1, Margaret responds with the suffocation fear line (exact text verified).
- [ ] After Phrase 2, Margaret responds with the oxygen question (exact text verified).
- [ ] After Phrase 3, Margaret raises the morphine fear (exact text verified).
- [ ] After Phrase 4, Margaret expresses she needs direction (exact text verified).
- [ ] After Phrase 5, Harold responds asking not to leave Margaret alone (exact text verified).
- [ ] After Phrase 6, Margaret gives the closing response (exact text verified).
- [ ] No Training Pause fires during the clean path (steps after each of the six phrases above).
- [ ] Feedback screen displays all ten required sections.
- [ ] Seven skill score rows appear in the correct RN order: Emotional Attunement, Symptom Communication, Comfort Education, Role Boundary Safety, Caregiver Empowerment, Clinical Escalation Judgment, Trust Building.
- [ ] Each skill score row displays a human-readable category name, a score from 0 to 4, human-readable evidence, and a human-readable coaching note. No raw codes or IDs are visible.
- [ ] Dashboard displays all nine required fields. Scenario shows COPD Air Hunger at Home. Role shows RN. Safety Corrections shows 0. Next Recommended Scenario shows Terminal Dyspnea Follow Up Conversation.
- [ ] RN medication safety test: unsafe dose phrase fires the Training Pause with exact verbatim message (verified character for character).
- [ ] RN medication safety test: safe recovery phrase does not fire a Training Pause.
- [ ] RN medication safety test: dashboard Safety Corrections shows 1 after unsafe dose phrase followed by safe recovery in the same session.

---

## Part III: Clinical Liaison — Hospice Is Only for the Last Few Days

---

## 21. CL Hospice Too Soon: Pre-Test Conditions

- The app runs locally on a device or simulator.
- The learner starts from the welcome screen.
- No backend is required. No AI is required. No external APIs are required.
- The test uses the **Clinical Liaison** role.
- The test uses the **Hospice Is Only for the Last Few Days** scenario.
- The scenario selector will show two Clinical Liaison cards. Select the correct one.
- The tester must send the deterministic test phrases in the documented order with no extra turns between them.

---

## 22. CL Hospice Too Soon: Full Learner Journey Test

1. Open the app.
2. On the welcome screen, tap **Continue**.
3. On the role selection screen, select **Clinical Liaison**.
4. Complete the learner profile form and tap **Continue** to proceed.
5. On the scenario selector screen, confirm two Clinical Liaison scenario cards are visible: **Hospice Means Giving Up** and **Hospice Is Only for the Last Few Days**. Tap **Select** on Hospice Is Only for the Last Few Days.
6. Review the scenario briefing. Confirm the following are visible: patient name Gloria Santos, age 72, setting Hospital room, diagnosis Advanced pancreatic cancer, correct learner objective, correct role reminder.
7. Tap **Start Simulation**.
8. Confirm Marcus's opening line appears as the first message in the conversation (see Section 24).
9. Send **Phrase 1** (emotional validation — see Section 23).
10. Confirm Marcus responds with the too-soon acknowledgment line (see Section 24 for expected text).
11. Send **Phrase 2** (hospice timing education — see Section 23).
12. Confirm Marcus responds with the timing question (see Section 24 for expected text).
13. Send **Phrase 3** (hospice support description — see Section 23).
14. Confirm Marcus responds with the symptom support question (see Section 24 for expected text).
15. Send **Phrase 4** (comfort focus — see Section 23).
16. Confirm Marcus responds with his mother's wishes disclosure (see Section 24 for expected text).
17. Send **Phrase 5** (unsafe medication response — see Section 23).
18. Confirm the Clinical Liaison Training Pause system message appears (see Section 24 for expected text).
19. Send **Phrase 6** (safe medication routing — see Section 23).
20. Confirm Marcus responds with the fallback question (see Section 24 for expected text).
21. Tap **Finish** to end the simulation.
22. On the feedback screen, review all feedback sections (see Section 25).
23. Scroll to the Skill Scores section and review all seven score rows (see Section 26).
24. Tap **View Dashboard**.
25. On the dashboard screen, review all summary fields (see Section 27).

---

## 23. CL Hospice Too Soon: Exact Test Phrases

Send these phrases verbatim in the order listed. Do not add extra turns between them.

**Phrase 1 — Emotional validation**
> I understand how hard this is. You are trying to protect her, and that care for her is exactly right.

**Phrase 2 — Hospice timing education**
> Hospice is not only for the final days. It is designed to begin when someone may be in the last months of life, so support can start earlier when it matters most.

**Phrase 3 — Hospice support description**
> The hospice team would visit regularly. There is also a social worker and a chaplain available if your family would like that kind of support.

**Phrase 4 — Comfort focus**
> The goal is to help her feel comfortable and maintain her quality of life for as long as possible.

**Phrase 5 — Unsafe medication response**
> We can increase her morphine.

**Phrase 6 — Safe medication routing**
> That is an important question about her medications. I do not want to guess about that. The hospice provider should walk through that with you and your family directly.

---

## 24. CL Hospice Too Soon: Expected Simulation Results

Marcus's opening line (first message in simulation):
> The doctor says Mom might qualify for hospice, but she is still talking to us and eating a little. I thought hospice was only for the last few days.

| After this learner phrase | Expected response | Speaker |
|---|---|---|
| Phrase 1 — Emotional validation | I just do not want to give up on her too soon. She is still herself. | Marcus (family) |
| Phrase 2 — Hospice timing education | So hospice can start before someone is down to the last few days? | Marcus (family) |
| Phrase 3 — Hospice support description | Would she still get help with symptoms, or does that stop when treatment stops? | Marcus (family) |
| Phrase 4 — Comfort focus | She keeps telling me she just wants to feel like herself. I thought there was more time. | Marcus (family) |
| Phrase 5 — Unsafe medication response | That response gives medication guidance outside your selected role. Try again by validating the concern and connecting the family with the hospice nurse or provider. | System (Training Pause) |
| Phrase 6 — Safe medication routing | I hear what you are saying, but are you telling me she is already at that point? | Marcus (family) |

**Notes:**
- The response after Phrase 5 is a **Training Pause** system message, not a Marcus response.
- After Phrase 6, the Marcus fallback response fires because the safe routing phrase does not contain emotional validation, timing, support, or comfort terms.

---

## 25. CL Hospice Too Soon: Expected Feedback Results

After tapping Finish, the feedback screen should display all ten of the following sections:

- Overall Coaching Summary
- What Went Well
- What Changed the Room
- Missed Emotional Cues
- Role Boundary Review
- Medication Safety Review
- Hospice Language Review
- Suggested Wording
- Skill Scores
- Next Practice Focus

**Expected feedback themes to verify:**

- Marcus's opening statement is identified as a hospice timing misconception and an emotional concern.
- The emotional validation phrase is noted as the correct first move.
- The hospice timing education phrase is noted as addressing the core misconception.
- The unsafe medication phrase is flagged as a Clinical Liaison role boundary issue.
- The safe medication routing phrase is noted as the correct recovery behavior.
- Suggested wording examples remain within the Clinical Liaison role and do not include medication instructions or prognosis language.

---

## 26. CL Hospice Too Soon: Expected Skill Score Results

The Skill Scores section should display:

- An **Overall Score** shown as a decimal out of 4 (for example, 2.4 / 4).
- A **Primary Strength** label identifying the highest-scoring category.
- A **Primary Growth Area** label identifying the lowest-scoring category.
- **Seven score rows** in the following order:

| # | Category |
|---|---|
| 1 | Emotional Attunement |
| 2 | Hospice Education |
| 3 | Objection Handling |
| 4 | Compliance Safe Language |
| 5 | Clinical Escalation Judgment |
| 6 | Trust Building |
| 7 | Role Boundary Safety |

**For each row, verify:**
- The category name is human readable (matches the list above exactly).
- The score is a number from 0 to 4.
- The evidence text is human readable (no raw behavior codes such as `timeline_addressed` or `hospice_reframe`).
- The coaching note is human readable.
- No raw patient state values, raw safety event objects, or internal IDs are visible.

**Exact numeric scores are not required** for this test. Confirm all seven rows appear and all text is human readable.

---

## 27. CL Hospice Too Soon: Expected Dashboard Results

The dashboard should display the following fields. Tap **View Dashboard** from the feedback screen to reach it.

| Field | Expected value |
|---|---|
| Scenario | Hospice Is Only for the Last Few Days |
| Role | Clinical Liaison |
| Scenarios Completed | 1 |
| Average Score | Displayed as x.x / 4 |
| Strongest Skill | Human readable category name |
| Growth Area | Human readable category name |
| Safety Corrections | 1 (because the unsafe medication response was followed by safe medication routing in the same session) |
| Next Recommended Scenario | Human readable scenario name |
| Next Practice Focus | Human readable coaching text |

**Safety Corrections notes:**
- Safety Corrections shows **1** only when the unsafe medication phrase occurred and was followed by safe medication routing in the same session. This is the expected result for the deterministic test path.
- If the tester skips Phrase 5, Safety Corrections shows 0.

---

## 28. CL Hospice Too Soon: Pass or Fail Checklist

Use this checklist when executing the full learner journey test.

- [ ] Welcome screen loads and displays a Continue button.
- [ ] Role selection screen lists Clinical Liaison as a selectable option.
- [ ] Learner profile form accepts input and allows the tester to proceed.
- [ ] Scenario selector shows exactly two Clinical Liaison cards: Hospice Means Giving Up and Hospice Is Only for the Last Few Days.
- [ ] Selecting Hospice Is Only for the Last Few Days navigates to the correct briefing.
- [ ] Briefing displays: Gloria Santos, age 72, Hospital room, Advanced pancreatic cancer, correct learner objective, correct role reminder.
- [ ] Simulation starts and Marcus's opening line appears as the first message with the exact text documented in Section 24.
- [ ] Speaker label for the opening message is Marcus.
- [ ] After Phrase 1 (emotional validation), Marcus responds with the too-soon acknowledgment (exact text verified).
- [ ] After Phrase 2 (hospice timing education), Marcus responds with the timing question (exact text verified).
- [ ] After Phrase 3 (hospice support description), Marcus responds with the symptom support question (exact text verified).
- [ ] After Phrase 4 (comfort focus), Marcus responds with his mother's wishes disclosure (exact text verified).
- [ ] After Phrase 5 (unsafe medication response), the Training Pause system message appears (exact text verified).
- [ ] After Phrase 6 (safe medication routing), Marcus responds with the fallback question (exact text verified).
- [ ] Feedback screen displays all ten required sections.
- [ ] Seven Clinical Liaison skill score rows appear in the correct order: Emotional Attunement, Hospice Education, Objection Handling, Compliance Safe Language, Clinical Escalation Judgment, Trust Building, Role Boundary Safety.
- [ ] Each skill score row displays a human-readable category name, a score from 0 to 4, human-readable evidence, and a human-readable coaching note. No raw codes or IDs are visible.
- [ ] Dashboard displays all required fields. Scenario shows Hospice Is Only for the Last Few Days. Role shows Clinical Liaison. Safety Corrections shows 1.
- [ ] Existing Hospice Means Giving Up scenario still opens correctly (regression check).
- [ ] RN COPD scenario still opens correctly (regression check).
