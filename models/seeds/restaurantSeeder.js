const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

const restaurantJson = require('../../resteurant.json')


const SEED_USER = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'user2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', () => {
  // console.log('mongodb connected!')
  bcrypt
    .genSalt(10)
    .then(salt => {
      return Promise.all(Array.from(
        { length: SEED_USER.length },
        (_, i) => {
          return bcrypt.hash(SEED_USER[i].password, salt)
        }
      ))
    })
    .then(hash => {
      hash.forEach((element, index) => { SEED_USER[index].password = element })
      return Promise.all(Array.from(
        { length: SEED_USER.length },
        (_, i) => {
          return User.create(SEED_USER[i])
        }
      ))
    })
    .then(user => {
      console.log('user:', user)
      const restaurant = restaurantJson.results.slice(0, 6)
      return Promise.all(Array.from(
        { length: restaurant.length },
        (_, i) => {
          if (i < 3) {
            restaurant[i].userId = user[0]._id
            return Restaurant.create(restaurant[i])
          } else {
            restaurant[i].userId = user[1]._id
            return Restaurant.create(restaurant[i])
          }
        }
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit()
    })
})