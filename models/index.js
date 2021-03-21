const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

//  User/Post 
User.hasMany(Post, {
    foreignKey: "user_id"
});

Post.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "SET NULL"
});

// User/Comment
User.hasMany(Comment, {
    foreignKey: "user_id",
    onDelete: "SET NULL"
});

Comment.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "SET NULL"
});

// Post/Comment 
Post.hasMany(Comment, {
    foreignKey: "post_id"
});

Comment.belongsTo(Post, {
    foreignKey: "post_id",
    onDelete: "SET NULL"
});


module.exports = { User, Post, Comment };