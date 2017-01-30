var path = require('path');
var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser')

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use('/static', express.static(path.join(__dirname + '/public')));
//app.use('/backend', express.static(path.join(__dirname + '/backend')));
//app.use('/backend/pdfs', express.static(path.join(__dirname + '/backend/pdfs')));

//Home Page Route
router.get('/', function(req, res, next){
    res.render('pages/index', { title: 'Resume Builder'})
});
app.use('/', router);

// views is directory for all template files
app.set('views', __dirname + '/site/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//If no other express route captures path, return a 404 page
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});