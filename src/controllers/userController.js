import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";


export const getJoin = (req, res) => {
    return res.render("users/join", { pageTitle: "Join" });
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    let errorMessages = {};

    // 비밀번호 일치 확인
    if (password !== password2) {
        errorMessages['password'] = "Password confirmation does not match.";
    }

    // 이미 존재하는 username인지 확인
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
        errorMessages['username'] = "This username is already exists."
    }

    // 이미 존재하는 email인지 확인
    const emailExists = await User.exists({ email });
    if (emailExists) {
        errorMessages['email'] = "This email is already exists."
    }

    if (Object.keys(errorMessages).length > 0) {
        return res.status(400).render("users/join", { pageTitle: "Join", errorMessages, formValues: { name, email, username, location } });
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

export const getEdit = (req, res) => {
    return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const { name, email, username, location } = req.body;
    const userID = req.session.user._id;
    let errorMessages = {};

    // email, username 유효성 검사
    const loggedInUser = await User.findById(userID);
    if ((loggedInUser.email !== email) && (await User.exists({ email }))) {
        errorMessages.email = "This email is already exists.";
    }
    if ((loggedInUser.username !== username) && (await User.exists({ username }))) {
        errorMessages.username = "This username is already exists.";
    }

    // email, username 둘 중 하나라도 유효성 검사에 통과하지 못하면, 프론트에 에러 반환
    if (Object.keys(errorMessages).length !== 0) {
        return res.status(400).render("users/edit-profile", {
            pageTitle: "Edit Profile",
            errorMessages,
            formValues: { name, email, username, location, }
        });
    }

    const updatedUser = await User.findByIdAndUpdate(userID,
        {
            name,
            email,
            username,
            location,
        },
        { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    return res.render("users/change-password", { pageTitle: "Change Password" });
}

export const postChangePassword = async (req, res) => {
    const loggedInUserID = req.session.user._id;
    const loggedInUser = await User.findById(loggedInUserID);
    const { oldPassword, newPassword, newPassword2 } = req.body;
    const errorMessages = {}

    try {
        // 현재 패스워드가 일치하는지 확인
        const isCorrectOldPassword = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!isCorrectOldPassword) {
            errorMessages.oldPassword = "The current password is incorrect";
            throw new Error();
        }
        // 새로운 비밀번호/비밀번호 확인이 일치하는지 확인
        if (newPassword !== newPassword2) {
            errorMessages.newPassword = "The password does not match the confirmation";
            throw new Error();
        }
        // 일치 여부를 다 통과하면 업데이트 된 비밀번호를 저장하고, 로그아웃 진행
        loggedInUser.password = newPassword;
        await loggedInUser.save();
        return res.redirect("/users/logout");
    } catch {
        // 일치 여부를 통과하지 못하면 유효성 검사 에러메세지 반환
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessages,
        });
    }


}

export const getLogin = (req, res) => {
    return res.render("users/login", { pageTitle: "Login" });
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    let errorMessages = { mainErrors: [] };

    const user = await User.findOne({ username });

    try {
        // username 존재여부 확인
        if (!user) {
            errorMessages['username'] = "An account with this username does not exists.";
            throw new Error();
        }
        // Github Login으로 만든 계정인지 확인
        if (user.isGithubLogin) {
            errorMessages.mainErrors.push("Please continue with Github.");
            throw new Error();
        }
        // 비밀번호 일치여부 확인
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            errorMessages['password'] = "The password is wrong.";
            throw new Error();
        }

        // 유효성 검사에 다 통과하면 Session에 로그인 정보 저장
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } catch {
        // 통과하지 못하면 Error와 입력form값 다시 반환
        return res.status(400).render("users/login", { pageTitle: "Login", errorMessages, formValues: { username } });
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
