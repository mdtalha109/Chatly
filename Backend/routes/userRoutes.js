const express = require('express');
const {registerUser, authUser, allusers} = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser)
router.get('/', protect, allusers)
router.route('/').post(registerUser);




module.exports = router