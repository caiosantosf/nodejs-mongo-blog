const express = require('express')
require('dotenv').config();
const bodyParser = require('body-parser');
const auth = require('./app/authentication');
const cookieParser = require('cookie-parser');
const db = require('./app/db');
const func = require('./app/functions');
const compression = require('compression')
const fs = require('fs')

const app = express()

app.use(compression())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/assets', [
    express.static(__dirname + '/node_modules/bootstrap/dist/css'),
    express.static(__dirname + '/node_modules/bootstrap/dist/js/'),
    express.static(__dirname + '/node_modules/jquery/dist/'),
    express.static(__dirname + '/node_modules/ContentTools/build/'),
    express.static(__dirname + '/node_modules/jquery-mask-plugin/dist/'),
    express.static(__dirname + '/node_modules/popper.js/dist/umd/'),
    express.static(__dirname + '/node_modules/font-awesome/'),
    express.static(__dirname + '/node_modules/pgwslider/'),
    express.static(__dirname + '/node_modules/pgwslideshow/'),
    express.static(__dirname + '/node_modules/moment/'),
    express.static(__dirname + '/public/images/'),
    express.static(__dirname + '/public/js/'),
    express.static(__dirname + '/public/css/'),
    express.static(__dirname + '/public/ckeditor/'),
]);

app.use('/', express.static(__dirname + '/public/images/uploads/'));

app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => {
    db.posts.find({type: 'blog', hidden: false})
        .limit(6).sort({createdAt: -1}).lean().exec(function(e, blogs) {
            db.events.find()
                .limit(3).sort({date: -1}).lean().exec(function(e, events) {
                    res.render('index', {blogs, events, 'filiese': 'N'});
                });
        });
});              

app.get('/sendWhatsapp/:text', (req, res) => require('./app/whatsapp').sendWhatsapp(req, res))
app.post('/sendMail', (req, res) => require('./app/mail').sendMail(req.body, res))
app.get('/contato', (req, res) => res.render('contact'))
app.get('/blog', function(req, res) {
    require('./app/db').posts.find({type: 'blog', hidden: false}).sort({createdAt: -1}).lean().exec(
       function (e, posts) {
          res.render('blog', {posts});
    });
});
app.get('/blog/:titlePath', function(req, res) {
    require('./app/db').posts.findOne({titlePath: req.params.titlePath}).lean().exec(
        function (e, post) {
            db.posts.find({hidden: false, titlePath:{ $ne: req.params.titlePath}}) //{type: 'blog', 
            .limit(3).sort({createdAt: -1}).lean().exec(function(e, readtoo) {
                res.render('post', {post, readtoo})
            });
    });
});

// routes / admin
app.get('/admin', function(req, res) {
    res.clearCookie('user');
    res.clearCookie('password');
    auth.login(req, res, function(res) {
        res.redirect('/dashboard');
    });
});
app.post('/login', function(req, res) {
    auth.login(req, res, function(res) {
        res.redirect('/dashboard');
    });
});
app.get('/admin/not_found', function(req, res) {
     res.render('admin/login', {'erro': 'not_found'})
});
app.get('/dashboard', function(req, res) {
    auth.login(req, res, function(){
        db.posts.find({type: 'blog'}).sort({createdAt: -1}).lean().exec(function(e, blogs) {
            db.events.find().lean().exec(function(e, events) {
                res.render('admin/dashboard', {blogs, events});
            });
        });
    });
});

// routes / admin / posts
app.get('/novopost/:type', function(req, res){
    auth.login(req, res, function(){
        var post = {};
        res.render('admin/form_post.ejs', {'type': req.params.type, 'edit': false, post, func});
    });
});
app.post('/salvarpost', function(req, res) {
    auth.login(req, res, function(res) {
        db.posts.create(req.body, function (e, post) {
            res.redirect('/dashboard');
        })
    });
});
app.post('/atualizarpost/:id', function(req, res) {
    auth.login(req, res, function(res) {
        db.posts.findOneAndUpdate({_id: req.params.id}, req.body, function (e) {
            res.redirect('/dashboard');
        })
    });
});
app.get('/removerpost/:id', function(req, res) {
    auth.login(req, res, function(res) {
        db.posts.remove({_id: req.params.id}, function (e) {
            res.redirect('/dashboard');
        })
    });
});
app.get('/editarpost/:type/:id', function(req, res){
    auth.login(req, res, function(){
        if (req.params.type == 'noticia') {
        db.posts.findOne({_id: req.params.id}).lean().exec(function(e, post) {
            res.render('admin/form_post.ejs', {'type': req.params.type, 'edit': true, post});
        });
        } else {
            db.posts.findOne({_id: req.params.id}).lean().exec(function(e, post) {
                res.render('admin/form_post.ejs', {'type': req.params.type, 'edit': true, post});
            });
        }
    });
});

// routes / admin / agenda
app.get('/novoevento', function(req, res){
    auth.login(req, res, function(){
        var event = {};
        res.render('admin/form_event.ejs', {'edit': false, event});
    });
});
app.post('/salvarevento', function(req, res) {
    auth.login(req, res, function(res) {
        console.log(req.body)
        db.events.create(req.body, function (e, event) {
            console.log(e)
            res.redirect('/dashboard');
        })
    });
});
app.post('/atualizarevento/:id', function(req, res) {
    auth.login(req, res, function(res) {
        db.events.findOneAndUpdate({_id: req.params.id}, req.body, function (e) {
            res.redirect('/dashboard');
        })
    });
});
app.get('/removerevento/:id', function(req, res) {
    auth.login(req, res, function(res) {
        db.events.remove({_id: req.params.id}, function (e) {
            res.redirect('/dashboard');
        })
    });
});
app.get('/editarevento/:id', function(req, res){
    auth.login(req, res, function(){
        db.events.findOne({_id: req.params.id}).lean().exec(function(e, event) {
            res.render('admin/form_event.ejs', {'edit': true, event});
        });
    });
});

// routes / admin / upload
app.post('/upload', function(req, res) {
    const multiparty = require('multiparty');   
    var form = new multiparty.Form();
    var singleFile; 
    form.parse(req, function(err, fields, files) {    
        var fileArry = files.upload;        
        if(!fileArry[0].originalFilename){
            res.send('Não foi selecionado nenhum arquivo. <a href="/dashboard">Voltar</a>');
            return; 
        }
        for(i=0; i<fileArry.length; i++) {  
            newPath='./public/images/uploads/';
            singleFile=fileArry[i];
            var date = new Date()
            var mes = date.getMonth() + 1
            var dia = date.getDate()
            date = ('0' + dia).slice(-2) + ('0' + mes).slice(-2)
            newPath += date + singleFile.originalFilename;
            readAndWriteFile(singleFile.path,newPath);
        }
        res.send('Upload feito com sucesso! <a href="/dashboard">Voltar</a>');
    });
    function readAndWriteFile(sourceFile , targetFile){
        const fs = require('fs');
        fs.writeFileSync(targetFile, fs.readFileSync(sourceFile));
    }
});

app.use(function(req, res, next){
    res.status(404).redirect('/')
});

// start server
app.listen(process.env.PORT);