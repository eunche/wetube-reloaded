import User from "../models/User";
import bcrypt from "bcrypt";
import session from "express-session";

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

export const edit = (req, res) => res.send("Edit");

export const remove = (req, res) => res.send("Remove");

export const getLogin = (req, res) => {
    return res.render("login", { pageTitle: "Login" });
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    let errorMessages = {};

    try {
        const user = await User.findOne({ username });

        if (!user) {
            errorMessages['username'] = "An account with this username does not exists.";
            throw Error("An account with this username does not exists.");
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
        return res.status(400).render("login", { pageTitle: "Login", errorMessages, formValues: { username } });
    }
}

export const logout = (req, res) => res.send("Logout");

export const see = (req, res) => res.send("See");
