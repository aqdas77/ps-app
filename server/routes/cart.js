const express = require("express");
const router = express.Router();
const Item = require("../models/item");
const { User } = require("../models/user");
const jwtDecode = require("jwt-decode");

router.post("/", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const item = new Item({ ...req.body, image: req.body.images[0] });
    await item.save();
    const user = await User.findOne({ email: userEmail });
    if (!user) res.status(404).send("User not found");
    user.cart.push(item._id);
    await user.save();
    res.status(200).send("Item added successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/items", async (req,res)=>{
    try{
        const userEmail = req.body.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) res.status(404).send("User not found");
    var cartItems = [];
    const itemIds = user.cart;

    for(const id of itemIds){
        try{
           const item = await Item.findOne({_id:id});
           cartItems.push(item);
        }catch(error){
          console.log(error);
        }
    }
    // console.log("itemIds: ",itemIds)
    // console.log("cartItem :",cartItems)
    res.status(200).send({data : cartItems,message:"Cart Item fetched successfully"});

    }catch(error){
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
