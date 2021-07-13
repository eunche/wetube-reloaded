export const trending = (req, res) => {
    const videos = [
        {
            rating: 5,
            comments: 2,
        },
        {
            rating: 3,
            comments: 1,
        }
    ];
    return res.render("home", { pageTitle: "Home", videos });
}

export const search = (req, res) => res.send("Search");

export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });

export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });

export const remove = (req, res) => res.send("Remove");

export const upload = (req, res) => res.send("Upload");