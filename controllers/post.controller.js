const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.readPost = async (req, res) => {
  console.log(' PostModel readPost:',);
  PostModel.find((err, docs) => {
    console.log(' docs:', docs);
    if (!err)
      res.send(docs);
    else
      console.log(' Erro to get data :', err);
  }).sort({ createdAt: -1 });

}

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],

  })

  try {
    const post = await newPost.save();
    return res.status(201).json(post)

  } catch (err) {
    return res.status(400).send(err)
  }
}

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  const updatedRecord = {
    message: req.body.message
  }
  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err)
        res.send(docs);
      else
        console.log('Update error : ' + err)
    }
  )

}

module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  PostModel.findByIdAndRemove(
    req.params.id,
    (err, docs) => {
      if (!err)
        res.send('docs deleted : ' + docs);
      else
        console.log('Delete error : ' + err)
    })
}

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id }
      },
      { new: true },
      (err, docs) => {
        if (err)
          return res.status(400).send('LikePost Error : ' + err)
      }
    );

    await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { like: req.params.id }
      },
      { new: true },
      (err, docs) => {
        if (!err)
          res.send(docs)
        else
          return res.status(400).send('Error postLike sur le user' + err)
      }
    )
  } catch (err) {
    return res.status(400).send('Error postLike sur le user dans le catch : ' + err)
  }
}

module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (err)
          res.status(400).json(err)
      }
    )

    await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { like: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        if (err)
          res.status(400).json(err)
        else
          res.status(200).send(docs)
      }
    )

  } catch (err) {
    return res.status(500).json({ message: err })

  }
}

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  try {
    console.log(' try commentPost:',);
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime()
          }
        }
      },
      { new: true },
      (err, docs) => {
        if (!err)
          res.status(200).send(docs)
        else
          return res.status(400).send('error commentpost ' + err)
      }
    )
  } catch (err) {
    console.log('coucou catch err commentPost :',);
    return res.status(400).send('error dans le catch postcomment :' + err)


  }

}
module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  try {
    console.log(' req.body.commentIdd:', req.body.commentId);
    return PostModel.findById(
      req.params.id,
      (err, docs) => {
        // console.log('docs :', docs);
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );

        if (!theComment)
          return res.status(404).send('Comment not found' + err);

        theComment.text = req.body.text;

        return docs.save((err) => {
          if (!err)
            return res.status(200).send(docs)
          else
            return res.status(500).send('error editComment : ' + err)
        })
      }
    )


  } catch (err) {
    return res.status(400).send('editPost catch : ' + err)

  }
}



module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknow : ' + req.params.id);

  try {

    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: {
            _id: req.body.commentId
          }
        }
      },
      { new: true },
      (err, docs) => {
        if (!err)
          return res.status(200).send(docs);
        else
          return res.status(400).send(err)
      }
    )

  } catch (err) {
    return res.status(400).send(err)

  }
}
