const express = require('express');
const { AuthenticatorJWT } = require('../Middlewares/authenticator');
const { signUp, login, getUserById, updateUserProfile, updateRole } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/get/:id', AuthenticatorJWT, getUserById);
router.put('/update/:id', AuthenticatorJWT, updateUserProfile);
router.put('/change/role/:id', AuthenticatorJWT, updateRole);

module.exports = router;