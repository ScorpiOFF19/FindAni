const express = require("express")
const api = express()
const sqlite = require("sqlite3").verbose()
const cors = require("cors")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const path = require("path")
const port = process.env.PORT || 3001;
api.use(fileUpload())
api.use(bodyParser.json())
api.use(cors())

const db = new sqlite.Database('database.sqlite',(error)=>{
    if(error) throw "Не получилось подключиться к базе данных!"+error
    else console.log("База данных подключена!")
})

api.get("/", (req,res) => {
    res.send('hello world')
})

api.get("/pet", (req,res) => {
    db.all(`SELECT * FROM pet ORDER BY "id" DESC`, (err,rows) => {
        if(err){
            console.log(err)
            res.status(500).json("Ошибка работы с базой данных")
        }else{
            if(req.query.search){
                rows = rows.filter(item => item.name.toLowerCase().includes (req.query.search.toLowerCase()) ||
                item.city.toLowerCase().includes (req.query.search.toLowerCase()) ||
                item.story.toLowerCase().includes (req.query.search.toLowerCase()))
            }
            res.status(200).json(rows)
        }
    })
})

api.put("/pet", (req,res) => {
    res.send('hello world')
})

api.post("/pet", (req,res) => {
    if(!!req.body.link && !!req.body.story){
        if(!!req.files){
            const path = `/images/${new Date().getTime()}.${req.files.image.name.split('.')[req.files.image.name.split('.').length - 1]}`
            req.files.image.mv(path,(err)=>{
                if(err) return res.status(500).json({error: "Ошибка работы с файлами"})
                db.run(`INSERT INTO pet ("name","image","city","link","story") VALUES ('${req.body.name ? req.body.name : ''}','${path}','${req.body.city ? req.body.city : ''}','${req.body.link ? req.body.link : ''}','${req.body.story ? req.body.story : ''}')`,(dberr,data) => {
                    if(dberr) return res.status(500).json({error: "Ошибка работы с БД"})
                    res.status(200).json({message: 'Сохранено!'})
                })
            })
        }else{
            db.run(`INSERT INTO pet ("name","image","city","link","story") VALUES ('${req.body.name ? req.body.name : ''}','${req.body.image ? req.body.image : ''}','${req.body.city ? req.body.city : ''}','${req.body.link ? req.body.link : ''}','${req.body.story ? req.body.story : ''}')`,(dberr,data) => {
                if(dberr) return res.status(500).json({error: "Ошибка работы с БД"})
                res.status(200).json({message: 'Сохранено!'})
            })
        }
    }else {
        res.status(400).json({error: 'Один или несколько обязательных атрибутов отсутствуют'})
    }
})
api.use('/images',express.static(path.join(__dirname, 'images')))
api.listen(port,()=>{
    console.log('server listening on port 80');
})
