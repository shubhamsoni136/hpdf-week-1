var express = require('express');
var path = require('path');
var morgan = require('morgan');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var app = express();
var template=`<html>
<head>
  <title>Index</title>
</head>
<body>
  Enter data
  <input type="text" id="item">
  <input type="submit" value="submit" id='submit_btn'>
  <script>
  var submit = document.getElementById('submit_btn');
  submit.onclick =function(){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if(request.readyState === XMLHttpRequest.DONE){
        if(request.status===200){
          alert('data submitted successfully');
        }
        else{
          alert(request.responseText.toString());
        }
      }
    };
    x = document.getElementById('item').value;
    document.getElementById('item').value = "";
    request.open('POST','http://localhost:8080/submitdata',true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({"data":x}));
  };
 </script>
</body>
</html>`;
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine','ejs');
app.use(morgan('combined'));
app.use(function(req,res,next){
  console.log('conection from ip = '+req.ip+' to url = '+req.url);
  if(req.url === '/robot.txt') return res.status(403).render('default');
  next();
});
app.get('/',function(req,res){
  res.send('hello world - shubham');
});
var author,count1,count2,article;
app.get("/authors",function(req,res){
     var w="<html><ol>";
  request('https://jsonplaceholder.typicode.com/users', function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    author = JSON.parse(body);
    count1 = author.length;
  });
  request('https://jsonplaceholder.typicode.com/posts', function (error, response, body) {
    console.log('error:',error);
    console.log('statusCode:',response && response.statusCode);
    article = JSON.parse(body);
    count2 = article.length;
  });
  for(var i=0;i<count1;i++){
    var count3=0;
    for(var j=0;j<count2;j++){
      if(article[j].userId=== (i+1)){
        count3++;
      }
    }
    var m = author[i].name;
    w=w+`<li> ${m} has published ${count3} articles</li>`;
  };
  w=w+"</ol></html>";
  res.send(w);
});
app.get('/setcookie',function(req,res){
  var cookie = req.cookies;
  if(cookie.name===undefined||cookie.age===undefined){
    res.cookie('age',17,{maxAge:900000, httpOnly:true});
    res.cookie('name','shubham',{maxAge:900000,httpOnly:true});
    res.send("cookies set successfully");
  }
  else{
    res.send("cookies are already set");
  }
});
app.get('/getcookie',function(req,res){
  var cookie = req.cookies;
  if(cookie.name===undefined || cookie.age === undefined){
    res.send('coookies are not set first go and set cookies at <a href="http://localhost:8080/setcookie">set cookie</a>');
  }
  else{
    res.send('the values of cookies are <br> Name = '+ cookie.name +'<br> Age = '+cookie.age);
  }
});
app.get('/html',function(req,res){
  res.render('index');
});
app.get('/main.jpg',function(req,res){
  res.sendFile(path.join(__dirname,'assets/main.jpg'))
});
app.get('/input',function(req,res){
  res.send(template);
});
app.post('/submitdata',function(req,res){
  var data = req.body.data;
  console.log('recieved data is '+ data);
  res.send('data submitted successfully');
});
var port = 8080;
app.listen(port,function(){
  console.log(`imad app listening at port ${port}`);
});
