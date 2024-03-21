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
const resetPasswordRoutes = require('./routes/resetPassword')

const accessLogStream = fs.createWriteStream(
   path.join(__dirname,'accesslog'),
   { flags: 'a' }
);

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(morgan('combined',{stream: accessLogStream}))

app.use(bodyParser.json({ extended: false}));

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes)
app.use('/password', resetPasswordRoutes);

User.hasMany(Expenses);
Expenses.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(FileUrls);
FileUrls.belongsTo(User);

app.use(errorController.get404);


sequelize.sync()
  .then(() =>{
   app.listen( process.env.PORT || 3000);
})
 .catch( err => console.log(err));




