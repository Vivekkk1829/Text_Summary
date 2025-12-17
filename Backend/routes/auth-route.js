const express =require('express')
const {registerUser, loginUser, authMiddleware}=require('../controllers/auth-controller.js')
const router= express.Router()

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/check-auth',authMiddleware,(req,res)=>{
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
})

module.exports=router;