const { WebSocketServer } = require("ws");

// Lista de usuarios conectados
let users = [];

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("Nuevo cliente conectado");
    users.push(ws);

    if (users.length === 2) {
      const [user1, user2] = users;

      user1.send("Estás conectado con otro usuario. ¡Empieza a chatear!");
      user2.send("Estás conectado con otro usuario. ¡Empieza a chatear!");

      user1.on("message", (message) => user2.send(message));
      user2.on("message", (message) => user1.send(message));

      const cleanUp = () => {
        console.log("Usuario desconectado");
        users = [];
      };

      user1.on("close", cleanUp);
      user2.on("close", cleanUp);
    } else if (users.length > 2) {
      ws.send("Solo se permite conectar dos usuarios. Intentar más tarde.");
      ws.close();
    }
  });
}

module.exports = { setupWebSocket };
