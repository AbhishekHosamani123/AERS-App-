/**
 * Groq AI Chatbot Service for AERS Study Assistant.
 * Provides lightning-fast study doubt solving, coding help, and interview prep.
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get API Key from Vite env
const GROQ_API_KEY =
  (import.meta as any).env?.VITE_GROQ_API_KEY ||
  (import.meta as any).env?.GROQ_API_KEY ||
  '';

const PRIMARY_MODEL = 'openai/gpt-oss-120b';
const FALLBACK_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'groq/compound'];

const SYSTEM_PROMPT = `You are "AERS Study AI", an expert, friendly, and encouraging AI Academic & Placement Mentor for engineering and college students.

Your core capabilities:
1. Clear, step-by-step explanations of Computer Science, Engineering, Mathematics, Physics, Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and System Design concepts.
2. Writing, debugging, and explaining code in Python, C++, Java, JavaScript, TypeScript, SQL, etc., always including time and space complexity where relevant.
3. AERS Employability Learning Path guidance (Levels 01 to 20, Skill Badges, Module completion, and Employability Passport).
4. Placement & Interview Preparation (coding round strategies, aptitude shortcuts, common HR questions, tech interview questions, and resume optimization).
5. Structured study schedules, exam preparation tips, and doubt resolution.

Style Guidelines:
- Format your answers beautifully using Markdown: use clear bold headings, bullet points, numbered lists, and code blocks with language tags (e.g. \`\`\`python, \`\`\`cpp).
- Keep explanations concise, accurate, and easy to understand.
- Provide practical examples and code snippets whenever helpful.
- Maintain an encouraging, mentorship-oriented tone.`;

/**
 * Send a conversation to the Groq API and return the assistant response.
 */
export async function sendStudyQuestion(
  history: ChatMessage[],
  userPrompt: string
): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-10) // Keep last 10 messages for context
      .map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userPrompt },
  ];

  // Try primary model first, fallback if unavailable
  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Groq API error ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        return reply.trim();
      }
    } catch (err: any) {
      console.warn(`Groq request failed for model ${model}:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to get a response from AERS Study AI. Please check your connection.');
}
