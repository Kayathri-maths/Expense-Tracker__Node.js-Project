const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize = require('./util/database');

const Details = require('./models/User');

var cors = require('cors');

const app = express();

const userRoutes= require('./routes/details');

app.use(cors());

app.use(express.json());

app.use(bodyParser.json({ extended: false}));

app.use('/user',userRoutes);

app.use(errorController.get404);

sequelize.sync()
  .then(res =>{
   app.listen(3000);
})
 .catch( err => console.log(err));




