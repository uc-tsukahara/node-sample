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
  console.log("session:", req.session.userId);
  if (!req.session.userId) {req.url = '/login'}
  var data = {
      title:'メニュー画面'
  }
  res.render('menu', data);
});

router.get('/reservation', (req, res, next) => {
  console.log("session:", req.session.userId);
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
  console.log("sessionID:" ,req.session.userId);
  console.log("sessionID:" ,req.session.userId === "undefined");
 //セッションIDが空だったらログイン画面に戻る
  if (!req.session.userId) {
    console.log("セッション切れ");
    res.redirect('/login');
  }
  //入力チェック
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
      var result = '<ul class="text-danger">';
      var result_arr = errors.array();
      for(var n in result_arr) {
        result += '<li>' + result_arr[n].msg + '</li>'
      }
      models.SETSUBI_TBL.findAll({
        include: [{
          model:  models.KYOTEN_TBL,
          required: true
      }]
      }).then(setsubi=>{
          var data = {
            title:'会議室予約画面',
            setsubi:setsubi,
            content: result,
            form: req.body
          }
          res.render('reservation.ejs', data);
      })      
  }
  //予約重複チェック
  models.RESERVATION_TBL.findOne({
    where: {
      setsubiId: req.body.setsubi,
      startDateTime: {
        [models.Sequelize.Op.lte]: moment.utc(req.body.startDate).format()
      },
      endDateTime: {
        [models.Sequelize.Op.gte]: moment.utc(req.body.endDate).format()
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
  console.log("session:", req.session.userId);
  //セッションIDが空だったらログイン画面に戻る
  if (!req.session.userId) {
    console.log("セッション切れ");
    res.redirect('/login');
  }
  models.SETSUBI_TBL.findAll({
    include: [{
      model:  models.KYOTEN_TBL,
      required: true
  }]
  }).then(setsubi=>{
      var data = {
        title:'設備情報',
        setsubi:setsubi,
        content:"",
      }
      res.render('roomInfo.ejs', data);
  })
});

//設備情報登録画面 遷移
router.get('/roomRegist', (req, res, next) => {
  console.log("session:", req.session.userId);
  models.KYOTEN_TBL.findAll({
  }).then(kyoten=>{
      var data = {
        title:'設備情報(登録)',
        kyoten:kyoten,
        content:"",
        form:{setsubi: ""}
      }
      res.render('roomRegist.ejs', data);
  })
});

//設備情報登録画面　登録
router.post('/roomRegist', [
  check('setsubi','設備が未入力です').notEmpty()
],(req, res, next) => {
  console.log("session:", req.session.userId);
  //入力チェック
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
      var result = '<ul class="text-danger">';
      var result_arr = errors.array();
      for(var n in result_arr) {
        result += '<li>' + result_arr[n].msg + '</li>'
      }
      models.KYOTEN_TBL.findAll({
      }).then(kyoten=>{
          var data = {
            title:'設備情報(登録)',
            kyoten:kyoten,
            content: result,
            form: req.body
          }
          res.render('roomRegist.ejs', data);
      })      
  }
  
  //登録処理
  models.SETSUBI_TBL.create({
    setsubiName:req.body.setsubi, 
    kyotenId:req.body.kyoten
  });
  models.KYOTEN_TBL.findAll({
  }).then(kyoten=>{
      var data = {
        title:'設備情報(登録)',
        kyoten:kyoten,
        content:'登録が正常に完了しました。',
        form:{setsubi: ""}
      }
      res.render('roomRegist.ejs', data);
  })
});

//設備情報更新画面 遷移
router.post('/roomUpdate', (req, res, next) => {
  console.log("session:", req.session.userId);
  var setsubi = "";
  models.SETSUBI_TBL.findOne({
    where: {
      id: [req.body.id]
    }
  }).then(setsubiData=>{
    setsubi = setsubiData;
  });

  models.KYOTEN_TBL.findAll({
  }).then(kyoten=>{
      var data = {
        title:'設備情報(更新)',
        kyoten:kyoten,
        content:"",
        form:{
          setsubi: setsubi.setsubiName, 
          kyoten: setsubi.kyotenId, 
          id: req.body.id
        }
      }
      res.render('roomEdit.ejs', data);
  })
});

//設備情報更新画面　更新
router.post('/roomEdit', [
  check('setsubi','設備が未入力です').notEmpty()
],(req, res, next) => {
  console.log("session:", req.session.userId);
  //入力チェック
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
      var result = '<ul class="text-danger">';
      var result_arr = errors.array();
      for(var n in result_arr) {
        result += '<li>' + result_arr[n].msg + '</li>'
      }
      models.KYOTEN_TBL.findAll({
      }).then(kyoten=>{
          var data = {
            title:'設備情報(更新)',
            kyoten:kyoten,
            content: result,
            form: req.body
          }
          res.render('roomEdit.ejs', data);
      })      
  }
  
  //更新処理
  models.SETSUBI_TBL.update(
    {
      setsubiName:req.body.setsubi, 
      kyotenId:req.body.kyoten
    }
    ,
    {
      where: {id: req.body.id}
    }
  );
  models.SETSUBI_TBL.findAll({
    include: [{
      model:  models.KYOTEN_TBL,
      required: true
  }]
  }).then(setsubi=>{
      var data = {
        title:'設備情報',
        setsubi:setsubi,
        content:"更新が正常に完了しました",
      }
      res.render('roomInfo.ejs', data);
  })
});

//設備情報削除
router.post('/roomDelete', (req, res, next) => {
  console.log("session:", req.session.userId);
    models.SETSUBI_TBL.destroy({
      where: {
        id: [req.body.id]
      }
    }).then(()=>{
      models.SETSUBI_TBL.findAll({
          include: [{
            model:  models.KYOTEN_TBL,
            required: true
        }]
        }).then(setsubi=>{
            var data = {
              title:'設備情報',
              setsubi:setsubi,
              content:'データの削除が完了しました',
              form:{startDate: "", endDate: "", purpose: ""}
            }
            res.render('roomInfo.ejs', data);
        })
    })
})

//予約状況確認画面表示
router.get('/reservationInfo', (req, res, next) => {
  console.log("session:", req.session.userId);
//セッションIDが空だったらログイン画面に戻る
if (!req.session.userId) {
  console.log("セッション切れ");
  res.redirect('/login');
}
  models.RESERVATION_TBL.findAll({
    include: [{
      model:  models.SETSUBI_TBL,
      required: true,
      include: [{
        model:  models.KYOTEN_TBL,
      required: true,
      }]
    },
    {
      model:  models.USER_TBL,
        required: true
    }]
  }).then(reservation=>{
      var data = {
        title:'予約状況確認',
        reservation:reservation,
        content:"",
        moment: moment,
        userName:"",
        form: req.body,
        userId:req.session.userId
      }
      res.render('reservationInfo.ejs', data);
  })
});

//予約絞り込み
router.post('/reservationSearch', (req, res, next) => {
  console.log("session:", req.session.userId);
  console.log(req.body);
  models.RESERVATION_TBL.findAll({
    where:{
      userId: req.body.userId
    },
    include: [{
      model:  models.SETSUBI_TBL,
      required: true,
      include: [{
        model:  models.KYOTEN_TBL,
      required: true,
      }]
    },
    {
      model:  models.USER_TBL,
        required: true
    }]
  }).then(reservation=>{
      var data = {
        title:'予約状況確認',
        reservation:reservation,
        content:"",
        moment: moment,
        userName:"",
        form: req.body,
        userId:req.session.userId
      }
      res.render('reservationInfo.ejs', data);
  })
});

//予約更新画面遷移
router.post('/reservationUpdate', (req, res, next) => {
  console.log("session:", req.session.userId);
  var reservationData = "";
  models.RESERVATION_TBL.findAll({
    where:{
      id: req.body.id
    },
    include: [{
      model:  models.SETSUBI_TBL,
      required: true,
      include: [{
        model:  models.KYOTEN_TBL,
      required: true,
      }]
    },
    {
      model:  models.USER_TBL,
        required: true
    }]
  }).then(reservation=>{
    reservationData = reservation;
  });

  models.SETSUBI_TBL.findAll({
    include: [{
      model:  models.KYOTEN_TBL,
      required: true
  }]
  }).then(setsubi=>{
      var data = {
        title:'会議室予約(編集)',
        setsubi:setsubi,
        content:"",
        moment: moment,
        form:{
          setsubi:reservationData[0].setsubiId,
          startDate: reservationData[0].startDateTime, 
          endDate:reservationData[0].endDateTime, 
          purpose: reservationData[0].bikou,
          id: req.body.id
        }
      }
      console.log("reservationData:", reservationData[0].startDateTime);
      res.render('reservationEdit.ejs', data);
  })
});

//予約更新
router.post('/reservationEdit', [
  check('startDate','日時（始）が未入力です').notEmpty(),
  check('endDate','日時（終）が未入力です').notEmpty()
],(req, res, next) => {
  console.log("更新チェック", req.body.id);
 //セッションIDが空だったらログイン画面に戻る
  if (!req.session.userId) {
    console.log("セッション切れ");
    res.redirect('/login');
  }
  //入力チェック
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
      var result = '<ul class="text-danger">';
      var result_arr = errors.array();
      for(var n in result_arr) {
        result += '<li>' + result_arr[n].msg + '</li>'
      }
      models.SETSUBI_TBL.findAll({
        include: [{
          model:  models.KYOTEN_TBL,
          required: true
      }]
      }).then(setsubi=>{
        var data = {
          title:'会議室予約(編集)',
          setsubi:setsubi,
          content:"",
          moment: moment,
          form:req.body
        }
        res.render('reservationEdit.ejs', data);
      })      
  }
  //予約重複チェック
  models.RESERVATION_TBL.findOne({
    where: {
      setsubiId: req.body.setsubi,
      startDateTime: {
        [models.Sequelize.Op.lte]: moment.utc(req.body.startDate).format()
      },
      endDateTime: {
        [models.Sequelize.Op.gte]: moment.utc(req.body.endDate).format()
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
          title:'会議室予約(編集)',
          setsubi:setsubi,
          content:"予約情報が重複しています。",
          moment: moment,
          form:req.body
        }
        res.render('reservationEdit.ejs', data);
      })      
    } else {
      console.log("更新開始", req.body.id);
       models.RESERVATION_TBL.update({
        userId:req.session.userId, 
        startDateTime:moment.utc(req.body.startDate).format(),
        endDateTime:moment.utc(req.body.endDate).format(),
        bikou:req.body.purpose,
        setsubiId:req.body.setsubi
      }
      ,
    {
      where: {id: req.body.id}
    });
          res.redirect('/reservationInfo');
    }
  })
});

//予約削除
router.post('/reservationDelete', (req, res, next) => {
  console.log("session:", req.session.userId);
  models.RESERVATION_TBL.destroy({
    where: {
      id: [req.body.id]
    }
  }).then(()=>{
    models.RESERVATION_TBL.findAll({
      include: [{
        model:  models.SETSUBI_TBL,
        required: true,
        include: [{
          model:  models.KYOTEN_TBL,
        required: true,
        }]
      },
      {
        model:  models.USER_TBL,
          required: true
      }]
    }).then(reservation=>{
        var data = {
          title:'予約状況確認',
          reservation:reservation,
          content:"データの削除が完了しました",
          moment: moment,
          userName:"",
          form: req.body,
          userId:req.session.userId
        }
        res.render('reservationInfo.ejs', data);
    })
  })
})
module.exports = router;
