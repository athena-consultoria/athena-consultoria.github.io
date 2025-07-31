import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Conexão com PostgreSQL
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString, { ssl: 'require' }) // importante para Render

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://athena-consultoria.github.io', 'http://127.0.0.1:5500'],
  methods: ['POST']
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Rota de inscrição
app.post('/inscrever', async (req, res) => {
  const { nome, email, oficina, telefone } = req.body

  if (!nome || !email || !oficina || !telefone) {
    return res.status(400).json({ error: 'Dados incompletos.' })
  }

  try {
    // Criação da tabela se não existir (opcional)
    await sql`
      CREATE TABLE IF NOT EXISTS inscricoes (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        oficina TEXT NOT NULL,
        telefone TEXT NOT NULL,
        criado_em TIMESTAMPTZ DEFAULT NOW()
      )
    `

    // Inserção de dados
    await sql`
      INSERT INTO inscricoes (nome, email, oficina, telefone)
      VALUES (${nome}, ${email}, ${oficina}, ${telefone})
    `

    // Redireciona para página de obrigado
    res.redirect('https://athena-consultoria.github.io/obrigado.html')
  } catch (err) {
    console.error('Erro ao salvar dados:', err)
    res.status(500).json({ error: 'Erro interno no servidor.' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
