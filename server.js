const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Origens permitidas para CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'http://127.0.0.1:5500',
  'http://localhost',
  'https://athena-consultoria.github.io'
];

// Configuração CORS customizada
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (ex: curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `O CORS bloqueou essa origem: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Para ler dados do formulário x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Rota que recebe o POST do formulário
app.post('/inscrever', (req, res) => {
  const { nome, email, oficina, telefone } = req.body;

  // Validação simples dos campos obrigatórios
  if (!nome || !email || !oficina || !telefone) {
    return res.status(400).json({ error: 'Por favor, preencha todos os campos.' });
  }

  // Aqui você pode salvar os dados, enviar email, etc.
  console.log('Dados recebidos:', { nome, email, oficina, telefone });

  // Resposta de sucesso
  return res.json({ message: 'Inscrição recebida com sucesso!' });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
