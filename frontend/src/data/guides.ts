import type { ToolGuide, FreeAPIGuide, CodeSnippet } from '@/types/guide'

const ollamaSnippets: CodeSnippet[] = [
  {
    language: 'bash',
    code: `ollama pull llama3.1
ollama run llama3.1`,
    description: 'Pull and run Llama 3.1 via Ollama',
  },
  {
    language: 'javascript',
    code: `const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3.1',
    prompt: 'Why is the sky blue?'
  })
});
const data = await response.json();
console.log(data.response);`,
    description: 'Call Ollama via JavaScript',
  },
]

const vllmSnippets: CodeSnippet[] = [
  {
    language: 'bash',
    code: `python -m vllm.entrypoints.openai.api_server \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --tensor-parallel-size 2`,
    description: 'Start vLLM server with a model',
  },
  {
    language: 'python',
    code: `from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    description: 'Call vLLM with OpenAI-compatible client',
  },
]

const hfSnippets: CodeSnippet[] = [
  {
    language: 'python',
    code: `from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")

inputs = tokenizer("Hello!", return_tensors="pt")
outputs = model.generate(**inputs, max_new_tokens=100)
print(tokenizer.decode(outputs[0]))`,
    description: 'Load and run with Transformers',
  },
]

export const toolGuides: ToolGuide[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    description: 'The easiest way to run LLMs locally. Single-command download and run.',
    level: 'Beginner',
    icon: 'Terminal',
    sections: [
      {
        id: 'ollama-install',
        title: 'Installation',
        level: 'Beginner',
        content: 'Ollama supports macOS, Linux, and Windows. Visit ollama.com to download the installer. After installation, the `ollama` command is available in your terminal.',
        codeSnippets: ollamaSnippets,
      },
      {
        id: 'ollama-models',
        title: 'Pulling a Model',
        level: 'Beginner',
        content: 'Use `ollama pull <model>` to download models. Common choices include llama3.1, phi3, mistral, gemma2. The model files are stored locally.',
        codeSnippets: ollamaSnippets,
      },
      {
        id: 'ollama-webui',
        title: 'Open WebUI',
        level: 'Intermediate',
        content: 'For a ChatGPT-like interface, install Open WebUI with Docker: `docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main`',
        codeSnippets: [],
      },
    ],
  },
  {
    id: 'lm-studio',
    name: 'LM Studio',
    description: 'GUI application for discovering and running LLMs on your machine.',
    level: 'Intermediate',
    icon: 'Monitor',
    sections: [
      {
        id: 'lm-studio-install',
        title: 'Getting Started',
        level: 'Intermediate',
        content: 'Download LM Studio from lmstudio.ai. It provides a graphical interface to search HuggingFace, download GGUF models, and chat. Supports CPU and GPU inference.',
        codeSnippets: [],
      },
      {
        id: 'lm-studio-gpu',
        title: 'GPU Setup',
        level: 'Intermediate',
        content: 'LM Studio auto-detects available GPUs. For NVIDIA, ensure CUDA drivers are installed. For Apple Silicon, Metal acceleration works out of the box. AMD ROCm support is available on Linux.',
        codeSnippets: [],
      },
    ],
  },
  {
    id: 'llama-cpp',
    name: 'llama.cpp',
    description: 'Maximum-performance C++ inference engine for GGUF models.',
    level: 'Advanced',
    icon: 'Cpu',
    sections: [
      {
        id: 'llamacpp-build',
        title: 'Building from Source',
        level: 'Advanced',
        content: 'Clone the repository and build with your target backend. Supports CPU (OpenBLAS), CUDA, Metal (macOS), ROCm, Vulkan, and SYCL backends.',
        codeSnippets: [{
          language: 'bash',
          code: `git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
make -j LLAMA_CUDA=1`,
          description: 'Build llama.cpp with CUDA',
        }],
      },
      {
        id: 'llamacpp-run',
        title: 'Running Inference',
        level: 'Advanced',
        content: 'llama.cpp supports a wide range of GGUF models. Use the `-ngl` flag to offload layers to GPU. The CLI supports interactive chat, prompt completion, and batched inference.',
        codeSnippets: [{
          language: 'bash',
          code: `./main -m models/llama-3.1-8b.Q4_K_M.gguf -c 4096 --temp 0.7 -n 256 --color -i -ins`,
          description: 'Interactive chat mode',
        }],
      },
    ],
  },
  {
    id: 'vllm',
    name: 'vLLM',
    description: 'High-throughput serving engine with PagedAttention for production APIs.',
    level: 'Advanced',
    icon: 'Server',
    sections: [
      {
        id: 'vllm-server',
        title: 'Starting the Server',
        level: 'Advanced',
        content: 'vLLM exposes an OpenAI-compatible API server. Supports continuous batching, tensor parallelism, and pipeline parallelism for serving large models at scale.',
        codeSnippets: vllmSnippets,
      },
      {
        id: 'vllm-quant',
        title: 'Quantization',
        level: 'Advanced',
        content: 'vLLM supports AWQ, GPTQ, and FP8 quantization. SqueezeLLM is also supported for further memory reduction at the cost of throughput.',
        codeSnippets: [],
      },
    ],
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Transformers',
    description: 'The canonical Python library for loading and using transformer models.',
    level: 'Advanced',
    icon: 'Puzzle',
    sections: [
      {
        id: 'hf-basics',
        title: 'Loading Models',
        level: 'Advanced',
        content: 'Use AutoModelForCausalLM and AutoTokenizer to load any causal language model from the HuggingFace Hub. Device map auto-distribution allows large models to run on multi-GPU or CPU+GPU.',
        codeSnippets: hfSnippets,
      },
      {
        id: 'hf-peft',
        title: 'Fine-tuning with PEFT',
        level: 'Advanced',
        content: 'Use PEFT for LoRA and QLoRA fine-tuning. This allows adapting models with minimal GPU memory by training only adapter layers while keeping base model weights frozen.',
        codeSnippets: [{
          language: 'python',
          code: `from peft import LoraConfig, get_peft_model

config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])
model = get_peft_model(model, config)
model.print_trainable_parameters()`,
          description: 'Apply LoRA adapters',
        }],
      },
    ],
  },
]

export const freeAPIGuides: FreeAPIGuide[] = [
  {
    id: 'groq',
    provider: 'Groq',
    description: 'Fastest inference on the planet using custom LPU chips.',
    rateLimit: 'Up to 20 requests/min, 1M tokens/day.',
    availableModels: ['llama-3.1-70b', 'llama-3.1-8b', 'mixtral-8x7b', 'gemma-2-9b'],
    pythonExample: `import groq

client = groq.Groq(api_key="YOUR_KEY")
chat = client.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Explain quantum computing"}]
)
print(chat.choices[0].message.content)`,
    javascriptExample: `import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: 'YOUR_KEY' });
const chat = await groq.chat.completions.create({
  model: 'llama-3.1-70b-versatile',
  messages: [{ role: 'user', content: 'Explain quantum computing' }]
});
console.log(chat.choices[0].message.content);`,
    curlExample: `curl https://api.groq.com/openai/v1/chat/completions \\
  -H "Authorization: Bearer $GROQ_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"llama-3.1-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'`,
    url: 'https://console.groq.com',
  },
  {
    id: 'openrouter',
    provider: 'OpenRouter',
    description: 'Unified API for hundreds of models from many providers.',
    rateLimit: 'Pay-as-you-go with $10 free credits.',
    availableModels: ['claude-3.5-sonnet', 'gpt-4o', 'llama-3.3-70b', 'deepseek-r1', 'gemini-1.5-pro'],
    pythonExample: `import openai

client = openai.OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="YOUR_KEY",
)
response = client.chat.completions.create(
    model="anthropic/claude-3.5-sonnet",
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.choices[0].message.content)`,
    javascriptExample: `import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'YOUR_KEY',
  dangerouslyAllowBrowser: true
});
const chat = await openai.chat.completions.create({
  model: 'anthropic/claude-3.5-sonnet',
  messages: [{ role: 'user', content: 'Hello' }]
});`,
    curlExample: `curl https://openrouter.ai/api/v1/chat/completions \\
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \\
  -d '{"model":"anthropic/claude-3.5-sonnet","messages":[{"role":"user","content":"Hello"}]}'`,
    url: 'https://openrouter.ai',
  },
  {
    id: 'google-ai-studio',
    provider: 'Google AI Studio',
    description: 'Free tier for Gemini models with generous rate limits.',
    rateLimit: '60 requests/min, 1M tokens/day.',
    availableModels: ['gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    pythonExample: `import google.generativeai as genai

genai.configure(api_key="YOUR_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain how neural networks learn.")
print(response.text)`,
    javascriptExample: `import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent("Hello!");
console.log(result.response.text());`,
    curlExample: `curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$API_KEY" \\
  -H 'Content-Type: application/json' \\
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'`,
    url: 'https://aistudio.google.com',
  },
  {
    id: 'hf-inference',
    provider: 'Hugging Face Inference API',
    description: 'Run thousands of models via serverless endpoints.',
    rateLimit: 'Free tier: 1000 requests/day.',
    availableModels: ['meta-llama/Llama-3.1-70B-Instruct', 'mistralai/Mistral-7B-Instruct-v0.3'],
    pythonExample: `import requests

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct"
headers = {"Authorization": "Bearer YOUR_KEY"}

response = requests.post(API_URL, headers=headers, json={
    "inputs": "<|user|>\\nHello!\\n<|assistant|>\\n"
})
print(response.json())`,
    javascriptExample: `const response = await fetch(
  "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
  {
    method: "POST",
    headers: { Authorization: "Bearer YOUR_KEY" },
    body: JSON.stringify({ inputs: "What is machine learning?" }),
  }
);
const result = await response.json();`,
    curlExample: `curl https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct \\
  -H "Authorization: Bearer $HF_TOKEN" \\
  -d '{"inputs": "<|user|>\\nHello!\\n<|assistant|>\\n"}'`,
    url: 'https://huggingface.co/inference-api',
  },
]
