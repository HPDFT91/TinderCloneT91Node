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


function UpdateLikesTable(user_id, likedBy_user_id,auth,res){
  console.log(url);
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth
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
   Match_is_present(user_id,likedBy_user_id,auth,res);
})
.catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 5' + error);
});
  
 

}




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

app.post('/APIEP_Signup_Username', function(req, res){
  var username = req.body.data.username;
  var password = req.body.data.password;
  if (!username.trim() || !password.trim()) {
    res.send("One or more fields is empty!");
  } else {
    Signup_Username(username, password, res);
  }
});



app.get('/APIEP_Likes/:like_user_id/:likeby_user_id/:auth_key', function(req, res){
  var auth=req.params.auth_key;
  var User_id = req.params.like_user_id;
  var likeby_user_id = req.params.likeby_user_id;
  console.log(User_id);
  console.log(likeby_user_id);
  console.log("Inside server");
  if((User_id) && (likeby_user_id)){
      UpdateLikesTable(User_id, likeby_user_id,auth, res);
    
  }
  else{
    res.send({"message":"Error in likes"});
  }
  
 
});

app.post('/APIEP_Login_Username', function(req, res){
  var username = req.body.data.username;
  var password = req.body.data.password;
  if (!username.trim() || !password.trim()) {
    res.send("One or more fields is empty!");
  } else {
    Login_Username(username, password, res);
  }
});


app.post('/APIEP_Logout', function(req, res){
  var auth = (req.body.auth_key);
  console.log(auth);
  if (!auth.trim()) {
    res.send("A valid <b>auth_token</b> must be provided!");
  } else {
    Logout(auth, res);
  }
});


//Functions:








function Signup_Username(username, password, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
  };

  var body = {
      "provider": "username",
      "data": {
          "username": username,
          "password": password
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_signup, requestOptions,res)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(JSON.stringify(result));
    res.send(result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
    res.send('Request Failed:' + error);
  });
}

function Login_Username(username, password, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json"
    }
  };

  var body = {
      "provider": "username",
      "data": {
          "username": username,
          "password": password
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url_login, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(JSON.stringify(result));
    res.send(result);
  })
  .catch(function(error) {
    res.send(error);
    console.log('Request Failed:' + error);
  });
}

function Logout(auth, res){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth
    }
  };

  fetchAction(url_logout, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    res.send(result);
  })
  .catch(function(error) {
    res.send(error);
    console.log('Request Failed:' + error);
  });
}


function Match_is_present(User_id,likedBy_user_id,auth,res){
  console.log("function match present called");
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth
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
    insertmatch(User_id,likedBy_user_id,auth,res);
  
  }
  console.log(result);
})
.catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 1' + error);

});
}

function insertmatch(User_id,likedBy_user_id,auth,res){
var matchname1="";
var matchname2="";
var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth
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
        "Authorization": "Bearer "+auth
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
        "Authorization": "Bearer "+auth
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
  res.send(result);
  console.log("match inserted:"+JSON.stringify(result.affected_rows));
})
.catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 4' + error);
});

})
.catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 2' + error);
});

})

.catch(function(error) {
 res.send(error);
  console.log('Request Failed at server at server 3' + error);
});


}



app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


