const express = require('express');
const route = express.Router(); 
const homeController = require('./src/controllers/homeController');


//rotas da home
route.get('/',  homeController.index); 

//rotas de loguin



module.exports = route;