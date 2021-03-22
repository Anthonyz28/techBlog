const router = require("express").Router();
const { compareSync } = require("bcrypt");
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all users "/api/users"
router.get("/", (req, res) => {
    User.findAll({
        attributes: { exclude: ["password"] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(500).json(err));
});

// GET user by id "/api/users/:id"
router.get("/:id", withAuth, (req, res) => {
    User.findOne({
        attributes: { exclude: ["password"] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: [
                    "id", 
                    "title", 
                    "contents", 
                    "created_at"
                ]
            },
            {
                model: Comment,
                attributes: [
                    "id",
                    "comment_text", 
                    "created_at"
                ],
                include: {
                    model: Post,
                    attributes: ["title"]
                }
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "invalid id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
});

// CREATE user
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
        .catch(err => res.status(500).json(err));
});

// LOGIN "/api/users/login"
router.post("/login", (req, res) => {
    console.log(req.body.password);

    User.findOne({
        where: { email: req.body.email }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: "invalid id" })
                return;
            }

            // validation
            const validPW = dbUserData.checkPassword(req.body.password);
            if (!validPW) {
                console.log("!validPW");
                res.status(400).json({ message: "wrong password!" });
                return;
            }

            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({
                    user: dbUserData,
                    message: "You are now logged in!"
                });
            });
        })
        .catch(err => res.status(500).json(err));
});

// LOGOUT
router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// UPDATE "/api/users/:id"
router.put("/:id", withAuth, (req, res) => {
   
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "invalid id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
});

// DELETE "/api/users/:id"
router.delete("/:id", withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: "invalid id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;