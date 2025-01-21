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

// Almacenamos los clientes y sus conexiones
let users = [];

// Manejamos la conexión de los clientes
wss.on("connection", (ws) => {
  console.log("Nuevo cliente conectado");

  // Guardamos la conexión en la lista de usuarios
  users.push(ws);

  // Si hay exactamente dos usuarios conectados, los emparejamos
  if (users.length === 2) {
    const user1 = users[0];
    const user2 = users[1];

    // Emitimos un mensaje a cada usuario para indicar que están emparejados
    user1.send("¡Estás emparejado con otra persona! Pueden comenzar a chatear.");
    user2.send("¡Estás emparejado con otra persona! Pueden comenzar a chatear.");

    // Manejamos los mensajes entre estos dos usuarios
    user1.on("message", (message) => {
      console.log("Mensaje de usuario 1:", message);
      // Enviar mensaje a usuario 2
      user2.send(message);
    });

    user2.on("message", (message) => {
      console.log("Mensaje de usuario 2:", message);
      // Enviar mensaje a usuario 1
      user1.send(message);
    });

    // Cuando cualquiera de los dos se desconecte, limpiamos la lista
    user1.on("close", () => {
      console.log("Usuario 1 desconectado");
      users = [];
    });

    user2.on("close", () => {
      console.log("Usuario 2 desconectado");
      users = [];
    });
  }

  // Si hay más de dos usuarios, ignoramos las conexiones adicionales
  else if (users.length > 2) {
    ws.send("Lo siento, solo puedes conectarte con una persona a la vez.");
    ws.close();
  }
});

// Ruta de prueba para verificar el servidor
app.get("/", (req, res) => {
  res.send("Servidor WebSocket está funcionando 🚀");
});
