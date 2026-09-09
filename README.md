# MYAI Creative Engine MCP

Custom MCP server for MYAI.

Name: MYAI Creative Engine

Development endpoint:
http://localhost:3000/mcp

Recommended production endpoint:
https://mcp.myai.studio/mcp

The production URL is a recommended address, not a live hosted server. A public URL requires deployment and a domain.

Tools:
- myai_brand
- myai_capabilities
- myai_create
- myai_health

myai_create supports text, image, video, song, music_video, my_voice, and remix.

Run:
npm install
npm run dev

Then connect your MCP client to:
http://localhost:3000/mcp

To connect real MYAI generation, set MYAI_API_BASE_URL and adapt POST /v1/create to your actual MYAI API.

For production, add authentication/authorization and never hard-code API keys.
