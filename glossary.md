# GLOSSARY.md
# Glossary — Agentic Code Generation & Clarify-Style Coding Systems 

> A rigorous glossary for repositories that implement agentic, clarification-first code generation flows (e.g., “ClarifyFlow” / “Clarify-Coder”-style systems). Terms are grouped by *Modeling & Inference*, *Interaction & Control*, *Program Synthesis*, *Evaluation*, and *Safety & Ethics*.

---

## 1) Modeling & Inference

**Instruction-Tuned LLM (IT-LLM).**  
A language model fine-tuned on instruction–response pairs to follow task directives; often combined with preference tuning (e.g., RLHF/DPO) for helpfulness/harmlessness.

**Decoder-Only Causal LM.**  
An autoregressive transformer that estimates \( p(x_t \mid x_{<t}) \) and generates left-to-right; dominant architecture for contemporary code LLMs.

**Logit Calibration / Temperature / Top-p.**  
Sampling controls: temperature rescales logits; top-p keeps the minimal token set whose cumulative probability ≥ \(p\); both trade determinism vs. diversity and can modulate error exploration.

**Logit Bias / Token Masking.**  
Direct manipulation of token logits to enforce or inhibit patterns (e.g., deny `import os`); used as a soft constraint mechanism at decode time.

**Context Window / KV Cache.**  
The maximum token budget for prompts+outputs; KV caching amortizes attention costs by reusing past keys/values across generation steps.

**Retriever-Augmented Generation (RAG).**  
Augments prompts with retrieved code/docs/tests to ground outputs; reduces hallucination and improves domain specificity.

**Toolformer/Function-Calling Interface.**  
Model emits structured tool invocations (JSON) to call external functions (compilers, linters, unit test runners), and conditions future tokens on tool results.

**System Prompt (Policy Prior).**  
A non-user-visible prefix that imposes behavioral priors (e.g., “ask 1 clarifying question per turn”); crucial to agent policy shaping.

---

## 2) Interaction & Control (Agentic Flow)

**Agentic Flow (Clarification-First).**  
A loop that *first* reduces goal ambiguity by asking high-information clarifying questions, then synthesizes code once ambiguity falls below a threshold.

**Clarifying Question Selection Policy.**  
A policy \(\pi(q \mid s)\) that chooses the single highest-value question given state \(s\) (goal + transcript). Objectives include **expected information gain** (EIG), **entropy reduction**, or **constraint coverage**.

**Expected Information Gain (EIG).**  
\(\mathbb{E}_{a \sim p(a\mid q)}[H(\theta \mid s) - H(\theta \mid s, q, a)]\), where \(\theta\) parameterizes the hidden task specification; select \(q\) maximizing posterior certainty about required code.

**Stop Criterion (DONE).**  
A termination rule (e.g., posterior entropy \(< \epsilon\), constraint set closed, or no further EIG-positive questions) after which the agent commits to code synthesis.

**Conversation State / Belief State.**  
A structured memory (facts/assumptions/constraints) aggregated from answers, serving as sufficient statistics for downstream synthesis.

**Constraint Accumulation.**  
Monotone growth of required properties (I/O format, ranges, complexity limits) forming a partial specification used by the synthesizer.

**Self-Reflection / Plan-and-Execute.**  
Decomposing into subgoals (plan) and then executing each step with verification; reflection revises the plan when validation fails.

**Human-in-the-Loop (HITL) Control.**  
Explicit decision points where the user selects among candidate plans/edits/tests to bound model autonomy.

---

## 3) Program Synthesis & Verification

**Neural Program Synthesis.**  
Inducing program text from intent signals (NL specs, examples, tests). LLM-based synthesis uses next-token prediction guided by constraints.

**Constrained Decoding (Grammar/Regex/Type).**  
Hard constraints during generation that restrict outputs to a formal language (e.g., Python grammar) or type-consistent APIs, reducing invalid ASTs.

**Type-Directed Synthesis.**  
Using type signatures (or inferred types) to prune search and bias token selection; often backed by static typing or stub interfaces.

**Counterexample-Guided Inductive Synthesis (CEGIS).**  
Iterate: propose program → check against spec/tests → if failure, derive a counterexample → refine candidate; aligns with unit-test feedback loops.

**Repair Operators (Patch Synthesis).**  
Local edits (e.g., variable rename, off-by-one fix, condition inversion) proposed to satisfy failing tests without full resynthesis.

**AST-Level Reasoning.**  
Parsing generated code to an Abstract Syntax Tree and applying static checks (name resolution, control-flow, simple data-flow) before execution.

**Sandboxed Execution.**  
Interpreting candidate code under restricted builtins, syscall filters, and import allowlists; mitigates file/network/privilege abuse while enabling I/O-free testing.

**Spec Decomposition.**  
Split requirements into *interface* (signature/IO), *properties* (invariants, complexity), and *examples* (tests), enabling modular verification.

**Test-Driven Synthesis (TDS).**  
Generate code targeted to pass pre-specified unit tests; can overfit unless tests include coverage-driven diversity and metamorphic relations.

**Metamorphic Testing.**  
Derive follow-up tests from input–output relations (e.g., scaling/permute invariances) to detect spurious solutions that pass naive tests.

---

## 4) Evaluation & Metrics

**HumanEval / MBPP / MultiPL-Bench.**  
Benchmark suites for code generation; measured by *pass@k* (probability at least one of k samples passes tests).

**pass@k (Unbiased Estimator).**  
For \(n\) generated samples and \(c\) correct, the unbiased estimator for pass@k is \(1 - \frac{\binom{n-c}{k}}{\binom{n}{k}}\) (under sampling without replacement).

**Edit Distance / CodeBLEU.**  
Surface-level metrics; weak proxies for functional correctness—should be paired with executable tests.

**Runtime / Memory / Complexity Constraints.**  
Resource ceilings enforced during execution; important for fairness across methods and to avoid degenerate solutions (e.g., exponential brute force).

**Ablations (Policy/Prompt/Tooling).**  
Controlled variant experiments isolating contributions from clarification policy, prompt format, tool access, or constraint mechanisms.

**User Study (Latency & Turn Count).**  
Human-centered metrics: number of clarification turns, time-to-first-useful solution, subjective specificity/utility ratings.

---

## 5) Safety, Security & Ethics

**Capability Scoping.**  
Proactive limitation of imported modules, file/network access, and shell execution; ties into *least privilege* for agents.

**Prompt Injection / Jailbreaks.**  
Adversarial instructions that subvert the system prompt or tool policies; mitigations include instruction firewalls, input segmentation, and rule verifiers.

**Data Exfiltration Risks.**  
Generated code that reads secrets/environment or attempts network exfiltration. Prevent with syscall auditing, network egress blocking, and red-team tests.

**License & Attribution Compliance.**  
Ensure generated code and training corpora respect open-source licenses; include NOTICE files, SPDX tags, and provenance tracking.

**Dataset Contamination.**  
Test items or near-duplicates in pretraining data inflate scores; detect via n-gram/semantic dedup, report contamination audits.

**PII & Sensitive Content.**  
Filter prompts/outputs for personal data; apply redaction or deny-list token masking, and keep audit logs for incident response.

**Spec Drift & Model Staleness.**  
Model behavior evolves across versions; pin model hashes, log decoding params, and version prompts to ensure reproducibility.

---

## 6) Formalization Snippets

**Task Model (Bayesian View).**  
Let \(\theta\) be latent task spec; dialog \(D\) accumulates Q&A. The agent chooses \(q^* = \arg\max_q \mathrm{EIG}(q; D)\). Stop when \(H(\theta \mid D) < \epsilon\); then synthesize \(f^\* = \arg\max_f p(f \mid D)\).

**Risk-Bounded Execution.**  
Find \(f\) s.t. \(\Pr[\text{unsafe}(f)] \le \delta\) under sandbox policy \(\mathcal{S}\); approximate via static filters + monitored tests with time/memory caps.

**Specification as Constraints.**  
Spec \(\Sigma = \{\varphi_i\}\) with assertions over inputs/outputs. Verification seeks \(f\) s.t. \(\forall i,\, f \models \varphi_i\); tests approximate \(\Sigma\) via finite samples.

---

## 7) Practical Engineering Patterns

**Single-Question Loop.**  
Strictly one question per turn to minimize user burden and simplify credit assignment for EIG estimation.

**Fact Ledger.**  
Normalized “fact: value” lines (e.g., *“Start index -> 1”*) used to populate the code prompt deterministically.

**Deterministic Final Decode.**  
Low temperature for the final code block; stochasticity reserved for exploration during question generation.

**Two-Model Regime.**  
Small, fast model for questions; larger, more capable model for final synthesis; reduces interactive latency while retaining code quality.

**Grammar-Constrained Fencing.**  
Decode inside ```python fences with grammar masks to eliminate unterminated blocks and syntax errors.

**Audit Log.**  
Persist: (model id, prompt hash, decoding params, Q/A turns, code commit hash, test results) to support reproducibility and incident forensics.

---

## 8) References (Indicative, Non-Exhaustive)
- Counterexample-Guided Inductive Synthesis (CEGIS)  
- HumanEval / MBPP benchmarks  
- RLHF, DPO for preference alignment  
- RAG for code generation and doc grounding  
- Grammar-constrained decoding & type-guided synthesis

> Include your project’s specific paper citation(s) here (e.g., the Clarify-Coder arXiv entry), plus software artifacts (commit SHA, model cards).

---

## 9) How to Use in This Repo

- Keep this file as `GLOSSARY.md` at the repo root.  
- Link it from `README.md` and your `docs/` (e.g., MkDocs sidebar).  
- When you introduce a new mechanism (e.g., a new repair operator), add a 2–3 sentence, *formal* definition here with a pointer to code/tests.

