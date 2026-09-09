import "dotenv/config";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

const PORT = Number(process.env.PORT ?? 3000);
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL ?? `http://localhost:${PORT}`;
const MYAI_API_BASE_URL = process.env.MYAI_API_BASE_URL ?? "";

function buildServer() {
  const server = new McpServer({ name: "MYAI Creative Engine", version: "1.0.0" });

  server.registerTool("myai_brand", {
    description: "Returns the MYAI brand identity and positioning."
  }, async () => ({
    content: [{ type: "text", text: JSON.stringify({
      name: "MYAI",
      tagline: "CREATES JUST ABOUT ANYTHING FOR YOU",
      description: "MYAI is an all-in-one AI creative studio that turns imagination into reality through text, images, video, music, voice, and media remixing.",
      visual_identity: "Futuristic cinematic neon: black, midnight navy, electric cyan, neon blue, violet, magenta, and metallic silver.",
      modes: ["Text", "Image", "Video", "Song", "Music Video", "My Voice", "Remix"]
    }, null, 2) }]
  }));

  server.registerTool("myai_capabilities", {
    description: "Lists the creative capabilities exposed by MYAI."
  }, async () => ({
    content: [{ type: "text", text: JSON.stringify({
      text: "Scripts, poems, marketing copy, short stories, speeches and monologues.",
      image: "Visual concepts and images from natural-language descriptions.",
      video: "Cinematic video-generation jobs.",
      song: "Original song concepts, lyrics and music-generation jobs.",
      music_video: "Synchronized music-and-visual jobs.",
      my_voice: "Voice-based creative jobs using the configured voice system.",
      remix: "Editing/remix jobs from supplied media."
    }, null, 2) }]
  }));

  server.registerTool("myai_create", {
    description: "Submit a creative request to the configured MYAI backend.",
    inputSchema: z.object({
      mode: z.enum(["text", "image", "video", "song", "music_video", "my_voice", "remix"]),
      prompt: z.string().min(1),
      style: z.string().optional(),
      source_url: z.string().url().optional()
    })
  }, async ({ mode, prompt, style, source_url }) => {
    if (!MYAI_API_BASE_URL) return {
      content: [{ type: "text", text: "MYAI_API_BASE_URL is not configured. Connect this MCP to your real MYAI backend first." }]
    };

    const response = await fetch(`${MYAI_API_BASE_URL.replace(/\/$/, "")}/v1/create`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode, prompt, style, source_url })
    });
    const body = await response.text();

    return {
      content: [{ type: "text", text: response.ok ? body : `MYAI backend HTTP ${response.status}: ${body}` }]
    };
  });

  server.registerTool("myai_health", {
    description: "Checks the MYAI MCP server status."
  }, async () => ({
    content: [{ type: "text", text: JSON.stringify({
      status: "online",
      server: "MYAI Creative Engine",
      mcp_endpoint: `${PUBLIC_BASE_URL}/mcp`,
      backend_configured: Boolean(MYAI_API_BASE_URL)
    }, null, 2) }]
  }));

  return server;
}

const handler = createMcpHandler(buildServer);
const app = createMcpExpressApp();
const nodeHandler = toNodeHandler(handler);

app.all("/mcp", (req, res) => void nodeHandler(req, res, req.body));
app.listen(PORT, "0.0.0.0", () =>
  console.log(`MYAI Creative Engine MCP: ${PUBLIC_BASE_URL}/mcp`)
);
