import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { Sequelize, Model, DataTypes } from 'sequelize'

const app = express()
const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL
const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

class PingPong extends Model {}
PingPong.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'pingpong'
})
await PingPong.sync()

// const connectToDatabase = async () => {
//   try {
//     await sequelize.authenticate()
//     console.log('connected to the database')
//   } catch (err) {
//     console.log('failed to connect to the database')
//     console.log(err)
//     return process.exit(1)
//   }
// }

const pingpong = await PingPong.findByPk(1) || PingPong.build({count: 0})

console.log('count is :', pingpong.count)

app.use('/pingpong', async (req, res) => {

    console.log('pingpong-ing')
    console.log('count is now: ', pingpong.count)

    pingpong.count = pingpong.count++

    console.log('added 1 to pingpong count, now count is: ', pingpong.count)
    await pingpong.save()

    console.log('pingpong count saved.')
    
    res.send(`pong ${pingpong.count}`)  
})

app.use('/pings', (req, res) => {
    console.log('trying to get pings via network')
    res.send(count)
})

// const start = async () => {
//     await connectToDatabase()
    
// }
app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })

// start()