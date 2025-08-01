const form = document.getElementById('client-form');
const tableBody = document.querySelector('#client-table tbody');
const searchInput = document.getElementById('search');
const advisorFilter = document.getElementById('filterAdvisor');

let clients = [];

form.addEventListener('submit', function (e) {
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
    nextVisit,
    trialEnd,
    notes,
    advisor
  };

  clients.push(client);
  renderTable();
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = '';
  const searchTerm = searchInput.value.toLowerCase();
  const selectedAdvisor = advisorFilter.value;

  clients.forEach((client, index) => {
    if (
      (client.name.toLowerCase().includes(searchTerm) ||
      client.address.toLowerCase().includes(searchTerm) ||
      client.phone.toLowerCase().includes(searchTerm) ||
      client.advisor.toLowerCase().includes(searchTerm)) &&
      (selectedAdvisor (selectedAdvisor.trim().toLowerCase() === '' || client.advisor.trim().toLowerCase() === selectedAdvisor.trim().toLowerCase())
    ) {
      const row = document.createElement('tr');

      const visitClass = isToday(client.nextVisit) ? 'visit-warning' : '';
      const trialClass = isTomorrow(client.trialEnd) ? 'trial-warning' : '';

      row.innerHTML = `
        <td>${client.name}</td>
        <td><a href="https://www.google.com/maps/search/${encodeURIComponent(client.address)}" target="_blank">${client.address}</a></td>
        <td><a href="https://wa.me/${client.phone}" target="_blank">${client.phone}</a></td>
        <td>${client.hours}</td>
        <td class="${visitClass}">${formatDate(client.nextVisit)}</td>
        <td class="${trialClass}">${formatDate(client.trialEnd)}</td>
        <td>${client.notes}</td>
        <td>${client.advisor}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editClient(${index})">📝</button>
          <button class="action-btn delete-btn" onclick="deleteClient(${index})">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    }
  });
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function isToday(date) {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isTomorrow(date) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

function editClient(index) {
  const client = clients[index];
  const newName = prompt("Nuevo nombre del local", client.name);
  const newAddress = prompt("Nueva dirección", client.address);
  const newPhone = prompt("Nuevo teléfono", client.phone);
  const newHours = prompt("Nuevos horarios", client.hours);
  const newLastVisit = prompt("Nueva fecha de última visita (YYYY-MM-DD)", formatDate(new Date(client.nextVisit.setDate(client.nextVisit.getDate() - 6))));
  const newTrialStart = prompt("Nueva fecha de inicio de prueba (YYYY-MM-DD)", formatDate(new Date(client.trialEnd.setDate(client.trialEnd.getDate() - 10))));
  const newNotes = prompt("Nueva descripción", client.notes);
  const newAdvisor = prompt("Nuevo asesor", client.advisor);

  if (newName && newAddress && newPhone && newHours && newLastVisit && newTrialStart && newAdvisor) {
    client.name = newName;
    client.address = newAddress;
    client.phone = newPhone;
    client.hours = newHours;
    client.notes = newNotes;
    client.advisor = newAdvisor;

    const lastVisitDate = new Date(newLastVisit);
    const trialStartDate = new Date(newTrialStart);

    client.nextVisit = new Date(lastVisitDate.setDate(lastVisitDate.getDate() + 6));
    client.trialEnd = new Date(trialStartDate.setDate(trialStartDate.getDate() + 10));

    renderTable();
  }
}

function deleteClient(index) {
  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    clients.splice(index, 1);
    renderTable();
  }
}

searchInput.addEventListener('input', renderTable);
advisorFilter.addEventListener('change', renderTable);

  