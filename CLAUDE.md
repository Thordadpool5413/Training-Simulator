@AGENTS.md

# Hospice & Palliative Care Communication Training Simulator — Project Rules

1. This is a fictional hospice and palliative care communication training simulator.
2. The app must not provide medical advice.
3. The app must not handle real patient data.
4. The app must not diagnose patients.
5. The app must not determine hospice eligibility.
6. The app must not prescribe medications.
7. The app must not provide medication instructions unless the instruction is explicitly part of a reviewed fictional training scenario and the learner role allows it.
8. The first build phase must use local seed content only.
9. No live external APIs may be added without explicit approval.
10. No AI API calls may be added without explicit approval.
11. No private API keys may be placed inside the mobile app.
12. Protected AI calls must eventually run through a backend, not directly inside the Expo client.
13. Use TypeScript.
14. Use Expo Router.
15. Keep route files thin.
16. Put reusable UI in src/components.
17. Put local seed content in src/data.
18. Put simulator logic in src/services.
19. Put app state helpers in src/state.
20. Put shared types in src/types.
21. Do not refactor unrelated files.
22. Do not add packages without asking first.
23. Do not rename files unless the packet specifically requires it.
24. Do not add features outside the current packet.
25. Each packet must have a clear acceptance test before work begins.
