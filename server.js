const express = require("express");
const { WebSocketServer } = require("ws");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar la carpeta "front" como estática
app.use(express.static(path.join(__dirname, "../front")));

// Ruta de prueba para el servidor HTTP
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/index.html"));
});

// Crear servidor HTTP
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Crear servidor WebSocket
const wss = new WebSocketServer({ server });

let users = [];

// Manejamos las conexiones de WebSocket
wss.on("connection", (ws) => {
  console.log("Nuevo cliente conectado");

  // Guardar usuarios
  users.push(ws);

  if (users.length === 2) {
    const user1 = users[0];
    const user2 = users[1];

    user1.send("¡Conectado con otro usuario!");
    user2.send("¡Conectado con otro usuario!");

    user1.on("message", (message) => {
      console.log("Mensaje de usuario 1:", message);
      user2.send(message);
    });

    user2.on("message", (message) => {
      console.log("Mensaje de usuario 2:", message);
      user1.send(message);
    });

    // Cuando se desconectan
    user1.on("close", () => {
      console.log("Usuario 1 desconectado");
      users = users.filter((user) => user !== user1);
    });

    user2.on("close", () => {
      console.log("Usuario 2 desconectado");
      users = users.filter((user) => user !== user2);
    });
  } else if (users.length > 2) {
    ws.send("Máximo 2 usuarios pueden estar conectados al mismo tiempo.");
    ws.close();
  }
});
