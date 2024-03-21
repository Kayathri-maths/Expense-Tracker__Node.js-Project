const Expense = require('../models/expense');
const User = require('../models/User');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3services');
const DownloadFile = require('../models/downloadfileurl');
const Order = require('../models/orders');

const addExpense = async (req, res, next) => {
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

const getexpenses = async (req, res, next) => {
    try {
        const page = +req.query.page || 1; // Get the page number from the query parameters
      let itemsPerPage = +req.query.Rows || 10; // Number of expenses per page
    
      const totalExpenses=await req.user.countExpenses();
      const expenses = await Expense.findAll({
        where: {
          userId: req.user.id
        },
        limit: itemsPerPage, // Limit the number of results per page
        offset: (page - 1) * itemsPerPage // Calculate the offset based on the page number
      });

     
    res.json({
            result: expenses,
            currentPage: page,
            hasNextPage: itemsPerPage*page< totalExpenses,
            nextPage: page+1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalExpenses/itemsPerPage),
          });
       
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error, success: false });
    }
}

const deleteExpense = async (req, res, next) => {
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


const downloadexpenses = async (req, res, next) => {
    try {
        //  const expenses = await req.user.getExpenses();
        const expenses = await UserServices.getExpenses(req);
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, filename);
        console.log('fileUrl', fileUrl)

        await DownloadFile.create({
            fileUrl: fileUrl,
            userId: userId
        })
        res.status(200).json({ fileUrl, success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ fileUrl: '', error: err, success: false })
    }

}

module.exports = {
    addExpense,
    getexpenses,
    deleteExpense,
    downloadexpenses
}