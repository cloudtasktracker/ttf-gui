var express = require('express');
var app = express();
var https = require('https');
var request = require('request');
var bodyParser = require('body-parser');
var config = require('./public/conf/'+process.env.TTF_GUI_CONF+'/config.json')

app.set('port', (process.env.TTF_GUI_PORT || process.env.PORT));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.engine('js', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/task', function(req, res) {
    https.get(config.listTaskUrl, function (response) {
        var buffer = "";
        response.on("data", function (chunk) {
            buffer += chunk;
        });
        response.on("end", function (err) {
            res.render('pages/task', {
                taskList : JSON.parse(buffer)
            });
        });
    });
});

app.post('/addTask', function(req, res) {
    request.post(config.addTaskUri+req.body.taskName, {
            form: {
                key: 'value'
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
            res.redirect("/task");
        }
    );
});

app.post('/deleteTask/:taskId', function(req, res) {
    request.del(config.deleteTaskUrl+req.params.taskId, {
            form: {
                key: 'value'
            }
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
            res.redirect("/task");
        }
    );
});