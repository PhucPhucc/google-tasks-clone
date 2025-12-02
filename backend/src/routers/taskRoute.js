import express from 'express'

const router = express.Router();

// api/tasks
router.get('/', getTasks);

router.post('/:id', createTask);

router.patch('/:id', updateTask);

router.patch('/:id/status', updateStatus);

router. delete('/:id', deleteTask);

// share user
router.patch('/:id/assign', getTasks);