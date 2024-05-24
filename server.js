const express = require("express");
const urlRoute = require("./routes/url.routes");
const {connectToMongoDB} = require("./connectionDB");
const URL = require("./models/url.models")
const app = express();
const PORT = 3000;

//Database Connection
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>{
    console.log("Connected to MongoDB");
});

//Middlewares
app.use(express.json());

app.get("/test", async(req, res)=>{
    const allUrls = await URL.find();
    return res.end( )
})

//Routes
app.use("/url", urlRoute);

app.get("/url/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate({
            shortId,
        }, {
            $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
        );

        if (entry) {
            res.redirect(entry.redirectURL);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
        

app.listen(PORT, (req, res)=>{
    console.log(`Server is running on port ${PORT}`);
})