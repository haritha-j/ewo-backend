
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


//sample get fucntion
app.get('/getName',function (req,res){
  res.send('Swarup Bam');
});



//sample post fucntion for dialogflow
app.post('/findColor',function (request,response)  {
  if(request.body.queryResult.parameters.color['red']) {
      var req = unirest("GET", "https://api.themoviedb.org/3/movie/top_rated");
          req.query({
              "page": "1",
              "language": "en-US",
              "api_key": ""
          });
          req.send("{}");
          req.end(function(res) {
              if(res.error) {
                  response.setHeader('Content-Type', 'application/json');
                  response.send(JSON.stringify({
                      "speech" : "Error. Can you try it again ? ",
                      "displayText" : "Error. Can you try it again ? "
                  }));
              } else if(res.body.results.length > 0) {
                  let result = res.body.results;
                  let output = '';
                  for(let i = 0; i<result.length;i++) {
                      output += result[i].title;
                      output+="\n"
                  }
                  response.setHeader('Content-Type', 'application/json');
                  response.send(JSON.stringify({
                      "speech" : output,
                      "displayText" : output
                  })); 
              }
          });
  }
}
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


