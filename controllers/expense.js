const Expense = require('../models/expense');

exports.addExpense = async (req, res, next) => {

    try{
        const {expenseamount, description, category} = req.body;
    
        if(expenseamount === undefined || description.length ===0 || category.length === 0){
            return res.status(400).json({success: false, message: "Parameters missing"});
        }
        const expense = await Expense.create({expenseamount, description, category});
        res.status(201).json({expense, success: true})
    }  catch(err){
        res.status(500).json({success: false, error:err});
    }

}

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json({expenses, success: true});
      }
      catch(error) {
          res.status(500).json({ error: error});
      }
}

exports.deleteExpense = async (req, res, next) => {
    try{
        if(req.params.id == 'undefined'){
            console.log('ID is missing');
            return res.status(400).json({err: 'ID is missing'});
        }
        const expenseId = req.params.id;
        console.log(expenseId);
        await Expense.destroy({where: {id: expenseId}});
        res.sendStatus(200);
     }  catch(error){
        console.log(error);
        res.status(500).json(error);
     }
}