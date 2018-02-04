var express = require('express');
var app = express();
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
var router = express.Router();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var server = require('http').Server(app);

var url_signup = "https://auth.bleed71.hasura-app.io/v1/signup";
var url_login = "https://auth.bleed71.hasura-app.io/v1/login";
var url_logout = "https://auth.bleed71.hasura-app.io/v1/user/logout";
var url = "https://data.bleed71.hasura-app.io/v1/query";
var url_getinfo = "https://auth.bleed71.hasura-app.io/v1/user/info";






/*function testing(){
  var like_user_id = 119;
  var likeby_user_id = 250;
  var url_new = "http://localhost:8080/APIEP_Likes/"+like_user_id+"/"+likeby_user_id;
  console.log("app.js calling ep");
  fetchAction(url_new)
  .then(function(response) {
      return response.json();
  })
  .then(function(result) {
      console.log(result);
      /*console.log("result:"+result.username);
      console.log(JSON.stringify(result.hasura_id));
          
          res_username= JSON.stringify(result.username);
          res_username1= res_username.substring(1,res_username.length-1);
          res_password1= JSON.stringify(body.data.password);
          res_password= res_password1.substring(1,res_password1.length-1);
         
          res_id= JSON.stringify(result.hasura_id);
      })
   .catch(function(error) {

              console.log('Request Failed locally  6' + error);
          });
}


app.get('/testing', function(req, res){
  testing();
  res.send({"message":"done"});

});*/

app.get('/APIEP_Likes/:like_user_id/:likeby_user_id', function(req, res){
  
  var User_id = req.params.like_user_id;
  var likeby_user_id = req.params.likeby_user_id;
  console.log(User_id);
  console.log(likeby_user_id);
  console.log("Inside server");
  {
    UpdateLikesTable(User_id, likeby_user_id, res);
  Match_is_present(User_id,likeby_user_id)
     
    
  }
 var resp={
    "message": "API call successful"
  }

  
  res.send(resp);
 
});
//your routes here
function Match_is_present(User_id,likedBy_user_id){
  console.log("function match present called");
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 1ad19463a246363739193dd5750da22a5aefe4e1a3350862"
    }
};

var body = {
    "type": "select",
    "args": {
        "table": "LikedBy_SuperLikedBy",
        "columns": [
            "pkLikedBy"
        ],
        "where": {
            "$and": [
                {
                    "User_id": {
                        "$eq": likedBy_user_id
                    }
                },
                {
                    "LikedBy_User_id": {
                        "$eq": User_id
                    }
                }
            ]
        }
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  
  console.log(result.length);
  if(result.length!=0){
    insertmatch(User_id,likedBy_user_id);
  
  }

  
})
.catch(function(error) {
  
  console.log('Request Failed at server 1' + error);
});
}

function insertmatch(User_id,likedBy_user_id){
var matchname1="";
var matchname2="";
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 1ad19463a246363739193dd5750da22a5aefe4e1a3350862"
    }
};

var body = {
    "type": "select",
    "args": {
        "table": "User",
        "columns": [
            "User_name"
        ],
        "where": {
            "User_id": {
                "$eq": User_id
            }
        }
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)

.then(function(response) {
  return response.json();
})

.then(function(result) {
   var matchname=JSON.stringify(result[0].User_name);
   matchname1=matchname.substring(1,matchname.length-1);
  console.log("match1:"+matchname1);

var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 1ad19463a246363739193dd5750da22a5aefe4e1a3350862"
    }
};

var body = {
    "type": "select",
    "args": {
        "table": "User",
        "columns": [
            "User_name"
        ],
        "where": {
            "User_id": {
                "$eq": likedBy_user_id
            }
        }
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)

.then(function(response) {
  return response.json();
})
.then(function(result) {
  var match=JSON.stringify(result[0].User_name);
  matchname2=match.substring(1,match.length-1);
  console.log("match2:"+matchname2);

var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 1ad19463a246363739193dd5750da22a5aefe4e1a3350862"
    }
};
console.log("names:"+matchname1+matchname2);
var body = {
    "type": "insert",
    "args": {
        "table": "Match",
        "objects": [
            {
                "matching_username2": matchname2,
                "matching_username1": matchname1,
                "matching_user_id1": User_id,
                "matching_user_id2": likedBy_user_id
            }
        ]
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)

.then(function(response) {
  return response.json();
})
.then(function(result) {
  console.log("match inserted:"+JSON.stringify(result.affected_rows));
})
.catch(function(error) {
  console.log('Request Failed at server 4' + error);
});

})
.catch(function(error) {
  console.log('Request Failed at server 2' + error);
});

})

.catch(function(error) {
 
  console.log('Request Failed at server at server 3' + error);
});


}


function UpdateLikesTable(user_id, likedBy_user_id, res){
  console.log(url);
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 1ad19463a246363739193dd5750da22a5aefe4e1a3350862"
    }
};


var body = {
    "type": "insert",
    "args": {
        "table": "LikedBy_SuperLikedBy",
        "objects": [
            {
                "User_id": user_id,
                "LikedBy_User_id": likedBy_user_id
            }
        ]
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(result) {
  console.log(result);
})
.catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 5' + error);
});
  
 

}

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


