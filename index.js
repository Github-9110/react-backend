const express = require('express');
require('./db/config');
const cors = require('cors'); // Used remove for error during data vai api in mongodb
const app = express();
const user = require('./db/users');
const product = require('./db/products');
app.use(express.json());
app.use(cors());

app.post("/register", async (req, resp) => {
    let data = new user(req.body);
    let result = await data.save();
    result = result.toObject();
    delete result.password; //remove from respnse
    resp.send(result);
});

app.post("/login", async (req, resp) => {
    if (req.body.email && req.body.password) {
        console.log(req.body.email);
        let User = await user.findOne(req.body).select("-password");
        if (User) {
            resp.send(User);
        } else {
            resp.send({ result: "No User Found" });
        }
    } else {
        resp.send({ result: "No User Found" });
    }
});

app.post("/add-product", async (req, resp) => {
    let data =  new product(req.body);
    let result = await data.save();    
    resp.send(result);
});

app.get("/products",async (req,resp)=>{
    let data = await product.find();
    if(data.length>0){
    resp.send(data);
    }else{
        resp.send({result:"No Data Exist"});
    }
});

app.get("/product/:id", async (req,resp)=>{
    let result = await product.findOne({_id:req.params.id});
    if(result) {
    resp.send(result)
    }else{
        resp.send({result:"No Record Found."})
    }
    });

app.put("/product/:id", async(req,resp)=>{
let result = await product.updateOne(
    {_id: req.params.id},
    {
     $set : req.body
    }
)
resp.send(result);
});    
app.listen(5000);