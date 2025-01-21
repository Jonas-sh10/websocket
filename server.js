const express = require("express");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

// Servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Servidor WebSocket
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  // Escucha mensajes desde el cliente
  ws.on("message", (message) => {
    console.log(`Mensaje recibido: ${message}`);
    // Responde al cliente
    ws.send(`Servidor dice: ${message}`);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

// Ruta de prueba para verificar el servidor
app.get("/", (req, res) => {
  res.send("Servidor WebSocket está funcionando 🚀");
});
