const express = require("express");
const router = express.Router();
const URL = require("../models/url.models");

router.get("/", async (req, res) => {
    try{
    if(!req.user) return res.redirect("/login");
    const allurls = await URL.find({createdBy: req.user._id});
    return res.render("home", {
        urls: allurls,

    });
}catch(error){
    console.error(error);
    res.status(500).send("Server error");
}
});


router.get("/signup", (req, res)=>{
    return res.render("signup");
});

router.get("/login", (req, res)=>{
    return res.render("login");
});

module.exports = router;
