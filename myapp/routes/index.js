var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require("moment");
var { check, validationResult } = require('express-validator');

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
  console.log("ログイン画面");
  models.USER_TBL.findOne({
    where:{
      userName:req.body.userName,
      password:req.body.password,
    }
  }).then(usr=>{
    if (usr != null) {
      req.session.userId = usr.id;
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
  console.log("メニュー画面");
  console.log("req : ", req.session);
  var data = {
      title:'メニュー画面'
  }
  res.render('menu', data);
});

router.get('/reservation', (req, res, next) => {
  console.log("会議室予約画面");
  models.SETSUBI_TBL.findAll({
    include: [{
      model:  models.KYOTEN_TBL,
      required: true
  }]
  }).then(setsubi=>{
      var data = {
        title:'会議室予約画面',
        setsubi:setsubi,
        content:"",
        form:{startDate: "", endDate: "", purpose: ""}
      }
      res.render('reservation.ejs', data);
  })
});

router.post('/reservation', [
  check('startDate','日時（始）が未入力です').notEmpty(),
  check('endDate','日時（終）が未入力です').notEmpty()
],(req, res, next) => {
  //入力チェック
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    
  }
  //予約重複チェック
  models.RESERVATION_TBL.findOne({
    where: {
      setsubiId: req.body.setsubi,
      startDateTime: {
        [models.Sequelize.Op.lte]: req.body.startDate
      },
      endDateTime: {
        [models.Sequelize.Op.gte]: req.body.endDate
      }
    }
  }).then(resv => {
    if (resv != null) {
      models.SETSUBI_TBL.findAll({
        include: [{
          model:  models.KYOTEN_TBL,
          required: true
      }]
      }).then(setsubi=>{
          var data = {
            title:'会議室予約画面',
            setsubi:setsubi,
            content: '予約情報が重複しています。',
            form: req.body
          }
          res.render('reservation.ejs', data);
      })      
    } else {
      console.log(moment.utc(req.body.startDate).format());
      console.log(moment.utc(req.body.endDate).format());
       models.RESERVATION_TBL.create({
        userId:req.session.userId, 
        startDateTime:moment.utc(req.body.startDate).format(),
        endDateTime:moment.utc(req.body.endDate).format(),
        bikou:req.body.purpose,
        setsubiId:req.body.setsubi
      });
      models.SETSUBI_TBL.findAll({
        include: [{
          model:  models.KYOTEN_TBL,
          required: true
      }]
      }).then(setsubi=>{
          var data = {
            title:'会議室予約画面',
            setsubi:setsubi,
            content:'予約が正常に完了しました。',
            form:{startDate: "", endDate: "", purpose: ""}
          }
          res.render('reservation.ejs', data);
      })
    }
  })
});

router.get('/roomInfo', (req, res, next) => {
  var data = {
      title:'設備情報'
  }
  res.render('roomInfo.ejs', data);
});

router.get('/reservationInfo', (req, res, next) => {
  var data = {
      title:'予約状況確認画面'
  }
  res.render('reservationInfo.ejs', data);
});


module.exports = router;
