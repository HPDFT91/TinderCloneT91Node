var express = require('express');
var app = express();
var path = require('path');
var fetchAction =  require('node-fetch');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var multer  = require('multer');
var fs = require("fs");
var imagePath;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    imagePath = Date.now() + path.extname(file.originalname);
    cb(null, imagePath) //Appending .jpg
  }
})
var upload = multer({ storage: storage });

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
var url_file_upload = "https://filestore.bleed71.hasura-app.io/v1/file";



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
    res.status(500).send({ error:"One or more fields is empty!"});
  } else {
    Signup_Username(username, password, res);
  }
});

app.get('/APIEP_GetPictures/:curruserid/:auth_key',function(req,res){

  var userid=req.params.curruserid;
  var auth=req.params.auth_key;

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
            "userImage1",
            "userImage2",
            "userImage3"
        ],
        "where": {
            "User_id": {
                "$eq": userid
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
  res.send(result);
  console.log(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
});


});

app.get('/APIEP_MatchList/:curruserid/:auth_key',function(req,res){
 var MatchList = [];
var userid=req.params.curruserid;
var auth=req.params.auth_key;
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
        "table": "Match",
        "columns": [
            "matching_username1",
            "fileid_user1"
        ],
        "where": {
            "matching_user_id2": {
                "$eq": userid
            }
        }
    }
};
        requestOptions.body = JSON.stringify(body);
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {                           //console.log(result);
            Array.from(result).forEach(function(name){
            MatchList.push({name:name.matching_username1,fileid:name.fileid_user1});
            });

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
        "table": "Match",
        "columns": [
            "matching_username2",
            "fileid_user2"
        ],
        "where": {
            "matching_user_id1": {
                "$eq": userid
            }
        }
    }
};

 requestOptions.body = JSON.stringify(body);
        fetchAction(url, requestOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {                            //console.log(result);
            Array.from(result).forEach(function(name){
            MatchList.push({name:name.matching_username2,fileid:name.fileid_user2});
            });
            res.send(MatchList);
          })
          .catch(function(error) {
          console.log('Request Failed:' + error);
          });

         })
        .catch(function(error) {
          console.log('Request Failed:' + error);
        });
      });




app.get('/APIEP_Likes/:like_user_id/:likeby_user_id/:auth_key', function(req, res){
  var auth=req.params.auth_key;
  var User_id = req.params.like_user_id;
  var likeby_user_id = req.params.likeby_user_id;
  console.log(auth);
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




app.get('/APIEP_UserDetailsforSwipe/:userid/:gender/:city/:auth',function(req,res){
 var gen=req.params.gender;
var user_id=req.params.userid;
var city=req.params.city;
var auth=req.params.auth;
var ids=[];
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
            "User_id"
        ],
        "where": {
            "LikedBy_User_id": {
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
console.log(result);
   Array.from(result).forEach(function(name){
            ids.push(name.User_id);
            });
  console.log(ids);

var body = {
    "type": "select",
    "args": {
        "table": "User",
        "columns": [
            "User_id",
            "User_name",
            "fileid"
        ],
        "where": {
            "$and": [
                {
                    "Gender": {
                        "$nlike": gen
                    }
                },
                {
                    "City": {
                        "$like":  city
                    }
                },
                {
                    "User_id": {
                        "$nin": ids
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
  console.log(result);
  res.send(result);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
});
 
})
.catch(function(error) {
  console.log('Request Failed:' + error);
});


});




app.post('/APIEP_Login_Username', function(req, res){
  var username = req.body.data.username;
  var password = req.body.data.password;
  if (!username.trim() || !password.trim()) {
    res.status(500).send({ error:"One or more fields is empty!"});
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



app.post('/APIEP_PP', upload.any(), function(req, res, next){
  var image=fs.readFileSync(req.files[0].destination+'/'+imagePath);
  var imageType = req.files[0].mimetype;
  var auth_token = req.body.user_auth_token;
  if(!auth_token.trim()){
    res.send("Invalid Auth Token");
  } else {
    UploadPP(image, imageType, auth_token, res);
  }
});

//Extra Images of users-Extended Idea


app.post('/APIEP_UserImage1', upload.any(), function(req, res, next){
  var image=fs.readFileSync(req.files[0].destination+'/'+imagePath);
  var imageType = req.files[0].mimetype;
  var auth_token = req.body.user_auth_token;
  if(!auth_token.trim()){
    res.send("Invalid Auth Token");
  } else {
    UploadUserImage1(image, imageType, auth_token, res);
  }
});


app.post('/APIEP_UserImage2', upload.any(), function(req, res, next){
  var image=fs.readFileSync(req.files[0].destination+'/'+imagePath);
  var imageType = req.files[0].mimetype;
  var auth_token = req.body.user_auth_token;
  if(!auth_token.trim()){
    res.send("Invalid Auth Token");
  } else {
    UploadUserImage2(image, imageType, auth_token, res);
  }
});


app.post('/APIEP_UserImage3', upload.any(), function(req, res, next){
  var image=fs.readFileSync(req.files[0].destination+'/'+imagePath);
  var imageType = req.files[0].mimetype;
  var auth_token = req.body.user_auth_token;
  if(!auth_token.trim()){
    res.send("Invalid Auth Token");
  } else {
    UploadUserImage3(image, imageType, auth_token, res);
  }
});



//Functions:

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




function UpdateUsersTablePP(hasura_id, file_id, res, prev_result){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer dc6f122262155a058d260df14f261fad1314acf3a5bb9035"
    }
  };

  var body = {
      "type": "update",
      "args": {
          "table": "User",
          "where": {
              "User_id": {
                  "$eq": hasura_id
              }
          },
          "$set": {
              "fileid": file_id
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    res.send(prev_result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}




function UpdateUsersTableImage1(auth_token,hasura_id, file_id, res, prev_result){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+auth_token
    }
  };

  var body = {
      "type": "update",
      "args": {
          "table": "User",
          "where": {
              "User_id": {
                  "$eq": hasura_id
              }
          },
          "$set": {
              "userImage1": file_id
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    res.send(prev_result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}



function UpdateUsersTableImage2(hasura_id, file_id, res, prev_result){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 9c97e7194513e57ebbb203a663037676e92a1600804089b4"
    }
  };

  var body = {
      "type": "update",
      "args": {
          "table": "User",
          "where": {
              "User_id": {
                  "$eq": hasura_id
              }
          },
          "$set": {
              "userImage2": file_id
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    res.send(prev_result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}



function UpdateUsersTableImage3(hasura_id, file_id, res, prev_result){
  var requestOptions = {
    "method": "POST",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 9c97e7194513e57ebbb203a663037676e92a1600804089b4"
    }
  };

  var body = {
      "type": "update",
      "args": {
          "table": "User",
          "where": {
              "User_id": {
                  "$eq": hasura_id
              }
          },
          "$set": {
              "userImage3": file_id
          }
      }
  };

  requestOptions.body = JSON.stringify(body);

  fetchAction(url, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    res.send(prev_result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}




function UploadPP(image, imageType, auth_token, res){
  var requestOptions = {
    method: 'POST',
    headers: {
        "Authorization": "Bearer "+auth_token,
        "content-type" : imageType
    },
    body: image
  }

  fetchAction(url_file_upload, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    UpdateUsersTablePP(result.user_id, result.file_id, res, result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}




function UploadUserImage1(image, imageType, auth_token, res){
  var requestOptions = {
    method: 'POST',
    headers: {
        "Authorization": "Bearer "+auth_token,
        "content-type" : imageType
    },
    body: image
  }

  fetchAction(url_file_upload, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    UpdateUsersTableImage1(auth_token,result.user_id, result.file_id, res, result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}



function UploadUserImage2(image, imageType, auth_token, res){
  var requestOptions = {
    method: 'POST',
    headers: {
        "Authorization": "Bearer "+auth_token,
        "content-type" : imageType
    },
    body: image
  }

  fetchAction(url_file_upload, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    UpdateUsersTableImage2(result.user_id, result.file_id, res, result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}




function UploadUserImage3(image, imageType, auth_token, res){
  var requestOptions = {
    method: 'POST',
    headers: {
        "Authorization": "Bearer "+auth_token,
        "content-type" : imageType
    },
    body: image
  }

  fetchAction(url_file_upload, requestOptions)
  .then(function(response) {
    return response.json();
  })
  .then(function(result) {
    console.log(result);
    UpdateUsersTableImage3(result.user_id, result.file_id, res, result);
  })
  .catch(function(error) {
    console.log('Request Failed:' + error);
  });
}






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
 var status;
  requestOptions.body = JSON.stringify(body);
var pass= password;
  fetchAction(url_signup, requestOptions,res)
  .then(function(response) {
    status=response.status;
    console.log(status);
    return response.json();
  })
  .then(function(result) {
    if(status==200){var userdata=JSON.stringify(result);
  
            var res_username= JSON.stringify(result.username);
            var res_username1= res_username.substring(1,res_username.length-1);
            var res_password1= JSON.stringify(pass);
            var res_password= res_password1.substring(1,res_password1.length-1);
            var res_id= JSON.stringify(result.hasura_id);
          
           console.log("id:"+res_id);
           var url = "https://data.bleed71.hasura-app.io/v1/query";
            var requestOptions = {
                "method": "POST",
                "headers": {
                "Content-Type": "application/json"
                }
            };
            //console.log("role= "+ res_role);
            var body = {
                "type": "insert",
                "args": {
                "table": "User",
                "objects": [
                    {
                      "User_id": res_id,
                      "Password": res_password,
                      "User_name": res_username1,
                      
                        }
                    ]
                }
            };
      
            requestOptions.body = JSON.stringify(body);
            fetchAction(url, requestOptions)
            .then(function(response) {
          
                return response.json();
            })
            .then(function(result){
    
              var arr='['+userdata+','+JSON.stringify(result)+']';
          
              res.send(JSON.parse(arr));
         
            })
      
            .catch(function(error) {
            console.log('Request Failed:' + error);
            });}
            else{
              res.status(500).send({ error: "user exists" });
             console.log({"message":"user exists"});
            }

  })
  .catch(function(error) {

    console.log('Request Failed:' + error);
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
       status=response.status;
    console.log(status);
   return response.json()
  })
 .then(function(result) {
if(status==200){

    console.log(JSON.stringify(result));

   var auth=result.auth_token;
       var id=result.hasura_id;
        console.log(JSON.stringify(auth));
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
            "Gender",
            "City",
            "fileid"
        ],
        "where": {
            "User_id": {
                "$eq": id
            }
        }
    }
};

requestOptions.body = JSON.stringify(body);

fetchAction(url, requestOptions)
.then(function(response) {
  return response.json();
})
.then(function(resul) {
  console.log(resul);
arr='['+JSON.stringify(result)+','+JSON.stringify(resul[0])+']'
 // arr.put(result);
 // arr.put(resul);
  console.log(arr);
  res.send(arr);
})
.catch(function(error) {
  console.log('Request Failed:' + error);
});}
else{
  res.status(500).send({error:"wrong credentials"});
  console.log(status);
}

  })
  .catch(function(error) {
  
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
  else 
   { res.send(result);
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
var fileid_user1="";
var fileid_user2="";

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
            "User_name",
            "fileid"
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
   var fileid1=JSON.stringify(result[0].fileid);
   fileid_user1=fileid1.substring(1,fileid1.length-1);
   matchname1=matchname.substring(1,matchname.length-1);
  console.log("match1:"+matchname1+"fileid:"+fileid_user1);

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
            "User_name",
            "fileid"
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
  var fileid2=JSON.stringify(result[0].fileid);
   fileid_user2=fileid2.substring(1,fileid2.length-1);

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
                "matching_user_id2": likedBy_user_id,
                 "fileid_user1": fileid_user1,
                "fileid_user2": fileid_user2
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
}).catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 4' + error);
});

}).catch(function(error) {
  res.send(error);
  console.log('Request Failed at server 2' + error);
});

}).catch(function(error) {
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


