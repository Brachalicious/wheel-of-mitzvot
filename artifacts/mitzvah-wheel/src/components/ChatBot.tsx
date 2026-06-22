import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, MessageCircle, Trash2 } from "lucide-react";
import logo from "@/assets/logo.png";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are a warm, knowledgeable Jewish spiritual guide and Torah scholar, embedded in the "Wheel of Mitzvot" app — a tool to help Jews connect with all 613 mitzvot.

Your role:
- Answer questions about halacha (Jewish law), mitzvot, prayer, the siddur, Shabbat, holidays, and Jewish practice with warmth and depth
- Explain why mitzvot matter spiritually, not just technically
- Reference sources: Torah, Talmud, Shulchan Aruch, Rambam, Chofetz Chaim, Mishnah Berurah, etc.
- Offer practical guidance for everyday Jewish life
- Encourage and motivate the user in their mitzvot observance
- When relevant, mention the Sefaria website for deeper study
- Treat every person with dignity regardless of background or observance level
- Keep answers concise but meaningful — this is a mobile app, so be clear and readable
- Use Hebrew terms naturally with English explanations when first introduced
- You may include relevant Hebrew phrases with transliteration

Do NOT:
- Discuss topics unrelated to Judaism, Torah, or Jewish life
- Give medical, legal, or financial advice
- Make up sources — if unsure, say so and suggest consulting a local rabbi`;

let globalConvId: number | null = null;

async function getOrCreateConversation(): Promise<number> {
  if (globalConvId !== null) return globalConvId;
  const res = await fetch("/api/openai/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Mitzvah Wheel Chat" }),
  });
  if (!res.ok) throw new Error("Could not start conversation");
  const conv = await res.json() as { id: number };
  globalConvId = conv.id;
  return conv.id;
}

export function ChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Shalom! I am your MysticMinded³³ Mitzvah guide — ask me anything about the 613 mitzvot, halacha, prayer, Jewish practice, or spirituality. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const convId = await getOrCreateConversation();
      const res = await fetch(`/api/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok || !res.body) throw new Error("No response from server");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6)) as { content?: string; done?: boolean };
            if (data.content) {
              assistantMsg += data.content;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: assistantMsg };
                return next;
              });
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (e) {
      setError("Could not connect to the guide. Please try again.");
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    globalConvId = null;
    setMessages([{
      role: "assistant",
      content: "Shalom! I am your MysticMinded³³ Mitzvah guide — ask me anything about the 613 mitzvot, halacha, prayer, Jewish practice, or spirituality. How can I help you today?",
    }]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-[#1a237e]/5 to-[#4a148c]/5">
        <img src={logo} alt="MysticMinded33" className="w-9 h-9 rounded-full border border-primary/20 object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-foreground">Mitzvah Guide</h2>
          <p className="text-[11px] text-muted-foreground font-serif">Ask about halacha, mitzvot, prayer &amp; Jewish life</p>
        </div>
        <button onClick={clearChat} title="Clear chat" className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Trash2 className="w-4 h-4" />
        </button>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.role === "assistant" && (
              <img src={logo} alt="" className="w-7 h-7 rounded-full border border-primary/20 object-cover flex-shrink-0 mt-0.5" />
            )}
            <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed font-serif shadow-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted/60 border border-border text-foreground rounded-tl-sm"
            }`}>
              {msg.content || (
                <span className="flex items-center gap-1.5 text-muted-foreground italic text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" /> Thinking…
                </span>
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.content === "" && null}

        {error && (
          <div className="text-center">
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-xl inline-block">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="flex-shrink-0 px-4 pb-2 overflow-x-auto">
          <div className="flex gap-2 w-max">
            {[
              "What is the first mitzvah in the Torah?",
              "How do I put on Tefillin?",
              "What is Shmiras HaLashon?",
              "How does Maaser work?",
              "What is Kabbalat Shabbat?",
            ].map((q) => (
              <button key={q} onClick={() => { setInput(q); setTimeout(() => send(), 0); }}
                className="flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border bg-background">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 px-3 py-2 focus-within:border-primary/50 focus-within:bg-background transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about a mitzvah, halacha, prayer…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground font-serif"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-all"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5 font-serif italic">
          Always consult your local rabbi for definitive halachic rulings
        </p>
      </div>
    </div>
  );
}
