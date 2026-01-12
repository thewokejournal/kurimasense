# Phase F — Decision Framing (Non-Directive)
## Quick Reference

---

## ✅ IMPLEMENTATION COMPLETE

**Status:** Phase F has been successfully implemented and verified.

---

## What You Got

### 1. "How to Read This" Panel
A collapsible panel that appears in every AnalysisRun detail view.

**Location:** `components/DecisionFramingPanel.tsx`

**Behavior:**
- Hidden (collapsed) by default
- User clicks to expand
- Shows static framing content based on status/trend/confidence

### 2. Four Content Sections

#### A. What This Analysis Represents
Explains what each inference value means:
- **Status** (healthy/watch/stressed) = System's assessment based on signals
- **Trend** (improving/stable/declining) = Progression shown by signals
- **Confidence** (high/medium/low) = Signal completeness (NOT certainty)

#### B. What This Analysis Does Not Represent
4 explicit boundaries:
- Does NOT indicate what actions should be taken
- Does NOT explain why conditions exist
- Does NOT predict what will happen next
- Does NOT reference factors outside measured signals

#### C. System Limitations
4 required disclaimers:
- System does not give advice or recommendations
- System does not predict outcomes or future conditions
- Responsibility for decisions remains with the user
- This is one input among many that may inform your judgment

#### D. Responsibility Statement
Highlighted box:
> "You may choose how to use this information. The system provides an assessment based on available signals. It does not determine the correctness of any decision or action you may take."

---

## Key Principles (LOCKED)

### ✅ What It Does
- Clarifies what inference values mean
- States explicit boundaries
- Makes user responsibility clear
- Preserves uncertainty

### ❌ What It Does NOT Do
- Tell users what to do
- Recommend actions
- Predict outcomes
- Explain causes
- Reference external factors

---

## File Changes

### Created
- `components/DecisionFramingPanel.tsx` (162 lines)
- `PHASE_F_DECISION_FRAMING_VERIFICATION.md` (438 lines)
- `PHASE_F_IMPLEMENTATION_SUMMARY.md` (325 lines)
- `PHASE_F_QUICK_REFERENCE.md` (This file)

### Modified
- `components/AnalysisRunDetail.tsx` (Added DecisionFramingPanel integration)

---

## Visual Location

```
AnalysisRunDetail
├── Analysis Record (Field, Time Window, Created At)
├── Status
├── Trend
├── Confidence
├── Categories
├── Explanation
├── ┌──────────────────────────────────────┐
│   │ 🛈 HOW TO READ THIS                  │ ← NEW (Phase F)
│   │   Understanding what this analysis   │
│   │   means and does not mean            │
│   │                                      │
│   │ [Click to expand]                    │
│   └──────────────────────────────────────┘
├── Immutability Reminder
└── Provenance Panel
```

---

## Language Compliance

### ✅ Allowed (Examples from implementation)
- "This status reflects..."
- "Confidence reflects signal completeness..."
- "You may choose how to use this information..."
- "This does not indicate what actions should be taken..."

### ❌ Forbidden (Verified absent)
- "You should..." ❌
- "You must..." ❌
- "Recommended..." ❌
- "Action is required..." ❌
- "This suggests..." ❌
- "Will lead to..." ❌
- "Because..." / "Due to..." ❌

---

## Testing

### To Test Locally
1. `npm run dev`
2. Navigate to dashboard (http://localhost:3000/dashboard)
3. Select a field
4. Select or create an AnalysisRun
5. Scroll to "How to Read This" panel
6. Click to expand
7. Verify framing content displays correctly

### Expected Behavior
- Panel is collapsed by default ✅
- Clicking toggles expand/collapse ✅
- Content shows status/trend/confidence explanations ✅
- All 4 disclaimers visible ✅
- Responsibility statement highlighted ✅
- No linter errors ✅
- No console warnings ✅

---

## Verification Status

| Requirement | Status |
|------------|--------|
| Panel labeled "How to Read This" | ✅ |
| Hidden by default | ✅ |
| Opened only via explicit user action | ✅ |
| Appears alongside AnalysisRun replay | ✅ |
| Content is static & deterministic | ✅ |
| Category-based (status/trend/confidence) | ✅ |
| No causes/actions/outcomes/external data | ✅ |
| All required disclaimers present | ✅ |
| No prescriptive language | ✅ |
| Read-only (no workflows/checklists) | ✅ |
| Visually secondary | ✅ |
| No linter errors | ✅ |
| Build successful | ✅ |
| Dev server running | ✅ |

**Overall Status:** ✅ **ALL REQUIREMENTS MET**

---

## Final Tests

| Test | Answer | Pass |
|------|--------|------|
| Could user say "system told me what to do"? | **NO** | ✅ |
| Is inference authoritative if framing removed? | **YES** | ✅ |
| Does framing preserve uncertainty? | **YES** | ✅ |

**All Final Tests:** ✅ **PASSED**

---

## System Philosophy: PRESERVED ✅

KurimaSense remains:
- A **reporting system**, not a decision system
- **Calm and analytical**, not urgent or directive
- **User-owned responsibility**, not system authority
- **Explainable and deterministic**, not black-box AI
- **Truthful about limits**, not falsely confident

Phase F **enhances clarity** without **adding direction**.

---

## Phase F: COMPLETE ✅

**Date:** January 8, 2026  
**Implementation:** Complete  
**Verification:** Complete  
**Testing:** Successful  
**Ready for Use:** Yes

---

For detailed verification, see: `PHASE_F_DECISION_FRAMING_VERIFICATION.md`  
For usage documentation, see: `PHASE_F_IMPLEMENTATION_SUMMARY.md`

