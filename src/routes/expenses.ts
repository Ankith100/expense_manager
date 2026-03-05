import express from 'express';
import { expensesController } from '../controllers/expenses';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/', expensesController.getAllExpenses);
router.get('/filter', expensesController.filterByCategoryOrByMonth);
router.get('/dashboard', expensesController.dashboard);
router.get('/categories', expensesController.getCategories);
router.get('/:id', expensesController.getExpense);
router.post('/', expensesController.createExpense);
router.put('/:id', expensesController.updateExpense);
router.delete('/:id', expensesController.deleteExpense);

export default router;
