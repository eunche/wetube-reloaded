export const localMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        res.locals.loggedIn = true;
        res.locals.user = req.session.user;
    }
    res.locals.siteName = "Wetube";
    next();
}