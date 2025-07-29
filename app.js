const form = document.getElementById('clienteForm');
const tabla = document.getElementById('tablaClientes').querySelector('tbody');
const searchInput = document.getElementById('searchInput');

let clientes = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const cliente = {
    nombre: form.nombre.value,
    direccion: form.direccion.value,
    telefono: form.telefono.value,
    fechaVisita: form.fechaVisita.value,
    fechaPrueba: form.fechaPrueba.value
  };
  clientes.push(cliente);
  form.reset();
  renderClientes();
});

function renderClientes() {
  const filtro = searchInput.value.toLowerCase();
  tabla.innerHTML = '';
  clientes
    .filter(c =>
      c.nombre.toLowerCase().includes(filtro) ||
      c.direccion.toLowerCase().includes(filtro) ||
      c.telefono.toLowerCase().includes(filtro)
    )
    .forEach((c, index) => {
      const fila = tabla.insertRow();
      fila.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.direccion}</td>
        <td><a href="https://wa.me/${c.telefono}" target="_blank">${c.telefono}</a></td>
        <td title="Cada 6 días debe realizarse una visita">${c.fechaVisita}</td>
        <td title="Prueba gratuita de 10 días">${c.fechaPrueba}</td>
        <td>
          <button class="icon-btn" onclick="editarCliente(${index})">📝</button>
          <button class="icon-btn" onclick="eliminarCliente(${index})">🗑️</button>
        </td>
      `;
    });
}

function editarCliente(index) {
  const c = clientes[index];
  const nombre = prompt("Editar nombre:", c.nombre);
  const direccion = prompt("Editar dirección:", c.direccion);
  const telefono = prompt("Editar teléfono:", c.telefono);
  const fechaVisita = prompt("Editar fecha de visita (YYYY-MM-DD):", c.fechaVisita);
  const fechaPrueba = prompt("Editar fecha de fin de prueba (YYYY-MM-DD):", c.fechaPrueba);

  if (nombre && direccion && telefono && fechaVisita && fechaPrueba) {
    clientes[index] = { nombre, direccion, telefono, fechaVisita, fechaPrueba };
    renderClientes();
  }
}

function eliminarCliente(index) {
  const confirmado = confirm("¿Estás seguro de que quieres eliminar este cliente?");
  if (confirmado) {
    clientes.splice(index, 1);
    renderClientes();
  }
}

searchInput.addEventListener('input', renderClientes);
