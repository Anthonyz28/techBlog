const router = require("express").Router();
const { Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all "/api/comments"
router.get("/", (req, res) => {
    Comment.findAll({
        attributes: [
            "id",
            "comment_text",
            "user_id",
            "post_id"
        ],
        order: [["created_at", "DESC"]],
        include: [
            {
                model: User,
                attributes: ["username"]
            }
        ]
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => res.status(500).json(err));
});

// CREATE "/api/comments"
router.post("/", withAuth, (req, res) => {
 
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => res.status(500).json(err));
    }
});

// DELETE "/api/comments/:id"
router.delete("/:id", withAuth, (req, res) => {
    Comment.destroy({ where: { id: req.params.id }})
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: "invaid id" });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => res.status(500).json(err));
});

module.exports = router;