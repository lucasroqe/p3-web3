const form = document.getElementById('form-item');
const listaReservas = document.getElementById('lista-reservas');
const botaoAdicionar = document.querySelector('.btn-adicionar');

async function carregarReservas() {
  const resposta = await fetch('/reservas');
  const reservas = await resposta.json();
  if (listaReservas) {
    listaReservas.innerHTML = '';
    reservas.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.nomeCliente}</td>
        <td>${item.numeroMesa}</td>
        <td>${new Date(item.dataHoraReserva).toLocaleString()}</td>
        <td>${item.status}</td>
        <td>${item.contatoCliente}</td>
        <td>
          <button onclick='atualizarItem(${JSON.stringify(item)})' class="btn-editar">Editar</button>
          <button onclick='deletarItem("${item._id}")' class="btn-deletar">Deletar</button>
        </td>
      `;
      listaReservas.appendChild(row);
    });
  }
}

async function atualizarItem(item) {
  document.getElementById('nomeCliente').value = item.nomeCliente;
  document.getElementById('numeroMesa').value = item.numeroMesa;
  document.getElementById('dataHoraReserva').value = item.dataHoraReserva.slice(0, 16);
  document.getElementById('status').value = item.status;
  document.getElementById('contatoCliente').value = item.contatoCliente;

  botaoAdicionar.innerText = 'Atualizar';
  botaoAdicionar.classList.remove('btn-adicionar');
  botaoAdicionar.classList.add('btn-atualizar');

  form.removeEventListener('submit', adicionarItem);

  const handleUpdate = async (event) => {
    event.preventDefault();

    const data = {
      nomeCliente: document.getElementById('nomeCliente').value,
      numeroMesa: document.getElementById('numeroMesa').value,
      dataHoraReserva: document.getElementById('dataHoraReserva').value,
      status: document.getElementById('status').value,
      contatoCliente: document.getElementById('contatoCliente').value,
    };

    const resposta = await fetch(`/reservas/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (resposta.ok) {
      form.reset();

      botaoAdicionar.innerText = 'Adicionar';
      botaoAdicionar.classList.remove('btn-atualizar');
      botaoAdicionar.classList.add('btn-adicionar');

      form.removeEventListener('submit', handleUpdate);
      form.addEventListener('submit', adicionarItem);
      carregarReservas();
    }
  };

  form.addEventListener('submit', handleUpdate);
}

async function deletarItem(id) {
  const confirmar = confirm('Tem certeza que deseja deletar esta reserva?');
  if (!confirmar) return;

  const resposta = await fetch(`/reservas/${id}`, { method: 'DELETE' });
  if (resposta.ok) carregarReservas();
}

async function adicionarItem(event) {
  event.preventDefault();

  const data = {
    nomeCliente: document.getElementById('nomeCliente').value,
    numeroMesa: document.getElementById('numeroMesa').value,
    dataHoraReserva: document.getElementById('dataHoraReserva').value,
    status: document.getElementById('status').value,
    contatoCliente: document.getElementById('contatoCliente').value,
  };

  const resposta = await fetch('/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (resposta.ok) {
    form.reset();
    carregarReservas();
  }
}

async function buscarReservas() {
  const termo = document.getElementById('busca').value;
  const resposta = await fetch(`/reservas?nomeCliente=${encodeURIComponent(termo)}`);
  const reservas = await resposta.json();

  if (listaReservas) {
    listaReservas.innerHTML = '';
    reservas.forEach((item) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.nomeCliente}</td>
        <td>${item.numeroMesa}</td>
        <td>${new Date(item.dataHoraReserva).toLocaleString()}</td>
        <td>${item.status}</td>
        <td>${item.contatoCliente}</td>
        <td>
          <button onclick='atualizarItem(${JSON.stringify(item)})' class="btn-editar">Editar</button>
          <button onclick='deletarItem("${item._id}")' class="btn-deletar">Deletar</button>
        </td>
      `;
      listaReservas.appendChild(row);
    });
  }
}

form?.addEventListener('submit', adicionarItem);
carregarReservas();
