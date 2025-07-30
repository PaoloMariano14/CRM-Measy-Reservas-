// Obtener elementos
const form = document.getElementById("client-form");
const tableBody = document.querySelector("#client-table tbody");
const searchInput = document.getElementById("search");

// Función para agregar un cliente
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtener valores
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const hours = document.getElementById("hours").value;
  const lastVisit = document.getElementById("lastVisit").value;
  const trialStart = document.getElementById("trialStart").value;
  const notes = document.getElementById("notes").value;

  // Calcular fechas
  const nextVisitDate = calculateDate(lastVisit, 6);
  const trialEndDate = calculateDate(trialStart, 10);

  // Crear fila
  const row = document.createElement("tr");

  // Dirección como link de Google Maps
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  // WhatsApp
  const whatsappLink = `https://wa.me/${phone}`;

  row.innerHTML = `
    <td>${name}</td>
    <td><a href="${mapsLink}" target="_blank">${address}</a></td>
    <td><a href="${whatsappLink}" target="_blank">${phone}</a></td>
    <td>${hours}</td>
    <td>${nextVisitDate}</td>
    <td>${trialEndDate}</td>
    <td>${notes}</td>
    <td>
      <button class="action-btn edit-btn">📝</button>
      <button class="action-btn delete-btn">🗑️</button>
    </td>
  `;

  // Botón editar
  row.querySelector(".edit-btn").addEventListener("click", () => {
    editRow(row);
  });

  // Botón borrar
  row.querySelector(".delete-btn").addEventListener("click", () => {
    const confirmDelete = confirm("¿Estás seguro de que quieres eliminar este cliente?");
    if (confirmDelete) row.remove();
  });

  // Agregar fila a la tabla
  tableBody.appendChild(row);

  form.reset();
});

// Función para editar fila con prompts
function editRow(row) {
  const cells = row.querySelectorAll("td");
  const name = prompt("Nuevo nombre del local:", cells[0].textContent);
  const address = prompt("Nueva dirección:", cells[1].textContent);
  const phone = prompt("Nuevo teléfono:", cells[2].textContent);
  const hours = prompt("Nuevo horario:", cells[3].textContent);
  const notes = prompt("Descripción o notas:", cells[6].textContent);

  // Actualizar datos
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const whatsappLink = `https://wa.me/${phone}`;
  cells[0].textContent = name;
  cells[1].innerHTML = `<a href="${mapsLink}" target="_blank">${address}</a>`;
  cells[2].innerHTML = `<a href="${whatsappLink}" target="_blank">${phone}</a>`;
  cells[3].textContent = hours;
  cells[6].textContent = notes;
}

// Función para calcular fechas
function calculateDate(dateStr, daysToAdd) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}

// Buscador dinámico
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const match = Array.from(cells).some((cell, i) =>
      i <= 2 && cell.textContent.toLowerCase().includes(query)
    );
    row.style.display = match ? "" : "none";
  });
});