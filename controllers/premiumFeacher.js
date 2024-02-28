const User = require('../models/User');
const Expense = require('../models/expense');
const sequelize = require('../util/database');
const e = require('express');

const getUserLeaderBoard =  async (req, res) => {
    try{
         const users = await User.findAll();
         const expenses = await Expense.findAll();
         const userAggregateExpenses = {};
         console.log(expenses);

         expenses.forEach(expense => {
           if(userAggregateExpenses[expense.userId]){
            userAggregateExpenses[expense.userId] += expense.expenseamount;
           } else {
            userAggregateExpenses[expense.userId] = expense.expenseamount;
           }
         });

         var userLeaderBoardDetails = [];

         users.forEach((user) => {
            userLeaderBoardDetails.push({ name:user.name, total_cost: userAggregateExpenses[user.id] || 0})
         })
       console.log(userLeaderBoardDetails);
       userLeaderBoardDetails.sort((a,b) => b.total_cost - a.total_cost);
       res.status(200).json(userLeaderBoardDetails)
    } catch(err){
        console.log(err);
        res.status(500).json({error: err});
    }
}

module.exports = {
    getUserLeaderBoard
}