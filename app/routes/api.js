const express = require('express');
const router = express.Router();
module.exports = router ;
//import 
const students = require('../controllers/student.controller.js');

router.post('/students/create',students.create);
router.get('/students',students.studentAll);
router.post('/students/details',students.findOne);