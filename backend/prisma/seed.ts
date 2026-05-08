import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const organizations = [
  { name: 'Anthropic', color: '#d4521a', link: 'https://www.anthropic.com' },
  { name: 'OpenAI', color: '#10a37f', link: 'https://openai.com' },
  { name: 'Google DeepMind', color: '#4285F4', link: 'https://deepmind.google' },
  { name: 'Meta AI', color: '#0866FF', link: 'https://ai.meta.com' },
  { name: 'Mistral AI', color: '#FF7000', link: 'https://mistral.ai' },
  { name: 'DeepSeek', color: '#4D6BFE', link: 'https://deepseek.com' },
  { name: 'xAI', color: '#1a1a1a', link: 'https://x.ai' },
  { name: 'Microsoft', color: '#0078D4', link: 'https://microsoft.com' },
  { name: 'Cohere', color: '#39594D', link: 'https://cohere.com' },
  { name: 'Sakana AI', color: '#FF6B6B', link: 'https://sakana.ai' },
  { name: 'Nvidia', color: '#76B900', link: 'https://nvidia.com' },
]

const benchmarks = [
  { id: 'mmlu', name: 'Massive Multitask Language Understanding', shortName: 'MMLU', category: 'Reasoning & Knowledge', description: 'MMLU evaluates models across 57 subjects spanning STEM, humanities, social sciences, and more. Questions are drawn from undergraduate-level exams and professional certification tests.', whyItMatters: 'MMLU is a gold standard for measuring a model\'s breadth of factual knowledge across academic fields.', limitations: 'Heavily biased toward Western, English-language academic curricula.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'mmlu-pro', name: 'MMLU-Pro', shortName: 'MMLU-Pro', category: 'Reasoning & Knowledge', description: 'MMLU-Pro is a harder variant of MMLU with multi-step reasoning problems and expanded answer choices.', whyItMatters: 'Better differentiation among top-tier models.', limitations: 'Smaller question count leads to higher variance.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'gpqa', name: 'GPQA Diamond', shortName: 'GPQA', category: 'Reasoning & Knowledge', description: 'Expert-level science questions requiring PhD-level reasoning.', whyItMatters: 'Tests genuine scientific reasoning at expert level.', limitations: 'Small dataset with high variance.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'arc-challenge', name: 'ARC Challenge', shortName: 'ARC', category: 'Reasoning & Knowledge', description: 'Grade-school level science questions requiring reasoning.', whyItMatters: 'Isolates genuine reasoning from shallow statistical cues.', limitations: 'Grade-school framing limits advanced testing.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'hellaswag', name: 'HellaSwag', shortName: 'HellaSwag', category: 'Reasoning & Knowledge', description: 'Commonsense NLI completion challenges.', whyItMatters: 'Tests commonsense reasoning.', limitations: 'Can be gamed with shallow patterns.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'winogrande', name: 'Winogrande', shortName: 'Winogrande', category: 'Reasoning & Knowledge', description: 'Pronoun disambiguation at scale.', whyItMatters: 'Tests physical and social reasoning.', limitations: 'Simple format limits depth.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'big-bench-hard', name: 'BIG-Bench Hard', shortName: 'BBH', category: 'Reasoning & Knowledge', description: 'Diverse challenging reasoning tasks.', whyItMatters: 'Tests multi-step reasoning beyond memorization.', limitations: 'Task heterogeneity makes generalization hard.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'drop', name: 'DROP', shortName: 'DROP', category: 'Reasoning & Knowledge', description: 'Discrete reasoning over paragraphs.', whyItMatters: 'Tests numeric reasoning in context.', limitations: 'Requires specific paragraph structures.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'math-500', name: 'MATH-500', shortName: 'MATH', category: 'Mathematics', description: 'Competition math problems (500 examples).', whyItMatters: 'Gold standard for mathematical reasoning.', limitations: 'Limited to competition-level math.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'gsm8k', name: 'GSM8K', shortName: 'GSM8K', category: 'Mathematics', description: 'Grade school math word problems.', whyItMatters: 'Tests elementary math reasoning.', limitations: 'Relatively simple for frontier models.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'aime-2024', name: 'AIME 2024', shortName: 'AIME', category: 'Mathematics', description: 'American Invitational Math Examination.', whyItMatters: 'Standard for math competition.', limitations: 'Annual updates limit longitudinal comparison.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'amc-2023', name: 'AMC 2023', shortName: 'AMC', category: 'Mathematics', description: 'American Math Competition problems.', whyItMatters: 'Validates competition math capability.', limitations: 'Requires specific training.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'olympiadbench', name: 'OlympiadBench', shortName: 'Olympiad', category: 'Mathematics', description: 'International olympiad problems.', whyItMatters: 'Tests advanced mathematical reasoning.', limitations: 'Very hard for most models.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'mathvista', name: 'MathVista', shortName: 'MathVista', category: 'Mathematics', description: 'Multimodal math reasoning.', whyItMatters: 'Tests math + vision together.', limitations: 'Requires multimodal capabilities.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'humaneval', name: 'HumanEval', shortName: 'HumanEval', category: 'Coding', description: 'Python function completion (164 problems).', whyItMatters: 'Tests code generation capability.', limitations: 'Synthetic dataset.', higherIsBetter: true, scoreType: 'pass@1', scaleMin: 0, scaleMax: 100 },
  { id: 'humaneval-plus', name: 'HumanEval+', shortName: 'HE+', category: 'Coding', description: 'Stricter test suite for HumanEval.', whyItMatters: 'More robust code evaluation.', limitations: 'Smaller than original.', higherIsBetter: true, scoreType: 'pass@1', scaleMin: 0, scaleMax: 100 },
  { id: 'mbpp', name: 'MBPP', shortName: 'MBPP', category: 'Coding', description: 'Mostly Basic Python Programs.', whyItMatters: 'Tests fundamental coding skills.', limitations: 'Relatively simple tasks.', higherIsBetter: true, scoreType: 'pass@1', scaleMin: 0, scaleMax: 100 },
  { id: 'swe-bench-verified', name: 'SWE-bench Verified', shortName: 'SWE', category: 'Coding', description: 'Real GitHub issues resolved.', whyItMatters: 'Tests real-world code capability.', limitations: 'Requires understanding large repos.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'livecodebench', name: 'LiveCodeBench', shortName: 'LCB', category: 'Coding', description: 'Contamination-free monthly updated.', whyItMatters: 'Fresh, un-gamed problems.', limitations: 'Monthly updates.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'cruxeval', name: 'CRUXEval', shortName: 'CRUX', category: 'Coding', description: 'Code reasoning and understanding.', whyItMatters: 'Tests code understanding vs generation.', limitations: 'New benchmark.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'mt-bench', name: 'MT-Bench', shortName: 'MT-Bench', category: 'Instruction Following', description: 'Multi-turn conversation (GPT-4 judged).', whyItMatters: 'Tests instruction following quality.', limitations: 'Subjective evaluation.', higherIsBetter: true, scoreType: 'score', scaleMin: 0, scaleMax: 10 },
  { id: 'alpacaeval-2', name: 'AlpacaEval 2.0', shortName: 'Alpaca', category: 'Instruction Following', description: 'LC win rate vs GPT-4.', whyItMatters: 'Large-scale automatic evaluation.', limitations: 'Only measures vs GPT-4.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'ifeval', name: 'IFEval', shortName: 'IFEval', category: 'Instruction Following', description: 'Verifiable instruction following.', whyItMatters: 'Objective instruction following.', limitations: 'Limited instruction types.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'wildbench', name: 'WildBench', shortName: 'WildBench', category: 'Instruction Following', description: 'Diverse user prompt evaluation.', whyItMatters: 'Real-world instruction variety.', limitations: 'Complex evaluation.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'ruler', name: 'RULER', shortName: 'RULER', category: 'Long Context', description: 'Synthetic long-context tasks.', whyItMatters: 'Tests long-context retrieval.', limitations: 'Synthetic tasks.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'longbench-v2', name: 'LongBench v2', shortName: 'LongBench', category: 'Long Context', description: 'Real-world long tasks.', whyItMatters: 'Tests practical long-context.', limitations: 'Task diversity limited.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'scrolls', name: 'SCROLLS', shortName: 'SCROLLS', category: 'Long Context', description: 'Summarization + QA over long docs.', whyItMatters: 'Tests long document tasks.', limitations: 'Specific domains only.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'needle', name: 'Needle-in-Haystack', shortName: 'Needle', category: 'Long Context', description: 'Retrieval at N% depth.', whyItMatters: 'Tests perfect recall.', limitations: 'Can be gamed.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'mmbench', name: 'MMBench', shortName: 'MMBench', category: 'Multimodal', description: 'Vision-language multi-choice.', whyItMatters: 'Comprehensive multimodal eval.', limitations: 'Can have data leakage.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'mmmu', name: 'MMMU', shortName: 'MMMU', category: 'Multimodal', description: 'University-level multimodal questions.', whyItMatters: 'Tests expert-level multimodal.', limitations: 'Requires strong multimodal.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'chartqa', name: 'ChartQA', shortName: 'ChartQA', category: 'Multimodal', description: 'Chart understanding.', whyItMatters: 'Tests chart reasoning.', limitations: 'Simple charts only.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'docvqa', name: 'DocVQA', shortName: 'DocVQA', category: 'Multimodal', description: 'Document visual QA.', whyItMatters: 'Tests document understanding.', limitations: 'English only mostly.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'videomme', name: 'VideoMME', shortName: 'VideoMME', category: 'Multimodal', description: 'Video understanding.', whyItMatters: 'Tests video reasoning.', limitations: 'Requires video models.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'truthfulqa', name: 'TruthfulQA', shortName: 'TruthfulQA', category: 'Safety', description: 'Truthfulness evaluation.', whyItMatters: 'Tests honesty.', limitations: 'Can be gamed.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'bbq', name: 'BBQ', shortName: 'BBQ', category: 'Safety', description: 'Bias benchmark for QA.', whyItMatters: 'Tests fairness.', limitations: 'Limited domains.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
  { id: 'harmbench', name: 'HarmBench', shortName: 'HarmBench', category: 'Safety', description: 'Safety evaluation.', whyItMatters: 'Comprehensive safety test.', limitations: 'Red-teaming possible.', higherIsBetter: true, scoreType: 'percentage', scaleMin: 0, scaleMax: 100 },
]

const models = [
  { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', organization: 'Anthropic', version: '4.7', description: 'Anthropic\'s flagship ultra-agentic model with 2M context window. Features hybrid instant/extended reasoning and Constitutional AI v3.', parameters: 'Undisclosed', contextWindow: 200000, modalitiesInput: ['Text', 'Vision', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Claude', strengths: ['Deep reasoning', 'Long-document analysis', 'Agentic workflows', 'Code review'], apiAvailable: true, apiEndpoint: 'https://api.anthropic.com' },
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', organization: 'Anthropic', version: '4.5', description: 'Balanced speed and intelligence for everyday tasks. Strong instruction following and summarization.', parameters: 'Undisclosed', contextWindow: 200000, modalitiesInput: ['Text', 'Vision', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Claude', strengths: ['Balanced speed', 'Instruction following', 'Summarization'], apiAvailable: true, apiEndpoint: 'https://api.anthropic.com' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', organization: 'Anthropic', version: '4.5', description: 'Ultra-fast responses for lightweight tasks and high-volume APIs.', parameters: 'Undisclosed', contextWindow: 200000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Claude', strengths: ['Ultra-fast', 'Lightweight', 'High-volume APIs'], apiAvailable: true, apiEndpoint: 'https://api.anthropic.com' },
  { id: 'gpt-5-5', name: 'GPT-5.5', organization: 'OpenAI', version: '5.5', description: 'OpenAI\'s flagship next-generation unified model. Merges o-series reasoning with creative GPT capabilities.', parameters: 'Undisclosed', contextWindow: 256000, modalitiesInput: ['Text', 'Vision', 'Audio', 'Code', 'Image generation'], modalitiesOutput: ['Text', 'Audio', 'Code', 'Image'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'GPT', strengths: ['Multimodal reasoning', 'DALL-E integration', 'Voice mode', 'Function calling'], apiAvailable: true, apiEndpoint: 'https://api.openai.com/v1' },
  { id: 'gpt-4-1', name: 'GPT-4.1', organization: 'OpenAI', version: '4.1', description: 'Massive context model with 1M token window. Excellent document processing and needle-in-haystack retrieval.', parameters: 'Undisclosed', contextWindow: 1000000, modalitiesInput: ['Text', 'Vision', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'GPT', strengths: ['Massive context', 'Document processing', 'Needle retrieval'], apiAvailable: true, apiEndpoint: 'https://api.openai.com/v1' },
  { id: 'o3', name: 'o3', organization: 'OpenAI', version: '3', description: 'Frontier reasoning model for mathematical olympiad problems and scientific research.', parameters: 'Undisclosed', contextWindow: 200000, modalitiesInput: ['Text', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'o-series', strengths: ['Mathematical reasoning', 'Scientific research', 'Chain-of-thought'], apiAvailable: true, apiEndpoint: 'https://api.openai.com/v1' },
  { id: 'o4-mini', name: 'o4-mini', organization: 'OpenAI', version: '4-mini', description: 'Fast reasoning model for cost-efficient STEM tasks.', parameters: 'Undisclosed', contextWindow: 128000, modalitiesInput: ['Text', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'No', license: 'Closed', status: 'Available', isOpenSource: false, family: 'o-series', strengths: ['Fast reasoning', 'Cost-efficient', 'STEM tasks'], apiAvailable: true, apiEndpoint: 'https://api.openai.com/v1' },
  { id: 'gemini-3-1-pro', name: 'Gemini 3.1 Pro', organization: 'Google DeepMind', version: '3.1', description: 'Ultra-long context with 2M tokens, frontier multimodal reasoning at scale. Native Google ecosystem integration.', parameters: 'Undisclosed', contextWindow: 2000000, modalitiesInput: ['Text', 'Vision', 'Audio', 'Video', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Gemini', strengths: ['Ultra-long context', 'Multimodal fusion', 'Google ecosystem'], apiAvailable: true, apiEndpoint: 'https://generativelanguage.googleapis.com/v1' },
  { id: 'gemini-3-1-flash', name: 'Gemini 3.1 Flash', organization: 'Google DeepMind', version: '3.1', description: 'Speed-optimized with free tier available. Strong multimodal at low cost.', parameters: 'Undisclosed', contextWindow: 1000000, modalitiesInput: ['Text', 'Vision', 'Audio', 'Video', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Gemini', strengths: ['Speed-optimized', 'Free tier', 'Multimodal low cost'], apiAvailable: true, apiEndpoint: 'https://generativelanguage.googleapis.com/v1' },
  { id: 'gemma-3-27b', name: 'Gemma 3 27B', organization: 'Google DeepMind', version: '3', description: 'Best open-weights model under 30B parameters. Multilingual support with Apache 2.0 license.', parameters: '27B', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Open', status: 'Available', isOpenSource: true, family: 'Gemma', vramBF16: '16GB', vramQ4: '8GB', selfHostable: true, strengths: ['Best open under 30B', 'Multilingual'], apiAvailable: true },
  { id: 'llama-3-3-70b', name: 'Llama 3.3 70B Instruct', organization: 'Meta AI', version: '3.3', description: 'Strongest open-source general model. Excellent code generation, reasoning, and multi-turn conversation.', parameters: '70B', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Llama', vramBF16: '40GB', vramQ4: '20GB', selfHostable: true, strengths: ['Best open general', 'Code generation', 'Reasoning'], github: 'https://github.com/meta-llama/llama' },
  { id: 'llama-4-scout', name: 'Llama 4 Scout (17B MoE)', organization: 'Meta AI', version: '4', description: 'Record-breaking 10M context window for open-source. Mixture-of-experts efficiency.', parameters: '17B active / 109B total', contextWindow: 10000000, modalitiesInput: ['Text', 'Vision'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Llama', vramBF16: '12GB', selfHostable: true, strengths: ['10M context', 'MoE efficiency'], github: 'https://github.com/meta-llama/llama' },
  { id: 'llama-4-maverick', name: 'Llama 4 Maverick (17B MoE)', organization: 'Meta AI', version: '4', description: 'Frontier-competitive multimodal model. Beats GPT-4o on many benchmarks.', parameters: '17B active / 400B total', contextWindow: 1000000, modalitiesInput: ['Text', 'Vision'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Llama', selfHostable: true, strengths: ['Multimodal frontier', 'Competitive with GPT-4o'], github: 'https://github.com/meta-llama/llama' },
  { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', organization: 'DeepSeek', version: '4', description: 'Best open-source coder with 671B total / 37B active MoE. Frontier performance at fraction of cost.', parameters: '671B total / 37B active', contextWindow: 128000, modalitiesInput: ['Text', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Open', status: 'Available', isOpenSource: true, family: 'DeepSeek', vramBF16: '80GB+', selfHostable: true, strengths: ['Best open coder', 'Math reasoning', 'CoT', 'Cost-efficient'], apiAvailable: true },
  { id: 'deepseek-r2', name: 'DeepSeek R2', organization: 'DeepSeek', version: 'R2', description: 'Reasoning specialist matching o3 on MATH and AIME benchmarks.', parameters: 'Undisclosed', contextWindow: 256000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'DeepSeek', strengths: ['Reasoning specialist', 'MATH/AIME matching o3'], apiAvailable: true },
  { id: 'mistral-large-3', name: 'Mistral Large 3', organization: 'Mistral AI', version: '3', description: 'Strong multilingual model. Supports French, Spanish, Italian, German, Arabic, Chinese.', parameters: '123B', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Gated', status: 'Available', isOpenSource: false, family: 'Mistral', vramBF16: '80GB+', strengths: ['Multilingual', 'Strong instruction follow'], selfHostable: true },
  { id: 'mistral-small-3-1', name: 'Mistral Small 3.1', organization: 'Mistral AI', version: '3.1', description: 'Best-in-class sub-30B multilingual model.', parameters: '24B', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Mistral', vramBF16: '14GB', selfHostable: true, strengths: ['Best sub-30B multilingual'], apiAvailable: true },
  { id: 'codestral-2', name: 'Codestral 2.0', organization: 'Mistral AI', version: '2', description: 'Fill-in-the-middle code completion. 80+ programming languages, IDE integration.', parameters: 'Undisclosed', contextWindow: 256000, modalitiesInput: ['Text', 'Code'], modalitiesOutput: ['Code'], toolUse: 'Yes', license: 'Gated', status: 'Available', isOpenSource: false, family: 'Codestral', strengths: ['Code completion', '80+ languages', 'IDE integration'], apiAvailable: true },
  { id: 'phi-4', name: 'Phi-4', organization: 'Microsoft', version: '4', description: 'Best sub-15B reasoning model. Trained on textbook-quality data.', parameters: '14B', contextWindow: 16000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Phi', vramBF16: '8GB', selfHostable: true, strengths: ['Best sub-15B reasoning', 'Textbook quality'], apiAvailable: true, github: 'https://github.com/microsoft/phi-4' },
  { id: 'phi-4-multimodal', name: 'Phi-4-multimodal', organization: 'Microsoft', version: '4', description: 'Edge deployment with on-device multimodal capabilities.', parameters: '5.6B', contextWindow: 128000, modalitiesInput: ['Text', 'Vision', 'Audio'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Phi', strengths: ['Edge deployment', 'On-device multimodal'] },
  { id: 'command-r-plus', name: 'Command R+ (2025)', organization: 'Cohere', version: '2025', description: 'Enterprise RAG with grounded generation and citation-accurate retrieval augmentation.', parameters: '104B', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Gated', status: 'Available', isOpenSource: false, family: 'Command', strengths: ['Enterprise RAG', 'Grounded generation', 'Citations'], apiAvailable: true },
  { id: 'grok-3', name: 'Grok 3', organization: 'xAI', version: '3', description: 'Real-time X/Twitter data access with humor and DeepSearch web browsing.', parameters: 'Undisclosed', contextWindow: 131000, modalitiesInput: ['Text', 'Vision', 'Code'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Grok', strengths: ['Real-time data', 'Humor', 'DeepSearch', 'STEM reasoning'], apiAvailable: true },
  { id: 'grok-3-mini', name: 'Grok 3 Mini', organization: 'xAI', version: '3', description: 'Fast, free inference on X platform.', parameters: 'Undisclosed', contextWindow: 131000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Closed', status: 'Available', isOpenSource: false, family: 'Grok', strengths: ['Fast', 'Free on X'], apiAvailable: true },
  { id: 'gpt-5', name: 'GPT-5 (full)', organization: 'OpenAI', version: '5', description: 'Upcoming full multimodal with agent-native design. Expected Q3 2025.', parameters: 'Undisclosed', contextWindow: 1000000, modalitiesInput: ['Text', 'Vision', 'Audio', 'Code'], modalitiesOutput: ['Text', 'Audio', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Upcoming', isOpenSource: false, family: 'GPT', strengths: ['Full multimodal', 'Agent-native'], apiAvailable: false },
  { id: 'gemini-3-ultra', name: 'Gemini 3 Ultra', organization: 'Google DeepMind', version: '3', description: 'Expected Q4 2025. Rumored 10M+ context with video generation.', parameters: 'Undisclosed', contextWindow: 10000000, modalitiesInput: ['Text', 'Vision', 'Audio', 'Video'], modalitiesOutput: ['Text', 'Video'], toolUse: 'Yes', license: 'Closed', status: 'Upcoming', isOpenSource: false, family: 'Gemini', strengths: ['10M+ context', 'Video generation'] },
  { id: 'llama-5', name: 'Llama 5', organization: 'Meta AI', version: '5', description: 'Expected Q1 2026. Rumored 405B+ dense flagship model.', parameters: '405B+', contextWindow: 200000, modalitiesInput: ['Text', 'Vision'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Open', status: 'Upcoming', isOpenSource: true, family: 'Llama', strengths: ['Dense flagship', 'Open weights'] },
  { id: 'claude-opus-5', name: 'Claude Opus 5', organization: 'Anthropic', version: '5', description: 'Expected Q2 2026. Successor to Opus 4.7 with enhanced agentic computer use.', parameters: 'Undisclosed', contextWindow: 2000000, modalitiesInput: ['Text', 'Vision', 'Code'], modalitiesOutput: ['Text', 'Code'], toolUse: 'Yes', license: 'Closed', status: 'Upcoming', isOpenSource: false, family: 'Claude', strengths: ['Enhanced agentic', 'Computer use'] },
  { id: 'deepseek-v5', name: 'DeepSeek V5', organization: 'DeepSeek', version: '5', description: 'Expected 2026. Next MoE generation. Rumored 1T+ total params.', parameters: '1T+ total', contextWindow: 256000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Open', status: 'Upcoming', isOpenSource: true, family: 'DeepSeek', strengths: ['Next-gen MoE'] },
  { id: 'mistral-le-chat-pro', name: 'Mistral Le Chat Pro', organization: 'Mistral AI', version: '1', description: 'Expected Q3 2025. Full product suite with native agents and enterprise deployment.', parameters: 'Undisclosed', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'Yes', license: 'Gated', status: 'Upcoming', isOpenSource: false, family: 'Mistral', strengths: ['Native agents', 'Enterprise'], apiAvailable: true },
  { id: 'mythos', name: 'Mythos', organization: 'Sakana AI', version: '1', description: 'Self-evolving architecture. 800B reasoning specialist with auto-retrain.', parameters: '800B', contextWindow: 128000, modalitiesInput: ['Text'], modalitiesOutput: ['Text'], toolUse: 'No', license: 'Open', status: 'Available', isOpenSource: true, family: 'Mythos', strengths: ['Self-evolving', 'Auto-retrain', 'Reasoning specialist'] },
]

const benchmarkScores = [
  { modelId: 'claude-opus-4-7', benchmarkId: 'mmlu', score: 88.2, source: 'Official' },
  { modelId: 'claude-opus-4-7', benchmarkId: 'mmlu-pro', score: 84.1, source: 'Official' },
  { modelId: 'claude-opus-4-7', benchmarkId: 'gpqa', score: 72.5, source: 'Official' },
  { modelId: 'claude-opus-4-7', benchmarkId: 'math-500', score: 87.3, source: 'Official' },
  { modelId: 'claude-opus-4-7', benchmarkId: 'humaneval', score: 92.1, source: 'Official' },
  { modelId: 'claude-opus-4-7', benchmarkId: 'mt-bench', score: 9.2, source: 'Official' },
  { modelId: 'claude-sonnet-4-5', benchmarkId: 'mmlu', score: 85.7, source: 'Official' },
  { modelId: 'claude-sonnet-4-5', benchmarkId: 'humaneval', score: 88.4, source: 'Official' },
  { modelId: 'claude-haiku-4-5', benchmarkId: 'mmlu', score: 78.2, source: 'Official' },
  { modelId: 'claude-haiku-4-5', benchmarkId: 'humaneval', score: 75.6, source: 'Official' },
  { modelId: 'gpt-5-5', benchmarkId: 'mmlu', score: 89.1, source: 'Official' },
  { modelId: 'gpt-5-5', benchmarkId: 'mmlu-pro', score: 86.3, source: 'Official' },
  { modelId: 'gpt-5-5', benchmarkId: 'gpqa', score: 71.8, source: 'Official' },
  { modelId: 'gpt-5-5', benchmarkId: 'math-500', score: 88.9, source: 'Official' },
  { modelId: 'gpt-5-5', benchmarkId: 'humaneval', score: 93.7, source: 'Official' },
  { modelId: 'gpt-5-5', benchmarkId: 'mt-bench', score: 9.3, source: 'Official' },
  { modelId: 'gpt-4-1', benchmarkId: 'mmlu', score: 85.4, source: 'Official' },
  { modelId: 'gpt-4-1', benchmarkId: 'humaneval', score: 90.2, source: 'Official' },
  { modelId: 'o3', benchmarkId: 'mmlu', score: 87.9, source: 'Official' },
  { modelId: 'o3', benchmarkId: 'math-500', score: 96.4, source: 'Official' },
  { modelId: 'o3', benchmarkId: 'aime-2024', score: 91.3, source: 'Official' },
  { modelId: 'o4-mini', benchmarkId: 'mmlu', score: 82.1, source: 'Official' },
  { modelId: 'o4-mini', benchmarkId: 'math-500', score: 78.2, source: 'Official' },
  { modelId: 'gemini-3-1-pro', benchmarkId: 'mmlu', score: 86.3, source: 'Official' },
  { modelId: 'gemini-3-1-pro', benchmarkId: 'mmmu', score: 82.1, source: 'Official' },
  { modelId: 'gemini-3-1-pro', benchmarkId: 'mmbench', score: 81.5, source: 'Official' },
  { modelId: 'gemini-3-1-flash', benchmarkId: 'mmlu', score: 83.7, source: 'Official' },
  { modelId: 'gemma-3-27b', benchmarkId: 'mmlu', score: 76.2, source: 'Official' },
  { modelId: 'gemma-3-27b', benchmarkId: 'humaneval', score: 72.8, source: 'Official' },
  { modelId: 'llama-3-3-70b', benchmarkId: 'mmlu', score: 82.1, source: 'Official' },
  { modelId: 'llama-3-3-70b', benchmarkId: 'humaneval', score: 85.4, source: 'Official' },
  { modelId: 'llama-3-3-70b', benchmarkId: 'mt-bench', score: 8.7, source: 'Official' },
  { modelId: 'llama-4-scout', benchmarkId: 'mmlu', score: 79.5, source: 'Official' },
  { modelId: 'llama-4-scout', benchmarkId: 'ruler', score: 94.2, source: 'Official' },
  { modelId: 'llama-4-maverick', benchmarkId: 'mmlu', score: 81.3, source: 'Official' },
  { modelId: 'llama-4-maverick', benchmarkId: 'mmmu', score: 79.8, source: 'Official' },
  { modelId: 'deepseek-v4-pro', benchmarkId: 'mmlu', score: 83.9, source: 'Official' },
  { modelId: 'deepseek-v4-pro', benchmarkId: 'humaneval', score: 90.1, source: 'Official' },
  { modelId: 'deepseek-v4-pro', benchmarkId: 'math-500', score: 86.7, source: 'Official' },
  { modelId: 'deepseek-v4-pro', benchmarkId: 'aime-2024', score: 88.2, source: 'Official' },
  { modelId: 'deepseek-r2', benchmarkId: 'mmlu', score: 85.2, source: 'Official' },
  { modelId: 'deepseek-r2', benchmarkId: 'math-500', score: 91.8, source: 'Official' },
  { modelId: 'mistral-large-3', benchmarkId: 'mmlu', score: 84.1, source: 'Official' },
  { modelId: 'mistral-large-3', benchmarkId: 'humaneval', score: 87.2, source: 'Official' },
  { modelId: 'mistral-small-3-1', benchmarkId: 'mmlu', score: 77.3, source: 'Official' },
  { modelId: 'codestral-2', benchmarkId: 'humaneval', score: 89.5, source: 'Official' },
  { modelId: 'phi-4', benchmarkId: 'mmlu', score: 73.8, source: 'Official' },
  { modelId: 'phi-4', benchmarkId: 'math-500', score: 70.2, source: 'Official' },
  { modelId: 'phi-4-multimodal', benchmarkId: 'mmlu', score: 68.5, source: 'Official' },
  { modelId: 'command-r-plus', benchmarkId: 'mmlu', score: 78.4, source: 'Official' },
  { modelId: 'grok-3', benchmarkId: 'mmlu', score: 84.7, source: 'Official' },
  { modelId: 'grok-3', benchmarkId: 'math-500', score: 79.3, source: 'Official' },
  { modelId: 'grok-3-mini', benchmarkId: 'mmlu', score: 79.2, source: 'Official' },
]

async function main() {
  console.log('Starting seed...')
  
  // Clear existing data
  await prisma.benchmarkScore.deleteMany()
  await prisma.modelVersion.deleteMany()
  await prisma.model.deleteMany()
  await prisma.benchmark.deleteMany()
  await prisma.newsItem.deleteMany()
  await prisma.syncLog.deleteMany()
  
  console.log('Creating benchmarks...')
  for (const b of benchmarks) {
    await prisma.benchmark.create({ data: b })
  }
  
  console.log('Creating models...')
  for (const m of models) {
    await prisma.model.create({ data: m })
  }
  
  console.log('Creating benchmark scores...')
  for (const s of benchmarkScores) {
    await prisma.benchmarkScore.create({ data: s })
  }
  
  // Create some sample news items
  console.log('Creating news items...')
  const newsItems = [
    { title: 'OpenAI Announces GPT-5 with Full Multimodal Capabilities', summary: 'OpenAI has announced GPT-5, featuring native multimodal understanding with text, vision, audio, and video. Expected release in Q3 2025.', source: 'OpenAI Blog', tags: ['New Model', 'Product Launch'], url: 'https://openai.com/blog' },
    { title: 'Claude Opus 4.7 Sets New Benchmark Records', summary: 'Anthropic\'s latest flagship model achieves state-of-the-art results on MMLU, GPQA, and mathematical reasoning benchmarks.', source: 'Anthropic', tags: ['New Model', 'Benchmark'], url: 'https://anthropic.com' },
    { title: 'DeepSeek Releases Open-Source V4 Pro Model', summary: 'DeepSeek releases V4 Pro under MIT license, achieving GPT-4 level performance at a fraction of the cost.', source: 'DeepSeek', tags: ['New Model', 'Open Source'], url: 'https://deepseek.com' },
    { title: 'Meta AI Unveils Llama 4 with 10M Context Window', summary: 'Meta introduces Llama 4 Scout with unprecedented 10M token context window for open-source models.', source: 'Meta AI', tags: ['New Model', 'Open Source'], url: 'https://ai.meta.com' },
    { title: 'Google Gemini 3.1 Pro Now Available with 2M Context', summary: 'Google DeepMind releases Gemini 3.1 Pro with 2M token context and native multimodal reasoning.', source: 'Google', tags: ['New Model', 'Product Launch'], url: 'https://deepmind.google' },
  ]
  for (const n of newsItems) {
    await prisma.newsItem.create({ data: { ...n, publishedAt: new Date() } })
  }
  
  console.log('Seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })