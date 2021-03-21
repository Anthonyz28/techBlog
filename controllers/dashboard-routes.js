const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} =require('../models');

// get posts user created
router.get('/', (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes:  [
            "id",
            "title",
            "contents",
            "created_time"
        ],
        include:[
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_time'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true}));

        res.render('dashboard', {
            post,
            loggedIn: true
        });
    })
    .catch(err => res.status(500).json(err));
});

// edit single-post 
router.get("/edit/:id", withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            "id",
            "title",
            "contents",
            "created_time"
        ],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_time"],
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
                res.status(404).end();
                return;
            }

            const post = dbPostData.get({ plain: true });

            res.render("edit-post", {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => res.status(500).json(err));
    });

    module.exports = router;