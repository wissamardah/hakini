const jwt = require('jsonwebtoken');
const db = require("../lib/db.js");


module.exports = {
    validateRegister: (req, res, next) => {
    
    
      if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 6 chars'
        });
      }
      // password (repeat) does not match
      if (
        !req.body.password_repeat ||
        req.body.password != req.body.password_repeat
      ) {
        return res.status(400).send({
          msg: 'Both passwords must match'
        });
      }
      next();
    },
    isLoggedIn: (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(
          token,
          process.env.JWT_KEY
        );
        req.userData = decoded;

        if(req.userData){


          db.query(
            `select * from users where id=?`,
            [req.userData.userId],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
        
                if(result.length>0){
                  next();

                }
                else{
                  return res.status(401).send({
                    msg: 'Your session is not valid!'
                  });
                }
        
             
              }
            }
          );

        }
       } catch (err) {
          console.log(err)
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
    }
    ,
    isStoreUser: (req, res, next) => {
      try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(
          token,
          process.env.JWT_KEY
        );
        req.userData = decoded;

        if(req.userData){


          db.query(
            `select * from storesusers where id=?`,
            [req.userData.userId],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
        
                if(result.length>0){
                  next();

                }
                else{
                  return res.status(401).send({
                    msg: 'Your session is not valid!'
                  });
                }
        
             
              }
            }
          );

        }
       } catch (err) {
          console.log(err)
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
    },
    isAdmin: (req, res, next) => {
      try {

        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(
          token,
          process.env.JWT_KEY
        );
        req.userData = decoded;
        console.log(req.userData)
        if(req.userData.role=="admin")
        next();
        else
        return res.status(401).send({
          msg: 'ليس لديك صلاحية لهذا الاجراء'
        });
      } catch (err) {
          console.log(err)
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
    }
    ,
    isInspector: (req, res, next) => {
      try {
        console.log(req.headers.Data)

        const token = req.headers.authorization.split(' ')[1];
        console.log(token)

        const decoded = jwt.verify(
          token,
          process.env.JWT_KEY
        );
        req.userData = decoded;
        console.log(req.userData)
        if(req.userData.admin||req.userData.inspector)
        next();
        else
        return res.status(401).send({
          msg: 'Your Are Not Admin!'
        });
      } catch (err) {
          console.log(err)
        return res.status(401).send({
          msg: 'Your session is not valid!'
        });
      }
    }
  };