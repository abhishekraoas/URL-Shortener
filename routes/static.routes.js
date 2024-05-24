const express = require("express");
const router = express.Router();
const URL = require("../models/url.models");

router.get("/", async (req, res) => {
    try{
    const allurls = await URL.find({});
    return res.render("home", {
        urls: allurls,

    });
}catch(error){
    console.error(error);
    res.status(500).send("Server error");
}
});

module.exports = router;
