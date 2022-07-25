const express = require("express");
const app = express();



const Usuario = require("./models/Usuario")
const path = require('path'); //enderço de cada rota
const router = express.Router(); // trabalha com as rotas
const moment = require('moment');
const handlebars = require("express-handlebars");
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Rota Para index.html
router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//Rota para Sobre
router.get('/sobre', function(req, res) {
    res.sendFile(path.join(__dirname + '/sobre.html'));
});

// Esse vai chamar o indexCadUsuario 
router.get('/cadastrar', function(req, res) {
    res.sendFile(path.join(__dirname + '/indexCadusuario.html'));
});

//Rotas Login
router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/login.html'));
});

//Rotas para Usuario

//Essa rota vai chamar o meu usuario.html
router.get('/usuario', function(req, res) {
    res.sendFile(path.join(__dirname + '/usuario.html'));
});

// aqui vai pegar as informações o arquivo Usuario.js
router.post('/usuario', function(req, res) {

    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }).then(function() {
        res.redirect('/usuario')

    }).catch(function(erro) {
        res.send("Erro: Usuario não foi cadastrado com sucesso!" + erro)
    })

});
//essa rota vai pegar o arquivo usuario.handlebars para lista os usuarios cadastrados
router.get('/listausuario', function(req, res) {
    Usuario.findAll().then(function(Usuario) {
        res.render('usuario', { Usuario: Usuario });
    })

});

router.get('/del-usuario/:id', function(req, res) {
    Usuario.destroy({
        where: { 'id': req.params.id }
    }).then(function() {
        res.sendFile(path.join(__dirname + '/usuariodel.html'));
        //res.redirect('/usuariodel.html'); //res.redirect('/usuariodel');
        //res.send("Usuario apagado com sucesso!"); //se eu quiser que apresente essa mensagem
    }).catch(function(erro) {
        res.send("Erro ao Deletar Usuario!");
    })
});

//aqui vai redirecionar para a rota de editar
router.get('/edit-usuario/:id', function(req, res) {
    Usuario.findByPk(req.params.id).then(function(Usuario) {
        res.render('editarCadUsuario', { Usuario: Usuario }); // aqui vai fazer o redirecionamento para a parte de editar 
    })
});


router.post('/edit-usuario/:id', function(req, res) {
    Usuario.update({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha
    }, { where: { 'id': req.params.id } }).then(function() {
        res.redirect('/listausuario')

    }).catch(function(erro) {
        res.send("Erro: Usuario não foi cadastrado!" + erro)
    })
});





app.use('/', router);

app.use('/del-usuario/:id', router);
app.use('/edit-usuario/:id', router);
app.use('/listausuario', router);
app.use('/usuario', router);
app.use('/', router);
app.use('/login', router);

app.listen(8080, function() {
    console.log("Servidor Rodando na url http://localhost:8080");
});