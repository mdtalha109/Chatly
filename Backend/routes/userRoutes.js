const express = require('express');
const {registerUser, authUser, allUsers} = require('../controller/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', authUser)
router.get('/', protect, allUsers)
router.route('/').post(registerUser);




module.exports = router