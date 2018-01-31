var express = require('express');
var app = express();
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var isNumber = require('is-number');
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

app.get('/APIEP_Likes', function(req, res){
  var User_id = req.body.like_user_id;
  var likeby_user_id = req.body.likeby_user_id;
  console.log("Inside server");
  /*if(isNumber(User_id) && isNumber(likeby_user_id))*/{
    UpdateLikesTable(User_id, likeby_user_id, res);
    if(Match_is_present(User_id,likedby_user_id))
      insertmatch(User_id,likedby_user_id);
    
  }/* else {
    res.send("One or more inputs is invalid (Should be numbers)");
  }*/
});
//your routes here
function Match_is_present(User_id,likedBy_user_id){
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
  if (result!='[]')
    return true;
  else return false;
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed at server 1' + error);
});
}

function insertmatch(user_id,likedBy_user_id){
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
                "$eq": user_id
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
  matchname1=result.User_name;
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed at server 2' + error);
});

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
  matchname2=result.User_name;
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed at server at server 3' + error);
});

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
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed at server 4' + error);
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
  console.log('Request Failed at server 5' + error);
});
  res.send("API Call successfull");
}

app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


