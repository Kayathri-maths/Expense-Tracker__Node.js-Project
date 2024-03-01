const Expense = require('../models/expense');
const User = require('../models/User');
const sequelize = require('../util/database');

exports.addExpense = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { expenseamount, description, category } = req.body;

        if (expenseamount === undefined || description.length === 0 || category.length === 0) {
            return res.status(400).json({ success: false, message: "Parameters missing" });
        }
        const expense = await Expense.create({ expenseamount, description, category, userId: req.user.id }, { transaction: transaction });
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        console.log(totalExpense);
        await User.update({
            totalExpenses: totalExpense
        }, {
            where: { id: req.user.id },
            transaction: transaction
        });
        await transaction.commit();
        res.status(201).json({ expense, success: true })
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ success: false, error: err });
    }

}

exports.getexpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ expenses, success: true });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error, success: false });
    }
}

exports.deleteExpense = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        if (req.params.id == 'undefined') {
            console.log('ID is missing');
            return res.status(400).json({ success: false, err: 'ID is missing' });
        }
        const expenseId = req.params.id;
        console.log(expenseId);
        const noofrows = await Expense.destroy({ where: { id: expenseId, userId: req.user.id }, transaction: transaction });
        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });

        const updateExpense = Number(req.user.totalExpenses) - Number(expense.expenseamount);
        await User.update({
            totalExpenses: updateExpense
        }, {
            where: { id: req.user.id },
            transaction: transaction
        });
        await transaction.commit();
        console.log(noofrows)
        if (noofrows === 0) {
            return res.status(404).json({ success: false, message: "expense doesn't belong to the usr" })
        }
        return res.status(200).json({ success: true, message: "Deleted Successfully" });
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({ message: "failed", success: false });
    }
}