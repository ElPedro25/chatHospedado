// Importando o módulo 'express' e atribuindo-o à constante 'app'
const app = require('express')();
const http = require('http').createServer(app);
// Aumentamos maxHttpBufferSize para suportar imagens de perfil em Base64 (ex: até 5MB)
const io = require('socket.io')(http, {
  maxHttpBufferSize: 5e6 
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // Envia nova mensagem (agora contendo id, nome, mensagem e avatar)
  socket.on('chat message', (data) => io.emit('chat message', data));

  // Repassa a edição da mensagem para todos
  socket.on('edit message', (data) => io.emit('edit message', data));

  // Repassa a exclusão da mensagem para todos
  socket.on('delete message', (id) => io.emit('delete message', id));

  socket.on('disconnect', () => console.log('Usuário desconectado'));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});