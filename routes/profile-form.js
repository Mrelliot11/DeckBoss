var express = require('express');
var router = express.Router();
require('dotenv').config();

/* GET profile form page */
router.get('/', function(req, res, next) {
  res.render('profile-form');
});


module.exports = router;

//Image preview
$("#defaultImage").onclick(function(e) {
  $("#imageProfile").onclick();
});
  
 function preview(uploader) {
   if(uploader.files && uploader.files[0]) {
     $('#defaultImage').attr('src', window.URL.createObjectURL(uploader.files[0]));
   }
 }
  
$('#imageProfile').onchange(function() {
  preview(this);
}); 
