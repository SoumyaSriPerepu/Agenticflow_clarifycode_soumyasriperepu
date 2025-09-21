# PAPER_SUMMARY_ClarifyCoder.md

---

##  Background  
Large Language Models (LLMs) have become very good at generating code from natural language descriptions. They are trained via pretraining on large corpora of text + code and then further fine-tuned with “instruction tuning” so that given a prompt in NL, they output code that matches. However, those instruction-tuned models typically assume the user’s prompt is sufficiently precise: they do not handle ambiguity well. In many real-world cases, problem descriptions are **ambiguously specified**, **incomplete**, or **inconsistent**, meaning a human engineer would first ask clarifying questions before writing code. Prior work includes benchmarks and datasets where clarifications are evaluated (e.g. HumanEvalComm), and some “agent” systems that wrap LLMs to ask questions as a separate step. But the intrinsic capability of the model itself to detect ambiguity and proactively ask isn’t reliably present.

---

## Problem Statement  
The ClarifyCoder paper identifies this gap: when problem statements are ambiguous, current instruction-tuned code LLMs tend to *generate code immediately*, often speculating on missing parts. This leads to wrong behavior, misunderstandings, mismatches to user’s real intent, and sometimes safety or correctness issues.

So the core problem is:

> **How can we train a code LLM so that it both (a) recognizes when a description is ambiguous or incomplete, (b) generates clarifying questions in those cases, *before* generating code, all while retaining strong code generation performance when prompts are good?**

---

##  Technical Process  

Here is how the paper solves it:

1. **Synthetic data generation, clarify-aware dataset**  
   - Start with existing code task datasets (e.g. APPS).  
   - Automatically generate modified versions of tasks with ambiguous / inconsistent / incomplete statements (“ambiguous problem descriptions”) and pair them with “clarifying questions.” This yields a *clarify-aware dataset* \(D_{\text{clarify}}\). :contentReference[oaicite:0]{index=0}

2. **Instruction tuning & loss functions**  
   - Have the original (fully specified) dataset \(D_{\text{og}}\), used for standard instruction tuning.  
   - Fine-tune the model using both \(D_{\text{clarify}}\) (teach it to produce *questions when needed*) and \(D_{\text{og}}\) (teach it to produce correct code when prompt is sufficient).  
   - Define losses:  
     \[
     L_{\text{og}} = -\sum_{\text{(p,a)}\in D_{\text{og}}} \log P(a \mid p)
     \]  
     for tasks where prompt \(p\) is already clear and code target \(a\) is correct.  
     
     \[
     L_{\text{clarify}} = -\sum_{\text{(p_c, a_c)}\in D_{\text{clarify}}} \log P(a_c \mid p_c)
     \]  
     where \(p_c\) is an ambiguous prompt and \(a_c\) is the clarifying question. :contentReference[oaicite:1]{index=1}

   - They also experiment with combining the datasets: \(D_{\text{all}} = D_{\text{og}} \cup D_{\text{clarify}}\), with a ratio parameter \(r\) controlling how much clarify-aware data vs original data is in the mix. :contentReference[oaicite:2]{index=2}

3. **Evaluation metrics** 
   - Use benchmarks that include ambiguous/incomplete problem statements.  
   - Measure *communication rate* (how often the model asks clarification), *good question rate* (how often the question is meaningful/useful), and also standard code correctness metrics (e.g. pass@k, test pass rate) to ensure code quality does not degrade. :contentReference[oaicite:3]{index=3}  
   - Explore how varying the dataset ratio \(r\), or whether the loss is computed only over the answer or over both prompt + answer, affects trade-offs between clarify-awareness and code generation performance. :contentReference[oaicite:4]{index=4}

---

## Conclusion 

- **Findings:**  
  ClarifyCoder notably improves the model’s ability to *detect ambiguity* and *generate clarifying questions*, without severely harming code generation quality.  
  For many settings, adding clarify-aware fine-tuning raises communication rate and good question rate significantly (absolute improvements of tens of percentage points), while pass@k or test pass rates remain comparable to baseline models.

- **Trade-offs:**  
  There is some trade between clarify-aware behavior and raw code generation quality: for example, when too much clarify-aware data or improper weighting is used, the model may “over-ask” or delay code generation unnecessarily. Also, loss choices (answer-only vs prompt+answer) affect metrics differently. 

- **Outlook & Future Directions:**  
  The paper suggests that making clarify-awareness intrinsic to LLMs is valuable, moving beyond wrappers/agentic loops. It opens further questions such as: optimal data generation for ambiguity, how to calibrate when to ask vs generate, richer categories of ambiguity (types of missing information), integrating with human feedback, and exploring whether these methods generalize across domains, code complexity, and model scales.

---

