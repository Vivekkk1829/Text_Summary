const express = require('express')

const router=express.Router();
const {summariseText}=require('../controllers/summarise-controller.js')

router.post('/',summariseText);

module.exports= router;