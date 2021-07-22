export const localMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        res.locals.loggedIn = true;
        res.locals.user = req.session.user;
    }
    res.locals.siteName = "Wetube";
    next();
}

export const blockLoggedInUserMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    } else {
        next();
    }
}

export const blockAnonymousUserMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        res.redirect("/login");
    } else {
        next();
    }
}