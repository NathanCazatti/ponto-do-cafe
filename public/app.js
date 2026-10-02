const form = document.getElementById('form-cadastro');
const msg = document.getElementById('mensagem');
const tabela = document.querySelector('#tabela tbody');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !telefone || !email) {
    mostrarMensagem('Preencha todos os campos!', 'erro');
    return;
  }

  const res = await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, telefone, email })
  });

  const dados = await res.json();
  if (res.ok) {
    mostrarMensagem(dados.mensagem, 'ok');
    form.reset();
    listarClientes();
  } else {
    mostrarMensagem(dados.erro, 'erro');
  }
});

document.getElementById('btn-listar').addEventListener('click', listarClientes);

async function listarClientes() {
  const res = await fetch('/api/clientes');
  const clientes = await res.json();
  tabela.innerHTML = '';
  clientes.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nome}</td>
      <td>${c.telefone}</td>
      <td>${c.email}</td>
      <td><button class="btn-excluir" onclick="excluirCliente(${c.id}, '${c.nome}')">Excluir</button></td>
    `;
    tabela.appendChild(tr);
  });
}

window.excluirCliente = async function (id, nome) {
  const confirmar = confirm('Deseja realmente excluir o cliente "' + nome + '" (ID ' + id + ')?');
  if (!confirmar) return;

  const res = await fetch('/api/clientes/' + id, { method: 'DELETE' });
  const dados = await res.json();
  if (res.ok) {
    mostrarMensagem(dados.mensagem, 'ok');
    listarClientes();
  } else {
    mostrarMensagem(dados.erro, 'erro');
  }
};

function mostrarMensagem(texto, tipo) {
  msg.textContent = texto;
  msg.className = 'msg ' + tipo;
  setTimeout(() => { msg.textContent = ''; }, 4000);
}
