const path = require('path');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/expense');

router.post('/addexpense', userController.addExpense);

router.get('/get-expenses',userController.getExpenses);

router.delete('/delete-expense/:id',userController.deleteExpense);

module.exports = router;
