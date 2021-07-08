require('dotenv').config(); //dotenv configura-se de forma automática 

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');



//conexão com o banco
mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        //emitindo um sinal
        console.log('conectei a base de dados');
        app.emit('pronto');
    })
    .catch((error) => console.log(error));



app.use(helmet());


//liberando o req.body
app.use(express.urlencoded({extended: true}));

app.use(express.json());

//dizendo pro express onde está meus arquivos estáticos 
app.use(express.static(path.resolve(__dirname, 'public')));


//configuração das sessões
const sessionOptions = session({
    secret: 'aisjaoisjasijasijas',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

//usando as sessões e flash com express
app.use(sessionOptions);
app.use(flash());

//dizendo pro express onde está minhas views 
app.set('views', path.resolve(__dirname, 'src', 'views'));

//dizendo pro express qual a minha template engine
app.set('view engine', 'ejs');


app.use(csrf());

//middleware global
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

//minhas rotas
app.use(routes);

//iniciando o servidor apenas quando o sinal de conexão com o banco for iniciado
app.on('pronto', () =>{
    app.listen(3000, () => {
        console.log('Executando em localhost:3000'); 
    })
})