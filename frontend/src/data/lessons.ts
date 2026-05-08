export interface Lesson {
  id: string
  title: string
  track: 'foundational' | 'practitioner' | 'builder'
  order: number
  content: string
  keyPoints: string[]
  quizQuestions: { question: string; options: string[]; correctIndex: number }[]
}

export const lessons: Lesson[] = [
  {
    id: 'llm-basics',
    title: 'What is an LLM?',
    track: 'foundational',
    order: 1,
    content: `A Large Language Model (LLM) is a neural network trained on vast amounts of text to predict the next token in a sequence. At its core, an LLM is a probability distribution over sequences of tokens. Given a prompt like "The capital of France is", the model assigns a probability to every possible next word, then samples from this distribution.

LLMs are built on the transformer architecture, introduced by Vaswani et al. in 2017. Unlike previous recurrent models, transformers process entire sequences in parallel using self-attention, allowing them to capture long-range dependencies efficiently. Modern LLMs like GPT-4, Claude, and Llama contain hundreds of billions of parameters, each learned from training data to encode patterns in language, logic, and knowledge.

Despite their name, LLMs are not "understanding" text in a human sense. They are next-token prediction engines. However, at sufficient scale, this simple objective produces emergent capabilities like reasoning, translation, coding, and creative writing.`,
    keyPoints: [
      'LLMs predict the next token in a sequence',
      'Built on the transformer architecture with self-attention',
      'Scale (parameters + data) enables emergent capabilities',
      'They do not "understand" in a human sense; they predict',
    ],
    quizQuestions: [
      {
        question: 'What objective do LLMs optimize during training?',
        options: [
          'Classifying sentiment',
          'Next-token prediction',
          'Image recognition',
          'Speech-to-text',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which architecture underpins modern LLMs?',
        options: ['RNNs', 'CNNs', 'Transformers', 'Decision Trees'],
        correctIndex: 2,
      },
      {
        question: 'What capability emerges at sufficient scale?',
        options: [
          'Only translation',
          'Reasoning, coding, and creative writing',
          'Video generation',
          'Quantum computing',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'tokenization',
    title: 'How Tokenization Works',
    track: 'foundational',
    order: 2,
    content: `Tokenization is the process of breaking text into pieces (tokens) that models can process. A token can be a word, subword, or even a single character. GPT models use Byte Pair Encoding (BPE), which starts with characters and iteratively merges the most frequent adjacent pairs into new tokens.

Subword tokenization handles out-of-vocabulary words by splitting them into known pieces. For example, "unbelievable" might become ["un", "believ", "able"]. This is more efficient than character-level processing and handles rare words gracefully.

Vocabulary size matters. Larger vocabularies (e.g., 100K tokens) mean shorter sequences but more embedding parameters. Smaller vocabularies require longer sequences but reduce memory. Modern models typically use vocabularies of 32K to 200K tokens.`,
    keyPoints: [
      'BPE merges frequent character pairs iteratively',
      'Subword splitting handles rare words',
      'Vocabulary size is a memory/sequence-length tradeoff',
      'Token count affects API pricing and context usage',
    ],
    quizQuestions: [
      {
        question: 'What algorithm do GPT models use for tokenization?',
        options: ['Word2Vec', 'BPE', 'TF-IDF', 'LDA'],
        correctIndex: 1,
      },
      {
        question: 'How does subword tokenization handle rare words?',
        options: [
          'Replaces them with <UNK>',
          'Splits them into known subwords',
          'Removes them entirely',
          'Translates them to English',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'context-windows',
    title: 'Understanding Context Windows',
    track: 'foundational',
    order: 3,
    content: `The context window is the maximum number of tokens a model can consider when generating its next output. Early models had 4K-token windows; modern models support up to 2M tokens. A larger window means the model can process entire documents, long conversations, or codebases at once.

Context windows are limited by the quadratic cost of self-attention (O(n²) in sequence length). However, techniques like sparse attention, sliding windows, and ring attention reduce this cost. Some models use "pre-filling" — encoding the prompt in chunks — to extend effective context without massive memory overhead.

Not all parts of a long context are attended to equally. Retrieval-augmented generation (RAG) often provides better performance for very long contexts by only feeding relevant chunks rather than the full document.`,
    keyPoints: [
      'Context window limits tokens the model can see at once',
      'Larger windows enable whole-document processing',
      'Attention cost grows quadratically with length',
      'RAG often outperforms full long-context for retrieval tasks',
    ],
    quizQuestions: [
      {
        question: 'What limits context window size?',
        options: [
          'Disk space',
          'Quadratic attention cost',
          'API pricing',
          'Network bandwidth',
        ],
        correctIndex: 1,
      },
      {
        question: 'Why is RAG sometimes preferred over very long context?',
        options: [
          'It is faster and more focused',
          'It requires more memory',
          'It only works offline',
          'It supports fewer languages',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'base-vs-instruct',
    title: 'Base vs Instruction-Tuned Models',
    track: 'foundational',
    order: 4,
    content: `A "base" model is trained only on raw text using next-token prediction. It has broad language knowledge but does not follow instructions well — it will simply continue your text. An "instruction-tuned" (or "chat") model is a base model fine-tuned on dialog-style data with human preferences.

Instruction tuning teaches the model to understand formats like Q&A, system-user-assistant roles, and task descriptions. Reinforcement Learning from Human Feedback (RLHF) further refines this by training a reward model to predict human preferences, then optimizing the LLM against this reward.

Practical takeaway: always use instruct/chat variants for applications. Base models are primarily for further fine-tuning or research analysis of pre-training behavior.`,
    keyPoints: [
      'Base models predict next tokens on raw text',
      'Instruction-tuned models follow prompts and roles',
      'RLHF uses a reward model trained on human preferences',
      'Use instruct/chat variants for production applications',
    ],
    quizQuestions: [
      {
        question: 'What does a base model do if you ask it a question?',
        options: [
          'Answers directly',
          'Continues the text like a story',
          'Refuses to respond',
          'Translates to another language',
        ],
        correctIndex: 1,
      },
      {
        question: 'What does RLHF optimize?',
        options: [
          'Training speed',
          'Human preference scores',
          'GPU utilization',
          'Tokenization accuracy',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'what-is-rag',
    title: 'What is RAG?',
    track: 'foundational',
    order: 5,
    content: `Retrieval-Augmented Generation (RAG) combines an LLM with a knowledge retrieval system. Instead of relying solely on the model\'s training data (which is static and may hallucinate), RAG fetches relevant documents from an external knowledge base and includes them in the prompt.

The typical pipeline: (1) split documents into chunks, (2) convert chunks into embedding vectors, (3) store in a vector database, (4) at query time, embed the user query and retrieve the most similar chunks, (5) include retrieved chunks in a system prompt, (6) generate the answer.

RAG dramatically reduces hallucination, enables grounding in private/up-to-date data, and provides source attribution. It is the dominant pattern for building production LLM applications over proprietary data.`,
    keyPoints: [
      'RAG augments LLM prompts with retrieved documents',
      'Uses embedding similarity to find relevant chunks',
      'Reduces hallucination and grounds answers in sources',
      'The dominant pattern for enterprise LLM applications',
    ],
    quizQuestions: [
      {
        question: 'What is the main benefit of RAG?',
        options: [
          'Faster training',
          'Reduced hallucination + grounding in sources',
          'Smaller model size',
          'Native multimodality',
        ],
        correctIndex: 1,
      },
      {
        question: 'Where are document chunks stored in a RAG system?',
        options: [
          'In a relational database',
          'In a vector database',
          'In the model weights',
          'In a CDN cache',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Fundamentals',
    track: 'practitioner',
    order: 6,
    content: `Prompt engineering is the art and science of formulating inputs to get the desired output from an LLM. Key techniques include:

**Zero-shot:** Ask the model to perform a task with no examples. Works best for well-known tasks.\n**Few-shot:** Provide 2-5 examples of input-output pairs before the actual query. Dramatically improves performance on structured or nuanced tasks.\n**Chain-of-Thought (CoT):** Add "Let\'s think step by step" or demonstrate reasoning in examples. Boosts performance on math, logic, and multi-step problems.\n**System prompts:** Use the system role to set the behavior, constraints, and persona of the assistant. A well-crafted system prompt can dramatically change output quality.\n
Temperature (0-2) controls randomness: 0.1-0.3 for deterministic outputs (coding, data extraction), 0.7-1.0 for creative tasks (writing, brainstorming).`,
    keyPoints: [
      'Zero-shot: no examples; Few-shot: provide examples',
      'Chain-of-Thought improves reasoning tasks',
      'System prompts set behavior and constraints',
      'Temperature controls randomness vs determinism',
    ],
    quizQuestions: [
      {
        question: 'What temperature range is best for coding?',
        options: ['0.0-0.3', '0.5-0.7', '1.0-1.5', '1.8-2.0'],
        correctIndex: 0,
      },
      {
        question: 'When should you use Few-shot prompting?',
        options: [
          'For all tasks',
          'For structured or nuanced tasks',
          'Only for translation',
          'It never helps',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'cot-prompting',
    title: 'Few-Shot and Chain-of-Thought Prompting',
    track: 'practitioner',
    order: 7,
    content: `Few-shot prompting provides the model with examples of the desired input-output format. The model then generalizes from these examples to process new inputs. For example, giving 3 sentiment-labeled reviews before asking it to classify a new review.

Chain-of-Thought (CoT) prompting asks the model to show its reasoning. This can be zero-shot ("Let\'s think step by step") or few-shot (demonstrating reasoning in examples). CoT dramatically improves arithmetic, logical, and commonsense reasoning benchmarks.

ReAct (Reasoning + Acting) extends CoT by allowing the model to use tools. The model alternates between reasoning steps and action steps (e.g., calling a search API or calculator), enabling it to answer questions requiring external knowledge.`,
    keyPoints: [
      'Few-shot examples demonstrate desired format',
      'CoT asks the model to show reasoning',
      'CoT significantly improves math and logic tasks',
      'ReAct combines reasoning with tool use',
    ],
    quizQuestions: [
      {
        question: 'What does CoT prompting ask the model to show?',
        options: ['Only the final answer', 'Step-by-step reasoning', 'Source code', 'Translation steps'],
        correctIndex: 1,
      },
      {
        question: 'What does ReAct add beyond CoT?',
        options: ['More parameters', 'External tool usage', 'Multimodal inputs', 'Faster inference'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'system-prompts',
    title: 'System Prompt Design',
    track: 'practitioner',
    order: 8,
    content: `The system prompt sets the stage for the entire conversation. It defines the model\'s role, constraints, output format, and guardrails. A well-designed system prompt can be the difference between mediocre and excellent outputs.

Effective system prompts specify: (1) Role — "You are an expert Python developer", (2) Constraints — "Only use standard library", (3) Output format — "Respond in JSON with keys \'explanation\' and \'code\'", (4) Tone — "Be concise and direct", (5) Guardrails — "Do not generate code that makes network requests".

System prompts are not a security mechanism. Models can be "jailbroken" through creative prompting. However, they significantly reduce off-target responses and set clear expectations for the interaction.`,
    keyPoints: [
      'System prompts define role, constraints, and format',
      'Best practice: be specific about desired output',
      'System prompts improve but do not guarantee safety',
      'Experiment iteratively with prompt variants',
    ],
    quizQuestions: [
      {
        question: 'What is the primary purpose of a system prompt?',
        options: [
          'To encrypt messages',
          'To set role, constraints, and format',
          'To increase model size',
          'To cache previous responses',
        ],
        correctIndex: 1,
      },
      {
        question: 'Are system prompts a security guarantee?',
        options: ['Yes', 'No — models can be jailbroken', 'Only for small models', 'Only in closed-source models'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'evaluating-outputs',
    title: 'Evaluating Model Outputs',
    track: 'practitioner',
    order: 9,
    content: `Evaluating LLM outputs is critical for building reliable applications. There are several approaches:

**Human evaluation:** Domain experts rate outputs on rubrics. Gold standard but expensive and slow.\n**Automated metrics:** BLEU/ROUGE for translation/summarization, exact match for Q&A, code execution for programming tasks. These can be brittle and may not capture quality nuance.\n**LLM-as-judge:** Use a stronger model (like GPT-4) to evaluate outputs from another model. This is fast and correlates reasonably with human judgments but can have biases (preference for longer, more confident responses).\n
Best practice: combine automated metrics with periodic human spot-checks. Define clear evaluation rubrics before collecting data.`,
    keyPoints: [
      'Human evaluation is the gold standard but expensive',
      'Automated metrics are fast but can be brittle',
      'LLM-as-judge is a scalable middle ground',
      'Always define rubrics before evaluating',
    ],
    quizQuestions: [
      {
        question: 'What is the main drawback of automated metrics?',
        options: [
          'They are too slow',
          'They can be brittle and miss nuance',
          'They require human judges',
          'They only work in English',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'simple-rag',
    title: 'Building a Simple RAG Pipeline',
    track: 'practitioner',
    order: 10,
    content: `A basic RAG pipeline can be built in under 50 lines of Python:

1. **Chunking:** Split documents into overlapping chunks (e.g., 500 chars with 50-char overlap).\n2. **Embedding:** Use a sentence embedding model (all-MiniLM-L6-v2, text-embedding-3-small) to convert chunks into vectors.\n3. **Storage:** Save vectors in a vector database (Chroma, FAISS, Pinecone, Qdrant) or even a simple numpy array for small scale.\n4. **Retrieval:** At query time, embed the user question and find the top-k most similar chunks using cosine similarity.\n5. **Generation:** Construct a prompt: "Context: [chunks]\\n\\nQuestion: [user query]" and send to an LLM.\n
For production, consider: re-ranking retrieved chunks with a cross-encoder, handling metadata filtering, and implementing caching for repeated questions.`,
    keyPoints: [
      'RAG = chunking + embedding + retrieval + generation',
      'Cosine similarity finds relevant chunks',
      'Use a vector database for production scale',
      'Re-ranking can improve retrieval quality',
    ],
    quizQuestions: [
      {
        question: 'What similarity metric is commonly used for retrieval?',
        options: ['Euclidean distance', 'Cosine similarity', 'Manhattan distance', 'Hamming distance'],
        correctIndex: 1,
      },
      {
        question: 'What is a re-ranker?',
        options: [
          'A GPU optimizer',
          'A model that reorders retrieved chunks by relevance',
          'A quantization method',
          'A data format',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'fine-tuning-basics',
    title: 'Fine-tuning Concepts',
    track: 'builder',
    order: 11,
    content: `Fine-tuning adapts a pre-trained model to a specific task or domain by training on a smaller, curated dataset. Unlike prompting, fine-tuning changes the model weights, so the adaptation is permanent and does not require long prompts.

**Full fine-tuning** updates all model parameters. This yields the best results but requires significant compute (e.g., 70B model needs ~400GB GPU memory) and risks catastrophic forgetting of general knowledge.\n**Parameter-Efficient Fine-Tuning (PEFT)** only trains a small set of additional parameters. LoRA (Low-Rank Adaptation) is the most popular method, inserting trainable rank-decomposition matrices into attention layers. QLoRA extends this by quantizing the base model to 4-bit and training adapters in 16-bit, enabling fine-tuning of 70B models on a single GPU.\n**When to fine-tune:** Your task has unique formats (e.g., legal contracts), you need low-latency (no long prompt), or few-shot prompting is insufficient.`,
    keyPoints: [
      'Fine-tuning adapts model weights to a specific task',
      'PEFT/LoRA trains only adapter parameters',
      'QLoRA enables 70B fine-tuning on single GPU',
      'Fine-tune when few-shot prompting is insufficient',
    ],
    quizQuestions: [
      {
        question: 'What does LoRA stand for?',
        options: [
          'Long-Range Attention',
          'Low-Rank Adaptation',
          'Large Output Recursion',
          'Local Region Analysis',
        ],
        correctIndex: 1,
      },
      {
        question: 'What does QLoRA quantize the base model to?',
        options: ['8-bit', '4-bit', '16-bit', '32-bit'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'rlhf',
    title: 'RLHF Overview',
    track: 'builder',
    order: 12,
    content: `Reinforcement Learning from Human Feedback (RLHF) is the dominant method for aligning LLMs with human preferences. It involves three stages:

1. **Supervised Fine-Tuning (SFT):** Train the model on high-quality human demonstrations of the desired behavior.\n2. **Reward Model Training:** Collect human comparisons (response A vs response B, which is better?) and train a reward model to predict human preferences.\n3. **RL Optimization:** Use a policy gradient method (like PPO) to optimize the LLM to maximize the reward model score, while adding a KL-divergence penalty to prevent the model from drifting too far from the SFT policy.

DPO (Direct Preference Optimization) is a newer alternative that skips the reward model and optimizes directly on preference data. It is simpler and often as effective as RLHF+PPO. Constitutional AI (from Anthropic) uses AI-generated feedback instead of human data to scale alignment.`,
    keyPoints: [
      'RLHF aligns models with human preferences',
      'Three stages: SFT, reward model, RL optimization',
      'DPO skips the reward model for simpler training',
      'Constitutional AI uses AI feedback instead of humans',
    ],
    quizQuestions: [
      {
        question: 'What does the reward model predict?',
        options: ['Next token probability', 'Human preference scores', 'Image quality', 'Training time'],
        correctIndex: 1,
      },
      {
        question: 'What is DPO a replacement for?',
        options: ['Embedding models', 'Reward model + PPO', 'Tokenizers', 'Data loaders'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'inference-optimization',
    title: 'Inference Optimization',
    track: 'builder',
    order: 13,
    content: `Inference optimization makes LLMs faster and cheaper to serve:

**Quantization:** Reduce weight precision from FP16 to INT8, INT4, or FP8. GGUF (llama.cpp), AWQ, and GPTQ are popular formats. A 70B model in FP16 needs ~140GB; in 4-bit it fits on ~40GB.\n**KV Cache:** During autoregressive generation, store key/value attention tensors from previous tokens to avoid recomputing them. This reduces generation from O(n²) to O(n) per step.\n**Speculative Decoding:** Use a small draft model to predict future tokens, then verify them in parallel with the main model. This can 2-3x speed up generation.\n**Continuous Batching:** Instead of waiting for all sequences in a batch to finish, dynamically add new requests and remove completed ones. Maximizes GPU utilization.\n
These techniques are composable: a quantized model with continuous batching and KV cache optimization can serve 10x more users at the same latency.`,
    keyPoints: [
      'Quantization reduces memory and speeds up inference',
      'KV cache avoids recomputing attention for past tokens',
      'Speculative decoding uses a small draft model',
      'Continuous batching maximizes GPU utilization',
    ],
    quizQuestions: [
      {
        question: 'What does KV caching avoid?',
        options: [
          'Data loading',
          'Recomputing attention for past tokens',
          'Model training',
          'Prompt tokenization',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is speculative decoding?',
        options: [
          'Using a large model to train a small one',
          'Using a small draft model to predict future tokens',
          'Compressing model weights',
          'Batching requests',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'building-app',
    title: 'Building an LLM-Powered Application',
    track: 'builder',
    order: 14,
    content: `Building a production LLM application involves more than calling an API:

**Architecture patterns:**\n- Direct API calls for simple use cases\n- RAG for knowledge-grounded applications\n- Agentic workflows for multi-step tasks (ReAct, Plan-and-Execute)\n- Fine-tuned models for specialized domains\n
**UX considerations:**\n- Stream responses token-by-token for perceived speed\n- Show loading states and progress indicators\n- Handle errors gracefully (rate limits, timeouts, hallucinations)\n- Allow users to edit/regenerate responses\n
**Observability:**\n- Log all prompts and responses for debugging\n- Track latency, token usage, and costs\n- Use tools like LangSmith, Langfuse, or Helicone for monitoring\n- Implement feedback loops (thumbs up/down) to improve over time\n
**Cost management:**\n- Cache repeated queries\n- Choose the smallest model that meets quality needs\n- Use streaming to reduce time-to-first-token\n- Consider self-hosting for high-volume applications`,
    keyPoints: [
      'Stream responses for better perceived speed',
      'Implement observability from day one',
      'Cache repeated queries to reduce costs',
      'Collect user feedback for continuous improvement',
    ],
    quizQuestions: [
      {
        question: 'Why stream LLM responses?',
        options: [
          'It improves model accuracy',
          'Better perceived speed and UX',
          'It reduces token count',
          'Required by law',
        ],
        correctIndex: 1,
      },
      {
        question: 'What tools help with LLM observability?',
        options: ['LangSmith', 'Langfuse', 'Helicone', 'All of the above'],
        correctIndex: 3,
      },
    ],
  },
  {
    id: 'safety-red-teaming',
    title: 'Safety and Red-teaming',
    track: 'builder',
    order: 15,
    content: `LLM safety involves preventing harmful, biased, or misleading outputs. Red-teaming is the practice of deliberately trying to break a model to find failure modes.

**Common attack vectors:**\n- Jailbreaking: Convincing the model to ignore safety guidelines ("DAN" prompts, roleplay, encoding)\n- Prompt injection: Hiding malicious instructions in user input (e.g., "Ignore previous instructions and...")\n- Data leakage: Extracting training data by prompting\n- In-context poisoning: Contaminating the model\'s context with misinformation\n
**Mitigation strategies:**\n- Input/output filtering with classifiers (e.g., OpenAI Moderation API, Llama Guard)\n- Sandboxing for code execution\n- Prompt injection detection (delimiters, content validation)\n- Human review for high-risk applications\n
Safety is adversarial — attackers constantly find new ways to bypass defenses. Regular red-teaming, safety evaluations (TruthfulQA, BBQ, HarmBench), and rapid patching are essential.`,
    keyPoints: [
      'Red-teaming finds failure modes before attackers do',
      'Prompt injection is a major real-world vulnerability',
      'Use guardrails (classifiers, filters) for defense-in-depth',
      'Safety is an ongoing process, not a one-time fix',
    ],
    quizQuestions: [
      {
        question: 'What is jailbreaking?',
        options: [
          'Installing unauthorized software',
          'Convincing a model to ignore safety guidelines',
          'Encrypting model weights',
          'Scaling to larger GPUs',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is prompt injection?',
        options: [
          'Optimizing prompt tokens',
          'Hiding malicious instructions in user input',
          'Converting prompts to embeddings',
          'Fine-tuning on prompt data',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'reasoning-models',
    title: 'Reasoning Models: Chain-of-Thought at Scale',
    track: 'practitioner',
    order: 16,
    content: `Reasoning models represent a paradigm shift from standard LLMs. Instead of generating responses immediately, they use extended chain-of-thought reasoning before producing a final answer. This approach, pioneered by OpenAI's o-series and mirrored by DeepSeek-R1, Qwen3, and others, achieves dramatic improvements on math, coding, and science benchmarks.

**How reasoning models work:**
- They are trained with reinforcement learning to generate long, structured thinking traces
- During inference, they "think" for seconds to minutes before responding
- The thinking process includes self-verification, backtracking, and alternative approaches
- This test-time compute scaling means accuracy improves with more thinking time

**Key reasoning model families (2025):**
- OpenAI o3/o4-mini: State-of-the-art on ARC, GPQA, and code generation
- DeepSeek-R1: Open-source model matching o1 on STEM through pure RL
- Qwen3 series: Hybrid models with toggleable thinking mode
- Claude 3.7 Sonnet: Extended thinking mode for complex tasks
- Gemini 2.5 Flash/Pro: Built-in reasoning with 1M context

**Trade-offs:**
- Higher latency and cost per query
- Thinking traces can be difficult to interpret
- Best suited for complex multi-step problems, overkill for simple Q&A
- Combining reasoning with tool use remains an active research challenge`,
    keyPoints: [
      'Reasoning models use test-time compute to improve accuracy',
      'They "think" for seconds/minutes before responding',
      'Open-source alternatives (R1, Qwen3) match proprietary reasoning',
      'Best for STEM, coding, and complex reasoning tasks',
    ],
    quizQuestions: [
      {
        question: 'What distinguishes reasoning models from standard LLMs?',
        options: [
          'They use more parameters',
          'Extended chain-of-thought before answering',
          'They are always faster',
          'They only work for math',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which open-source model matches o1 reasoning?',
        options: ['Llama 4', 'DeepSeek-R1', 'Gemma 2', 'GPT-4o'],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'moe-architecture',
    title: 'Mixture of Experts: Smarter Scaling',
    track: 'builder',
    order: 17,
    content: `Mixture of Experts (MoE) is an architecture that dramatically reduces inference cost while maintaining (or exceeding) model quality. Instead of activating all parameters for every token, MoE models route each token to a small subset of "expert" sub-networks.

**How MoE works:**
- The model contains N expert networks (e.g., 8, 16, or 128)
- A lightweight router/gate decides which experts to activate per token
- Typically 2 experts are activated per token (top-k routing)
- Active parameters per token are much smaller than total parameters
- Example: DeepSeek-V3 has 671B total but only 37B active per token

**2025 MoE models:**
- DeepSeek-V3 (0324): 685B total / 37B active, top-tier quality
- Llama 4 Maverick: 400B total / 17B active, native multimodal
- Qwen3-235B: 235B total / 22B active, hybrid reasoning
- Mixtral 8x22B: 141B total / 39B active, strong code performance
- Grok 3: Large MoE, competitive with dense frontier models

**Advantages:**
- 3-10x faster inference than dense models of equivalent quality
- Cheaper to serve at scale
- Can be trained with less compute than dense equivalents
- Each expert can specialize in different domains

**Challenges:**
- Higher memory requirements (all experts must be loaded)
- Load balancing across experts is critical and tricky
- Router can become a bottleneck
- Harder to fine-tune and quantize than dense models`,
    keyPoints: [
      'MoE activates only a subset of parameters per token',
      'Active vs total parameters: DeepSeek-V3 is 37B/671B',
      'Specialization: different experts handle different domains',
      'Key challenge: expert load balancing and router quality',
    ],
    quizQuestions: [
      {
        question: 'In an MoE model, how many experts typically activate per token?',
        options: ['All experts', '1-2 experts', 'Half of all experts', 'None'],
        correctIndex: 1,
      },
      {
        question: 'What is a key challenge in MoE training?',
        options: [
          'Speed is too fast',
          'Expert load balancing',
          'Not enough parameters',
          'Too few experts',
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: 'multimodal-2025',
    title: 'Multimodal Models in 2025: Vision, Voice, and Beyond',
    track: 'practitioner',
    order: 18,
    content: `Multimodal models in 2025 natively process text, images, audio, and video within a single architecture. This is different from earlier approaches that used separate encoders and decoders bolted together.

**How native multimodal models work:**
- All modalities are tokenized into a shared embedding space
- Images become visual tokens via vision encoders (ViT variants)
- Audio is encoded through audio tokenizers
- These tokens are interleaved with text tokens in the same sequence
- The model learns cross-modal relationships during pretraining
- The same transformer processes everything uniformly

**Leading multimodal architectures (2025):**
- GPT-4o/4.5: Text + Vision + Audio with native image generation
- Gemini 2.5 Pro: All modalities with 1M token context
- Claude 3.7 Sonnet: Text + Vision with extended thinking
- Llama 4 Scout/Maverick: Open-source with vision support
- Gemma 3: Compact vision models for edge devices
- Phi-4 Multimodal: 5.6B with text, vision, and speech

**Key capabilities:**
- Visual question answering and document understanding
- Speech-to-speech interaction with emotional inflection
- Video understanding (action recognition, scene description)
- Chart and diagram interpretation
- Real-time camera-based assistance

**What makes multimodal evaluation hard:**
- Different modalities have different metrics
- Human evaluation is often necessary
- Benchmarks like MMMU, MMBench, and Video-MME provide standardized comparisons
- Open-source multimodal models are rapidly closing the gap with proprietary ones`,
    keyPoints: [
      'All modalities share a unified token/embedding space',
      'Leading models handle text, vision, audio, and video',
      'Open-source multimodal catching up to proprietary',
      'Evaluation requires multiple modality-specific benchmarks',
    ],
    quizQuestions: [
      {
        question: 'How do multimodal models process images?',
        options: [
          'As separate databases',
          'By tokenizing into visual tokens',
          'Only as metadata',
          'They ignore images',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which benchmark evaluates college-level multimodal understanding?',
        options: ['MMLU', 'MMMU', 'GSM8K', 'HumanEval'],
        correctIndex: 1,
      },
    ],
  },
]
