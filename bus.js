
exports.searchmybus=function (req,res) {
    var data = require('url').parse(req.url, true).query;
    var route,stops,data1,data2;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM stops where stpnm="' + data.src + '"',function(err,rows1) {route=rows1;});
        connection.query('SELECT * FROM destimetable',function(err,rows) {data2=rows;});
        connection.query('SELECT * FROM srctimetable',function(err,rows) {data1=rows;});
        connection.query('SELECT * FROM stops', function (err, rows) {stops=rows});
        connection.query('SELECT * FROM stops where stpnm="' + data.des + '"',function(err,rows){

            res.render('searchresult',{stops:stops,result:true,res2:rows,res1:route,data1:data1,data2:data2});
        });
    });
};

exports.searchmybusp=function (req,res) {
    var data = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection) {
    connection.query('SELECT * FROM allstops', function (err, rows) {
    res.render('homepg',{reg:"nothing",login:"nothing",stops:rows,url:"/searchmybus",src:data.src,des:data.des,result:true});
    });
    });
};



exports.custsearchmybus=function (req,res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var route,stops,data1,data2;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM stops where stpnm="' + input.src + '"',function(err,rows1) {route=rows1;});
        connection.query('SELECT * FROM destimetable',function(err,rows) {data2=rows;});
        connection.query('SELECT * FROM srctimetable',function(err,rows) {data1=rows;});
        connection.query('SELECT * FROM stops', function (err, rows) {stops=rows});
        connection.query('SELECT * FROM stops where stpnm="' + input.des + '"',function(err,rows)
        {res.render('customerpg',{bookticket:true,myticket:false,timetable:false,stops:stops,result:true,res2:rows,res1:route,data1:data1,data2:data2,id:input.id});});
    });
};




exports.getcam= function (req,res) {

    res.render('camera');

};

