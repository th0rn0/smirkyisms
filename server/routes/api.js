var express = require('express');
var router = express.Router();

/* GET api page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/quote', function(req, res) {
  res.json(req);
});

module.exports = router;
