const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../lib/db.js");
const userMiddleware = require("../middleware/users.js");
const request = require("request");
const { json } = require("express");
var path = require("path");
const fs = require("fs");
const _ = require('lodash');
const schedule = require('node-schedule');

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");


var tempMsgs=[]



let scheduledJobs = {};

function sendSms(message,numbers){
console.error("sms Function")

    
    const postData = {
	
      "api_key" : process.env.tweetSmsApi ,
      "sender" :  process.env.tweetSmsSender,
      "message" : message ,
      "to":numbers.join(",")
    }
    
    const options = {
      url: 'https://www.tweetsms.ps/api.php/office/sendsms',
      method: 'POST',
      json: true,
      body: postData,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    request(options, (error, response, body) => {
      if (error) {
        console.error('SMSError:', error);
  
      } else {
        console.error('SMSResponse:', body);
  
  
    
      }
    });
  
  
  

}


function sendTemplate(message,numbers){


  numbers.forEach(mobile => {
    
  const postData = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": mobile,
    "type": "template",
    "template": {
      "name": "inquiry",
      "language": {
        "code": "ar"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": "صديقنا"
            },
            {
              "type": "text",
              "text": message
            },
          ]
        }
      ]
    }
  };
  
  const options = {
    url: 'https://graph.facebook.com/v17.0/'+process.env.facebookMobileId+'/messages',
    method: 'POST',
    json: true,
    body: postData,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer "+process.env.facebookToken
    }
  };
  
  request(options, (error, response, body) => {
    if (error) {
      console.error('Error:', error);

    } else {
      console.error('Response:', body);


      tempMsgs.push({
        messageId:body.messages[0].id||"",
        message:message
      })
    }
  });


  });


}

function sendHBDTemplate(name,mobile){



  const postData = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": mobile,
    "type": "template",
    "template": {
      "name": "HBD",
      "language": {
        "code": "ar"
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": name
            }
          ]
        }
      ]
    }
  };
  
  const options = {
    url: 'https://graph.facebook.com/v17.0/'+process.env.facebookMobileId+'/messages',
    method: 'POST',
    json: true,
    body: postData,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer "+process.env.facebookToken
    }
  };
  
  request(options, (error, response, body) => {
    if (error) {
      console.error('Error:', error);

    } else {
      console.error('Response:', body);


  
    }
  });



}



const poll = () => {
  // Cancel all jobs
  Object.values(scheduledJobs).forEach(job => {
    
    try{
      job.cancel()

    }
    catch{

    }
  });
  scheduledJobs = {};

  // Fetch new jobs from database
  db.query('SELECT * FROM scheduledmessagesMobile', (err, results) => {
    if (err) throw err;

    results.forEach(row => {
      const date = new Date(row.datetime);
      scheduledJobs[row.id] = schedule.scheduleJob(date, function() {
        if(row.messageType=="whatsapp")
        sendTemplate(row.message,JSON.parse(row.mobiles)||[])
        else if(row.messageType=="sms")
        sendSms(row.message,JSON.parse(row.mobiles)||[])

      });
    });
  });
};

poll();


let scheduledBD={}
const HBD = () => {
  // Cancel all jobs
  Object.values(scheduledBD).forEach(job => {
    
    try{
      job.cancel()

    }
    catch{

    }
  });
  scheduledBD = {};

  // Fetch new jobs from database
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) throw err;

    results.forEach(row => {
      const date = new Date(row.dob);
      scheduledBD[row.id] = schedule.scheduleJob(date, function() {


        sendHBDTemplate(row.name,row.mobile)
        

      });
    });
  });
};






router.post("/adminlogin", (req, res, next) => {
  const { email, password } = req.body;
  db.query(
    `SELECT * FROM admins WHERE (email=?);`,
    [email],
    (err, result) => {
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          status: "err",
          msg: "رقم الهاتف او كلمة المرور غير صحيحة",
        });
      }

      bcrypt.compare(password, result[0]["password"], (bErr, bResult) => {
        if (bErr) {
          return res.status(401).send({
            status: "err",

            msg: "رقم الهاتف او كلمة المرور غير صحيحة",
          });
        }

        if (bResult) {
          {
            const token = jwt.sign(
              {
                userId: result[0].id,
                role: "admin",
                
              },
              process.env.JWT_KEY,
              {
                expiresIn: "60d",
              }
            );
            db.query(
              `UPDATE admins SET lastlogin = now() WHERE id = '${result[0].id}'`
            );

            return res.status(200).send({
              status: "success",
              msg: "Logged In!",
              token,
            });
          }
        }

        return res.status(401).send({
          status: "err",
          msg: "رقم الهاتف او كلمة المرور غير صحيحة",
        });
      });
    }
  );
});
router.get("/getCampains", (req, res, next) => {
  db.query(
    "select * from campains where visible=1 order by id desc",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});

router.get("/getCustomers", (req, res, next) => {
  db.query(
    "select * from customers order by id desc",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});

router.post("/customerNote", (req, res, next) => {
  const {id,note}=req.body


  db.query(
    "update customers set notes=? where id=?",[note,id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});


router.get("/nav", (req, res, next) => {
  db.query(
    "select * from navbar where (hidden=0) order by id desc",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});

router.get("/getSectionData", (req, res, next) => {
  const { sectionId } = req.query;
  db.query("select * from navbar where (id=?)", [sectionId], (err, result) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }
    if (result.length > 0 && result[0].externalData == 0) {
      db.query(
        "select * from sectiondata where (sectionId=?)",
        [sectionId],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
          result.forEach((r) => {
            if (r.data) r.data = JSON.parse(r.data);
          });
          res.status(200).send({
            status: "success",
            data: result,
          });
        }
      );
    } else if (result.length == 0) {
      res.status(200).send({
        status: "success",
        data: [],
      });
    } else {
      db.query(
        "select * from externaldata where (sectionId=?) order by id desc",
        [sectionId],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
          result.forEach((r) => {
            if (r.data) r.data = JSON.parse(r.data);
          });
          res.status(200).send({
            status: "success",
            data: result,
          });
        }
      );
    }
  });
});

router.post("/editSection",userMiddleware.isAdmin, (req, res, next) => {
  const { sectionId, data } = req.body;
  db.query("select * from navbar where (id=?)", [sectionId], (err, result) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }

    if (result.length > 0 && result[0].externalData == 0) {
      db.query(
        "insert into sectiondata (sectionId,data) values (?,?) ON DUPLICATE KEY UPDATE data=?",
        [sectionId, JSON.stringify(data), JSON.stringify(data)],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
          res.status(200).send({
            status: "success",
            msg: "تم تعديل البيانات  بنجاح",
          });
        }
      );
    } else if (result.length == 0) {
      return res.status(404).send({
        status: "error",
        msg: "Section Not Found!!",
      });
    } else {
      db.query(
        "insert into externaldata (sectionId,data) values (?,?)",
        [sectionId, JSON.stringify(data)],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
          res.status(200).send({
            status: "success",
            msg: "تم اضافة البيانات  بنجاح",
          });
        }
      );
    }
  });
});

router.post("/deleteSectionData",userMiddleware.isAdmin, (req, res, next) => {
  const { sectionId, dataId } = req.body;
  db.query("select * from navbar where (id=?)", [sectionId], (err, result) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }

    if (result.length > 0 && result[0].externalData == 0) {
      db.query(
        "delete from sectiondata where (id=? and sectionId=?)",
        [dataId, sectionId],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
          res.status(200).send({
            status: "success",
            msg: "تم حذف البيانات  بنجاح",
          });
        }
      );
    } else if (result.length == 0) {
      return res.status(404).send({
        status: "error",
        msg: "Section Not Found!!",
      });
    } else {
      db.query(
        "delete from externaldata where (id=? and sectionId=?)",
        [dataId, sectionId],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
          res.status(200).send({
            status: "success",
            msg: "تم حذف البيانات  بنجاح",
          });
        }
      );
    }
  });
});

router.post("/createForm",userMiddleware.isAdmin, (req, res, next) => {
  const { title,subtext,activated } = req.body;
  var {data}=req.body
  data.unshift( {

    id:"dob",
    label:"تاريخ الميلاد",
    type:"date",
    required:true
  })

  
  data.unshift( {

    id:"gender",
    label:"الجنس",
    type:"radio",
    data:[
      "ذكر","أنثى"
  ],
  required:true})
  data.unshift( {

    id:"address",
    label:"العنوان",
    type:"text",
    required:true
  })
  data.unshift( {

    id:"mobile",
    label:"رقم الهاتف",
    type:"text",
    required:true
  })

  data.unshift( {

    id:"name",
    label:"الاسم",
    type:"text",
    required:true
})



data.push( {

  id:"campain",
  label:"الحملة",
  type:"text"
})
data.push( {

  id:"platform",
  label:"المنصة",
  type:"text"
})
data.push( {

  id:"isSale",
  label:"زبون؟",
  type:"checkbox"
})
  db.query(
    "insert into forms (title,subtext,data,activated) values (?,?,?,?)",
    [ title,subtext,JSON.stringify(data),activated ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم إضافة البيانات  بنجاح",
      });

    }
  );
});

router.get("/getWhatsappMessages/:phone",userMiddleware.isAdmin, (req, res, next) => {
 const { phone } = req.params;
  db.query(
    "select * from chat where phone=? order by id desc",
    [ phone ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        data: result,
      });

    }
  );
});

router.get("/getWhatsappNames",userMiddleware.isAdmin, (req, res, next) => {
  db.query(
    "SELECT * FROM chat r1 JOIN ( SELECT phone, MAX(timestamp) AS max_timestamp FROM chat GROUP BY phone ) r2 ON r1.phone = r2.phone AND r1.timestamp = r2.max_timestamp order by r1.timestamp desc;",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});

router.post("/sendWhatsapp",userMiddleware.isAdmin, (req, res, next) => {
  const { to, message } = req.body;

  const postData = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": to,
    "type": "text",
    "text": { 
      "preview_url": true,
      "body": message
      }
  };
  
  const options = {
    url: 'https://graph.facebook.com/v16.0/'+process.env.facebookMobileId+'/messages',
    method: 'POST',
    json: true,
    body: postData,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer "+process.env.facebookToken
    }
  };
  
  request(options, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      res.send(error)

    } else {
      console.error('Response:', body);


      tempMsgs.push({
        messageId:body.messages[0].id||"",
        message:message
      })
      res.send(body)
    }
  });

});
router.post("/sendWhatsapptemplate",userMiddleware.isAdmin, (req, res, next) => {
  const { to, message } = req.body;

  const postData = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": to,
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  };
  
  const options = {
    url: 'https://graph.facebook.com/v17.0/'+process.env.facebookMobileId+'/messages',
    method: 'POST',
    json: true,
    body: postData,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer "+process.env.facebookToken
    }
  };
  
  request(options, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      res.send(error)

    } else {
      console.error('Response:', body);


      tempMsgs.push({
        messageId:body.messages[0].id||"",
        message:message
      })
      res.send(body)
    }
  });

});
router.get("/whatsapp", (req, res, next) => {

console.error(req)
if(req.query["hub.verify_token"]=="happy"){
  res.send(req.query["hub.challenge"])
}
})

router.post("/whatsapp", (req, res, next) => {
  console.error(req.body)
if(req.body.entry[0].changes[0].value.statuses){
    req.body.entry.forEach(entry => {
      entry.changes.forEach(change => {
        change.value.statuses.forEach(status => {
          const messageData=status

          const msg = tempMsgs.find(msg => msg.messageId === messageData.id);

          db.query(
            "insert into chat (message_id,phone,timestamp,message,name,sent,status) values (?,?,?,?,'',1,?) ON DUPLICATE KEY UPDATE status=?",
            [messageData.id,messageData.recipient_id,messageData.timestamp,msg.message||"",messageData.status,messageData.status],
            (err, result) => {
              if (err) {
             
                console.error(err)
              }
           
            }
          );
        });
      });
    });
 
}
else if(req.body.entry[0].changes[0].value.messages){
  req.body.entry.forEach(entry => {
    entry.changes.forEach(change => {
      change.value.messages.forEach(message => {
        const messageData=message

        if(messageData.type=="text"){

          db.query(
            "select lastmessage.* ,questions.id as questionId from (select chat.* from chat where (phone=? and sent=1) order by id desc limit 1) lastmessage inner join questions on questions.question=lastmessage.message",
            [messageData.from],
            (err, result) => {
              if (err) {
             console.error(err)
              }
           
              if(result.length>0){
                db.query(
                  "insert into questionsresponses (message_id,questionId,phone,timestamp,message,name,sent,status) values (?,?,?,?,?,?,0,'recieved')",
                  [messageData.id,result[0].questionId,messageData.from,messageData.timestamp,messageData.text.body,change.value.contacts[0].profile.name],
                  (err, result) => {
                    if (err) {
                   console.error(err)
                    }
                 
                  }
                );
              }
              else{
                db.query(
                  "insert into chat (message_id,phone,timestamp,message,name,sent,status) values (?,?,?,?,?,0,'recieved')",
                  [messageData.id,messageData.from,messageData.timestamp,messageData.text.body,change.value.contacts[0].profile.name],
                  (err, result) => {
                    if (err) {
                   console.error(err)
                    }
                 
                  }
                );
              }
            }
          );

          
        
        }
      
      });
    });
  });

}
res.send("test")
})
router.get("/getForm/:formId", (req, res, next) => {
  db.query(
    "select * from forms where (id=? and activated=1)",[req.params.formId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      if(result.length>0){
        result[0].data=JSON.parse(result[0].data)
      }
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});

router.get("/questionResponses/:qid", (req, res, next) => {
  db.query(
    "select * from questionsresponses where (questionId=?) order by id desc",[req.params.qid],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
     
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});
router.get("/questions", (req, res, next) => {
  db.query(
    "select * from questions where visible=1 order by id desc",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
     
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});

router.get("/getForms",userMiddleware.isAdmin, (req, res, next) => {
  db.query(
    "select * from forms order by id desc",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      result.forEach(r => {
        r.data=JSON.parse(r.data)

      });
      
      res.status(200).send({
        status: "success",
        data: result,
      });
    }
  );
});
router.post("/getFilteredMobiles", userMiddleware.isAdmin, async(req, res, next) => {
  // request body validation
  const errors = [];
  if (!req.body) {
      errors.push('Request body is required');
  } else if (!Array.isArray(req.body)) {
      errors.push('Request body must be an array');
  } else {
      req.body.forEach(item => {
          if (!item.labelName || !item.data || !Array.isArray(item.data)) {
              errors.push('Each item in the request body must have a labelName and a data array');
          }
      });
  }
  if (errors.length > 0) {
      return res.status(400).send({
          status: "error",
          msg: errors.join(", "),
      });
  }

  // get all forms to map the label names to the IDs
  db.query(
      "SELECT * FROM forms ORDER BY id DESC",
      async (err, forms) => {
          if (err) {
              console.log(err);
              return res.status(500).send({
                  status: "error",
                  msg: "Internal Server Error",
              });
          }

          const labelToId = {};
          forms.forEach(form => {
              form.data = JSON.parse(form.data);
              form.data.forEach(item => {
                  labelToId[item.label] = item.id;
              });
          });

          // filter the form data
          db.query(
              "SELECT * FROM formsdata",
              (err, allFormData) => {
                  if (err) {
                      console.log(err);
                      return res.status(500).send({
                          status: "error",
                          msg: "Internal Server Error",
                      });
                  }

                  const result = allFormData.filter(data => {
                      data.data = JSON.parse(data.data);
                      return req.body.every(item => {
                          // ignore fields whose data array is empty
                          if (item.data.length === 0) {
                              return true;
                          }
                          const id = labelToId[item.labelName];
                          return item.data.includes(data.data[id]);
                      });
                  });

                  const mobileNumbers = [...new Set(result.map(data => data.data.mobile))];

                  res.status(200).send(mobileNumbers);
              }
          );
      }
  );
});


router.get("/getAllFormData", userMiddleware.isAdmin, async(req, res, next) => {
  // first, get all forms
  db.query(
      "SELECT * FROM forms ORDER BY id DESC",
      async (err, forms) => {
          if (err) {
              console.log(err);
              return res.status(500).send({
                  status: "error",
                  msg: "Internal Server Error",
              });
          }

          // initialize an object with each label name as a key and an empty array as its value
          const allFormData = {};
          forms.forEach(form => {
              form.data = JSON.parse(form.data);
              form.data.forEach(item => {
                  allFormData[item.label] = new Set();
              });
          });

          // get all form data
          for (const form of forms) {
              await new Promise((resolve, reject) => {
                  db.query(
                      "SELECT * FROM formsdata WHERE formid=?",[form.id],
                      (err, formData) => {
                          if (err) {
                              console.log(err);
                              reject(err);
                          } else {
                              formData.forEach(data => {
                                  data.data = JSON.parse(data.data);
                                  for (const item of form.data) {
                                      // push the value for each label to the corresponding set in allFormData
                                      allFormData[item.label].add(data.data[item.id]);
                                  }
                              });
                              resolve();
                          }
                      }
                  );
              });
          }

          // convert allFormData to the desired format
          const result = Object.keys(allFormData).map(label => ({
              labelName: label,
              // convert the set back to an array
              data: Array.from(allFormData[label])
          }));

          res.status(200).send(result);
      }
  );
});


router.get("/getFormData/:formId",userMiddleware.isAdmin, async(req, res, next) => {

  db.query(
    'SELECT * FROM campains',
    (err, campains) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      db.query(
        'SELECT * FROM formsdata where formid=?',[req.params.formId],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
        
          result.forEach(r => {
            r.data=JSON.parse(r.data)
            console.error(r.data)
            const campain=campains.filter(item => item.id === r.data.campain);
            if(campain){
              r.data.campain=campain[0].name||""
            }
          });
          res.send(result)
    
        })  
 
    })  



})
router.get("/deleteFormData/:dataId",userMiddleware.isAdmin, async(req, res, next) => {

  db.query(
    'delete from formsdata where id=?',[req.params.dataId],
    (err, campains) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
  
      else{
        return res.status(200).send({
          status: "success",
          msg: "تم الحذف بنجاح",
        });
      }
 
    })  



})

router.get("/deletecustomer/:id",userMiddleware.isAdmin, async(req, res, next) => {

  db.query(
    'delete from customers where id=?',[req.params.id],
    (err, campains) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
  
      else{
        return res.status(200).send({
          status: "success",
          msg: "تم الحذف بنجاح",
        });
      }
 
    })  



})
router.get("/stats",userMiddleware.isAdmin, async(req, res, next) => {

  db.query(
    'SELECT * FROM campains',
    (err, campains) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      db.query(
        'SELECT * FROM formsdata ',
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
        
          result.forEach(r => {
            r.data=JSON.parse(r.data)
            const campain=campains.filter(item => item.id === r.data.campain);
            if(campain){
              r.data.campain=campain[0].name
            }
          });

          console.error(result)
          let intermediateResult = result.reduce((acc, cur) => {
            const campaignName = cur.data.campain;
            const platformName = cur.data.platform;
            const isSale = cur.data.isSale;
        
            // handling campaign data
            if (!acc.campaigns[campaignName]) {
                acc.campaigns[campaignName] = { totalCount: 0, saleCount: 0 };
            }
            acc.campaigns[campaignName].totalCount++;
            if (isSale) {
                acc.campaigns[campaignName].saleCount++;
            }
        
            // handling platform data
            if (!acc.platforms[platformName]) {
                acc.platforms[platformName] = { totalCount: 0, saleCount: 0 };
            }
            acc.platforms[platformName].totalCount++;
            if (isSale) {
                acc.platforms[platformName].saleCount++;
            }
        
            return acc;
        }, {
            campaigns: {},
            platforms: {}
        });
        
        let result1 = {
            campaignsTotalCount: Object.entries(intermediateResult.campaigns).map(([x, {totalCount}]) => ({x, y: totalCount})),
            campaignsSaleCount: Object.entries(intermediateResult.campaigns).map(([x, {saleCount}]) => ({x, y: saleCount})),
            platformsTotalCount: Object.entries(intermediateResult.platforms).map(([x, {totalCount}]) => ({x, y: totalCount})),
            platformsSaleCount: Object.entries(intermediateResult.platforms).map(([x, {saleCount}]) => ({x, y: saleCount})),
        };
        db.query(
          'SELECT questions.question as x, COUNT(questionsresponses.questionId) as y from questions LEFT JOIN questionsresponses ON questions.id=questionsresponses.questionId GROUP BY questionsresponses.questionId ORDER by questions.id DESC',
          (err, questionsCount) => {
            if (err) {
              console.log(err);
            
            }

            result1.questions=questionsCount
            res.send(result1);    


          })

        
        })  
 
    })  



})
router.get("/campaignStats/:campaignId",userMiddleware.isAdmin, async(req, res, next) => {

  db.query(
    'SELECT * FROM campains',
    (err, campains) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      db.query(
        'SELECT * FROM formsdata ',
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
        
          result.forEach(r => {
            r.data=JSON.parse(r.data)
            const campain=campains.filter(item => item.id === r.data.campain);
            if(campain){
              r.data.campain=campain[0].name
              r.data.campainId=campain[0].id
            }
          });

          let intermediateResult = result.reduce((acc, cur) => {
            // Check if the campaign name matches
            console.error(cur.data.campainId)
            if (cur.data.campainId == req.params.campaignId) {
                const platformName = cur.data.platform;
                const isSale = cur.data.isSale;
    
                // handling platform data
                let platform = acc.find(p => p.name === platformName);
                if (!platform) {
                    platform = { name: platformName, totalCount: 0, saleCount: 0 };
                    acc.push(platform);
                }
                platform.totalCount++;
                if (isSale) {
                    platform.saleCount++;
                }
            }
    
            return acc;
        }, []);
    
        let result1 = {
          TotalCount: Object.entries(intermediateResult).map(([x, {totalCount,name}]) => ({x:name, y: totalCount})),
          SaleCount: Object.entries(intermediateResult).map(([x, {saleCount,name}]) => ({x:name, y: saleCount}))
      };
        
      res.send({
        TotalCount:transformData(result1.TotalCount),
        SaleCount:transformData(result1.SaleCount)
      });         })  
 
    })  



})

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function transformData(data) {
  var transformedData = {
      xValues: [],
      yValues: [],
      barColors: []
  };

  for (var i = 0; i < data.length; i++) {
      transformedData.xValues.push(data[i].x);
      transformedData.yValues.push(data[i].y);
      transformedData.barColors.push(getRandomColor()+"aa");
  }

  return transformedData;
}
router.get("/platformStats/:platformName",userMiddleware.isAdmin, async(req, res, next) => {

  db.query(
    'SELECT * FROM campains',
    (err, campains) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      db.query(
        'SELECT * FROM formsdata ',
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: "error",
              msg: "Internal Server Error",
            });
          }
        
          result.forEach(r => {
            r.data=JSON.parse(r.data)
            const campain=campains.filter(item => item.id === r.data.campain);
            if(campain){
              r.data.campain=campain[0].name
              r.data.campainId=campain[0].id
            }
          });

          let intermediateResult = result.reduce((acc, cur) => {
            // Check if the platform name matches
            if (cur.data.platform == req.params.platformName) {
                const campaignName = cur.data.campain;
                const isSale = cur.data.isSale;
    
                // handling campaign data
                let campaign = acc.find(c => c.name === campaignName);
                if (!campaign) {
                    campaign = { name: campaignName, totalCount: 0, saleCount: 0 };
                    acc.push(campaign);
                }
                campaign.totalCount++;
                if (isSale) {
                    campaign.saleCount++;
                }
            }
    
            return acc;
        }, []);
    
        let result1 = {
          TotalCount: Object.entries(intermediateResult).map(([x, {totalCount,name}]) => ({x:name, y: totalCount})),
          SaleCount: Object.entries(intermediateResult).map(([x, {saleCount,name}]) => ({x:name, y: saleCount}))
      };
        
        
        res.send({
          TotalCount:transformData(result1.TotalCount),
          SaleCount:transformData(result1.SaleCount)
        });    
        })  
 
    })  



})
router.get("/getKpis/:formId",userMiddleware.isAdmin, async(req, res, next) => {
 
  
  

  db.query(
    'SELECT * FROM formsdata where formid=?',[req.params.formId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
    
  // Process the result set
  const kpis = {};
  const insights = {};
  
  for (const row of result) {
    const data = JSON.parse(row.data);
  
    for (const [key, value1] of Object.entries(data)) {
      if (/^\d+$/.test(value1)) {
        if (!kpis[key]) {
          kpis[key] = {
            min: Number.POSITIVE_INFINITY,
            max: Number.NEGATIVE_INFINITY,
            sum: 0,
            count: 0,
            data: [],
          };
        }
        var value=parseFloat(value1)
        kpis[key].min = Math.min(kpis[key].min, value);
        kpis[key].max = Math.max(kpis[key].max, value);
        kpis[key].sum += value;
        kpis[key].count++;
        kpis[key].data.push(value);
      } else {
        if (!insights[key]) {
          insights[key] = {};
        }
        if (!insights[key][value1]) {
          insights[key][value1] = 0;
        }
        insights[key][value1]++;
      }
    }
  }
  
  // Compute the KPIs for each key
  var kpis1=[]
  for (const [key, kpi] of Object.entries(kpis)) {
    
    kpi.avg = kpi.sum / kpi.count;
    delete kpi.sum;
    delete kpi.count;
  
    kpis1.push({
      key,
      data:kpi
    })
  }
  
  // Compute the insights for each key
  var insights1=[]
  for (const [key, valueCounts] of Object.entries(insights)) {
    const totalCount = Object.values(valueCounts).reduce((a, b) => a + b, 0);
    var tempinsights = [];
    for (const [value, count] of Object.entries(valueCounts)) {
  
      tempinsights.push({
        value,
        percentage: count / totalCount,
        count,
        totalCount
      })
    }
    insights1.push({
      key,
      data:tempinsights
    })
  }
  
  // Return the KPI and insights as the API response
  res.send({
    kpis: kpis1,
    insights: insights1,
  });
  
    }
  );
  
  });

  router.get("/getKpisTest/:formid",userMiddleware.isAdmin, async(req, res, next) => {
 
  
  

    db.query(
      'SELECT * FROM formsdata where formid=?',[req.params.formid],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            status: "error",
            msg: "Internal Server Error",
          });
        }
        db.query(
          "select * from forms where (id=? and activated=1)",[req.params.formid],
          (err, result1) => {
            if (err) {
              console.log(err);
              return res.status(500).send({
                status: "error",
                msg: "Internal Server Error",
              });
            }
            if(result1.length>0){
              result1[0].data=JSON.parse(result1[0].data)
            }


            result.forEach(r => {
              r.data=JSON.parse(r.data)
            });
            let data = result;
          
          let formStructure = result1[0];
          console.error(data)
          console.error(formStructure)


          let insights = {};

          // Filter data based on formid from the URL
          let filteredData = _.filter(data, o => o.formid === parseInt(req.params.formid));
      
          // Total number of entries for this form
          insights.totalEntries = filteredData.length;
      
          // Iterate over each field in the form structure
          formStructure.data.forEach(field => {
              let id = field.id;
              let type = field.type;
      
              if (type === 'text' || type === 'email' || type === 'tel') {
                  // Average length of input for text, email and tel types
                  insights[`avgLength_${id}`] = _.meanBy(filteredData, o => (o.data[id] ? o.data[id].length : 0));
              }
              else if (type === 'radio') {
                  // Count by radio option
                  insights[`countBy_${id}`] = _.countBy(filteredData, o => o.data[id]);
              }
              // Add other types as necessary
          });
      
          // Count by dateadded
          insights.countByDate = _.countBy(filteredData, o => new Date(o.dateadded).toISOString().split('T')[0]);
      
          res.json(insights);
          }
        );
    
    });
  })
router.post("/mapSettings",userMiddleware.isAdmin, (req, res, next) => {
  const { longitude, latitude } = req.body;

  db.query(
    "insert into mapdata (longitude,latitude) values (?,?) ON DUPLICATE KEY UPDATE longitude=? , latitude=?",
    [longitude, latitude, longitude, latitude],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم تعديل البيانات  بنجاح",
      });
    }
  );
});
router.get("/getMapData", (req, res, next) => {
  const { sectionId } = req.query;
  db.query("select * from mapdata", [sectionId], (err, result) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }
    res.status(200).send({
      status: "success",
      data: result,
    });
  });

});

router.get("/deleteCampain/:campaignId",userMiddleware.isAdmin, (req, res, next) => {
  const { campaignId } = req.params;

  db.query(
    "update campains set visible=0 where id=?",
    [campaignId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم حذف الحملة بنجاح",
      });
    }
  );
});

router.post("/addCampain",userMiddleware.isAdmin, (req, res, next) => {
  const { name } = req.body;

  db.query(
    "insert into campains (name) values (?)",
    [name],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم اضافة الحملة بنجاح",
      });
    }
  );
});
router.post("/addQuestion",userMiddleware.isAdmin, (req, res, next) => {
  const { question } = req.body;

  db.query(
    "insert into questions (question) values (?)",
    [question],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم اضافة السؤال بنجاح",
      });
    }
  );
});
router.get("/deleteQuestion/:questionId",userMiddleware.isAdmin, (req, res, next) => {
  const { questionId } = req.params;

  db.query(
    "update questions set visible=0 where id=?",
    [questionId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم حذف السؤال بنجاح",
      });
    }
  );
});
router.post("/addSection",userMiddleware.isAdmin, (req, res, next) => {
  const { name, hasExternalData } = req.body;

  db.query(
    "insert into navbar (name,externaldata) values (?,?)",
    [name, hasExternalData],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم اضافة القسم بنجاح",
      });
    }
  );
});

router.post("/addScheduledMessageMobile",userMiddleware.isAdmin, (req, res, next) => {
  const { messageDate,message,mobiles,messageType } = req.body;
  db.query(
    "insert into scheduledmessagesMobile (datetime,message,mobiles,messageType) values (?,?,?,?)",
    [new Date(messageDate),message,JSON.stringify(mobiles)||"[]",messageType],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم اضافة الجدولة بنجاح",
      });
      poll();

    }
  );
});
router.get("/getscheduledmessagesMobile",userMiddleware.isAdmin, (req, res, next) => {

  db.query(
    "select * from scheduledmessagesMobile order by id desc",
   
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      result.forEach(message => {
        message.mobiles=JSON.parse(message.mobiles)
      });
      res.status(200).send({
        status: "success",
        data: result
      });
      poll();

    }
  );
});
router.get("/deletescheduledmessagesMobile/:messageId",userMiddleware.isAdmin, (req, res, next) => {

  const {messageId}=req.params
  db.query(
    "delete from scheduledmessagesMobile where id=?",[messageId],
   
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
    
      res.status(200).send({
        status: "success",
        msg: "تم حذف الجدولة بنجاح"
      });
      poll();

    }
  );
});
router.post("/contactUs", (req, res, next) => {
  const { name, email, message } = req.body;

  db.query(
    "insert into contactus (name,email,message) values (?,?,?)",
    [name, email, message],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          status: "error",
          msg: "Internal Server Error",
        });
      }
      res.status(200).send({
        status: "success",
        msg: "تم ارسال الرسالة  بنجاح",
      });


      
      const wamessage="لديك استفسار/شكوى جديدة\nالاسم: "+name+"\nالبريد الالكتروني: "+email+"\nالرسالة: "+message
  const postData = {
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "972599513387",
    "type": "text",
    "text": { 
      "preview_url": true,
      "body": wamessage
      }
  };
  
  const options = {
    url: 'https://graph.facebook.com/v16.0/'+process.env.facebookMobileId+'/messages',
    method: 'POST',
    json: true,
    body: postData,
    headers: {
      'Content-Type': 'application/json',
      "Authorization": "Bearer "+process.env.facebookToken
    }
  };
  
  request(options, (error, response, body) => {
    if (error) {
      console.error('Error:', error);

    } else {
      console.error('Response:', body);


   
    }
  });




    }
  );
});
router.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).json(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).json(err);
    } else {
      // Everything went fine.

      const fileUrl =
        req.protocol + "://" + req.get("host") + "/api/" + req.file.path;
      res.status(200).json({ url: fileUrl });
    }
  });
});

router.post("/sendform", function (req, res) {


  const {formid}=req.body
  console.log(req.body)
  db.query(
  "insert into formsdata (formid,data) values (?,?)",
  [formid, JSON.stringify(req.body.data)],
  (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }
    res.status(200).send({
      status: "success",
      msg: "تم ارسال البيانات  بنجاح",
    });


    const {name,mobile,address,gender,email,dob}=req.body.data
    db.query(
      "insert into customers (name,mobile,address,gender,email,dob) values (?,?,?,?,?,?)",
      [name,mobile,address,gender,email||"",dob],
      (err, result) => {
        if (err) {
          console.log(err);
         
        }
      
      }
    );
  }
);
});

router.post("/activateform",userMiddleware.isAdmin, function (req, res) {


  const {formid}=req.body
  db.query(
  "update forms set activated=1 where id=?",
  [formid],
  (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }
    res.status(200).send({
      status: "success",
      msg: "تم تفعيل النموذج  بنجاح",
    });
  }
);
});
router.post("/activateSale",userMiddleware.isAdmin, function (req, res) {


  const {dataId}=req.body
  db.query(
  "select * from formsdata where id=?",
  [dataId],
  (err, result) => {
    if (err) {
      console.log(err);
  
    }

    var jsondata=JSON.parse(result[0].data||"[]")

    jsondata.isSale=true
    db.query(
      "update formsdata set data=? where id=?",
      [JSON.stringify(jsondata), dataId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            status: "error",
            msg: "Internal Server Error",
          });
        }


        db.query(
          "update customers set isSale=true where mobile=?",
          [jsondata.mobile],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).send({
                status: "error",
                msg: "Internal Server Error",
              });
            }
            res.status(200).send({
              status: "success",
              msg: "تم تفعيل المبيعة  بنجاح",
            });
          }
        );
     
      }
    );


 
  }
);
});
router.post("/deactivateSale",userMiddleware.isAdmin, function (req, res) {


  const {dataId}=req.body
  db.query(
  "select * from formsdata where id=?",
  [dataId],
  (err, result) => {
    if (err) {
      console.log(err);
  
    }

    var jsondata=JSON.parse(result[0].data||"[]")

    jsondata.isSale=false
    db.query(
      "update formsdata set data=? where id=?",
      [JSON.stringify(jsondata), dataId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            status: "error",
            msg: "Internal Server Error",
          });
        }

        db.query(
          "update customers set isSale=false where mobile=?",
          [jsondata.mobile],
          (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).send({
                status: "error",
                msg: "Internal Server Error",
              });
            }
        
            res.status(200).send({
              status: "success",
              msg: "تم الغاء تفعيل المبيعة  بنجاح",
            });
          }
        );


      }
    );


 
  }
);
});

router.post("/deactivateform",userMiddleware.isAdmin, function (req, res) {


  const {formid}=req.body
  db.query(
  "update forms set activated=0 where id=?",
  [formid],
  (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: "error",
        msg: "Internal Server Error",
      });
    }
    res.status(200).send({
      status: "success",
      msg: "تم الغاء تفعيل النموذج  بنجاح",
    });
  }
);
});

router.get("/uploads/:file", function (req, res) {
  const imagePath = "./uploads/" + req.params.file; // replace with your own image path

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }

    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(data);
  });
});

router.get("/hash", (req, res, next) => {
  bcrypt.hash(req.query.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: err,
      });
    } else {
      res.send(hash);
    }
  });
});

module.exports = router;
