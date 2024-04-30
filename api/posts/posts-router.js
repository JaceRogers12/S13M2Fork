// implement your posts router here
const express = require("express");
const {
    find,
    findById,
    insert,
    update,
    remove,
    findPostComments,
    findCommentById,
    insertComment,
} = require("./posts-model.js");

const router = express.Router();

// endpoints here
router.get("/", async (req, res) => {
    find()
        .then(result => res.status(200).send(result))
        .catch(result => res.status(500).send({ message: "The posts information could not be retrieved" }))
});

router.get("/:id", async (req, res) => {
    findById(req.params.id)
        .then(result => {
            result? res.status(200).send(result) : res.status(404).send({ message: "The post with the specified ID does not exist" })
        })
        //.catch(result => )
});

router.post("/", async (req, res) => {
    const newPost = req.body;
    if (!newPost.title || !newPost.contents) {
        res.status(400).send({ message: "Please provide title and contents for the post" })
    } else {
        insert(newPost)
            .then(result => {
                find()
                    .then(posts => {
                        let selectedPost = posts.find(post => newPost.title == post.title);
                        res.status(201).send(selectedPost)
                    })
            })
            .catch(result => res.status(500).send({ message: "There was an error while saving the post to the database" }))
    }
});

router.put("/:id", async (req, res) => {
    const updatedPost = req.body;
    findById(req.params.id)
        .then(selectedPost => {
            if (!selectedPost) {
                res.status(404).send({ message: "The post with the specified ID does not exist" })
            } else if (!updatedPost.title || !updatedPost.contents){
                res.status(400).send({ message: "Please provide title and contents for the post" })
            } else {
                update(req.params.id, updatedPost)
                    .then(result => {
                        findById(req.params.id).then(nowPost => res.status(200).send(nowPost))
                    })
                    .catch(result => res.status(500).send({ message: "The post information could not be modified" }))
            }
        })
});

router.delete("/:id", async (req, res) => {
    let selectedPost;
    findById(req.params.id)
        .then(result => {
            selectedPost = result;
            if (!selectedPost) res.status(404).send({ message: "The post with the specified ID does not exist" });
    });
    remove(req.params.id)
        .then(result => res.status(200).send(selectedPost))
        .catch(result => res.status(500).send({ message: "The post could not be removed" }))
});

router.get("/:id/comments", async (req, res) => {
    findById(req.params.id)
        .then(selectedPost => {
            if (!selectedPost) {
                res.status(404).send({ message: "The post with the specified ID does not exist" })
            } else {
                findPostComments(req.params.id)
                    .then(result => res.status(200).send(result))
                    .catch(result => res.status(500).send({ message: "The comments information could not be retrieved" }))
            }
    })
});
// no more endpoints

module.exports = router;