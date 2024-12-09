const express = require("express");
const path = require("path");
const {connectToMongoDB} = require("./connectionDB");
const URL = require("./models/url.models")
const cookieParser = require("cookie-parser");
const {restrictToLoggedInUserOnly, checkAuth}= require("./middlewares/auth.middlewares");
require("dotenv").config();


const urlRoute = require("./routes/url.routes");
const staticRoute = require("./routes/static.routes");
const userRoute = require("./routes/user.routes");

const app = express();
const PORT = 3000;


//Connecting EJS File
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


//Database Connection
connectToMongoDB(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.get("/test", async(req, res)=>{
    const allUrls = await URL.find({});
    return res.render("home", {urls: allUrls});
})

//Routes
app.use("/url",restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
app.use("/user", userRoute);




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