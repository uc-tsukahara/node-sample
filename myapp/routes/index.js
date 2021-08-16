var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

  router.get('/login', (req, res, next) => {
    var data = {
       title:'ログイン画面',
       content:''
    }
    res.render('login', data);
  });
  
  router.post('/login', (req, res, next) => {
    models.USER_TBL.findOne({
      where:{
        userName:req.body.userName,
        password:req.body.password,
      }
    }).then(usr=>{
      if (usr != null) {
        req.session.login = usr;
        let back = req.session.back;
        if (back == null){
          back = 'login';
        }
        res.redirect(back);
      } else {
        var data = {
          title:'ログイン画面',
          content:'名前かパスワードに問題があります。再度入力下さい。'
        }
        res.render('login', data);
      }
    })
  });

module.exports = router;
