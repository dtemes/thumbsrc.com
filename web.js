require('newrelic');

var express = require('express')
  , logfmt = require('logfmt')
  , mongoose = require('mongoose')
  , app = express();

process.on('uncaughtException', function (err) {
	console.log('Exception: ', err.stack);
});

mongoose.connect(process.env.MONGOLAB_URI, function(err) {
	if (err) {
		throw err;
	}
});

require('./register_models')();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(logfmt.requestLogger());
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('index.html');
});

require('./routes/image')(app, mongoose, __dirname);

app.listen(process.env.PORT || 5000);
