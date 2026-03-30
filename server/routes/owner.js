const express = require('express');
const router = express.Router();
const { listUsers, promoteToOwner, demoteOwner, deleteUser } = require('../controllers/ownerController');
const { protect, ownerOnly } = require('../middleware/auth');

router.use(protect, ownerOnly);   // all routes below require owner role

router.get('/users', listUsers);
router.patch('/promote/:id', promoteToOwner);
router.patch('/demote/:id', demoteOwner);
router.delete('/users/:id', deleteUser);

module.exports = router;
