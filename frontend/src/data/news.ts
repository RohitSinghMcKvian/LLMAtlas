import type { NewsItem } from '@/types/news'

export const newsItems: NewsItem[] = [
  {
    id: 'gpt-image-2-launch',
    title: 'OpenAI Launches GPT Image 2.0 with State-of-the-Art Image Generation',
    source: 'OpenAI',
    date: '2026-04-21',
    summary:
      'GPT Image 2.0 sets new benchmark on Image Arena with +242 point margin, the largest lead ever recorded. Supports 2K resolution, generates up to 8 coherent images from a single prompt with character consistency. First OpenAI image model with native reasoning capabilities.',
    tags: ['New Model', 'Product Launch'],
    url: 'https://openai.com/index/introducing-chatgpt-images-2-0/',
    isBreaking: true,
  },
  {
    id: 'claude-opus-4-7-release',
    title: 'Anthropic Releases Claude Opus 4.7 with 1M Context Window and Enhanced Coding',
    source: 'Anthropic',
    date: '2026-04-16',
    summary:
      'Claude Opus 4.7 brings stronger performance across coding, vision, and complex multi-step tasks. Features high-resolution image support (up to 2576px), adaptive thinking, and task budgets. Available on Claude API at $5/$25 per 1M tokens. Most capable generally available model from Anthropic.',
    tags: ['New Model', 'Product Launch'],
    url: 'https://www.anthropic.com/news/claude-opus-4-7',
    isBreaking: true,
  },
  {
    id: 'claude-mythos-preview',
    title: 'Anthropic Unveils Claude Mythos Preview - Most Powerful Model Yet',
    source: 'Anthropic',
    date: '2026-04-07',
    summary:
      'Claude Mythos Preview is Anthropic\'s frontier model, discovered via data leak before official announcement. Excels at autonomous zero-day vulnerability discovery - found thousands of bugs in major OS and browsers. Access limited to Project Glasswing partners (Apple, Microsoft, Amazon, Cisco, CrowdStrike). Not publicly available.',
    tags: ['New Model', 'Research', 'Security'],
    url: 'https://www.anthropic.com/claude/opus',
    isBreaking: true,
  },
  {
    id: 'seedance-2-official-launch',
    title: 'ByteDance Seedance 2.0 Revolutionizes AI Video Generation',
    source: 'ByteDance Seed',
    date: '2026-02-12',
    summary:
      'Seedance 2.0 launches with unified multimodal audio-video architecture supporting text, image, audio, and video inputs. Generates up to 20-second clips at native 2K resolution. Features multi-shot storytelling with character consistency across cuts. Causes viral sensation with realistic celebrity deepfakes.',
    tags: ['New Model', 'Product Launch'],
    url: 'https://seed.bytedance.com/en/blog/official-launch-of-seedance-2-0',
    isBreaking: true,
  },
  {
    id: 'seedance-2-viral-copyright',
    title: 'Seedance 2.0 Sparks Hollywood COPYRIGHT Storm',
    source: 'Variety',
    date: '2026-02-13',
    summary:
      'Disney and Paramount send cease-and-desist letters to ByteDance over Seedance 2.0 generated content featuring copyrighted characters. Senators Blackburn and Welch urge ByteDance CEO to shut down model. Generates viral clips of Friends, Brad Pitt, Will Smith that fool viewers into thinking they are real.',
    tags: ['Regulation', 'Product Launch'],
    url: 'https://en.wikipedia.org/wiki/Seedance_2.0',
    isBreaking: true,
  },
  {
    id: 'nano-banana-2-launch',
    title: 'Google Unveils Nano Banana 2 - Fast Image Generation at Scale',
    source: 'Google DeepMind',
    date: '2026-02-26',
    summary:
      'Nano Banana 2 (Gemini 3.1 Flash Image) combines Pro-quality with Flash speed. Supports 5 character consistency, 14 objects per workflow, production-ready 512px to 4K resolution. Enhanced text rendering, multilingual support. Now default across Gemini app, Search, and Flow.',
    tags: ['New Model', 'Product Launch'],
    url: 'https://deepmind.google/blog/nano-banana-2-combining-pro-capabilities-with-lightning-fast-speed',
    isBreaking: true,
  },
  {
    id: 'gpt-image-2-api',
    title: 'GPT Image 2.0 API Now Available - 4K Resolution Support',
    source: 'OpenAI Developers',
    date: '2026-04-21',
    summary:
      'GPT Image 2.0 API supports any resolution up to 4K, aspect ratios from 3:1 to 1:3. Features intelligent routing layer with two modes. Thinking mode enables web search, multi-image batching, output verification. Available via Responses API and Image API.',
    tags: ['New Model', 'Product Launch', 'Developer'],
    url: 'https://developers.openai.com/api/docs/models/gpt-image-2',
    isBreaking: false,
  },
  {
    id: 'seed2-pro-frontier-llm',
    title: 'ByteDance Seed2.0 Pro Matches Claude Opus 4.5 at 1/10th Cost',
    source: 'LLM Rumors',
    date: '2026-02-14',
    summary:
      'ByteDance Seed2.0 Pro model card reveals full-stack AI ecosystem. Scores gold at IMO 2025, 3020 Codeforces Elo. Matches GPT-5.2 and Claude Opus 4.5 on benchmarks at $0.47/1M input tokens vs $5.00 for Opus 4.5. Powers hundreds of millions of daily users across ByteDance products.',
    tags: ['New Model', 'Research', 'Benchmark'],
    url: 'https://www.llmrumors.com/news/seedance-2-bytedance-ai-video-revolution',
    isBreaking: false,
  },
  {
    id: 'anthropic-project-glasswing',
    title: 'Project Glasswing - Tech Giants Join Anthropic for Cybersecurity Initiative',
    source: 'TechCrunch',
    date: '2026-04-07',
    summary:
      '12 founding partners including Amazon, Apple, Microsoft, Cisco, CrowdStrike join Anthropic\'s Project Glasswing. Mission: use Claude Mythos to secure critical software infrastructure. Model autonomously identified thousands of zero-day vulnerabilities previously undetected for decades.',
    tags: ['Security', 'Partnership'],
    url: 'https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/',
    isBreaking: false,
  },
  {
    id: 'openai-gpt-5-4-pro',
    title: 'OpenAI GPT-5.4 Pro Leads SWE-bench with 58.7% Score',
    source: 'Anthropic',
    date: '2026-04-16',
    summary:
      'GPT-5.4 Pro achieves 58.7% on SWE-bench with tools, outperforming Claude Opus 4.7\'s 54.7%. Claude Mythos leads all with 64.7% but remains gated. Humanity\'s Last Exam shows Mythos as the only model to exceed 60% on hardest reasoning tasks.',
    tags: ['Benchmark', 'Research'],
    url: 'https://www.anthropic.com/claude/opus',
    isBreaking: false,
  },
  {
    id: 'claude-opus-4-7-migration',
    title: 'Claude Opus 4.7 Tokenizer Update - 1.35x Token Increase',
    source: 'Claude Docs',
    date: '2026-04-16',
    summary:
      'Opus 4.7 uses new tokenizer with 1.0-1.35x token increase depending on content. Extended thinking budgets removed - adaptive thinking is now the only mode. New xhigh effort level added between high and max. Default effort raised to xhigh for coding in Claude Code.',
    tags: ['Update', 'Developer'],
    url: 'https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-7',
    isBreaking: false,
  },
  {
    id: 'nano-banana-synthid-20m',
    title: 'Google SynthID Used 20 Million Times for AI Image Detection',
    source: 'TechCrunch',
    date: '2026-02-26',
    summary:
      'Google\'s C2PA-based SynthID verification used over 20 million times since November 2025. Now expanding to Gemini app and interoperability with industry-wide C2PA Content Credentials. Nano Banana 2 outputs include SynthID watermark by default.',
    tags: ['Safety', 'Product Update'],
    url: 'https://techcrunch.com/2026/02/26/google-launches-nano-banana-2-model-with-faster-image-generation/',
    isBreaking: false,
  },
  {
    id: 'seedance-2-api-fal',
    title: 'Seedance 2.0 API Now Live on fal for Developers',
    source: 'fal.ai',
    date: '2026-04-09',
    summary:
      'Seedance 2.0 officially available via fal API with text-to-video, image-to-video, and reference-to-video endpoints. Standard and Fast tiers available. Supports 4-15 second clips, aspect ratios from 9:16 to 21:9. ~60 second generation time.',
    tags: ['Product Launch', 'Developer'],
    url: 'https://fal.ai/seedance-2.0',
    isBreaking: false,
  },
  {
    id: 'gpt-image-retirement',
    title: 'DALL-E 2 and DALL-E 3 Retirement Date Set - May 12, 2026',
    source: 'OpenAI',
    date: '2026-04-21',
    summary:
      'OpenAI announces DALL-E 2 and DALL-E 3 will be retired on May 12, 2026. gpt-image-2 is architecturally distinct - described as "generalist model" or "GPT for images" rather than traditional diffusion model. Migration guide available for existing workflows.',
    tags: ['Product Update', 'Deprecation'],
    url: 'https://community.openai.com/t/introducing-gpt-image-2-available-today-in-the-api-and-codex/1379479',
    isBreaking: false,
  },
  {
    id: 'openai-microsoft-foundry',
    title: 'GPT Image 2.0 Now Available in Microsoft Foundry',
    source: 'Microsoft',
    date: '2026-04-21',
    summary:
      'GPT Image 2.0 integrated into Microsoft Foundry with intelligent routing layer. Supports 4K resolution generation, aspect ratio control, and production-ready output. Developers can build visual content pipelines at scale with Azure AI.',
    tags: ['Partnership', 'Product Launch'],
    url: 'https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-openais-gpt-image-2-in-microsoft-foundry/4500571',
    isBreaking: false,
  },
  {
    id: 'anthropic-mythos-system-card',
    title: 'Anthropic Publishes First System Card for Unreleased Model - 244 Pages',
    source: 'ClaudeFA',
    date: '2026-05-06',
    summary:
      'Anthropic publishes 244-page system card for Claude Mythos Preview - first time for unreleased model. Documents SWE-bench Verified 93.9%, SWE-bench Pro 77.8%, Terminal-Bench 2.0 82.0%. Pricing for partners at $25/$125 per 1M tokens.',
    tags: ['Research', 'Safety'],
    url: 'https://claudefa.st/blog/models/claude-mythos',
    isBreaking: false,
  },
  {
    id: 'google-gemini-3-pro-update',
    title: 'Gemini 3 Pro Shows Strong Performance Against Frontier Models',
    source: 'Anthropic',
    date: '2026-04-16',
    summary:
      'Claude Opus 4.7 benchmark comparison shows Gemini 3.1 Pro ahead in some areas while Opus 4.7 leads in others. GPT-5.4 Pro leads overall on SWE-bench with tools. Claude Mythos leads all categories but remains gated.',
    tags: ['Benchmark', 'Research'],
    url: 'https://www.anthropic.com/claude/opus',
    isBreaking: false,
  },
  {
    id: 'image-generation-wars-2026',
    title: 'AI Image Generation Wars: OpenAI vs Google vs ByteDance',
    source: 'Build Fast With AI',
    date: '2026-04-22',
    summary:
      '2026 sees unprecedented competition in AI image/video generation. GPT Image 2.0 leads on Image Arena. Nano Banana 2 dominates fast generation. Seedance 2.0 leads in video. Each excels in different niches - production workflows now use multiple models.',
    tags: ['Industry', 'Analysis'],
    url: 'https://www.buildfastwithai.com/blogs/chatgpt-images-2-0-gpt-image-2-2026',
    isBreaking: false,
  },
  {
    id: 'claude-code-effort-levels',
    title: 'Claude Code Default Effort Now xhigh for All Users',
    source: 'GitHub',
    date: '2026-04-16',
    summary:
      'Claude Code raises default effort to xhigh for all plans with Opus 4.7. New effort level provides finer control over reasoning vs latency tradeoff. Promotional pricing ended April 30 - premium request multiplier updated to 15x.',
    tags: ['Product Update', 'Developer'],
    url: 'https://github.blog/changelog/2026-04-16-claude-opus-4-7-is-generally-available',
    isBreaking: false,
  },
  {
    id: 'ai-video-market-30b',
    title: 'AI Video Generation Market Projected to Hit $30B in 2026',
    source: 'A2A Protocol',
    date: '2026-02-11',
    summary:
      'AI video generation tool market exceeds $30 billion in 2026 with 40% annual growth. Seedance 2.0 and Sora 2 lead consumer market. Enterprise adoption accelerates for advertising, film production, and social media content. Technical barriers drop significantly.',
    tags: ['Industry', 'Market'],
    url: 'https://a2aprotocol.ai/insights/2026-seedance-2.0',
    isBreaking: false,
  },
]