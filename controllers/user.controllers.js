const User = require("../models/user.models");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

async function handleUserSignUp(req, res) {
    try {
        const { name, email, password } = req.body;
        await User.create({
            name,
            email,
            password,
        });

        return res.redirect("/");
    } catch (error) {
        console.error("Error during sign up:", error);
        return res.status(500).send("Internal Server Error");
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.render("login", {
                Error: "Invalid Username or Password",
            });
        }

        const sessionId = uuidv4();
        setUser(sessionId, user);
        res.cookie("uid", sessionId);
        return res.redirect("/");
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("Internal Server Error");
    }
}




module.exports = {
    handleUserSignUp,
    handleUserLogin,

};