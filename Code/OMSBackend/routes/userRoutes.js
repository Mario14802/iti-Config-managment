const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateRegister } = require('../validations/authValidation');

// GET all users (Admin only)
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

// DELETE user (Admin only)
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

// POST new supplier (Admin only)
router.post('/supplier', verifyToken, isAdmin, validateRegister, userController.createSupplier);

module.exports = router;
