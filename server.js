const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/clientes', (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome || !telefone || !email) {
    return res.status(400).json({
      erro: 'Todos os campos (nome, telefone e e-mail) são obrigatórios.'
    });
  }

  const stmt = db.prepare(
    'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)'
  );
  const resultado = stmt.run(nome.trim(), telefone.trim(), email.trim());

  res.status(201).json({
    mensagem: 'Cliente cadastrado com sucesso!',
    id: resultado.lastInsertRowid
  });
});

app.get('/api/clientes', (req, res) => {
  const clientes = db.prepare('SELECT * FROM clientes ORDER BY id').all();
  res.json(clientes);
});

app.delete('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  const resultado = db.prepare('DELETE FROM clientes WHERE id = ?').run(id);

  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Cliente não encontrado.' });
  }

  res.json({ mensagem: 'Cliente excluído com sucesso!' });
});

app.listen(PORT, () => {
  console.log('Servidor rodando em http://localhost:' + PORT);
});
