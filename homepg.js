exports.home = function(req, res){

    req.getConnection(function(err,connection) {
        connection.query('SELECT * FROM allstops', function (err, rows) {

  res.render('homepg',{reg:"nothing",login:"nothing",error:"nothing",stops:rows,result:false});
        });
    });
};



/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var stops;
    req.getConnection(function (err, connection) {
        
        var data = {
            
            cust_name    : input.cust_name,
            mob : input.mob,
            pwd   : input.pwd,
            email: input.email,
            addr: input.addr,
            gender:input.gender

        };

        connection.query('SELECT * FROM allstops', function (err, rows) {stops=rows});

        connection.query("INSERT INTO customer set ? ",data, function(err, rows)
        {
            if(err) res.render('homepg',{reg:false,login:"nothing",error:"Registration Unsuccessfull!  Please Try Again",stops:stops,result:false});
            res.render('homepg',{reg:true,login:"nothing",error:"You Have Successfully Registered",stops:stops,result:false});
        });
    });
};


exports.logincheck = function(req, res){

    var input = JSON.parse(JSON.stringify(req.body));
    var stops;
    if(input.user=="admin" && input.pwd=="nimda")
        res.render('adminpg2',{url:"/admin/viewbuses"});
    else {
        req.getConnection(function (err, connection) {
            connection.query('SELECT * FROM allstops', function (err, rows) {stops=rows});

            if (input.actype == "customer") {
                connection.query('SELECT * FROM customer where cust_name="' + input.user + '" and pwd="' + input.pwd + '"', function (err, rows) {
                        if (rows.length == 1) {
                            //redirect to customer page
                            res.render('customerpg2',{url:"/customer/customerpg",id:rows[0].id,cust_name:rows[0].cust_name});
                        }
                        else
                            res.render('homepg', {reg:"nothing",login: "failed", error: "Email or Password does not match",stops:stops,result:false});
                });
            }
            else {
                connection.query('SELECT cname,cpwd FROM conductor where cname="' + input.user + '" and cpwd="' + input.pwd + '"', function (err, rows) {
                        if (rows.length == 1) {
                            //redirect to conductor page
                            res.render('conductorpg2',{cust_name:input.user});
                                             }
                        else
                            res.render('homepg', {reg:"nothing",login: "failed", error: "Email or Password does not match",stops:stops,result:false});
                });
                 }

        });
    }
};


