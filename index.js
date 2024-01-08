const express = require("express");
const app = express();
const body_parser=require('body-parser');
const port = 8800;



app.get("/whatsapp_webhook", (req, res) => {
    let mode=req.query["hub.mode"];
    let challange=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    const mytoken="12345@quadra"

    if(mode=="subscribe" && token=="12345@quadra"){
        res.status(200).send(challange);
        console.log(JSON.stringify(req.body,'response'));
    }else{
        res.status(403);
    }
  res.send("Hello World!");
});


app.post('/whatsapp_webhook', (req, res) => {

    let body_params=req.body
    console.log(JSON.stringify(body_params,null,2)) // print all response

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
    // res.status(200).end()
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// const app1=express().use(body_parser.json)
