const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

//get all users
router.get('/', (req, res) => {
    console.log('=======================');
    Post.findAll({
        //query config
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get single user
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create a user
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// .then(() => {
//     //then find the post that was voted on
//     return Post.findOne({
//         where: {
//             id: req.body.post_id
//         },
//         attributes: [
//             'id',
//             'post_url',
//             'title',
//             'created_at',
//             //use raw MySQL to get count of votes
//             [
//                 sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//                 'vote_count'
//             ]
//         ]
//     })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(err => {
//         console.log(err);
//         res.status(400).json(err);
//     });
// });

//upvote a post
router.put('/upvote', (req, res) => {
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    }).then(() => {
        //then find the post that was voted on
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at',
                //use raw MySQL to get count of votes
                [
                    sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                    'vote_count'
                ]
            ]
        })
            .then(dbPostData => res.json(dbPostData))
            .catch(err => res.json(err));
    });
});

//update a user
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete a user
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
