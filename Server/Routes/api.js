const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const mySqlConnection = require('../database')
var atob = require('atob')


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretkey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userrole = payload.subject
    next()
  }

router.post('/Login', (req, res) => {
    let UserData = req.body
    const query = 'SELECT * FROM DtUser Where userName = ? and password = ?'
     mySqlConnection.query(query, [UserData.username, UserData.password], (err, rows, fields) => {
        if(err){
            console.error(err)
        } else{
            if(rows && rows.length ){ 
                let payload = {subject:rows.UserRole}
                let token = jwt.sign(payload ,'secretkey')
                let User = {
                    username:rows[0].UserName,
                    UserRole:rows[0].UserRole,
                    token
                }
                res.status(200).send(User)    
            } else {
                res.status(401).send("Invalid user")  
            }
        }
    });  
  });

router.get('/Products', verifyToken, (req, res) => {
const query = 'SELECT ProductID, ItemType FROM DtProducts'
    mySqlConnection.query(query, (err, rows, fields) => {
    if(err){
        console.error(err) 
    } else  res.status(200).send(rows)
    });  
});

router.get('/Products/:ProductID',  (req, res) => {
     const query = 'SELECT * FROM DtProducts where ProductID = ?'
     mySqlConnection.query(query, [req.params.ProductID] , (err, rows, fields) => {
        if(err){
            console.error(err)
        } else res.json(rows[0])

    });  
});
 
router.get('/Cart/:UserName', (req, res) => {
    const query = 'SELECT * FROM DtUserProducts Where UserName = ?'
     mySqlConnection.query(query,[req.params.UserName], (err, rows, fields) => {
        if(err){
            console.error(err)
        } else  res.status(200).send(rows)
    });  
});

//get the single cart for employees to edit
router.get('/EditCart/:PurchaseID',  (req, res) => {
    const query = 'SELECT * FROM DtUserProducts Where PurchaseID =?'
     mySqlConnection.query(query, [req.params.PurchaseID], (err, rows, fields) => {
        if(err){
            console.error(err)
        } else  res.json(rows[0])
    });  
}); 

//Update the quantity of the selected cart 
router.put('/EditCart/:PurchaseID',  (req, res) => {
    const query = 'Update DtUserProducts set Quantity = ? Where PurchaseID =?'
     mySqlConnection.query(query, [req.body.Quantity,req.params.PurchaseID], (err, rows, fields) => {
        if(err){
            console.error(err)
        } else  res.status(200).send(rows)
    });  
}); 

//get the entire cart for Admin users
router.get('/ApproveCart', (req, res) => {
    const query = 'SELECT * FROM DtUserProducts  '
     mySqlConnection.query(query,(err, rows, fields) => {
        if(err){
            console.error(err)
        } else  res.status(200).send(rows)
    });  
});

//get the single cart for approval 
router.get('/ApproveCart:PurchaseID', (req, res) => {
    const query = 'SELECT * FROM DtUserProducts Where PurchaseID  =?'
     mySqlConnection.query(query, [req.params.PurchaseID], (err, rows, fields) => {
        if(err){
            console.error(err)
        } else  res.status(200).send(rows)
    });  
});

//Approve cart
router.put('/ApproveCart/:PurchaseID',  (req, res) => {
    const query = 'Update DtUserProducts set IsApproved = 1 Where PurchaseID =?'
     mySqlConnection.query(query, [req.params.PurchaseID], (err, rows, fields) => {
        if(err){
            console.error(err)
        } else  res.status(200).send(rows)
    });  
}); 

//Add to Cart /:username
router.post('/Cart/:UserName', verifyToken, (req, res) => {
    let CartData = req.body;
    const query = 'insert into DtUserProducts (UserName, ProductID, ItemType, ProductName, UnitPrice, Quantity,IsApproved) Select ?, ?, ?, ?, ?, ?,?'
    mySqlConnection.query(query, [req.params.UserName, CartData.ProductID, CartData.ItemType, CartData.ProductName, CartData.UnitPrice, CartData.Quantity, CartData.IsApproved], (err, rows, fields) => {
      if(!err) {
        res.json({status: 'Added to Cart'});
      } else {
        console.log(err);
      }
    });
});

//Remove from cart
router.delete('/Cart/:PurchaseID', (req, res) => {
    const query = 'Delete from DtUserProducts Where PurchaseID = ?'
    mySqlConnection.query(query, [req.params.PurchaseID], (err, rows, fields) => {
      if(!err) {
        res.json({status: 'Removed from Cart'});
      } else {
        console.log(err);
      }
    }); 
});


module.exports = router

