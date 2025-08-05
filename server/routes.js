const express = require('express');
const router = express.Router();
const db = require('./db');

// Obtener todos los clientes
router.get('/clients', (req, res) => {
  db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear nuevo cliente
router.post('/clients', (req, res) => {
  const { name, address, phone, hours, nextVisit, trialEnd, notes, advisor } = req.body;
  db.run(
    `INSERT INTO clients (name, address, phone, hours, nextVisit, trialEnd, notes, advisor)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, address, phone, hours, nextVisit, trialEnd, notes, advisor],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Actualizar cliente
router.put('/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, address, phone, hours, nextVisit, trialEnd, notes, advisor } = req.body;
  db.run(
    `UPDATE clients SET name=?, address=?, phone=?, hours=?, nextVisit=?, trialEnd=?, notes=?, advisor=? WHERE id=?`,
    [name, address, phone, hours, nextVisit, trialEnd, notes, advisor, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// Eliminar cliente
router.delete('/clients/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM clients WHERE id = ?`, id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;