import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";


export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    let errorMessages = {};

    try {
        if (password !== password2) {
            errorMessages['password'] = "Password confirmation does not match.";
            throw new Error("Password confirmation does not match.");
        }

        await User.create({
            name,
            email,
            username,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        const usernameExists = await User.exists({ username });
        if (usernameExists) {
            errorMessages['username'] = "This username is already exists."
        }
        const emailExists = await User.exists({ email });
        if (emailExists) {
            errorMessages['email'] = "This email is already exists."
        }

        return res.status(400).render("join", { pageTitle: "Join", errorMessages, formValues: { name, email, username, location } });
    }
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const { name, email, username, location } = req.body;
    const userID = req.session.user._id;
    const user = await User.findByIdAndUpdate(userID,
        {
            name,
            email,
            username,
            location,
        },
        { new: true }
    );
    req.session.user = user;
    return res.redirect("/users/edit");

};

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    let errorMessages = { mainErrors: [] };

    try {
        const user = await User.findOne({ username });

        if (!user) {
            errorMessages['username'] = "An account with this username does not exists.";
            throw Error("An account with this username does not exists.");
        }

        if (user.isGithubLogin) {
            errorMessages.mainErrors.push("Please continue with Github.");
            throw Error("Please continue with Github.");
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            errorMessages['password'] = "The password is wrong.";
            throw Error("The password is wrong.");
        }

        req.session.loggedIn = true;
        req.session.user = user;

        return res.redirect("/");
    } catch (error) {
        console.log(errorMessages);
        return res.status(400).render("login", { pageTitle: "Login", errorMessages, formValues: { username } });
    }
}

export const startGithubLogin = (req, res) => {
    const baseURL = "https://github.com/login/oauth/authorize?";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = baseURL + params;

    return res.redirect(finalURL);
}

export const githubLoginCallback = async (req, res) => {
    // github으로부터 받은 code값으로 access_token을 얻기위해 POST요청 보내기
    const baseURL = "https://github.com/login/oauth/access_token?";
    const { code } = req.query;
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
    }
    const params = new URLSearchParams(config).toString();
    const finalURL = baseURL + params;
    const tokenData = await (
        await fetch(finalURL, {
            method: "POST",
            headers: {
                Accept: "application/json",
            }
        })).json()

    // 얻은 access_token값으로 user데이터, email데이터를 GET요청으로 받아오기
    const apiURL = "https://api.github.com/";
    if ("access_token" in tokenData) {
        const accessToken = tokenData.access_token;
        const userData = await (
            await fetch(`${apiURL}user`, {
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiURL}user/emails`, {
                headers: {
                    Authorization: `token ${accessToken}`,
                },
            })
        ).json();
        const { email } = emailData.find(email => email.primary === true && email.verified === true);
        if (!email) {
            return res.redirect("/login");
        }

        // 가져온 email과 일치하는 계정이 있으면 바로 Login시키기
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.session.loggedIn = true;
            req.session.user = existingUser;

            return res.redirect("/");
            // 일치하는 email 계정이 없으면 unset-password 계정으로 생성하기
        } else {
            const user = await User.create({
                name: userData.name,
                email,
                username: userData.login,
                password: "",
                location: userData.location,
                isGithubLogin: true,
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } else {
        return res.redirect("/login");
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};


export const see = (req, res) => res.send("See");
