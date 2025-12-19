const express = require('express')

const router=express.Router();
const {summariseText}=require('../controllers/summarise-controller.js');
const { authMiddleware } = require('../controllers/auth-controller.js');

router.post('/',authMiddleware,summariseText);

module.exports= router;