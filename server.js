const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = http.createServer(expressApp);
  const io = new Server(httpServer);

  // WebSocket logic
  io.on('connection', (socket) => {
    console.log('🟢 User connected:', socket.id);

    socket.on('message', (msg) => {
      console.log('💬 Message:', msg);
      io.emit('message', msg);
    });

    socket.on('disconnect', () => {
      console.log('🔴 User disconnected:', socket.id);
    });
  });

  // Proper way to hand over requests to Next.js App Router
  expressApp.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
  });
});
