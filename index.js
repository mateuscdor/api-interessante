const express = require('express')
const body = require('body-parser')
const e = require('./main')
const app = express()
const fs = require('fs')
let qrcode = require('qrcode')
const port = process.env.PORT | 3000;

let db = {}
fs.writeFile('./db/db.json',JSON.stringify(db),(err)=>{})

app.use(express.static("views"))
app.use(body.raw())
app.use(body.json())
app.use(body.urlencoded({extended:true}))

app.get('/', (req, res, next) => {
	let re = fs.readFileSync(__dirname + '/views/public/index.html',()=>{})
	res.send((''+re).replace('#{id}',e.create()))
});
app.post('/qr', async (req,res)=>{
	let qr = await e.get(req.body.id)
	if(qr == 'error'|| !qr) res.end('error')
	else{
		res.setHeader('content-type','image/png')
		res.send(await qrcode.toBuffer(qr))
	}
})
app.get('/qr', async (req,res)=>{
res.end('404 : method not true')
})

app.get('*', (req, res, next) => {
	res.status(201).send('Sorry, page not found');
	next();
});

app.listen(port, () => {
	console.log(`Server started at port ${port}`);
});