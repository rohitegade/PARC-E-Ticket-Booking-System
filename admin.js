exports.adminpg=function(req,res)
{
    res.render('adminpg',{viewbuses:false,viewcustomers:false,viewconductors:false});
};

exports.viewbuses=function(req,res) {
    var stops;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM allstops', function (err, rows) {stops=rows});
        connection.query('SELECT * FROM bus', function (err, rows) {
            res.render('adminpg',{viewbuses:true,viewcustomers:false,viewconductors:false,data:rows,stops:stops});
        });
    });
};

exports.send=function (req,res) {
    var url;
    var data = require('url').parse(req.url, true).query;
    if(data.get=="buses") url="/admin/viewbuses";
    if(data.get=="customers") url="/admin/viewcustomers";
    if(data.get=="conductors") url="/admin/viewconductors";
    if(data.get=="allocate") url="/admin/allocate/?rt=0";
    console.log("recieved");
    res.render('adminpg2',{url:url});
};


exports.viewcustomers=function(req,res)
{
    req.getConnection(function(err,connection) {

        connection.query('SELECT * FROM customer', function (err, rows) {
            res.render('adminpg',{viewbuses:false,viewcustomers:true,viewconductors:false,data:rows});
        });
    });
};


exports.viewconductors=function(req,res)
{
    req.getConnection(function(err,connection) {

        connection.query('SELECT * FROM conductor', function (err, rows) {
                res.render('adminpg',{viewbuses:false,viewcustomers:false,viewconductors:true,data:rows});
        });
    });
};



exports.addbus=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var stops;
    req.getConnection(function(err,connection) {
        var data = {

            rtno    : input.rtno,
            src : input.src,
            des   : input.des,

        };
        connection.query('SELECT * FROM allstops', function (err, rows) {stops=rows});
        connection.query("INSERT INTO bus set ? ",data, function(err, rows) {
            if(err) res.send("error");
        });
        connection.query('SELECT * FROM bus', function (err, rows){
            res.render('adminpg',{viewbuses:true,viewcustomers:false,viewconductors:false,data:rows,stops:stops});
        });
    });
};

exports.addcon=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection) {

        var data = {
            cid    : input.cid,
            cname : input.cname,
            cpwd: "parc@123",
            mob    : input.mob,
            email : input.email,
            age    : input.age,
            gender : input.gender,
            addr    : input.addr
        };

       connection.query("INSERT INTO conductor set ? ",data, function(err, rows1){});

                connection.query('SELECT * FROM conductor', function (err, rows) {
                    res.render('adminpg',{viewbuses:false,viewcustomers:false,viewconductors:true,data:rows});

            });
        });
};

exports.removebus=function(req,res)
{
    var stops;
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM allstops', function (err, rows) {stops=rows});
        connection.query('DELETE FROM bus WHERE rtno="'+input.rtno+'"',function (err, rows) {});
        connection.query('SELECT * FROM bus', function (err, rows){
            res.render('adminpg',{viewbuses:true,viewcustomers:false,viewconductors:false,data:rows,stops:stops});
        });
    });
};

exports.removecon=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection) {
        connection.query('DELETE FROM conductor WHERE cid="'+input.cid+'"',function (err, rows) {if(err) res.send("error");});

        connection.query('SELECT * FROM conductor', function (err, rows) {
            res.render('adminpg',{viewbuses:false,viewcustomers:false,viewconductors:true,data:rows});
        });
    });
};

exports.showbusdetails=function (req,res) {
    var query1 = require('url').parse(req.url,true).query;
    var route;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM bus where rtno="' + query1.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query('SELECT * FROM stops where rtno="' + query1.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:true,ids:false,timings:false});
        });
    });
};



exports.showbusids=function (req,res) {
    var query1 = require('url').parse(req.url,true).query;
    var route;
    req.getConnection(function(err,connection) {
       connection.query('SELECT * FROM bus where rtno="' + query1.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

         connection.query('SELECT * FROM busids where rtno="' + query1.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:true,timings:false});
        });
    });
};


exports.showbustimings=function (req,res) {
    var query1 = require('url').parse(req.url,true).query;
    var route,data2,busids;
    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM bus where rtno="' + query1.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query('SELECT * FROM srctimetable  where rtno="' + query1.rtno + '"',function(err,rows)
        {
            data2=rows;
        });
        connection.query('SELECT busid FROM busids where rtno="' + query1.rtno + '"',function(err,rows1)
        {
            busids=rows1;
            
        });
        connection.query('SELECT * FROM destimetable where rtno="' + query1.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:false,timings:true,data2:data2,busids:busids});
        });
    });
};


exports.addstop=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route;
    req.getConnection(function(err,connection) {
        var data = {
            rtno : input.rtno,
            srno: input.srno,
            stpnm: input.stpnm,
            km: 0
        };

        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query("INSERT INTO stops set ? ",data, function(err, rows) {});

        connection.query('SELECT * FROM stops where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:true,ids:false,timings:false});
        });

    });
};

exports.removestop=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route;
    req.getConnection(function(err,connection) {
        connection.query('DELETE FROM stops WHERE stpnm="'+input.stpnm+'"and rtno="'+input.rtno+'"',function (err, rows) {});
        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query('SELECT * FROM stops where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:true,ids:false,timings:false});
        });
    });
};

exports.addbusid=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route;
    req.getConnection(function(err,connection) {
        var data = {
            rtno : input.rtno,
           busid: input.busid
        };

       connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query("INSERT INTO busids set ? ",data, function(err, rows) {});

        connection.query('SELECT * FROM busids where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:true,timings:false});
        });

    });
};

exports.removebusid=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route;
    req.getConnection(function(err,connection) {
        connection.query('DELETE FROM busids WHERE busid="'+input.busid+'"and rtno="'+input.rtno+'"',function (err, rows) {});
        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query('SELECT * FROM busids where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:true,timings:false});
        });
    });
};

exports.addst=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route,data2,busids;
    req.getConnection(function(err,connection) {
        var data = {
            rtno : input.rtno,
            tm: input.tm,
            busid:input.busid
        };
        console.log(input.busid);
        connection.query('SELECT * FROM destimetable  where rtno="' + input.rtno + '"',function(err,rows)
        {
            data2=rows;
        });

        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });
        connection.query('SELECT busid FROM busids where rtno="' + input.rtno + '"',function(err,rows1)
        {
            busids=rows1;
            
        });
        connection.query("INSERT INTO srctimetable set ? ",data, function(err, rows) {});

        connection.query('SELECT * FROM srctimetable where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:false,timings:true,data2:data2,busids:busids});
        });

    });
};

exports.removest=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var data2,route,busids;
    req.getConnection(function(err,connection) {
       connection.query('DELETE FROM srctimetable WHERE tm="'+input.tm+'"and rtno="'+input.rtno+'"',function (err, rows) {});
        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query('SELECT * FROM destimetable  where rtno="' + input.rtno + '"',function(err,rows)
        {
            data2=rows;
        });
        connection.query('SELECT busid FROM busids where rtno="' + input.rtno + '"',function(err,rows1)
        {
            busids=rows1;
            
        });
        connection.query('SELECT * FROM srctimetable where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:false,timings:true,data2:data2,busids:busids});
        });
    });
};

exports.adddt=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route,data2,busids;
    req.getConnection(function(err,connection) {
        var data = {
            rtno : input.rtno,
            tm: input.tm,
            busid:input.busid,
        };

        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });
        connection.query("INSERT INTO destimetable set ? ",data, function(err, rows) {});

        connection.query('SELECT busid FROM busids where rtno="' + input.rtno + '"',function(err,rows1)
        {
            busids=rows1;
            
        });
        connection.query('SELECT * FROM destimetable  where rtno="' + input.rtno + '"',function(err,rows)
        {
            data2=rows;
        });

     connection.query('SELECT * FROM srctimetable where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:false,timings:true,data2:data2,busids:busids});
        });

    });
};

exports.removedt=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var route,data2,busids;

    req.getConnection(function(err,connection) {
        connection.query('DELETE FROM destimetable WHERE tm="'+input.tm+'"and rtno="'+input.rtno+'"',function (err, rows) {});
        connection.query('SELECT * FROM bus where rtno="' + input.rtno + '"',function(err,rows1)
        {
            route=rows1;
        });

        connection.query('SELECT * FROM destimetable  where rtno="' + input.rtno + '"',function(err,rows)
        {
            data2=rows;
        });
        connection.query('SELECT busid FROM busids where rtno="' + input.rtno + '"',function(err,rows1)
        {
            busids=rows1;
            
        });
        connection.query('SELECT * FROM srctimetable where rtno="' + input.rtno + '"',function(err,rows)
        {
            res.render('busdetails',{data:rows,head:route,stops:false,ids:false,timings:true,data2:data2,busids:busids});
        });
    });
};

exports.editcon = function (req,res) {
    res.render('conductor');

}


exports.allocate2=function (req,res) {
    var bid,cid,stm,dtm;
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function(err,connection) {
            connection.query('SELECT * FROM busids where rtno="'+input.rt+'"',function(err,rows)
            {
                bid=rows;
            });
            connection.query('SELECT cid,cname FROM conductor',function(err,rows)
            {
                cid=rows;
            });


            connection.query('SELECT * FROM bus',function(err,rows)
            {
                res.render('allocation',{action:false,show:true,bus:rows,bid:bid,cid:cid});
            });
    });
};

exports.allocate=function (req,res) {
    req.getConnection(function(err,connection) {
            connection.query('SELECT * FROM bus',function(err,rows)
            {
                res.render('allocation',{action:false,show:false,bus:rows});
            });
    });
};
exports.saveallocate=function(req,res)
{
    var input = JSON.parse(JSON.stringify(req.body));
    var result,tm;
    req.getConnection(function(err,connection) {

        if(input.loc=="src") {
            connection.query('SELECT * FROM srctimetable where busid="'+input.bid+'"', function (err, rows) {
                    tm=rows[0].tm;
                    console.log(tm);
            });
        }
        else
        {
            connection.query('SELECT * FROM destimetable where busid="'+input.bid+'"', function (err, rows) {
                tm = rows[0].tm;
            });
        }

        var data = {
            cid    : input.cid,
            busid : input.bid,
            intime:  tm,
            trips    : input.trips,
            date : input.year+"-"+input.month+"-"+input.day,
            location    : input.loc
        };
        var q=connection.query("INSERT INTO allocates set ? ",data, function(err, rows1){
            if(err) {
                console.log(q.sql);
                console.log(err);
                connection.query('SELECT * FROM bus', function (err, rows) {
                res.render('allocation',{result:"Something Went Wrong Or Already Alloated! Please Try Again",action:true,show:false,bus:rows});
            });
    }
            else {
                connection.query('SELECT * FROM bus', function (err, rows) {
                    res.render('allocation', {action: true, show: false, result: "Allocation Suucessfull",bus:rows});
                });
            }
        });


    });
};

