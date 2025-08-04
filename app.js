const form = document.getElementById('client-form');
const tableBody = document.querySelector('#client-table tbody');
const searchInput = document.getElementById('search');
const advisorFilter = document.getElementById('filterAdvisor');

let clients = [];

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const address = document.getElementById('address').value;
  const phone = document.getElementById('phone').value;
  const hours = document.getElementById('hours').value;
  const lastVisit = new Date(document.getElementById('lastVisit').value);
  const trialStart = new Date(document.getElementById('trialStart').value);
  const notes = document.getElementById('notes').value;
  const advisor = document.getElementById('advisor').value;

  const nextVisit = new Date(lastVisit);
  nextVisit.setDate(nextVisit.getDate() + 6);

  const trialEnd = new Date(trialStart);
  trialEnd.setDate(trialEnd.getDate() + 10);

  const client = {
    name,
    address,
    phone,
    hours,
    nextVisit: nextVisit.toISOString(),
    trialEnd: trialEnd.toISOString(),
    notes,
    advisor
  };

  const res = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(client)
  });

  const savedClient = await res.json();
  client.id = savedClient.id;
  clients.push(client);
  renderTable();
  form.reset();
});

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function daysUntil(date) {
  const today = new Date();
  const target = new Date(date);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function renderTable() {
  tableBody.innerHTML = '';
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedAdvisor = advisorFilter.value;

  clients.forEach((client, index) => {
    if (
      (client.name.toLowerCase().includes(searchTerm) ||
        client.address.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm) ||
        client.advisor.toLowerCase().includes(searchTerm)) &&
      (selectedAdvisor === '' || client.advisor === selectedAdvisor)
    ) {
      const row = document.createElement('tr');

      const visitDaysLeft = daysUntil(client.nextVisit);
      const trialDaysLeft = daysUntil(client.trialEnd);

      let visitClass = visitDaysLeft <= 2 ? (visitDaysLeft === 1 ? 'visit-warning' : 'critical-warning') : '';
      let trialClass = trialDaysLeft <= 2 ? (trialDaysLeft === 1 ? 'trial-warning' : 'critical-warning') : '';

      row.innerHTML = `
        <td>${client.name}</td>
        <td><a href="https://www.google.com/maps/search/${encodeURIComponent(client.address)}" target="_blank">${client.address}</a></td>
        <td><a href="https://wa.me/${client.phone}" target="_blank">${client.phone}</a></td>
        <td>${client.hours}</td>
        <td class="${visitClass}">${formatDate(client.nextVisit)}<br><small>Faltan ${visitDaysLeft} días</small></td>
        <td class="${trialClass}">${formatDate(client.trialEnd)}<br><small>Quedan ${trialDaysLeft} días</small></td>
        <td>${client.notes}</td>
        <td>${client.advisor}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editClient(${index})">📝</button>
          <button class="action-btn delete-btn" onclick="deleteClient(${index})">🗑️</button>
          <button class="action-btn" onclick="add5DaysVisit(${index})">➕ +5 días visita</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
}

async function editClient(index) {
  const client = clients[index];
  const newName = prompt("Nuevo nombre del local", client.name);
  const newAddress = prompt("Nueva dirección", client.address);
  const newPhone = prompt("Nuevo teléfono", client.phone);
  const newHours = prompt("Nuevos horarios", client.hours);
  const newLastVisit = prompt("Nueva fecha de última visita (YYYY-MM-DD)", formatDate(new Date(client.nextVisit).setDate(new Date(client.nextVisit).getDate() - 6)));
  const newTrialStart = prompt("Nueva fecha de inicio de prueba (YYYY-MM-DD)", formatDate(new Date(client.trialEnd).setDate(new Date(client.trialEnd).getDate() - 10)));
  const newNotes = prompt("Nueva descripción", client.notes);
  const newAdvisor = prompt("Nuevo asesor", client.advisor);

  if (newName && newAddress && newPhone && newHours && newLastVisit && newTrialStart && newAdvisor) {
    const lastVisitDate = new Date(newLastVisit);
    const trialStartDate = new Date(newTrialStart);

    const updatedClient = {
      id: client.id,
      name: newName,
      address: newAddress,
      phone: newPhone,
      hours: newHours,
      notes: newNotes,
      advisor: newAdvisor,
      nextVisit: new Date(lastVisitDate.setDate(lastVisitDate.getDate() + 6)).toISOString(),
      trialEnd: new Date(trialStartDate.setDate(trialStartDate.getDate() + 10)).toISOString()
    };

    await fetch(`/api/clients/${client.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedClient)
    });

    clients[index] = updatedClient;
    renderTable();
  }
}

async function deleteClient(index) {
  const client = clients[index];
  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    await fetch(`/api/clients/${client.id}`, { method: 'DELETE' });
    clients.splice(index, 1);
    renderTable();
  }
}

function add5DaysVisit(index) {
  const client = clients[index];
  const newVisitDate = new Date(client.nextVisit);
  newVisitDate.setDate(newVisitDate.getDate() + 5);
  client.nextVisit = newVisitDate.toISOString();
  editClient(index);
}

function sortByNextVisit() {
  clients.sort((a, b) => daysUntil(a.nextVisit) - daysUntil(b.nextVisit));
  renderTable();
}

function sortByTrialEnd() {
  clients.sort((a, b) => daysUntil(a.trialEnd) - daysUntil(b.trialEnd));
  renderTable();
}

searchInput.addEventListener('input', renderTable);
advisorFilter.addEventListener('change', renderTable);

// Cargar clientes desde la base de datos al iniciar
window.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('/api/clients');
  clients = await res.json();
  renderTable();
});
