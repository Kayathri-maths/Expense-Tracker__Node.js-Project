const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User = require('./models/User');
const Expenses = require('./models/expense');
const Order = require('./models/orders');
const ForgotPassword = require('./models/forgotpassword');
const FileUrls = require('./models/downloadfileurl');
const userRoutes= require('./routes/details');
const expenseRoutes = require('./routes/expenses');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeacher');
const resetPasswordRoutes = require('./routes/resetPassword');

// Middleware
app.use(cors());
app.use(helmet( {
   contentSecurityPolicy: false
}));
app.use(express.json());
app.use(bodyParser.json({ extended: false }));

// Routes
app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', resetPasswordRoutes);

// Catch-all route
app.use((req, res) => {
   console.log('url>>>>>>>>',req.url) 
   res.sendFile(path.join(__dirname,'frontendPage',req.url))
   console.log('after...url',req.url)
});

// Associations
User.hasMany(Expenses);
Expenses.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);
User.hasMany(FileUrls);
FileUrls.belongsTo(User);

// 404 Error Handling
app.use(errorController.get404);

// Database Sync and Server Start
sequelize.sync()
  .then(() =>{
   app.listen(3000);
})
 .catch( err => console.log(err));
