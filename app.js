const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const User = require('./models/User');
const Expenses = require('./models/expense');
const Order = require('./models/orders');


const userRoutes= require('./routes/details');
const expenseRoutes = require('./routes/expenses');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeacher');

app.use(cors());

app.use(express.json());

app.use(bodyParser.json({ extended: false}));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes)

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

app.use(errorController.get404);

sequelize.sync()
  .then(res =>{
   app.listen(3000);
})
 .catch( err => console.log(err));




