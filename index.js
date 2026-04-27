import http from "http";
import net from "net";
import url from "url";

// این پراکسی WebSocket درخواست را به سرور واقعی‌ت هدایت می‌کند (91.107.251.214)
const serverIp = "91.107.251.214";
const serverPort = 443;

export default function handler(req, res) {
  // بررسی اینکه درخواست از نوع WebSocket هست یا نه
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket") {
    const { socket } = res;
    const { pathname } = url.parse(req.url);
    console.log("WS connection:", pathname);

    // اتصال به سرور Xray
    const client = net.connect(serverPort, serverIp, () => {
      socket.pipe(client);
      client.pipe(socket);
    });

    client.on("error", (e) => {
      console.error("Error connecting to server:", e.message);
      socket.destroy();
    });
  } else {
    res.statusCode = 200;
    res.end("VLESS WS proxy active on Vercel.");
  }
}
