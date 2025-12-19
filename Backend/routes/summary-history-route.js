const express = require('express')

const router=express.Router();

const { authMiddleware } = require('../controllers/auth-controller.js');
const {getSummaryHistory}=require('../controllers/summary-history.js')


router.get('/',authMiddleware,getSummaryHistory);


module.exports= router;