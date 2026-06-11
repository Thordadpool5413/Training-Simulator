# Internal Demo Script — Hospice Training Simulator

> **Use:** Walk a stakeholder or new learner through the app from launch to feedback. Each step includes what to say and what to show.

---

## Setup

- Open the app in Expo Go or the web export.
- Make sure no previous session is active (restart if needed — sessions are not persisted).
- Use the Clinical Liaison path for the primary demo. Switch to the RN path for a second pass if time allows.

---

## Step 1 — Welcome Screen

**Show:** App title and disclaimer text.

**Say:** "The app opens with a plain disclaimer — this is a fictional training tool. No real patient data, no clinical decisions, no AI. Everything runs locally."

---

## Step 2 — Role Selection

**Show:** Two role cards — Clinical Liaison and RN. Each lists what the role allows and a medication boundary note.

**Say:** "Learners pick their role before choosing a scenario. The role determines which safety rules fire during the simulation. Clinical Liaison has a strict zero-medication boundary. RN has dose boundary enforcement."

**Action:** Tap **Clinical Liaison**.

---

## Step 3 — Scenario Selector (Clinical Liaison)

**Show:** "Role: Clinical Liaison · 3 scenarios" header. Three scenario cards. Change Role link.

**Say:** "The selector shows the active role and the count of available scenarios. Three scenarios for Clinical Liaison. Each card shows patient, setting, diagnosis, and a two-line objective preview."

**Action:** Tap the **Hospice Means Giving Up** card.

---

## Step 4 — Scenario Briefing

**Show:** Back link, scenario title, eight briefing rows (role, setting, patient, diagnosis, recent clinical change, who is present, objective, role reminder). Start Simulation button.

**Say:** "Before the simulation starts, learners see the full clinical context — who is present, what changed recently, what their objective is, and the role reminder. This primes the conversation."

**Action:** Tap **Start Simulation**.

---

## Step 5 — Simulation: Opening Line

**Show:** Chat screen. Header with scenario title, role, patient info. Indigo role reminder banner. Opening message from Daughter: "My dad is dying and you want to take away his care?"

**Say:** "The family member opens with the core emotional challenge. The learner types a response and taps Send."

---

## Step 6 — Simulation: Clean Path

**Action:** Type and send: "I can hear how frightening this must feel. You are not taking away his care — hospice adds a layer of support."

**Show:** Family response appears. Conversation continues.

**Say:** "The system detects emotional acknowledgment and hospice reframe language. The family member's hidden resistance decreases and the response reflects that — without any AI or backend call."

---

## Step 7 — Simulation: Training Pause (Medication Safety)

**Action:** Type and send: "We can increase his morphine dose to help."

**Show:** Training Pause message appears in amber. Family does not respond.

**Say:** "Medication guidance is outside the Clinical Liaison role. The system catches the violation instantly and shows a Training Pause with coaching language. The simulation pauses — the family doesn't respond until the learner reframes."

---

## Step 8 — Simulation: Recovery

**Action:** Type and send: "I don't want to guess about that. The nurse can walk you through the medication plan."

**Show:** Family responds and conversation continues.

**Say:** "The learner routed correctly. The safety event is logged. The dashboard will later show one Safety Correction was flagged and recovered from."

---

## Step 9 — Finish and Feedback

**Action:** Tap **Finish**.

**Show:** Feedback screen. Scenario subtitle shows "Hospice Means Giving Up." Ten sections: Overall Coaching Summary, What Went Well, What Changed the Room, Missed Emotional Cues, Role Boundary Review, Medication Safety Review, Hospice Language Review, Suggested Wording, Skill Scores, Next Practice Focus.

**Say:** "Every section is generated from the session — no AI, no API. The Suggested Wording section shows three scenario-specific phrases the learner can practice. Skill Scores rate seven competencies from 0 to 4."

---

## Step 10 — Dashboard

**Action:** Tap **View Dashboard**.

**Show:** Summary message, Session card, Skill Summary, Safety Corrections (amber badge showing 1), Next Steps with recommended scenario and practice focus. Practice Again and Return to Role Selection buttons.

**Say:** "The dashboard summarizes the session. Safety Corrections shows one — flagged and recovered. The next recommended scenario is based on what the learner struggled with. Practice Again keeps the role selected and takes them back to scenario selection."

---

## Optional: RN Path Demo

**Action:** Tap **Return to Role Selection** → select **RN** → select **COPD Air Hunger at Home**.

**Key demo moments:**
- Opening line: "He keeps saying he cannot breathe. I am scared he is suffocating."
- Show that the RN selector says "Role: RN · 2 scenarios."
- Demonstrate a dose violation: "Give him 0.5 mL more of the morphine" → Training Pause.
- Demonstrate safe routing: "I cannot change the dose without the hospice orders. The on-call provider should walk through that with us."
- Show that RN Skill Scores use different categories (Symptom Communication, Comfort Education, Caregiver Empowerment).

---

## Demo Talking Points

| Point | Detail |
|---|---|
| No AI | All responses are deterministic rule-based logic. Zero API calls. |
| No backend | Everything runs on device. No data leaves the app. |
| No real patient data | Fictional scenarios with fictional patients only. |
| Role-specific safety | Different medication boundaries for different roles — enforced automatically. |
| Scenario-specific feedback | Suggested Wording changes by scenario. Score categories change by role. |
| Expandable | New scenarios follow the existing pattern — add data and service files. |
| Speed | Responses are instant. No latency, no loading states. |

---

## Known Limitations to Acknowledge

- Responses are rule-based, not AI-generated. They are realistic but not open-ended.
- No session history or learner profiles — sessions reset on close.
- No voice mode — text input only.
- Light mode only — dark mode is not implemented in this version.
- For internal training use only in current form.
