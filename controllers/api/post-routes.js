const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all posts "/api/posts"
router.get("/", (req, res) => {
    Post.findAll({
        attributes: [
            "id",
            "title",
            "contents",
            "created_at"
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    "id", 
                    "comment_text", 
                    "post_id", 
                    "user_id", 
                    "created_at"
                ],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => res.status(500).json(err));
});

// GET single post "/api/posts/:id"
router.get("/:id", withAuth, (req, res) => {
    Post.findOne({
        where: {id: req.params.id},
        attributes: [
            "id", 
            "title", 
            "contents",
            "created_at"
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    "id", 
                    "comment_text", 
                    "post_id", 
                    "user_id", 
                    "created_at"
                ],
                include: {
                    model: User,
                    attributes: ["username"]
                }
            },
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: "invalid id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.status(500).json(err));
});

// CREATE "/api/posts"
router.post("/", withAuth, (req, res) => {
    
    Post.create({
        title: req.body.title,
        contents: req.body.contents,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => res.status(500).json(err));
});

// UPDATE "/api/posts/:id"
router.put("/:id", withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            contents: req.body.contents
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: "invalid id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.status(500).json(err));
});

// DELETE a post "/api/posts/:id"
router.delete("/:id", withAuth, (req, res) => {
    Post.destroy({
        where: { id: req.params.id }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: "invalid id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;