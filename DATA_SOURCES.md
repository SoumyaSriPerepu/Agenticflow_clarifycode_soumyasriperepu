# DATA_SOURCES.md
# ClarifyCoder Paper — Data Sources

---

## Table of Data Sources

| Dataset / Source          | Size (approx.) | Origin            | Categories / Structure                  | Purpose in Paper                                      |
|---------------------------|----------------|-------------------|------------------------------------------|-------------------------------------------------------|
| **APPS**                  | ~10,000 tasks  | Public dataset    | Clear coding problems + solutions + tests | Base dataset for fine-tuning code generation          |
| **Clarify-Aware Synthetic** | ~29,896 tasks  | Created by authors | Ambiguous / Incomplete / Inconsistent; each with clarifying Q | Train model to detect ambiguity & ask questions        |
| **D<sup>all</sup> (Combined)** | ~40,000 tasks  | APPS + Synthetic  | Mix of clear and ambiguous problems       | Unified training dataset for clarify-aware fine-tuning |
| **HumanEvalComm**         | ~164 tasks     | Benchmark (modified HumanEval) | Ambiguous prompts + clarifying dialogue  | Evaluate communication rate & good question rate      |
| **HumanEvalComm v2**      | Larger variant | Extended benchmark | Same as above with more ambiguous cases   | Richer evaluation of clarification-aware behavior     |

---

## Bullet Summary

### 1. Base Dataset
- **APPS**: ~10k coding problems from online judges (Codeforces, Kattis, etc.)  
- Contains: problem statement, solutions, test cases.  
- Used for *baseline code generation training*.  

### 2. Clarify-Aware Synthetic (New, Created)
- Derived from APPS tasks.  
- Modified to introduce **three ambiguity types**:  
  - Ambiguous (multiple interpretations).  
  - Incomplete (missing constraints).  
  - Inconsistent (contradictory statements).  
- Each includes: *modified problem statement*, *clarifying question*, *category label*.  
- Size: ~29.9k tasks (≈10k per category).  

### 3. Combined Dataset
- **D<sup>all</sup>** = APPS + Clarify-Aware Synthetic.  
- Total ~40k tasks.  
- Sampling ratio \(r\) varied to balance clear vs ambiguous.  
- Used for **clarify-aware fine-tuning**.  

### 4. Evaluation Benchmarks
- **HumanEvalComm**: HumanEval with added ambiguity + dialogues.  
- **HumanEvalComm v2**: Extended version with more cases.  
- Used to measure:  
  - *Communication Rate*: % of cases where model asks clarification.  
  - *Good Question Rate*: % of clarifications judged useful.  
  - *Code Correctness*: pass rates after clarification.  

---
