import type { Benchmark, BenchmarkScore } from '@/types/benchmark'

export const benchmarks: Benchmark[] = [
  {
    id: 'mmlu',
    name: 'Massive Multitask Language Understanding',
    shortName: 'MMLU',
    category: 'Reasoning & Knowledge',
    description:
      'MMLU evaluates models across 57 subjects spanning STEM, humanities, social sciences, and more. Questions are drawn from undergraduate-level exams and professional certification tests. It is one of the most widely cited benchmarks for general world knowledge and reasoning.',
    whyItMatters:
      'MMLU is a gold standard for measuring a model’s breadth of factual knowledge across academic fields. High MMLU scores correlate strongly with real-world usefulness in professional and educational applications.',
    limitations:
      'Heavily biased toward Western, English-language academic curricula. Some questions can be solved via surface-level pattern matching rather than deep reasoning.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'mmlu-pro',
    name: 'MMLU-Pro',
    shortName: 'MMLU-Pro',
    category: 'Reasoning & Knowledge',
    description:
      'MMLU-Pro is a harder variant of MMLU, designed to reduce ceiling effects as frontier models approach near-perfect accuracy. It replaces easier questions with multi-step reasoning problems and expanded answer choices.',
    whyItMatters:
      'MMLU-Pro provides better differentiation among top-tier models that have saturated the original MMLU. It tests reasoning depth rather than rote memorization.',
    limitations:
      'Smaller question count than the original MMLU, leading to higher variance. Still limited by the same domain coverage constraints as the parent benchmark.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'arc-challenge',
    name: 'AI2 Reasoning Challenge (Challenge Set)',
    shortName: 'ARC-Challenge',
    category: 'Reasoning & Knowledge',
    description:
      'ARC-Challenge presents grade-school level multiple-choice science questions that require reasoning rather than simple retrieval. The challenge set filters for questions answered incorrectly by both IR-based and word co-occurrence baselines.',
    whyItMatters:
      'ARC-Challenge isolates genuine reasoning from shallow statistical cues, making it a strong signal for scientific reasoning capability. It has proven difficult for models that otherwise score highly on retrieval-based tests.',
    limitations:
      'Relatively small question set leads to high variance in scores. The grade-school framing means it does not test advanced or specialized scientific knowledge.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'hellaswag',
    name: 'HellaSwag',
    shortName: 'HellaSwag',
    category: 'Reasoning & Knowledge',
    description:
      'HellaSwag tests commonsense natural language inference by asking models to choose the most plausible continuation of a given scenario. Distractors are adversarially generated to be superficially plausible but logically inconsistent.',
    whyItMatters:
      'HellaSwag evaluates a model’s grasp of everyday commonsense physics and social norms. Strong performance indicates robust world modeling beyond textbook knowledge.',
    limitations:
      'Focused narrowly on English-language commonsense scenarios. Adversarial distractor generation can introduce artifacts that reward specific training data exposure.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'winogrande',
    name: 'WinoGrande',
    shortName: 'WinoGrande',
    category: 'Reasoning & Knowledge',
    description:
      'WinoGrande is a large-scale pronoun resolution benchmark built on the Winograd Schema Challenge format. Each question requires resolving ambiguous pronouns by understanding context and commonsense knowledge.',
    whyItMatters:
      'Pronoun resolution is a core linguistic competency that reveals a model’s understanding of discourse pragmatics. WinoGrande’s scale reduces the brittleness of the original Winograd Schema Challenge.',
    limitations:
      'Some schema pairs can be solved through dataset artifacts rather than genuine reasoning. Performance gains have partially tracked increased scale rather than architectural improvements.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'big-bench-hard',
    name: 'BIG-Bench Hard',
    shortName: 'BBH',
    category: 'Reasoning & Knowledge',
    description:
      'BIG-Bench Hard is a curated subset of 23 challenging tasks from the BIG-Bench suite, selected because they were beyond the capabilities of contemporary models at the time of selection. Tasks span algorithmic reasoning, logical deduction, and multi-step problem solving.',
    whyItMatters:
      'BBH focuses specifically on tasks that resist shallow heuristics, providing a cleaner signal of reasoning depth. It has become a standard metric for chain-of-thought prompting efficacy.',
    limitations:
      'Some tasks are sensitive to prompt formatting and few-shot examples. The fixed subset means the benchmark cannot evolve as model capabilities advance.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'humaneval',
    name: 'HumanEval',
    shortName: 'HumanEval',
    category: 'Code',
    description:
      'HumanEval consists of 164 hand-written Python programming problems, each with a function signature, docstring, and unit tests. Models must generate correct, executable code that passes all hidden test cases.',
    whyItMatters:
      'HumanEval is the most widely reported code generation benchmark and serves as the primary yardstick for coding capability. Pass@k metrics allow nuanced evaluation of sampling-based code generation strategies.',
    limitations:
      'Limited to Python and constrained to short, self-contained functions. Does not assess real-world software engineering skills like debugging, refactoring, or system design.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'humaneval-plus',
    name: 'HumanEval+',
    shortName: 'HumanEval+',
    category: 'Code',
    description:
      'HumanEval+ extends the original HumanEval with additional test cases generated via automatic input fuzzing. It catches false positives where models pass the original tests with superficially correct code that fails on edge cases.',
    whyItMatters:
      'HumanEval+ reveals overfitting to the original test suite and provides a stricter measure of code correctness. Many models show significant score drops compared to the original HumanEval.',
    limitations:
      'Some generated test cases may be unrealistically adversarial. Still limited to the same 164 problems and Python-only scope as the original benchmark.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'mbpp',
    name: 'Mostly Basic Python Programming',
    shortName: 'MBPP',
    category: 'Code',
    description:
      'MBPP contains approximately 1,000 crowd-sourced Python programming problems covering basic programming concepts. Each problem includes a task description, solution, and three test cases.',
    whyItMatters:
      'MBPP provides a larger and more diverse code generation test set than HumanEval. It stresses fundamental programming competence rather than algorithmic cleverness.',
    limitations:
      'Problems tend to be simpler than HumanEval, leading to ceiling effects for strong models. Crowd-sourced test cases can contain errors or be insufficiently rigorous.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'swe-bench-verified',
    name: 'SWE-bench Verified',
    shortName: 'SWE-bench Verified',
    category: 'Code',
    description:
      'SWE-bench Verified is a human-validated subset of 500 real GitHub issues from popular Python repositories. Models must generate patches that resolve the described bugs and pass associated regression tests.',
    whyItMatters:
      'SWE-bench Verified is the closest proxy for real-world software engineering capability. It evaluates the end-to-end workflow of understanding an issue, navigating a codebase, and producing a correct fix.',
    limitations:
      'High evaluation cost and complexity. Requires a full agent scaffold with repository access, meaning scores are sensitive to the agent framework used, not just the underlying model.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'math',
    name: 'MATH',
    shortName: 'MATH',
    category: 'Math',
    description:
      'MATH consists of 12,500 competition-level mathematics problems drawn from AMC, AIME, and similar contests across seven subjects. Problems require multi-step symbolic reasoning and often involve algebra, geometry, number theory, and combinatorics.',
    whyItMatters:
      'MATH is the most challenging and widely recognized math reasoning benchmark. Performance correlates strongly with the ability to handle complex, multi-step analytical tasks in science and engineering.',
    limitations:
      'Problem difficulty is uneven across the seven subjects. Models can achieve partial credit through pattern-matched intermediate steps without true mathematical understanding.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'gsm8k',
    name: 'Grade School Math 8K',
    shortName: 'GSM8K',
    category: 'Math',
    description:
      'GSM8K contains 8,500 grade-school math word problems requiring 2–8 arithmetic operations to solve. Problems are written in natural language and demand reading comprehension in addition to mathematical reasoning.',
    whyItMatters:
      'GSM8K is a clean, interpretable benchmark for step-by-step mathematical reasoning. The chain-of-thought prompting technique was largely validated and popularized on this dataset.',
    limitations:
      'Problems are narrow in mathematical scope and do not extend beyond basic arithmetic. High scores are now common among frontier models, limiting its discriminatory power.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'mt-bench',
    name: 'Multi-Turn Benchmark',
    shortName: 'MT-Bench',
    category: 'Instruction Following',
    description:
      'MT-Bench evaluates multi-turn conversation and instruction-following quality across eight domains including writing, roleplay, reasoning, and coding. A strong LLM (GPT-4) judges response quality on a 1–10 scale.',
    whyItMatters:
      'Multi-turn interactions are the dominant mode of real-world LLM usage. MT-Bench captures conversational quality dimensions that single-turn benchmarks miss, such as coherence across turns and instruction maintenance.',
    limitations:
      'Relies on an LLM-as-judge methodology which introduces systematic biases toward the judge model’s own preferences. Scoring can be sensitive to the order in which responses are presented.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 10,
  },
  {
    id: 'alpacaeval-2',
    name: 'AlpacaEval 2.0',
    shortName: 'AlpacaEval 2.0',
    category: 'Instruction Following',
    description:
      'AlpacaEval 2.0 measures instruction-following quality by comparing model outputs against a reference (GPT-4 Turbo) on 805 diverse prompts. It reports a length-controlled win rate that corrects for the bias that longer responses tend to be rated more favorably.',
    whyItMatters:
      'AlpacaEval 2.0 is fast, cheap to run, and has become the de facto leaderboard for instruction-following. The length-controlled variant mitigates the well-known verbosity bias in LLM judging.',
    limitations:
      'All comparisons are anchored to GPT-4 Turbo outputs, so the benchmark cannot distinguish models that surpass the reference. Prompt set is static and may not reflect evolving user distributions.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'ruler',
    name: 'RULER',
    shortName: 'RULER',
    category: 'Long Context',
    description:
      'RULER evaluates a model’s ability to reason over long contexts ranging from 4K to 128K tokens. It includes retrieval, multi-hop tracing, and aggregation tasks designed to stress-test the full effective context window.',
    whyItMatters:
      'As models claim increasingly large context windows, RULER verifies whether they can actually utilize that context effectively. Many models degrade well before their advertised context limits.',
    limitations:
      'Synthetic tasks may not fully represent real-world long-document use cases. Evaluation cost scales linearly with context length, limiting the number of samples at extreme lengths.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'longbench',
    name: 'LongBench',
    shortName: 'LongBench',
    category: 'Long Context',
    description:
      'LongBench is a multi-task benchmark covering single-document QA, multi-document QA, summarization, few-shot learning, and code completion across contexts up to 32K tokens in both English and Chinese.',
    whyItMatters:
      'LongBench provides broad coverage of realistic long-context use cases including multi-document synthesis. Bilingual support extends its relevance beyond English-only evaluations.',
    limitations:
      'Context lengths are capped at 32K tokens, which is no longer challenging for state-of-the-art models. Task diversity means aggregate scores can mask performance on specific sub-capabilities.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'mmbench',
    name: 'MMBench',
    shortName: 'MMBench',
    category: 'Multimodal',
    description:
      'MMBench evaluates multi-modal understanding across a wide range of visual reasoning tasks including perception, reasoning, and knowledge-based visual question answering. It features a carefully curated, circular-evaluated dataset with fine-grained ability categories.',
    whyItMatters:
      'MMBench provides a comprehensive and fair multi-modal evaluation with minimal data leakage, thanks to its circular evaluation protocol. It tests practical vision-language integration rather than isolated visual perception.',
    limitations:
      'Limited to static images and does not cover video, audio, or embodied perception. Some questions can be answered from text alone, overstating true multi-modal capability.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'mmmu',
    name: 'Massive Multi-discipline Multimodal Understanding',
    shortName: 'MMMU',
    category: 'Multimodal',
    description:
      'MMMU is a large-scale multi-modal benchmark spanning 30 subjects across six disciplines, with 11.5K college-level questions that require joint image and text understanding. Subjects range from art and medicine to physics and finance.',
    whyItMatters:
      'MMMU is the most challenging multi-modal benchmark, requiring deep domain expertise combined with visual perception. It serves as the multi-modal analogue of the MMLU and sets a high bar for vision-language models.',
    limitations:
      'Heavy reliance on expert-level diagrams and charts biases results toward models with domain-specific visual pretraining. The scale may still be insufficient for robust per-subject comparisons.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'truthfulqa',
    name: 'TruthfulQA',
    shortName: 'TruthfulQA',
    category: 'Safety & Alignment',
    description:
      'TruthfulQA measures whether language models can avoid generating false answers learned from imitating human texts. It contains 817 questions spanning 38 categories, including misconceptions, conspiracies, and common myths.',
    whyItMatters:
      'Truthfulness is a foundational safety property. TruthfulQA revealed that larger models tend to be less truthful, directly contradicting the scaling assumption that bigger is always better.',
    limitations:
      'The adversarial construction may over-penalize models on niche or controversial topics where ground truth is contested. Multiple-choice format does not capture nuanced or qualified truthful responses.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
  {
    id: 'bbq',
    name: 'Bias Benchmark for QA',
    shortName: 'BBQ',
    category: 'Safety & Alignment',
    description:
      'BBQ evaluates social bias in QA systems by presenting ambiguous and disambiguated contexts across nine social dimensions including race, gender, religion, and disability status. It measures whether models rely on stereotypes when context is insufficient.',
    whyItMatters:
      'BBQ provides a structured, reproducible framework for measuring bias, enabling direct comparisons across models and mitigation strategies. It distinguishes between appropriate use of context and inappropriate stereotyping.',
    limitations:
      'Focused on US-centric social categories and English-language bias patterns. Real-world fairness concerns extend beyond this fixed set of scenarios.',
    higherIsBetter: true,
    scaleMin: 0,
    scaleMax: 100,
  },
]

export const benchmarkScores: BenchmarkScore[] = [
  // ─── MMLU ───────────────────────────────────────────────
  { benchmarkId: 'mmlu', modelId: 'gpt-4o', score: 88.7, rawScore: 88.7, normalizedScore: 88.7, confidenceInterval: [88.1, 89.3], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu', modelId: 'gpt-4-turbo', score: 86.5, rawScore: 86.5, normalizedScore: 86.5, confidenceInterval: [85.9, 87.1], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu', modelId: 'o1', score: 92.3, rawScore: 92.3, normalizedScore: 92.3, confidenceInterval: [91.7, 92.9], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu', modelId: 'claude-3-5-sonnet', score: 88.3, rawScore: 88.3, normalizedScore: 88.3, confidenceInterval: [87.6, 89.0], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'mmlu', modelId: 'claude-3-opus', score: 86.8, rawScore: 86.8, normalizedScore: 86.8, confidenceInterval: [86.1, 87.5], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'mmlu', modelId: 'gemini-2-flash', score: 85.5, rawScore: 85.5, normalizedScore: 85.5, confidenceInterval: [84.8, 86.2], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'mmlu', modelId: 'gemini-1-5-pro', score: 85.2, rawScore: 85.2, normalizedScore: 85.2, confidenceInterval: [84.5, 85.9], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'mmlu', modelId: 'llama-3-3-70b', score: 86.0, rawScore: 86.0, normalizedScore: 86.0, confidenceInterval: [85.3, 86.7], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'mmlu', modelId: 'llama-3-1-405b', score: 88.0, rawScore: 88.0, normalizedScore: 88.0, confidenceInterval: [87.3, 88.7], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'mmlu', modelId: 'llama-3-1-8b', score: 69.5, rawScore: 69.5, normalizedScore: 69.5, confidenceInterval: [68.6, 70.4], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'mmlu', modelId: 'mistral-large', score: 83.2, rawScore: 83.2, normalizedScore: 83.2, confidenceInterval: [82.4, 84.0], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'mmlu', modelId: 'deepseek-v3', score: 88.5, rawScore: 88.5, normalizedScore: 88.5, confidenceInterval: [87.8, 89.2], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'mmlu', modelId: 'deepseek-r1', score: 90.8, rawScore: 90.8, normalizedScore: 90.8, confidenceInterval: [90.1, 91.5], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'mmlu', modelId: 'qwen-2-5-72b', score: 84.6, rawScore: 84.6, normalizedScore: 84.6, confidenceInterval: [83.8, 85.4], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'mmlu', modelId: 'gemma-2-27b', score: 79.8, rawScore: 79.8, normalizedScore: 79.8, confidenceInterval: [78.9, 80.7], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── MMLU-Pro ───────────────────────────────────────────
  { benchmarkId: 'mmlu-pro', modelId: 'gpt-4o', score: 74.2, rawScore: 74.2, normalizedScore: 74.2, confidenceInterval: [73.1, 75.3], dateEvaluated: '2024-08-22', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu-pro', modelId: 'gpt-4-turbo', score: 72.0, rawScore: 72.0, normalizedScore: 72.0, confidenceInterval: [70.8, 73.2], dateEvaluated: '2024-04-18', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu-pro', modelId: 'o1', score: 80.5, rawScore: 80.5, normalizedScore: 80.5, confidenceInterval: [79.3, 81.7], dateEvaluated: '2024-12-10', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu-pro', modelId: 'claude-3-5-sonnet', score: 73.8, rawScore: 73.8, normalizedScore: 73.8, confidenceInterval: [72.6, 75.0], dateEvaluated: '2024-06-25', evaluator: 'Anthropic' },
  { benchmarkId: 'mmlu-pro', modelId: 'claude-3-opus', score: 71.5, rawScore: 71.5, normalizedScore: 71.5, confidenceInterval: [70.3, 72.7], dateEvaluated: '2024-03-12', evaluator: 'Anthropic' },
  { benchmarkId: 'mmlu-pro', modelId: 'gemini-2-flash', score: 71.0, rawScore: 71.0, normalizedScore: 71.0, confidenceInterval: [69.8, 72.2], dateEvaluated: '2025-02-14', evaluator: 'Google' },
  { benchmarkId: 'mmlu-pro', modelId: 'gemini-1-5-pro', score: 70.5, rawScore: 70.5, normalizedScore: 70.5, confidenceInterval: [69.3, 71.7], dateEvaluated: '2024-05-20', evaluator: 'Google' },
  { benchmarkId: 'mmlu-pro', modelId: 'llama-3-3-70b', score: 69.8, rawScore: 69.8, normalizedScore: 69.8, confidenceInterval: [68.6, 71.0], dateEvaluated: '2024-12-12', evaluator: 'Meta' },
  { benchmarkId: 'mmlu-pro', modelId: 'llama-3-1-405b', score: 72.3, rawScore: 72.3, normalizedScore: 72.3, confidenceInterval: [71.1, 73.5], dateEvaluated: '2024-07-28', evaluator: 'Meta' },
  { benchmarkId: 'mmlu-pro', modelId: 'llama-3-1-8b', score: 53.2, rawScore: 53.2, normalizedScore: 53.2, confidenceInterval: [51.8, 54.6], dateEvaluated: '2024-07-28', evaluator: 'Meta' },
  { benchmarkId: 'mmlu-pro', modelId: 'mistral-large', score: 67.5, rawScore: 67.5, normalizedScore: 67.5, confidenceInterval: [66.2, 68.8], dateEvaluated: '2024-03-05', evaluator: 'Mistral AI' },
  { benchmarkId: 'mmlu-pro', modelId: 'deepseek-v3', score: 73.0, rawScore: 73.0, normalizedScore: 73.0, confidenceInterval: [71.8, 74.2], dateEvaluated: '2024-12-30', evaluator: 'DeepSeek' },
  { benchmarkId: 'mmlu-pro', modelId: 'deepseek-r1', score: 77.6, rawScore: 77.6, normalizedScore: 77.6, confidenceInterval: [76.4, 78.8], dateEvaluated: '2025-01-25', evaluator: 'DeepSeek' },
  { benchmarkId: 'mmlu-pro', modelId: 'qwen-2-5-72b', score: 70.0, rawScore: 70.0, normalizedScore: 70.0, confidenceInterval: [68.7, 71.3], dateEvaluated: '2024-09-25', evaluator: 'Alibaba' },
  { benchmarkId: 'mmlu-pro', modelId: 'gemma-2-27b', score: 64.2, rawScore: 64.2, normalizedScore: 64.2, confidenceInterval: [62.8, 65.6], dateEvaluated: '2024-07-05', evaluator: 'Google' },

  // ─── ARC-Challenge ──────────────────────────────────────
  { benchmarkId: 'arc-challenge', modelId: 'gpt-4o', score: 95.2, rawScore: 95.2, normalizedScore: 95.2, confidenceInterval: [93.5, 96.9], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'arc-challenge', modelId: 'gpt-4-turbo', score: 94.6, rawScore: 94.6, normalizedScore: 94.6, confidenceInterval: [92.8, 96.4], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'arc-challenge', modelId: 'o1', score: 96.7, rawScore: 96.7, normalizedScore: 96.7, confidenceInterval: [95.1, 98.3], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'arc-challenge', modelId: 'claude-3-5-sonnet', score: 96.0, rawScore: 96.0, normalizedScore: 96.0, confidenceInterval: [94.3, 97.7], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'arc-challenge', modelId: 'claude-3-opus', score: 95.0, rawScore: 95.0, normalizedScore: 95.0, confidenceInterval: [93.3, 96.7], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'arc-challenge', modelId: 'gemini-2-flash', score: 92.8, rawScore: 92.8, normalizedScore: 92.8, confidenceInterval: [90.7, 94.9], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'arc-challenge', modelId: 'gemini-1-5-pro', score: 91.0, rawScore: 91.0, normalizedScore: 91.0, confidenceInterval: [88.8, 93.2], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'arc-challenge', modelId: 'llama-3-3-70b', score: 93.0, rawScore: 93.0, normalizedScore: 93.0, confidenceInterval: [91.0, 95.0], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'arc-challenge', modelId: 'llama-3-1-405b', score: 94.5, rawScore: 94.5, normalizedScore: 94.5, confidenceInterval: [92.7, 96.3], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'arc-challenge', modelId: 'llama-3-1-8b', score: 82.0, rawScore: 82.0, normalizedScore: 82.0, confidenceInterval: [79.5, 84.5], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'arc-challenge', modelId: 'mistral-large', score: 90.2, rawScore: 90.2, normalizedScore: 90.2, confidenceInterval: [87.9, 92.5], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'arc-challenge', modelId: 'deepseek-v3', score: 94.8, rawScore: 94.8, normalizedScore: 94.8, confidenceInterval: [93.0, 96.6], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'arc-challenge', modelId: 'deepseek-r1', score: 96.3, rawScore: 96.3, normalizedScore: 96.3, confidenceInterval: [94.6, 98.0], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'arc-challenge', modelId: 'qwen-2-5-72b', score: 92.1, rawScore: 92.1, normalizedScore: 92.1, confidenceInterval: [89.9, 94.3], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'arc-challenge', modelId: 'gemma-2-27b', score: 88.5, rawScore: 88.5, normalizedScore: 88.5, confidenceInterval: [86.0, 91.0], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── HellaSwag ──────────────────────────────────────────
  { benchmarkId: 'hellaswag', modelId: 'gpt-4o', score: 94.5, rawScore: 94.5, normalizedScore: 94.5, confidenceInterval: [93.8, 95.2], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'hellaswag', modelId: 'gpt-4-turbo', score: 95.6, rawScore: 95.6, normalizedScore: 95.6, confidenceInterval: [94.9, 96.3], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'hellaswag', modelId: 'o1', score: 96.4, rawScore: 96.4, normalizedScore: 96.4, confidenceInterval: [95.7, 97.1], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'hellaswag', modelId: 'claude-3-5-sonnet', score: 94.8, rawScore: 94.8, normalizedScore: 94.8, confidenceInterval: [94.1, 95.5], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'hellaswag', modelId: 'claude-3-opus', score: 95.4, rawScore: 95.4, normalizedScore: 95.4, confidenceInterval: [94.7, 96.1], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'hellaswag', modelId: 'gemini-2-flash', score: 90.2, rawScore: 90.2, normalizedScore: 90.2, confidenceInterval: [89.3, 91.1], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'hellaswag', modelId: 'gemini-1-5-pro', score: 89.0, rawScore: 89.0, normalizedScore: 89.0, confidenceInterval: [88.0, 90.0], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'hellaswag', modelId: 'llama-3-3-70b', score: 88.5, rawScore: 88.5, normalizedScore: 88.5, confidenceInterval: [87.5, 89.5], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'hellaswag', modelId: 'llama-3-1-405b', score: 89.2, rawScore: 89.2, normalizedScore: 89.2, confidenceInterval: [88.2, 90.2], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'hellaswag', modelId: 'llama-3-1-8b', score: 82.2, rawScore: 82.2, normalizedScore: 82.2, confidenceInterval: [81.0, 83.4], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'hellaswag', modelId: 'mistral-large', score: 86.7, rawScore: 86.7, normalizedScore: 86.7, confidenceInterval: [85.6, 87.8], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'hellaswag', modelId: 'deepseek-v3', score: 91.4, rawScore: 91.4, normalizedScore: 91.4, confidenceInterval: [90.4, 92.4], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'hellaswag', modelId: 'deepseek-r1', score: 92.8, rawScore: 92.8, normalizedScore: 92.8, confidenceInterval: [91.8, 93.8], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'hellaswag', modelId: 'qwen-2-5-72b', score: 88.0, rawScore: 88.0, normalizedScore: 88.0, confidenceInterval: [86.9, 89.1], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'hellaswag', modelId: 'gemma-2-27b', score: 84.6, rawScore: 84.6, normalizedScore: 84.6, confidenceInterval: [83.4, 85.8], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── WinoGrande ─────────────────────────────────────────
  { benchmarkId: 'winogrande', modelId: 'gpt-4o', score: 90.5, rawScore: 90.5, normalizedScore: 90.5, confidenceInterval: [89.2, 91.8], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'winogrande', modelId: 'gpt-4-turbo', score: 89.8, rawScore: 89.8, normalizedScore: 89.8, confidenceInterval: [88.5, 91.1], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'winogrande', modelId: 'o1', score: 92.1, rawScore: 92.1, normalizedScore: 92.1, confidenceInterval: [90.8, 93.4], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'winogrande', modelId: 'claude-3-5-sonnet', score: 89.4, rawScore: 89.4, normalizedScore: 89.4, confidenceInterval: [88.1, 90.7], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'winogrande', modelId: 'claude-3-opus', score: 88.7, rawScore: 88.7, normalizedScore: 88.7, confidenceInterval: [87.4, 90.0], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'winogrande', modelId: 'gemini-2-flash', score: 86.3, rawScore: 86.3, normalizedScore: 86.3, confidenceInterval: [84.8, 87.8], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'winogrande', modelId: 'gemini-1-5-pro', score: 84.5, rawScore: 84.5, normalizedScore: 84.5, confidenceInterval: [82.9, 86.1], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'winogrande', modelId: 'llama-3-3-70b', score: 85.8, rawScore: 85.8, normalizedScore: 85.8, confidenceInterval: [84.3, 87.3], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'winogrande', modelId: 'llama-3-1-405b', score: 88.0, rawScore: 88.0, normalizedScore: 88.0, confidenceInterval: [86.5, 89.5], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'winogrande', modelId: 'llama-3-1-8b', score: 77.2, rawScore: 77.2, normalizedScore: 77.2, confidenceInterval: [75.5, 78.9], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'winogrande', modelId: 'mistral-large', score: 83.6, rawScore: 83.6, normalizedScore: 83.6, confidenceInterval: [82.0, 85.2], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'winogrande', modelId: 'deepseek-v3', score: 87.0, rawScore: 87.0, normalizedScore: 87.0, confidenceInterval: [85.5, 88.5], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'winogrande', modelId: 'deepseek-r1', score: 89.6, rawScore: 89.6, normalizedScore: 89.6, confidenceInterval: [88.2, 91.0], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'winogrande', modelId: 'qwen-2-5-72b', score: 85.0, rawScore: 85.0, normalizedScore: 85.0, confidenceInterval: [83.4, 86.6], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'winogrande', modelId: 'gemma-2-27b', score: 80.4, rawScore: 80.4, normalizedScore: 80.4, confidenceInterval: [78.6, 82.2], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── BIG-Bench Hard ─────────────────────────────────────
  { benchmarkId: 'big-bench-hard', modelId: 'gpt-4o', score: 87.3, rawScore: 87.3, normalizedScore: 87.3, confidenceInterval: [86.0, 88.6], dateEvaluated: '2024-08-20', evaluator: 'OpenAI' },
  { benchmarkId: 'big-bench-hard', modelId: 'gpt-4-turbo', score: 85.1, rawScore: 85.1, normalizedScore: 85.1, confidenceInterval: [83.7, 86.5], dateEvaluated: '2024-04-15', evaluator: 'OpenAI' },
  { benchmarkId: 'big-bench-hard', modelId: 'o1', score: 91.4, rawScore: 91.4, normalizedScore: 91.4, confidenceInterval: [90.1, 92.7], dateEvaluated: '2024-12-08', evaluator: 'OpenAI' },
  { benchmarkId: 'big-bench-hard', modelId: 'claude-3-5-sonnet', score: 86.5, rawScore: 86.5, normalizedScore: 86.5, confidenceInterval: [85.1, 87.9], dateEvaluated: '2024-06-22', evaluator: 'Anthropic' },
  { benchmarkId: 'big-bench-hard', modelId: 'claude-3-opus', score: 83.9, rawScore: 83.9, normalizedScore: 83.9, confidenceInterval: [82.4, 85.4], dateEvaluated: '2024-03-08', evaluator: 'Anthropic' },
  { benchmarkId: 'big-bench-hard', modelId: 'gemini-2-flash', score: 82.6, rawScore: 82.6, normalizedScore: 82.6, confidenceInterval: [81.0, 84.2], dateEvaluated: '2025-02-12', evaluator: 'Google' },
  { benchmarkId: 'big-bench-hard', modelId: 'gemini-1-5-pro', score: 80.4, rawScore: 80.4, normalizedScore: 80.4, confidenceInterval: [78.7, 82.1], dateEvaluated: '2024-05-18', evaluator: 'Google' },
  { benchmarkId: 'big-bench-hard', modelId: 'llama-3-3-70b', score: 79.8, rawScore: 79.8, normalizedScore: 79.8, confidenceInterval: [78.1, 81.5], dateEvaluated: '2024-12-10', evaluator: 'Meta' },
  { benchmarkId: 'big-bench-hard', modelId: 'llama-3-1-405b', score: 84.2, rawScore: 84.2, normalizedScore: 84.2, confidenceInterval: [82.7, 85.7], dateEvaluated: '2024-07-25', evaluator: 'Meta' },
  { benchmarkId: 'big-bench-hard', modelId: 'llama-3-1-8b', score: 58.6, rawScore: 58.6, normalizedScore: 58.6, confidenceInterval: [56.5, 60.7], dateEvaluated: '2024-07-25', evaluator: 'Meta' },
  { benchmarkId: 'big-bench-hard', modelId: 'mistral-large', score: 76.5, rawScore: 76.5, normalizedScore: 76.5, confidenceInterval: [74.6, 78.4], dateEvaluated: '2024-03-02', evaluator: 'Mistral AI' },
  { benchmarkId: 'big-bench-hard', modelId: 'deepseek-v3', score: 85.0, rawScore: 85.0, normalizedScore: 85.0, confidenceInterval: [83.5, 86.5], dateEvaluated: '2024-12-28', evaluator: 'DeepSeek' },
  { benchmarkId: 'big-bench-hard', modelId: 'deepseek-r1', score: 89.5, rawScore: 89.5, normalizedScore: 89.5, confidenceInterval: [88.1, 90.9], dateEvaluated: '2025-01-22', evaluator: 'DeepSeek' },
  { benchmarkId: 'big-bench-hard', modelId: 'qwen-2-5-72b', score: 79.0, rawScore: 79.0, normalizedScore: 79.0, confidenceInterval: [77.3, 80.7], dateEvaluated: '2024-09-22', evaluator: 'Alibaba' },
  { benchmarkId: 'big-bench-hard', modelId: 'gemma-2-27b', score: 68.3, rawScore: 68.3, normalizedScore: 68.3, confidenceInterval: [66.2, 70.4], dateEvaluated: '2024-07-02', evaluator: 'Google' },

  // ─── HumanEval ──────────────────────────────────────────
  { benchmarkId: 'humaneval', modelId: 'gpt-4o', score: 91.0, rawScore: 91.0, normalizedScore: 91.0, confidenceInterval: [88.8, 93.2], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval', modelId: 'gpt-4-turbo', score: 88.4, rawScore: 88.4, normalizedScore: 88.4, confidenceInterval: [85.9, 90.9], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval', modelId: 'o1', score: 92.4, rawScore: 92.4, normalizedScore: 92.4, confidenceInterval: [90.2, 94.6], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval', modelId: 'claude-3-5-sonnet', score: 93.7, rawScore: 93.7, normalizedScore: 93.7, confidenceInterval: [91.6, 95.8], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'humaneval', modelId: 'claude-3-opus', score: 85.4, rawScore: 85.4, normalizedScore: 85.4, confidenceInterval: [82.7, 88.1], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'humaneval', modelId: 'gemini-2-flash', score: 82.9, rawScore: 82.9, normalizedScore: 82.9, confidenceInterval: [79.8, 86.0], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'humaneval', modelId: 'gemini-1-5-pro', score: 80.5, rawScore: 80.5, normalizedScore: 80.5, confidenceInterval: [77.2, 83.8], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'humaneval', modelId: 'llama-3-3-70b', score: 80.0, rawScore: 80.0, normalizedScore: 80.0, confidenceInterval: [76.7, 83.3], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'humaneval', modelId: 'llama-3-1-405b', score: 86.6, rawScore: 86.6, normalizedScore: 86.6, confidenceInterval: [83.7, 89.5], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'humaneval', modelId: 'llama-3-1-8b', score: 69.5, rawScore: 69.5, normalizedScore: 69.5, confidenceInterval: [65.9, 73.1], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'humaneval', modelId: 'mistral-large', score: 76.2, rawScore: 76.2, normalizedScore: 76.2, confidenceInterval: [72.7, 79.7], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'humaneval', modelId: 'deepseek-v3', score: 82.0, rawScore: 82.0, normalizedScore: 82.0, confidenceInterval: [78.8, 85.2], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'humaneval', modelId: 'deepseek-r1', score: 87.2, rawScore: 87.2, normalizedScore: 87.2, confidenceInterval: [84.3, 90.1], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'humaneval', modelId: 'qwen-2-5-72b', score: 78.6, rawScore: 78.6, normalizedScore: 78.6, confidenceInterval: [75.2, 82.0], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'humaneval', modelId: 'gemma-2-27b', score: 64.0, rawScore: 64.0, normalizedScore: 64.0, confidenceInterval: [60.1, 67.9], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── HumanEval+ ─────────────────────────────────────────
  { benchmarkId: 'humaneval-plus', modelId: 'gpt-4o', score: 87.2, rawScore: 87.2, normalizedScore: 87.2, confidenceInterval: [84.5, 89.9], dateEvaluated: '2024-08-18', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval-plus', modelId: 'gpt-4-turbo', score: 84.8, rawScore: 84.8, normalizedScore: 84.8, confidenceInterval: [81.8, 87.8], dateEvaluated: '2024-04-12', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval-plus', modelId: 'o1', score: 88.9, rawScore: 88.9, normalizedScore: 88.9, confidenceInterval: [86.3, 91.5], dateEvaluated: '2024-12-08', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval-plus', modelId: 'claude-3-5-sonnet', score: 90.2, rawScore: 90.2, normalizedScore: 90.2, confidenceInterval: [87.7, 92.7], dateEvaluated: '2024-06-22', evaluator: 'Anthropic' },
  { benchmarkId: 'humaneval-plus', modelId: 'claude-3-opus', score: 81.8, rawScore: 81.8, normalizedScore: 81.8, confidenceInterval: [78.7, 84.9], dateEvaluated: '2024-03-08', evaluator: 'Anthropic' },
  { benchmarkId: 'humaneval-plus', modelId: 'deepseek-v3', score: 78.3, rawScore: 78.3, normalizedScore: 78.3, confidenceInterval: [74.8, 81.8], dateEvaluated: '2024-12-28', evaluator: 'DeepSeek' },
  { benchmarkId: 'humaneval-plus', modelId: 'deepseek-r1', score: 84.0, rawScore: 84.0, normalizedScore: 84.0, confidenceInterval: [80.8, 87.2], dateEvaluated: '2025-01-22', evaluator: 'DeepSeek' },
  { benchmarkId: 'humaneval-plus', modelId: 'llama-3-3-70b', score: 76.0, rawScore: 76.0, normalizedScore: 76.0, confidenceInterval: [72.3, 79.7], dateEvaluated: '2024-12-10', evaluator: 'Meta' },
  { benchmarkId: 'humaneval-plus', modelId: 'llama-3-1-405b', score: 82.5, rawScore: 82.5, normalizedScore: 82.5, confidenceInterval: [79.2, 85.8], dateEvaluated: '2024-07-26', evaluator: 'Meta' },
  { benchmarkId: 'humaneval-plus', modelId: 'llama-3-1-8b', score: 64.8, rawScore: 64.8, normalizedScore: 64.8, confidenceInterval: [60.8, 68.8], dateEvaluated: '2024-07-26', evaluator: 'Meta' },

  // ─── MBPP ───────────────────────────────────────────────
  { benchmarkId: 'mbpp', modelId: 'gpt-4o', score: 88.2, rawScore: 88.2, normalizedScore: 88.2, confidenceInterval: [86.5, 89.9], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'mbpp', modelId: 'gpt-4-turbo', score: 86.0, rawScore: 86.0, normalizedScore: 86.0, confidenceInterval: [84.2, 87.8], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'mbpp', modelId: 'o1', score: 90.1, rawScore: 90.1, normalizedScore: 90.1, confidenceInterval: [88.4, 91.8], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'mbpp', modelId: 'claude-3-5-sonnet', score: 90.9, rawScore: 90.9, normalizedScore: 90.9, confidenceInterval: [89.2, 92.6], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'mbpp', modelId: 'claude-3-opus', score: 83.5, rawScore: 83.5, normalizedScore: 83.5, confidenceInterval: [81.6, 85.4], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'mbpp', modelId: 'gemini-2-flash', score: 80.7, rawScore: 80.7, normalizedScore: 80.7, confidenceInterval: [78.6, 82.8], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'mbpp', modelId: 'gemini-1-5-pro', score: 78.3, rawScore: 78.3, normalizedScore: 78.3, confidenceInterval: [76.1, 80.5], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'mbpp', modelId: 'llama-3-3-70b', score: 79.5, rawScore: 79.5, normalizedScore: 79.5, confidenceInterval: [77.4, 81.6], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'mbpp', modelId: 'llama-3-1-405b', score: 84.6, rawScore: 84.6, normalizedScore: 84.6, confidenceInterval: [82.7, 86.5], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'mbpp', modelId: 'llama-3-1-8b', score: 71.2, rawScore: 71.2, normalizedScore: 71.2, confidenceInterval: [68.7, 73.7], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'mbpp', modelId: 'mistral-large', score: 74.8, rawScore: 74.8, normalizedScore: 74.8, confidenceInterval: [72.5, 77.1], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'mbpp', modelId: 'deepseek-v3', score: 81.6, rawScore: 81.6, normalizedScore: 81.6, confidenceInterval: [79.5, 83.7], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'mbpp', modelId: 'deepseek-r1', score: 85.8, rawScore: 85.8, normalizedScore: 85.8, confidenceInterval: [83.8, 87.8], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'mbpp', modelId: 'qwen-2-5-72b', score: 77.4, rawScore: 77.4, normalizedScore: 77.4, confidenceInterval: [75.2, 79.6], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'mbpp', modelId: 'gemma-2-27b', score: 66.8, rawScore: 66.8, normalizedScore: 66.8, confidenceInterval: [64.1, 69.5], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── SWE-bench Verified ─────────────────────────────────
  { benchmarkId: 'swe-bench-verified', modelId: 'gpt-4o', score: 38.2, rawScore: 38.2, normalizedScore: 38.2, confidenceInterval: [35.4, 41.0], dateEvaluated: '2024-10-05', evaluator: 'OpenAI' },
  { benchmarkId: 'swe-bench-verified', modelId: 'o1', score: 45.4, rawScore: 45.4, normalizedScore: 45.4, confidenceInterval: [42.5, 48.3], dateEvaluated: '2025-01-08', evaluator: 'OpenAI' },
  { benchmarkId: 'swe-bench-verified', modelId: 'claude-3-5-sonnet', score: 48.6, rawScore: 48.6, normalizedScore: 48.6, confidenceInterval: [45.7, 51.5], dateEvaluated: '2024-11-15', evaluator: 'Anthropic' },
  { benchmarkId: 'swe-bench-verified', modelId: 'deepseek-v3', score: 41.8, rawScore: 41.8, normalizedScore: 41.8, confidenceInterval: [38.9, 44.7], dateEvaluated: '2025-01-30', evaluator: 'DeepSeek' },
  { benchmarkId: 'swe-bench-verified', modelId: 'deepseek-r1', score: 44.5, rawScore: 44.5, normalizedScore: 44.5, confidenceInterval: [41.6, 47.4], dateEvaluated: '2025-02-05', evaluator: 'DeepSeek' },
  { benchmarkId: 'swe-bench-verified', modelId: 'gemini-2-flash', score: 35.8, rawScore: 35.8, normalizedScore: 35.8, confidenceInterval: [33.0, 38.6], dateEvaluated: '2025-02-18', evaluator: 'Google' },
  { benchmarkId: 'swe-bench-verified', modelId: 'llama-3-3-70b', score: 30.5, rawScore: 30.5, normalizedScore: 30.5, confidenceInterval: [27.7, 33.3], dateEvaluated: '2024-12-20', evaluator: 'Meta' },
  { benchmarkId: 'swe-bench-verified', modelId: 'llama-3-1-405b', score: 36.0, rawScore: 36.0, normalizedScore: 36.0, confidenceInterval: [33.2, 38.8], dateEvaluated: '2024-08-10', evaluator: 'Meta' },
  { benchmarkId: 'swe-bench-verified', modelId: 'qwen-2-5-72b', score: 33.2, rawScore: 33.2, normalizedScore: 33.2, confidenceInterval: [30.3, 36.1], dateEvaluated: '2024-10-20', evaluator: 'Alibaba' },
  { benchmarkId: 'swe-bench-verified', modelId: 'gemma-2-27b', score: 20.8, rawScore: 20.8, normalizedScore: 20.8, confidenceInterval: [18.2, 23.4], dateEvaluated: '2024-08-02', evaluator: 'Google' },

  // ─── MATH ───────────────────────────────────────────────
  { benchmarkId: 'math', modelId: 'gpt-4o', score: 79.8, rawScore: 79.8, normalizedScore: 79.8, confidenceInterval: [78.2, 81.4], dateEvaluated: '2024-08-18', evaluator: 'OpenAI' },
  { benchmarkId: 'math', modelId: 'gpt-4-turbo', score: 72.6, rawScore: 72.6, normalizedScore: 72.6, confidenceInterval: [70.8, 74.4], dateEvaluated: '2024-04-12', evaluator: 'OpenAI' },
  { benchmarkId: 'math', modelId: 'o1', score: 94.8, rawScore: 94.8, normalizedScore: 94.8, confidenceInterval: [93.5, 96.1], dateEvaluated: '2024-12-06', evaluator: 'OpenAI' },
  { benchmarkId: 'math', modelId: 'claude-3-5-sonnet', score: 80.2, rawScore: 80.2, normalizedScore: 80.2, confidenceInterval: [78.6, 81.8], dateEvaluated: '2024-06-22', evaluator: 'Anthropic' },
  { benchmarkId: 'math', modelId: 'claude-3-opus', score: 64.8, rawScore: 64.8, normalizedScore: 64.8, confidenceInterval: [62.9, 66.7], dateEvaluated: '2024-03-06', evaluator: 'Anthropic' },
  { benchmarkId: 'math', modelId: 'gemini-2-flash', score: 74.0, rawScore: 74.0, normalizedScore: 74.0, confidenceInterval: [72.2, 75.8], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'math', modelId: 'gemini-1-5-pro', score: 65.4, rawScore: 65.4, normalizedScore: 65.4, confidenceInterval: [63.5, 67.3], dateEvaluated: '2024-05-16', evaluator: 'Google' },
  { benchmarkId: 'math', modelId: 'llama-3-3-70b', score: 62.7, rawScore: 62.7, normalizedScore: 62.7, confidenceInterval: [60.7, 64.7], dateEvaluated: '2024-12-10', evaluator: 'Meta' },
  { benchmarkId: 'math', modelId: 'llama-3-1-405b', score: 68.0, rawScore: 68.0, normalizedScore: 68.0, confidenceInterval: [66.1, 69.9], dateEvaluated: '2024-07-25', evaluator: 'Meta' },
  { benchmarkId: 'math', modelId: 'llama-3-1-8b', score: 33.5, rawScore: 33.5, normalizedScore: 33.5, confidenceInterval: [31.7, 35.3], dateEvaluated: '2024-07-25', evaluator: 'Meta' },
  { benchmarkId: 'math', modelId: 'mistral-large', score: 52.0, rawScore: 52.0, normalizedScore: 52.0, confidenceInterval: [50.0, 54.0], dateEvaluated: '2024-03-02', evaluator: 'Mistral AI' },
  { benchmarkId: 'math', modelId: 'deepseek-v3', score: 75.6, rawScore: 75.6, normalizedScore: 75.6, confidenceInterval: [73.9, 77.3], dateEvaluated: '2024-12-28', evaluator: 'DeepSeek' },
  { benchmarkId: 'math', modelId: 'deepseek-r1', score: 91.2, rawScore: 91.2, normalizedScore: 91.2, confidenceInterval: [89.8, 92.6], dateEvaluated: '2025-01-22', evaluator: 'DeepSeek' },
  { benchmarkId: 'math', modelId: 'qwen-2-5-72b', score: 70.5, rawScore: 70.5, normalizedScore: 70.5, confidenceInterval: [68.7, 72.3], dateEvaluated: '2024-09-22', evaluator: 'Alibaba' },
  { benchmarkId: 'math', modelId: 'gemma-2-27b', score: 48.4, rawScore: 48.4, normalizedScore: 48.4, confidenceInterval: [46.4, 50.4], dateEvaluated: '2024-06-29', evaluator: 'Google' },

  // ─── GSM8K ──────────────────────────────────────────────
  { benchmarkId: 'gsm8k', modelId: 'gpt-4o', score: 95.2, rawScore: 95.2, normalizedScore: 95.2, confidenceInterval: [93.9, 96.5], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'gsm8k', modelId: 'gpt-4-turbo', score: 93.6, rawScore: 93.6, normalizedScore: 93.6, confidenceInterval: [92.2, 95.0], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'gsm8k', modelId: 'o1', score: 97.5, rawScore: 97.5, normalizedScore: 97.5, confidenceInterval: [96.2, 98.8], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'gsm8k', modelId: 'claude-3-5-sonnet', score: 93.5, rawScore: 93.5, normalizedScore: 93.5, confidenceInterval: [92.1, 94.9], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'gsm8k', modelId: 'claude-3-opus', score: 91.0, rawScore: 91.0, normalizedScore: 91.0, confidenceInterval: [89.4, 92.6], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'gsm8k', modelId: 'gemini-2-flash', score: 90.5, rawScore: 90.5, normalizedScore: 90.5, confidenceInterval: [89.0, 92.0], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'gsm8k', modelId: 'gemini-1-5-pro', score: 89.0, rawScore: 89.0, normalizedScore: 89.0, confidenceInterval: [87.4, 90.6], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'gsm8k', modelId: 'llama-3-3-70b', score: 88.8, rawScore: 88.8, normalizedScore: 88.8, confidenceInterval: [87.2, 90.4], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'gsm8k', modelId: 'llama-3-1-405b', score: 91.2, rawScore: 91.2, normalizedScore: 91.2, confidenceInterval: [89.6, 92.8], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'gsm8k', modelId: 'llama-3-1-8b', score: 79.0, rawScore: 79.0, normalizedScore: 79.0, confidenceInterval: [77.0, 81.0], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'gsm8k', modelId: 'mistral-large', score: 84.5, rawScore: 84.5, normalizedScore: 84.5, confidenceInterval: [82.7, 86.3], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'gsm8k', modelId: 'deepseek-v3', score: 92.0, rawScore: 92.0, normalizedScore: 92.0, confidenceInterval: [90.5, 93.5], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'gsm8k', modelId: 'deepseek-r1', score: 96.0, rawScore: 96.0, normalizedScore: 96.0, confidenceInterval: [94.7, 97.3], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'gsm8k', modelId: 'qwen-2-5-72b', score: 88.2, rawScore: 88.2, normalizedScore: 88.2, confidenceInterval: [86.6, 89.8], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'gsm8k', modelId: 'gemma-2-27b', score: 82.6, rawScore: 82.6, normalizedScore: 82.6, confidenceInterval: [80.6, 84.6], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── MT-Bench ───────────────────────────────────────────
  { benchmarkId: 'mt-bench', modelId: 'gpt-4o', score: 9.2, rawScore: 9.2, normalizedScore: 92.0, confidenceInterval: [8.9, 9.5], dateEvaluated: '2024-08-15', evaluator: 'LMSYS' },
  { benchmarkId: 'mt-bench', modelId: 'gpt-4-turbo', score: 9.3, rawScore: 9.3, normalizedScore: 93.0, confidenceInterval: [9.0, 9.6], dateEvaluated: '2024-04-10', evaluator: 'LMSYS' },
  { benchmarkId: 'mt-bench', modelId: 'o1', score: 9.0, rawScore: 9.0, normalizedScore: 90.0, confidenceInterval: [8.7, 9.3], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'mt-bench', modelId: 'claude-3-5-sonnet', score: 8.9, rawScore: 8.9, normalizedScore: 89.0, confidenceInterval: [8.6, 9.2], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'mt-bench', modelId: 'claude-3-opus', score: 8.2, rawScore: 8.2, normalizedScore: 82.0, confidenceInterval: [7.9, 8.5], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'mt-bench', modelId: 'gemini-2-flash', score: 8.5, rawScore: 8.5, normalizedScore: 85.0, confidenceInterval: [8.2, 8.8], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'mt-bench', modelId: 'gemini-1-5-pro', score: 8.0, rawScore: 8.0, normalizedScore: 80.0, confidenceInterval: [7.7, 8.3], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'mt-bench', modelId: 'llama-3-3-70b', score: 8.4, rawScore: 8.4, normalizedScore: 84.0, confidenceInterval: [8.1, 8.7], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'mt-bench', modelId: 'llama-3-1-405b', score: 8.3, rawScore: 8.3, normalizedScore: 83.0, confidenceInterval: [8.0, 8.6], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'mt-bench', modelId: 'llama-3-1-8b', score: 6.8, rawScore: 6.8, normalizedScore: 68.0, confidenceInterval: [6.5, 7.1], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'mt-bench', modelId: 'mistral-large', score: 7.6, rawScore: 7.6, normalizedScore: 76.0, confidenceInterval: [7.3, 7.9], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'mt-bench', modelId: 'deepseek-v3', score: 8.6, rawScore: 8.6, normalizedScore: 86.0, confidenceInterval: [8.3, 8.9], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'mt-bench', modelId: 'deepseek-r1', score: 8.8, rawScore: 8.8, normalizedScore: 88.0, confidenceInterval: [8.5, 9.1], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'mt-bench', modelId: 'qwen-2-5-72b', score: 7.9, rawScore: 7.9, normalizedScore: 79.0, confidenceInterval: [7.6, 8.2], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'mt-bench', modelId: 'gemma-2-27b', score: 7.1, rawScore: 7.1, normalizedScore: 71.0, confidenceInterval: [6.8, 7.4], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── AlpacaEval 2.0 ─────────────────────────────────────
  { benchmarkId: 'alpacaeval-2', modelId: 'gpt-4o', score: 57.5, rawScore: 57.5, normalizedScore: 57.5, confidenceInterval: [55.2, 59.8], dateEvaluated: '2024-08-20', evaluator: 'Stanford CRFM' },
  { benchmarkId: 'alpacaeval-2', modelId: 'gpt-4-turbo', score: 55.0, rawScore: 55.0, normalizedScore: 55.0, confidenceInterval: [52.7, 57.3], dateEvaluated: '2024-04-15', evaluator: 'Stanford CRFM' },
  { benchmarkId: 'alpacaeval-2', modelId: 'o1', score: 52.3, rawScore: 52.3, normalizedScore: 52.3, confidenceInterval: [50.0, 54.6], dateEvaluated: '2024-12-10', evaluator: 'OpenAI' },
  { benchmarkId: 'alpacaeval-2', modelId: 'claude-3-5-sonnet', score: 54.8, rawScore: 54.8, normalizedScore: 54.8, confidenceInterval: [52.5, 57.1], dateEvaluated: '2024-06-22', evaluator: 'Anthropic' },
  { benchmarkId: 'alpacaeval-2', modelId: 'claude-3-opus', score: 50.2, rawScore: 50.2, normalizedScore: 50.2, confidenceInterval: [47.9, 52.5], dateEvaluated: '2024-03-08', evaluator: 'Anthropic' },
  { benchmarkId: 'alpacaeval-2', modelId: 'gemini-2-flash', score: 48.6, rawScore: 48.6, normalizedScore: 48.6, confidenceInterval: [46.3, 50.9], dateEvaluated: '2025-02-14', evaluator: 'Google' },
  { benchmarkId: 'alpacaeval-2', modelId: 'gemini-1-5-pro', score: 42.0, rawScore: 42.0, normalizedScore: 42.0, confidenceInterval: [39.7, 44.3], dateEvaluated: '2024-05-18', evaluator: 'Google' },
  { benchmarkId: 'alpacaeval-2', modelId: 'llama-3-3-70b', score: 44.5, rawScore: 44.5, normalizedScore: 44.5, confidenceInterval: [42.2, 46.8], dateEvaluated: '2024-12-12', evaluator: 'Meta' },
  { benchmarkId: 'alpacaeval-2', modelId: 'llama-3-1-405b', score: 46.2, rawScore: 46.2, normalizedScore: 46.2, confidenceInterval: [43.9, 48.5], dateEvaluated: '2024-07-28', evaluator: 'Meta' },
  { benchmarkId: 'alpacaeval-2', modelId: 'llama-3-1-8b', score: 28.6, rawScore: 28.6, normalizedScore: 28.6, confidenceInterval: [26.4, 30.8], dateEvaluated: '2024-07-28', evaluator: 'Meta' },
  { benchmarkId: 'alpacaeval-2', modelId: 'deepseek-v3', score: 51.0, rawScore: 51.0, normalizedScore: 51.0, confidenceInterval: [48.7, 53.3], dateEvaluated: '2024-12-30', evaluator: 'DeepSeek' },
  { benchmarkId: 'alpacaeval-2', modelId: 'deepseek-r1', score: 53.5, rawScore: 53.5, normalizedScore: 53.5, confidenceInterval: [51.2, 55.8], dateEvaluated: '2025-01-25', evaluator: 'DeepSeek' },
  { benchmarkId: 'alpacaeval-2', modelId: 'qwen-2-5-72b', score: 43.0, rawScore: 43.0, normalizedScore: 43.0, confidenceInterval: [40.7, 45.3], dateEvaluated: '2024-09-25', evaluator: 'Alibaba' },
  { benchmarkId: 'alpacaeval-2', modelId: 'gemma-2-27b', score: 32.4, rawScore: 32.4, normalizedScore: 32.4, confidenceInterval: [30.2, 34.6], dateEvaluated: '2024-07-05', evaluator: 'Google' },

  // ─── RULER ──────────────────────────────────────────────
  { benchmarkId: 'ruler', modelId: 'gpt-4o', score: 84.0, rawScore: 84.0, normalizedScore: 84.0, confidenceInterval: [82.3, 85.7], dateEvaluated: '2024-09-10', evaluator: 'NVIDIA' },
  { benchmarkId: 'ruler', modelId: 'claude-3-5-sonnet', score: 80.2, rawScore: 80.2, normalizedScore: 80.2, confidenceInterval: [78.4, 82.0], dateEvaluated: '2024-07-15', evaluator: 'Anthropic' },
  { benchmarkId: 'ruler', modelId: 'gemini-1-5-pro', score: 86.5, rawScore: 86.5, normalizedScore: 86.5, confidenceInterval: [84.9, 88.1], dateEvaluated: '2024-05-22', evaluator: 'Google' },
  { benchmarkId: 'ruler', modelId: 'gemini-2-flash', score: 82.8, rawScore: 82.8, normalizedScore: 82.8, confidenceInterval: [81.1, 84.5], dateEvaluated: '2025-02-14', evaluator: 'Google' },
  { benchmarkId: 'ruler', modelId: 'o1', score: 88.5, rawScore: 88.5, normalizedScore: 88.5, confidenceInterval: [86.9, 90.1], dateEvaluated: '2024-12-15', evaluator: 'OpenAI' },
  { benchmarkId: 'ruler', modelId: 'llama-3-3-70b', score: 72.5, rawScore: 72.5, normalizedScore: 72.5, confidenceInterval: [70.5, 74.5], dateEvaluated: '2024-12-15', evaluator: 'Meta' },
  { benchmarkId: 'ruler', modelId: 'llama-3-1-405b', score: 76.8, rawScore: 76.8, normalizedScore: 76.8, confidenceInterval: [75.0, 78.6], dateEvaluated: '2024-08-05', evaluator: 'Meta' },
  { benchmarkId: 'ruler', modelId: 'llama-3-1-8b', score: 56.2, rawScore: 56.2, normalizedScore: 56.2, confidenceInterval: [53.8, 58.6], dateEvaluated: '2024-08-05', evaluator: 'Meta' },
  { benchmarkId: 'ruler', modelId: 'deepseek-r1', score: 85.0, rawScore: 85.0, normalizedScore: 85.0, confidenceInterval: [83.4, 86.6], dateEvaluated: '2025-01-28', evaluator: 'DeepSeek' },
  { benchmarkId: 'ruler', modelId: 'deepseek-v3', score: 80.5, rawScore: 80.5, normalizedScore: 80.5, confidenceInterval: [78.8, 82.2], dateEvaluated: '2025-01-05', evaluator: 'DeepSeek' },

  // ─── LongBench ──────────────────────────────────────────
  { benchmarkId: 'longbench', modelId: 'gpt-4o', score: 78.6, rawScore: 78.6, normalizedScore: 78.6, confidenceInterval: [77.0, 80.2], dateEvaluated: '2024-09-12', evaluator: 'THUNLP' },
  { benchmarkId: 'longbench', modelId: 'claude-3-5-sonnet', score: 76.2, rawScore: 76.2, normalizedScore: 76.2, confidenceInterval: [74.5, 77.9], dateEvaluated: '2024-07-18', evaluator: 'Anthropic' },
  { benchmarkId: 'longbench', modelId: 'gemini-1-5-pro', score: 80.4, rawScore: 80.4, normalizedScore: 80.4, confidenceInterval: [78.9, 81.9], dateEvaluated: '2024-05-24', evaluator: 'Google' },
  { benchmarkId: 'longbench', modelId: 'gemini-2-flash', score: 77.5, rawScore: 77.5, normalizedScore: 77.5, confidenceInterval: [75.9, 79.1], dateEvaluated: '2025-02-16', evaluator: 'Google' },
  { benchmarkId: 'longbench', modelId: 'o1', score: 82.8, rawScore: 82.8, normalizedScore: 82.8, confidenceInterval: [81.3, 84.3], dateEvaluated: '2024-12-18', evaluator: 'OpenAI' },
  { benchmarkId: 'longbench', modelId: 'llama-3-3-70b', score: 68.5, rawScore: 68.5, normalizedScore: 68.5, confidenceInterval: [66.5, 70.5], dateEvaluated: '2024-12-18', evaluator: 'Meta' },
  { benchmarkId: 'longbench', modelId: 'llama-3-1-405b', score: 73.0, rawScore: 73.0, normalizedScore: 73.0, confidenceInterval: [71.2, 74.8], dateEvaluated: '2024-08-08', evaluator: 'Meta' },
  { benchmarkId: 'longbench', modelId: 'llama-3-1-8b', score: 52.4, rawScore: 52.4, normalizedScore: 52.4, confidenceInterval: [50.0, 54.8], dateEvaluated: '2024-08-08', evaluator: 'Meta' },
  { benchmarkId: 'longbench', modelId: 'deepseek-v3', score: 75.0, rawScore: 75.0, normalizedScore: 75.0, confidenceInterval: [73.3, 76.7], dateEvaluated: '2025-01-08', evaluator: 'DeepSeek' },
  { benchmarkId: 'longbench', modelId: 'deepseek-r1', score: 79.5, rawScore: 79.5, normalizedScore: 79.5, confidenceInterval: [78.0, 81.0], dateEvaluated: '2025-01-28', evaluator: 'DeepSeek' },

  // ─── MMBench ────────────────────────────────────────────
  { benchmarkId: 'mmbench', modelId: 'gpt-4o', score: 83.2, rawScore: 83.2, normalizedScore: 83.2, confidenceInterval: [81.5, 84.9], dateEvaluated: '2024-08-22', evaluator: 'OpenMMLab' },
  { benchmarkId: 'mmbench', modelId: 'gpt-4-turbo', score: 82.0, rawScore: 82.0, normalizedScore: 82.0, confidenceInterval: [80.3, 83.7], dateEvaluated: '2024-04-18', evaluator: 'OpenMMLab' },
  { benchmarkId: 'mmbench', modelId: 'o1', score: 85.6, rawScore: 85.6, normalizedScore: 85.6, confidenceInterval: [84.0, 87.2], dateEvaluated: '2024-12-15', evaluator: 'OpenMMLab' },
  { benchmarkId: 'mmbench', modelId: 'claude-3-5-sonnet', score: 80.5, rawScore: 80.5, normalizedScore: 80.5, confidenceInterval: [78.7, 82.3], dateEvaluated: '2024-06-28', evaluator: 'Anthropic' },
  { benchmarkId: 'mmbench', modelId: 'claude-3-opus', score: 78.2, rawScore: 78.2, normalizedScore: 78.2, confidenceInterval: [76.4, 80.0], dateEvaluated: '2024-03-12', evaluator: 'Anthropic' },
  { benchmarkId: 'mmbench', modelId: 'gemini-2-flash', score: 76.5, rawScore: 76.5, normalizedScore: 76.5, confidenceInterval: [74.5, 78.5], dateEvaluated: '2025-02-18', evaluator: 'Google' },
  { benchmarkId: 'mmbench', modelId: 'gemini-1-5-pro', score: 72.8, rawScore: 72.8, normalizedScore: 72.8, confidenceInterval: [70.8, 74.8], dateEvaluated: '2024-05-22', evaluator: 'Google' },
  { benchmarkId: 'mmbench', modelId: 'llama-3-3-70b', score: 70.0, rawScore: 70.0, normalizedScore: 70.0, confidenceInterval: [67.9, 72.1], dateEvaluated: '2024-12-20', evaluator: 'Meta' },
  { benchmarkId: 'mmbench', modelId: 'llama-3-1-405b', score: 74.5, rawScore: 74.5, normalizedScore: 74.5, confidenceInterval: [72.5, 76.5], dateEvaluated: '2024-08-02', evaluator: 'Meta' },
  { benchmarkId: 'mmbench', modelId: 'deepseek-r1', score: 81.0, rawScore: 81.0, normalizedScore: 81.0, confidenceInterval: [79.2, 82.8], dateEvaluated: '2025-01-30', evaluator: 'DeepSeek' },

  // ─── MMMU ───────────────────────────────────────────────
  { benchmarkId: 'mmmu', modelId: 'gpt-4o', score: 68.8, rawScore: 68.8, normalizedScore: 68.8, confidenceInterval: [67.0, 70.6], dateEvaluated: '2024-08-25', evaluator: 'MMBench Team' },
  { benchmarkId: 'mmmu', modelId: 'gpt-4-turbo', score: 64.5, rawScore: 64.5, normalizedScore: 64.5, confidenceInterval: [62.6, 66.4], dateEvaluated: '2024-04-20', evaluator: 'MMBench Team' },
  { benchmarkId: 'mmmu', modelId: 'o1', score: 75.2, rawScore: 75.2, normalizedScore: 75.2, confidenceInterval: [73.4, 77.0], dateEvaluated: '2024-12-18', evaluator: 'MMBench Team' },
  { benchmarkId: 'mmmu', modelId: 'claude-3-5-sonnet', score: 65.0, rawScore: 65.0, normalizedScore: 65.0, confidenceInterval: [63.1, 66.9], dateEvaluated: '2024-06-30', evaluator: 'Anthropic' },
  { benchmarkId: 'mmmu', modelId: 'claude-3-opus', score: 62.1, rawScore: 62.1, normalizedScore: 62.1, confidenceInterval: [60.2, 64.0], dateEvaluated: '2024-03-15', evaluator: 'Anthropic' },
  { benchmarkId: 'mmmu', modelId: 'gemini-2-flash', score: 63.0, rawScore: 63.0, normalizedScore: 63.0, confidenceInterval: [61.0, 65.0], dateEvaluated: '2025-02-20', evaluator: 'Google' },
  { benchmarkId: 'mmmu', modelId: 'gemini-1-5-pro', score: 58.5, rawScore: 58.5, normalizedScore: 58.5, confidenceInterval: [56.5, 60.5], dateEvaluated: '2024-05-25', evaluator: 'Google' },
  { benchmarkId: 'mmmu', modelId: 'llama-3-3-70b', score: 55.8, rawScore: 55.8, normalizedScore: 55.8, confidenceInterval: [53.7, 57.9], dateEvaluated: '2024-12-22', evaluator: 'Meta' },
  { benchmarkId: 'mmmu', modelId: 'llama-3-1-405b', score: 58.0, rawScore: 58.0, normalizedScore: 58.0, confidenceInterval: [56.0, 60.0], dateEvaluated: '2024-08-05', evaluator: 'Meta' },
  { benchmarkId: 'mmmu', modelId: 'deepseek-r1', score: 73.5, rawScore: 73.5, normalizedScore: 73.5, confidenceInterval: [71.7, 75.3], dateEvaluated: '2025-02-02', evaluator: 'DeepSeek' },

  // ─── TruthfulQA ─────────────────────────────────────────
  { benchmarkId: 'truthfulqa', modelId: 'gpt-4o', score: 75.0, rawScore: 75.0, normalizedScore: 75.0, confidenceInterval: [73.1, 76.9], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'truthfulqa', modelId: 'gpt-4-turbo', score: 74.2, rawScore: 74.2, normalizedScore: 74.2, confidenceInterval: [72.3, 76.1], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'truthfulqa', modelId: 'o1', score: 78.5, rawScore: 78.5, normalizedScore: 78.5, confidenceInterval: [76.7, 80.3], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'truthfulqa', modelId: 'claude-3-5-sonnet', score: 76.8, rawScore: 76.8, normalizedScore: 76.8, confidenceInterval: [75.0, 78.6], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'truthfulqa', modelId: 'claude-3-opus', score: 79.0, rawScore: 79.0, normalizedScore: 79.0, confidenceInterval: [77.2, 80.8], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'truthfulqa', modelId: 'gemini-2-flash', score: 72.0, rawScore: 72.0, normalizedScore: 72.0, confidenceInterval: [70.0, 74.0], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'truthfulqa', modelId: 'gemini-1-5-pro', score: 70.5, rawScore: 70.5, normalizedScore: 70.5, confidenceInterval: [68.5, 72.5], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'truthfulqa', modelId: 'llama-3-3-70b', score: 68.4, rawScore: 68.4, normalizedScore: 68.4, confidenceInterval: [66.3, 70.5], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'truthfulqa', modelId: 'llama-3-1-405b', score: 72.8, rawScore: 72.8, normalizedScore: 72.8, confidenceInterval: [70.8, 74.8], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'truthfulqa', modelId: 'llama-3-1-8b', score: 54.6, rawScore: 54.6, normalizedScore: 54.6, confidenceInterval: [52.2, 57.0], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'truthfulqa', modelId: 'mistral-large', score: 65.0, rawScore: 65.0, normalizedScore: 65.0, confidenceInterval: [62.8, 67.2], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'truthfulqa', modelId: 'deepseek-v3', score: 71.5, rawScore: 71.5, normalizedScore: 71.5, confidenceInterval: [69.5, 73.5], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'truthfulqa', modelId: 'deepseek-r1', score: 77.2, rawScore: 77.2, normalizedScore: 77.2, confidenceInterval: [75.4, 79.0], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'truthfulqa', modelId: 'qwen-2-5-72b', score: 67.2, rawScore: 67.2, normalizedScore: 67.2, confidenceInterval: [65.0, 69.4], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'truthfulqa', modelId: 'gemma-2-27b', score: 62.8, rawScore: 62.8, normalizedScore: 62.8, confidenceInterval: [60.4, 65.2], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── BBQ ────────────────────────────────────────────────
  { benchmarkId: 'bbq', modelId: 'gpt-4o', score: 85.6, rawScore: 85.6, normalizedScore: 85.6, confidenceInterval: [83.8, 87.4], dateEvaluated: '2024-08-15', evaluator: 'OpenAI' },
  { benchmarkId: 'bbq', modelId: 'gpt-4-turbo', score: 83.2, rawScore: 83.2, normalizedScore: 83.2, confidenceInterval: [81.3, 85.1], dateEvaluated: '2024-04-10', evaluator: 'OpenAI' },
  { benchmarkId: 'bbq', modelId: 'o1', score: 88.0, rawScore: 88.0, normalizedScore: 88.0, confidenceInterval: [86.2, 89.8], dateEvaluated: '2024-12-05', evaluator: 'OpenAI' },
  { benchmarkId: 'bbq', modelId: 'claude-3-5-sonnet', score: 87.5, rawScore: 87.5, normalizedScore: 87.5, confidenceInterval: [85.7, 89.3], dateEvaluated: '2024-06-20', evaluator: 'Anthropic' },
  { benchmarkId: 'bbq', modelId: 'claude-3-opus', score: 86.8, rawScore: 86.8, normalizedScore: 86.8, confidenceInterval: [85.0, 88.6], dateEvaluated: '2024-03-04', evaluator: 'Anthropic' },
  { benchmarkId: 'bbq', modelId: 'gemini-2-flash', score: 82.5, rawScore: 82.5, normalizedScore: 82.5, confidenceInterval: [80.5, 84.5], dateEvaluated: '2025-02-10', evaluator: 'Google' },
  { benchmarkId: 'bbq', modelId: 'gemini-1-5-pro', score: 80.8, rawScore: 80.8, normalizedScore: 80.8, confidenceInterval: [78.7, 82.9], dateEvaluated: '2024-05-14', evaluator: 'Google' },
  { benchmarkId: 'bbq', modelId: 'llama-3-3-70b', score: 79.2, rawScore: 79.2, normalizedScore: 79.2, confidenceInterval: [77.0, 81.4], dateEvaluated: '2024-12-06', evaluator: 'Meta' },
  { benchmarkId: 'bbq', modelId: 'llama-3-1-405b', score: 81.5, rawScore: 81.5, normalizedScore: 81.5, confidenceInterval: [79.4, 83.6], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'bbq', modelId: 'llama-3-1-8b', score: 68.0, rawScore: 68.0, normalizedScore: 68.0, confidenceInterval: [65.5, 70.5], dateEvaluated: '2024-07-23', evaluator: 'Meta' },
  { benchmarkId: 'bbq', modelId: 'mistral-large', score: 76.4, rawScore: 76.4, normalizedScore: 76.4, confidenceInterval: [74.0, 78.8], dateEvaluated: '2024-02-26', evaluator: 'Mistral AI' },
  { benchmarkId: 'bbq', modelId: 'deepseek-v3', score: 80.0, rawScore: 80.0, normalizedScore: 80.0, confidenceInterval: [77.8, 82.2], dateEvaluated: '2024-12-26', evaluator: 'DeepSeek' },
  { benchmarkId: 'bbq', modelId: 'deepseek-r1', score: 84.2, rawScore: 84.2, normalizedScore: 84.2, confidenceInterval: [82.3, 86.1], dateEvaluated: '2025-01-20', evaluator: 'DeepSeek' },
  { benchmarkId: 'bbq', modelId: 'qwen-2-5-72b', score: 77.5, rawScore: 77.5, normalizedScore: 77.5, confidenceInterval: [75.2, 79.8], dateEvaluated: '2024-09-19', evaluator: 'Alibaba' },
  { benchmarkId: 'bbq', modelId: 'gemma-2-27b', score: 73.4, rawScore: 73.4, normalizedScore: 73.4, confidenceInterval: [71.0, 75.8], dateEvaluated: '2024-06-27', evaluator: 'Google' },

  // ─── NEW MODELS 2024-2025 ────────────────────────────────
  // GPT-4.5
  { benchmarkId: 'mmlu', modelId: 'gpt-4-5', score: 90.5, rawScore: 90.5, normalizedScore: 90.5, confidenceInterval: [89.8, 91.2], dateEvaluated: '2025-03-01', evaluator: 'OpenAI' },
  { benchmarkId: 'mmlu-pro', modelId: 'gpt-4-5', score: 78.2, rawScore: 78.2, normalizedScore: 78.2, confidenceInterval: [77.0, 79.4], dateEvaluated: '2025-03-01', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval', modelId: 'gpt-4-5', score: 93.0, rawScore: 93.0, normalizedScore: 93.0, confidenceInterval: [89.1, 96.9], dateEvaluated: '2025-03-01', evaluator: 'OpenAI' },
  { benchmarkId: 'gsm8k', modelId: 'gpt-4-5', score: 94.2, rawScore: 94.2, normalizedScore: 94.2, confidenceInterval: [92.9, 95.5], dateEvaluated: '2025-03-01', evaluator: 'OpenAI' },

  // Claude 3.7 Sonnet
  { benchmarkId: 'mmlu', modelId: 'claude-3-7-sonnet', score: 89.5, rawScore: 89.5, normalizedScore: 89.5, confidenceInterval: [88.8, 90.2], dateEvaluated: '2025-03-01', evaluator: 'Anthropic' },
  { benchmarkId: 'mmlu-pro', modelId: 'claude-3-7-sonnet', score: 76.5, rawScore: 76.5, normalizedScore: 76.5, confidenceInterval: [75.3, 77.7], dateEvaluated: '2025-03-01', evaluator: 'Anthropic' },
  { benchmarkId: 'humaneval', modelId: 'claude-3-7-sonnet', score: 94.8, rawScore: 94.8, normalizedScore: 94.8, confidenceInterval: [91.3, 98.3], dateEvaluated: '2025-03-01', evaluator: 'Anthropic' },
  { benchmarkId: 'gsm8k', modelId: 'claude-3-7-sonnet', score: 96.5, rawScore: 96.5, normalizedScore: 96.5, confidenceInterval: [95.5, 97.5], dateEvaluated: '2025-03-01', evaluator: 'Anthropic' },
  { benchmarkId: 'swe-bench', modelId: 'claude-3-7-sonnet', score: 70.3, rawScore: 70.3, normalizedScore: 70.3, confidenceInterval: [66.5, 74.1], dateEvaluated: '2025-03-01', evaluator: 'Anthropic' },

  // Llama 4 Maverick
  { benchmarkId: 'mmlu', modelId: 'llama-4-maverick', score: 87.5, rawScore: 87.5, normalizedScore: 87.5, confidenceInterval: [86.8, 88.2], dateEvaluated: '2025-04-08', evaluator: 'Meta' },
  { benchmarkId: 'mmlu-pro', modelId: 'llama-4-maverick', score: 72.0, rawScore: 72.0, normalizedScore: 72.0, confidenceInterval: [70.7, 73.3], dateEvaluated: '2025-04-08', evaluator: 'Meta' },
  { benchmarkId: 'humaneval', modelId: 'llama-4-maverick', score: 88.5, rawScore: 88.5, normalizedScore: 88.5, confidenceInterval: [84.3, 92.7], dateEvaluated: '2025-04-08', evaluator: 'Meta' },
  { benchmarkId: 'gsm8k', modelId: 'llama-4-maverick', score: 91.8, rawScore: 91.8, normalizedScore: 91.8, confidenceInterval: [90.3, 93.3], dateEvaluated: '2025-04-08', evaluator: 'Meta' },

  // Llama 4 Scout
  { benchmarkId: 'mmlu', modelId: 'llama-4-scout', score: 82.6, rawScore: 82.6, normalizedScore: 82.6, confidenceInterval: [81.8, 83.4], dateEvaluated: '2025-04-08', evaluator: 'Meta' },
  { benchmarkId: 'mmlu-pro', modelId: 'llama-4-scout', score: 64.8, rawScore: 64.8, normalizedScore: 64.8, confidenceInterval: [63.4, 66.2], dateEvaluated: '2025-04-08', evaluator: 'Meta' },
  { benchmarkId: 'humaneval', modelId: 'llama-4-scout', score: 84.0, rawScore: 84.0, normalizedScore: 84.0, confidenceInterval: [79.4, 88.6], dateEvaluated: '2025-04-08', evaluator: 'Meta' },
  { benchmarkId: 'gsm8k', modelId: 'llama-4-scout', score: 88.2, rawScore: 88.2, normalizedScore: 88.2, confidenceInterval: [86.4, 90.0], dateEvaluated: '2025-04-08', evaluator: 'Meta' },

  // Grok 3
  { benchmarkId: 'mmlu', modelId: 'grok-3', score: 89.0, rawScore: 89.0, normalizedScore: 89.0, confidenceInterval: [88.3, 89.7], dateEvaluated: '2025-02-20', evaluator: 'xAI' },
  { benchmarkId: 'mmlu-pro', modelId: 'grok-3', score: 75.5, rawScore: 75.5, normalizedScore: 75.5, confidenceInterval: [74.2, 76.8], dateEvaluated: '2025-02-20', evaluator: 'xAI' },
  { benchmarkId: 'humaneval', modelId: 'grok-3', score: 90.2, rawScore: 90.2, normalizedScore: 90.2, confidenceInterval: [86.1, 94.3], dateEvaluated: '2025-02-20', evaluator: 'xAI' },
  { benchmarkId: 'math', modelId: 'grok-3', score: 89.5, rawScore: 89.5, normalizedScore: 89.5, confidenceInterval: [87.8, 91.2], dateEvaluated: '2025-02-20', evaluator: 'xAI' },

  // Qwen3 235B
  { benchmarkId: 'mmlu', modelId: 'qwen-3-235b', score: 89.8, rawScore: 89.8, normalizedScore: 89.8, confidenceInterval: [89.2, 90.4], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },
  { benchmarkId: 'mmlu-pro', modelId: 'qwen-3-235b', score: 76.0, rawScore: 76.0, normalizedScore: 76.0, confidenceInterval: [74.7, 77.3], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },
  { benchmarkId: 'humaneval', modelId: 'qwen-3-235b', score: 93.5, rawScore: 93.5, normalizedScore: 93.5, confidenceInterval: [89.6, 97.4], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },
  { benchmarkId: 'math', modelId: 'qwen-3-235b', score: 93.8, rawScore: 93.8, normalizedScore: 93.8, confidenceInterval: [92.4, 95.2], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },

  // Qwen3 32B
  { benchmarkId: 'mmlu', modelId: 'qwen-3-32b', score: 84.5, rawScore: 84.5, normalizedScore: 84.5, confidenceInterval: [83.7, 85.3], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },
  { benchmarkId: 'humaneval', modelId: 'qwen-3-32b', score: 89.0, rawScore: 89.0, normalizedScore: 89.0, confidenceInterval: [84.5, 93.5], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },

  // Qwen3 8B
  { benchmarkId: 'mmlu', modelId: 'qwen-3-8b', score: 72.8, rawScore: 72.8, normalizedScore: 72.8, confidenceInterval: [71.8, 73.8], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },
  { benchmarkId: 'humaneval', modelId: 'qwen-3-8b', score: 76.5, rawScore: 76.5, normalizedScore: 76.5, confidenceInterval: [71.0, 82.0], dateEvaluated: '2025-05-01', evaluator: 'Alibaba' },

  // Gemma 3 27B
  { benchmarkId: 'mmlu', modelId: 'gemma-3-27b', score: 82.5, rawScore: 82.5, normalizedScore: 82.5, confidenceInterval: [81.6, 83.4], dateEvaluated: '2025-03-15', evaluator: 'Google' },
  { benchmarkId: 'humaneval', modelId: 'gemma-3-27b', score: 82.0, rawScore: 82.0, normalizedScore: 82.0, confidenceInterval: [77.1, 86.9], dateEvaluated: '2025-03-15', evaluator: 'Google' },
  { benchmarkId: 'gsm8k', modelId: 'gemma-3-27b', score: 88.6, rawScore: 88.6, normalizedScore: 88.6, confidenceInterval: [86.9, 90.3], dateEvaluated: '2025-03-15', evaluator: 'Google' },

  // DeepSeek-V3 (0324 updated)
  { benchmarkId: 'mmlu', modelId: 'deepseek-v3-0324', score: 89.8, rawScore: 89.8, normalizedScore: 89.8, confidenceInterval: [89.1, 90.5], dateEvaluated: '2025-03-28', evaluator: 'DeepSeek' },
  { benchmarkId: 'humaneval', modelId: 'deepseek-v3-0324', score: 91.0, rawScore: 91.0, normalizedScore: 91.0, confidenceInterval: [87.0, 95.0], dateEvaluated: '2025-03-28', evaluator: 'DeepSeek' },
  { benchmarkId: 'math', modelId: 'deepseek-v3-0324', score: 90.2, rawScore: 90.2, normalizedScore: 90.2, confidenceInterval: [88.5, 91.9], dateEvaluated: '2025-03-28', evaluator: 'DeepSeek' },

  // Gemini 2.5 Pro
  { benchmarkId: 'mmlu', modelId: 'gemini-2-5-pro', score: 91.2, rawScore: 91.2, normalizedScore: 91.2, confidenceInterval: [90.5, 91.9], dateEvaluated: '2025-03-28', evaluator: 'Google' },
  { benchmarkId: 'mmlu-pro', modelId: 'gemini-2-5-pro', score: 80.0, rawScore: 80.0, normalizedScore: 80.0, confidenceInterval: [78.8, 81.2], dateEvaluated: '2025-03-28', evaluator: 'Google' },
  { benchmarkId: 'humaneval', modelId: 'gemini-2-5-pro', score: 93.2, rawScore: 93.2, normalizedScore: 93.2, confidenceInterval: [89.3, 97.1], dateEvaluated: '2025-03-28', evaluator: 'Google' },
  { benchmarkId: 'gsm8k', modelId: 'gemini-2-5-pro', score: 96.0, rawScore: 96.0, normalizedScore: 96.0, confidenceInterval: [95.0, 97.0], dateEvaluated: '2025-03-28', evaluator: 'Google' },
  { benchmarkId: 'math', modelId: 'gemini-2-5-pro', score: 94.5, rawScore: 94.5, normalizedScore: 94.5, confidenceInterval: [93.2, 95.8], dateEvaluated: '2025-03-28', evaluator: 'Google' },

  // Gemini 2.5 Flash
  { benchmarkId: 'mmlu', modelId: 'gemini-2-5-flash', score: 86.5, rawScore: 86.5, normalizedScore: 86.5, confidenceInterval: [85.7, 87.3], dateEvaluated: '2025-04-18', evaluator: 'Google' },
  { benchmarkId: 'humaneval', modelId: 'gemini-2-5-flash', score: 89.5, rawScore: 89.5, normalizedScore: 89.5, confidenceInterval: [85.3, 93.7], dateEvaluated: '2025-04-18', evaluator: 'Google' },
  { benchmarkId: 'gsm8k', modelId: 'gemini-2-5-flash', score: 92.5, rawScore: 92.5, normalizedScore: 92.5, confidenceInterval: [91.2, 93.8], dateEvaluated: '2025-04-18', evaluator: 'Google' },

  // GPT-4.1
  { benchmarkId: 'mmlu', modelId: 'gpt-4-1', score: 89.0, rawScore: 89.0, normalizedScore: 89.0, confidenceInterval: [88.3, 89.7], dateEvaluated: '2025-04-15', evaluator: 'OpenAI' },
  { benchmarkId: 'humaneval', modelId: 'gpt-4-1', score: 94.5, rawScore: 94.5, normalizedScore: 94.5, confidenceInterval: [90.8, 98.2], dateEvaluated: '2025-04-15', evaluator: 'OpenAI' },
  { benchmarkId: 'swe-bench', modelId: 'gpt-4-1', score: 58.5, rawScore: 58.5, normalizedScore: 58.5, confidenceInterval: [54.0, 63.0], dateEvaluated: '2025-04-15', evaluator: 'OpenAI' },

  // Mistral Small 3
  { benchmarkId: 'mmlu', modelId: 'mistral-small-3', score: 78.2, rawScore: 78.2, normalizedScore: 78.2, confidenceInterval: [77.2, 79.2], dateEvaluated: '2025-02-01', evaluator: 'Mistral AI' },
  { benchmarkId: 'humaneval', modelId: 'mistral-small-3', score: 80.0, rawScore: 80.0, normalizedScore: 80.0, confidenceInterval: [75.0, 85.0], dateEvaluated: '2025-02-01', evaluator: 'Mistral AI' },
  { benchmarkId: 'gsm8k', modelId: 'mistral-small-3', score: 86.5, rawScore: 86.5, normalizedScore: 86.5, confidenceInterval: [84.5, 88.5], dateEvaluated: '2025-02-01', evaluator: 'Mistral AI' },

  // Phi-4 Multimodal
  { benchmarkId: 'mmmu', modelId: 'phi-4-multimodal', score: 55.0, rawScore: 55.0, normalizedScore: 55.0, confidenceInterval: [52.8, 57.2], dateEvaluated: '2025-03-01', evaluator: 'Microsoft' },
  { benchmarkId: 'mmbench', modelId: 'phi-4-multimodal', score: 72.5, rawScore: 72.5, normalizedScore: 72.5, confidenceInterval: [70.3, 74.7], dateEvaluated: '2025-03-01', evaluator: 'Microsoft' },
]