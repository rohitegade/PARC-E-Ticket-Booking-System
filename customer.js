exports.custprofile=function(req,res)
{
    var data = require('url').parse(req.url, true).query;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM allstops', function (err, rows) {
            res.render('customerpg',{bookticket:true,myticket:false,timetable:false,stops:rows,result:false,id:data.id});
        });
    });
};

exports.showticket=function(req,res) {
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection) {
        connection.query('SELECT cust_name FROM customer where id="'+input.id+'"', function (err, rows) {
            res.render('ticket', {data:input,cust_name:rows[0].cust_name});
        });
    });
};


exports.bookticket=function(req,res) {
    var msg="";
    var input = JSON.parse(JSON.stringify(req.body));
    var dt=input.year+"-"+input.month+"-"+input.day;
    console.log(dt);
    var data = {
        cid : input.id,
        tid: input.tid,
        src: input.src,
        des: input.des,
        tcost: input.tcost,
        dt: input.year+"-"+input.month+"-"+input.day,
        valid:1

    };
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM wallet where id="'+input.id+'"', function (err, rows) {
            if(rows[0].bal<input.tcost){
                msg="Insufficient Balance";
                connection.query('SELECT * FROM booking where cid="'+input.id+'" ORDER BY bdt DESC', function (err, rows) {
                    res.render('customerpg',{bookticket:false,myticket:true,timetable:false,data:rows,result:false,id:data.cid,error:msg,activity:true});
                });

            }
            else{
             var q=    connection.query("INSERT INTO booking set ? ",data, function(err, rows){
                    if(err){
                        console.log(q.sql);
                        res.send("Error");
                        msg="error";
                    }
                    else msg="Ticket Booked Successfully";
                });
                connection.query('SELECT * FROM booking where cid="'+input.id+'" ORDER BY bdt ASC', function (err, rows) {
                    res.render('customerpg',{bookticket:false,myticket:true,timetable:false,data:rows,result:false,id:data.id,error:msg,activity:true});
                });
            }
                });
    });
};


exports.myticket=function(req,res)
{
    var data = require('url').parse(req.url, true).query;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM booking where cid="'+data.id+'" ORDER BY bdt ASC', function (err, rows) {
            res.render('customerpg',{bookticket:false,myticket:true,timetable:false,data:rows,result:false,id:data.id,activity:false});
        });
    });
};




exports.timetable=function (req,res) {
    var route,data1,data2,data3;
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input.rtno);
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM bus',function(err,rows) {data3=rows;});
        connection.query('SELECT * FROM destimetable where rtno="'+input.rtno+'"',function(err,rows) {data2=rows;});
        connection.query('SELECT * FROM srctimetable where rtno="'+input.rtno+'"',function(err,rows) {data1=rows;});
        connection.query('SELECT * FROM stops where rtno="'+input.rtno+'"',function(err,rows){
            res.render('customerpg',{bookticket:false,myticket:false,timetable:true,stops:rows,result:false,data1:data1,data2:data2,bus:data3});
        });

    });
};

exports.send=function (req,res) {
    var url;
    var data = require('url').parse(req.url, true).query;
    if(data.get=="search") url="/customer/customerpg";
    if(data.get=="record") url="/customer/record";
    if(data.get=="timetable") url="/customer/timetable";
    res.render('customerpg2',{url:url,cust_name:data.cust_name,id:data.id});
};


