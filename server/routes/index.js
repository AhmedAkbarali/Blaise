var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/positions', function(req, res, next) {
  res.locals.connection.query('select * from positions', function (error, results, fields) {
    if(error) throw error;
    res.send(JSON.stringify(results));
  });
});

router.post('/positions/add', function(req, res, next) {
  res.locals.connection.query('insert into  values("+req.body.positions+")', function (error, results, fields) {
    if(error) throw error;
    res.send(JSON.stringify(results));
  });
});

module.exports = router;
