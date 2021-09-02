var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require("moment");
var { check, validationResult } = require('express-validator');

router.post('/delete', (req, res, next) => {

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