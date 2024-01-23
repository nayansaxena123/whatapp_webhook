const express = require("express");
const app = express();
const body_parser = require('body-parser');
const port = 8800;
var xhub = require('express-x-hub');
var received_updates = [];
let sendersnum;
let sendersMsg;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb+srv://nayansaxena123:nynquad@quadrafortweb.p5zncnb.mongodb.net/?retryWrites=true&w=majority').then(() => console.log('Mongo DB connected'));


const msgSchema = new mongoose.Schema({
  name: String,
  number: String,
  message: [Schema.Types.Mixed]
},
  {
    strict: false
  }
  ,
  {
    timestamps: true
  })

mongoose.model('replyMsg', msgSchema)

const mSchema = mongoose.model('replyMsg', msgSchema)


app.use(xhub({ algorithm: 'sha1', secret: "36246e7dd97d4b4c0c1bb44a33a334a5" }));



app.get("/whatsapp_webhook", (req, res) => {
  // let mode=req.query["hub.mode"];
  // let challange=req.query["hub.challenge"];
  // let token=req.query["hub.verify_token"];
  console.log('test')


  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == '12345@quadra'
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }


  // const mytoken="12345@quadra"

  // if(mode=="subscribe" && token=="12345@quadra"){
  //     res.status(200).send(challange);
  //     console.log(JSON.stringify(req.body,'response'));
  // }else{
  //     res.status(403);
  // }
  res.send("Hello World!");
});

async function finduserindb() {
  let user = await mSchema.findOne({ number: sendersnum })
  console.log(user, 'user')

  if (user == null) {
    console.log('not found');
    async function test() {
      await mSchema.create({
        name: "whatsapp user",
        number: sendersnum,
        message: [{
          from: 'whatsapp user',
          msg: sendersMsg,
          mark: 'unread'

        }]
      })
    }
    test();
  } else {
    async function tst() {
      await mSchema.updateOne(
        { number: sendersnum },
        {
          $push: {
            message: {
              from: 'whatsapp user',
              msg: sendersMsg
            }
          }
        }
      )
    }
    tst();
  }
}


app.post('/whatsapp_webhook', (req, res) => {

  // let body_params=req.body
  console.log(req.body, 'req') // print all response

  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }

  // if(body_params.object){
  //     if(body_params.entry &&
  //          body_params.entry[0].changes && 
  //          body_params.entry[0].changes[0].value.messages &&
  //          body_params.entry[0].changes[0].value.messages[0] 
  //          ){
  //             let phn_no_id= body_params.entry[0].changes[0].value.metadata.phone_number_id;
  //             let from=body_params.entry[0].changes[0].value.messages[0].from;
  //             let msg_body=body_params.entry[0].changes[0].value.messages[0].text.body;
  //             console.group(phn_no_id,from,msg_body)

  //          }

  // }

  //messageFrom=req.body['data']['from'] // sender number
  //messageMsg=req.body['data']['body'] // Message text

  if (req.body == {}) {
    console.log("{}")
  } else {
    let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
    let from = req.body.entry[0].changes[0].value.messages[0].from;
    console.log('request header X-Hub-Signature validated', msg_body, from);
    sendersnum = from;
    sendersMsg = msg_body;
    console.log(sendersMsg, sendersnum, 'cus-naming')
    finduserindb();
    // Process the Facebook updates here
    received_updates.unshift(req.body);
    res.status(200);
  }






})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// const app1=express().use(body_parser.json)
