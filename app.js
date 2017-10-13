
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var session = require('express-session')
var http = require('http');
var path = require('path');

//load customers route
var bodyParser = require('body-parser');
var homepg = require('./routes/homepg');
var admin = require('./routes/admin');
var cust = require('./routes/customer');
var bus = require('./routes/bus');
var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret: 'ssshhhhh'}));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'parc'
    },'pool') //or single

);



app.get('/', homepg.home);
app.get('/homepg', homepg.home);
app.post('/register', homepg.save);
app.post('/login',homepg.logincheck);

app.get('/searchmybus',bus.searchmybus);
app.post('/searchmybus',bus.searchmybusp);
app.post('/customer/searchmybus',bus.custsearchmybus);


app.get('/admin/adminpg',admin.adminpg);
app.get('/admin/get',admin.send);
app.get('/getcamera',bus.getcam);

app.post('/admin/addbus',admin.addbus);
app.post('/admin/removebus',admin.removebus);
app.get('/admin/viewbuses',admin.viewbuses);


app.get('/customer/customerpg',cust.custprofile);
app.get('/customer/get',cust.send);

app.post('/customer/show',cust.showticket);
app.post('/customer/book',cust.bookticket);
app.get('/customer/record',cust.myticket);
app.get('/customer/timetable',cust.timetable);
app.post('/customer/timetable',cust.timetable);


app.get('/admin/showbusdetails',admin.showbusdetails);
app.get('/admin/showbusids',admin.showbusids);
app.get('/admin/showbustimings',admin.showbustimings);

app.post('/admin/addstop',admin.addstop);
app.post('/admin/removestop',admin.removestop);
app.post('/admin/addbusid',admin.addbusid);
app.post('/admin/removebusid',admin.removebusid);
app.post('/admin/addsrctime',admin.addst);
app.post('/admin/removesrctime',admin.removest);
app.post('/admin/adddestime',admin.adddt);
app.post('/admin/removedestime',admin.removedt);


app.get('/admin/viewcustomers',admin.viewcustomers);
app.get('/admin/viewconductors',admin.viewconductors);
app.get('/admin/editconductor',admin.editcon);
app.post('/admin/addcon',admin.addcon);            
app.post('/admin/removecon',admin.removecon);
app.get('/admin/allocate',admin.allocate);
app.post('/admin/allocate',admin.allocate2);
app.post('/admin/saveallocate',admin.saveallocate);


app.use(app.router);


http.createServer(app).listen(app.get('port'), function()
{
  console.log('Express server listening on port ' + app.get('port'));
});
