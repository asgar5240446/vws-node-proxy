import { createServer } from "http";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
  console.log("WS connected from:", req.socket.remoteAddress);

  ws.on("message", (msg) => {
    console.log("Received:", msg.toString());
    // Echo back
    ws.send("ECHO: " + msg.toString());
  });

  ws.on("close", () => {
    console.log("WS closed");
  });
});

const server = createServer((req, res) => {
  if (req.headers.upgrade?.toLowerCase() === "websocket") {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("✅ Vercel WS test server is running");
  }
});

export default server;

