import User from "../models/User";

export const getJoin = (req, res) => {
    return res.render("join", { pageTitle: "Join" });
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    let errorMessages = {};
    let formValues = {};

    if (password !== password2) {
        errorMessages['password'] = "Password confirmation does not match.";
    }
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
        errorMessages['username'] = "This username is already exists."
        formValues['username'] = username;
    }
    const emailExists = await User.exists({ email });
    if (emailExists) {
        errorMessages['email'] = "This email is already exists."
        formValues['email'] = email;
    }

    const errorIsEmpty = Object.keys(errorMessages).length === 0
    if (!errorIsEmpty) {
        return res.status(400).render("join", { pageTitle: "Join", errorMessages, formValues });
    }

    await User.create({
        name,
        email,
        username,
        password,
        location,
    });
    return res.redirect("/login");
}

export const edit = (req, res) => res.send("Edit");

export const remove = (req, res) => res.send("Remove");

export const login = (req, res) => res.send("Login");

export const logout = (req, res) => res.send("Logout");

export const see = (req, res) => res.send("See");
