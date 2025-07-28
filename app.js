function sumarDias(fechaStr, dias) {
  const fecha = new Date(fechaStr);
  fecha.setDate(fecha.getDate() + dias);
  return fecha.toISOString().split('T')[0];
}

function formatearFecha(fechaStr) {
  const hoy = new Date();
  const fecha = new Date(fechaStr);
  const diferencia = (fecha - hoy) / (1000 * 60 * 60 * 24);
  return Math.floor(diferencia);
}

function actualizarFechas(row) {
  const ultimaVisita = row.children[4].textContent;
  const inicioPrueba = row.children[6].textContent;
  const proximaVisita = sumarDias(ultimaVisita, 6);
  const finPrueba = sumarDias(inicioPrueba, 10);
  row.children[5].textContent = proximaVisita;
  row.children[7].textContent = finPrueba;
  if (formatearFecha(proximaVisita) <= 1) row.classList.add("alerta-visita");
  if (formatearFecha(finPrueba) === 1) row.classList.add("alerta-prueba");
}

document.querySelectorAll("#crm tbody tr").forEach(actualizarFechas);

document.getElementById("addForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const horarios = document.getElementById("horarios").value;
  const telefono = document.getElementById("telefono").value;
  const ultimaVisita = document.getElementById("ultimaVisita").value;
  const inicioPrueba = document.getElementById("inicioPrueba").value;

  const tbody = document.getElementById("crmBody");
  const row = tbody.insertRow();

  row.innerHTML = `
    <td data-label="Nombre del Local">${nombre}</td>
    <td data-label="Dirección">${direccion}</td>
    <td data-label="Horarios">${horarios}</td>
    <td data-label="WhatsApp"><a href="https://wa.me/598${telefono}" target="_blank">+598 ${telefono}</a></td>
    <td data-label="Última Visita">${ultimaVisita}</td>
    <td data-label="Próxima Visita"></td>
    <td data-label="Inicio Prueba">${inicioPrueba}</td>
    <td data-label="Fin Prueba"></td>
  `;

  actualizarFechas(row);
  this.reset();
});

document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  document.querySelectorAll("#crmBody tr").forEach(row => {
    const texto = row.textContent.toLowerCase();
    row.style.display = texto.includes(query) ? "" : "none";
  });
});