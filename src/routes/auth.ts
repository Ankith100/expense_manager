import express from 'express'
import { authController } from '../controllers/auth'

const router = express.Router()

router.get("/register", authController.registerUser)
router.get("/login", authController.loginUser)

export default router