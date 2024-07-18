const express = require('express');
const router = express.Router();
const { getAllTasks, createTask, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');


router.get('/tasks', getAllTasks);
router.post('/tasks', createTask);
router.get('/tasks/:id', getTaskById);  
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;
