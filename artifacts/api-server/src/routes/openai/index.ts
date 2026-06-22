import { Router } from "express";
import { db, conversations as conversationsTable, messages as messagesTable } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq } from "drizzle-orm";

const router = Router();

const SYSTEM_PROMPT = `You are a warm, knowledgeable Jewish spiritual guide and Torah scholar, embedded in the "Wheel of Mitzvot" app.

Your role:
- Answer questions about halacha (Jewish law), mitzvot, prayer, the siddur, Shabbat, holidays, and Jewish practice with warmth and depth
- Explain why mitzvot matter spiritually, not just technically
- Reference sources: Torah, Talmud, Shulchan Aruch, Rambam, Chofetz Chaim, Mishnah Berurah, etc.
- Offer practical guidance for everyday Jewish life
- Encourage and motivate the user in their mitzvot observance
- When relevant, mention Sefaria for deeper study
- Treat every person with dignity regardless of background or observance level
- Keep answers concise but meaningful (this is a mobile app)
- Use Hebrew terms naturally with English explanations when first introduced

Do NOT discuss topics unrelated to Judaism, Torah, or Jewish life. If unsure about a halachic ruling, say so and suggest consulting a local rabbi.`;

// POST /openai/conversations — create conversation
router.post("/conversations", async (req, res) => {
  try {
    const { title } = req.body as { title?: string };
    const [conv] = await db
      .insert(conversationsTable)
      .values({ title: title ?? "Mitzvah Wheel Chat" })
      .returning();
    res.status(201).json(conv);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// GET /openai/conversations — list conversations
router.get("/conversations", async (req, res) => {
  try {
    const convs = await db
      .select()
      .from(conversationsTable)
      .orderBy(conversationsTable.createdAt);
    res.json(convs);
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

// DELETE /openai/conversations/:id
router.delete("/conversations/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });
  try {
    await db.delete(messagesTable).where(eq(messagesTable.conversationId, id));
    const deleted = await db
      .delete(conversationsTable)
      .where(eq(conversationsTable.id, id))
      .returning();
    if (deleted.length === 0) return void res.status(404).json({ error: "Not found" });
    res.status(204).end();
  } catch (e) {
    req.log.error(e);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// POST /openai/conversations/:id/messages — send message, stream response
router.post("/conversations/:id/messages", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return void res.status(400).json({ error: "Invalid id" });

  const { content } = req.body as { content?: string };
  if (!content?.trim()) return void res.status(400).json({ error: "content required" });

  try {
    // Load history
    const history = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, id))
      .orderBy(messagesTable.createdAt);

    // Save user message
    await db.insert(messagesTable).values({
      conversationId: id,
      role: "user",
      content: content.trim(),
    });

    // Build messages array for OpenAI
    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: content.trim() },
    ];

    // Stream response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 8192,
      messages: chatMessages,
      stream: true,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    // Save assistant message
    await db.insert(messagesTable).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (e) {
    req.log.error(e);
    if (!res.headersSent) {
      res.status(500).json({ error: "AI request failed" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      res.end();
    }
  }
});

export default router;
