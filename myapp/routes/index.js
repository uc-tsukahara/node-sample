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
        res.redirect("/menu");
      } else {
        var data = {
          title:'ログイン画面',
          content:'名前かパスワードに問題があります。再度入力下さい。'
        }
        res.render('login', data);
      }
    })
  });

  router.get('/menu', (req, res, next) => {
    var data = {
       title:'メニュー画面',
       content:''
    }
    res.render('menu', data);
  });

  router.get('/reservation', (req, res, next) => {
    var data = {
       title:'会議室予約画面',
       content:''
    }
    res.render('reservation.ejs', data);
  });

  router.get('/reservation', (req, res, next) => {
    var data = {
       title:'会議室予約画面',
       content:''
    }
    res.render('reservation.ejs', data);
  });


  router.get('/roomInfo', (req, res, next) => {
    var data = {
       title:'設備情報',
       content:''
    }
    res.render('roomInfo.ejs', data);
  });

  router.get('/reservationInfo', (req, res, next) => {
    var data = {
       title:'予約状況確認画面',
       content:''
    }
    res.render('reservationInfo.ejs', data);
  });


module.exports = router;