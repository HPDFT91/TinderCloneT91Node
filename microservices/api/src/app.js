var express=require('express');
var fetch=require('node-fetch');
var bodyParser= require("body-parser");
var cookieParser=require('cookie-parser');
var http = require('http');
var app=express();
  var d = "<ul>";


function countposts(usera){
    var count=0;
    fetch('http://jsonplaceholder.typicode.com/posts?userId='+usera.id)
    .then(function(response){
       return response.json();
    })
    .then(function(json){
    	     count = json.length;
    	     d +="<li>"+usera.name+" has written "+JSON.stringify(count)+" posts</li>";
        return 1;
       
    });
     
}


app.get('/',function(req,res){
res.send('Hello World-Amruthkala here!');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/input',function(req,res){
  res.sendFile('View/htmlform.html',{root:__dirname});
});

app.get('/authors',function(req,res){

    fetch('http://jsonplaceholder.typicode.com/users')
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        json.forEach(function(user){
             countposts(user);
        });
         res.send("If the page displays blank please refresh!"+d);
         d="<ul>";
       console.log("done");
       
    });
});
app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
res.send("Passed to console!");
  console.log("User name = "+user_name+", password is "+password);

});


app.get('/html',function(req,res){
	res.sendFile('View/myhtml.html',{root:__dirname});
})
app.get('/robots.txt',function(req, res){
 res.send('ACCESSS DENIED!!');
});

app.get('/getcookies',function(req, res){
 res.send('Currently set cookie values are:'+req.headers.cookie);
});
app.use(cookieParser());
app.use(function (req, res, next) {
  var cookie1=req.headers.cookie
  if (cookie1 === undefined)
  {
    // no: set a new cookie
    res.cookie('Name','Amruthkala',{maxAge : 999999});
     res.cookie('Age','20',{maxAge : 999999}).send('Cookie is set');

  } 
  else
  {
    // yes, cookie was already present 
    res.send('Cookie already exists');
    
  } 
  next();
});

app.get('/setcookie',function(req, res){
 console.log('Detected cookie and set if not already set');
});

app.listen(8080,function(){
console.log('Your App is running on port 8080');
}
);