const express = require('express')
// 引入路由模組
const router = express.Router()

const home = require('./modules/home')
const Restaurant = require('./modules/restaurants')
const { authenticator } = require('../middleware/auth')
const sort = require('./modules/sort')
const users = require('./modules/users')
const auth = require('./modules/auth')



router.use('/restaurants', authenticator, Restaurant)
router.use('/users', users)
router.use('/auth', auth)
router.use('/sort', sort)
router.use('/', authenticator, home)



module.exports = router