const UserModel = require('../models/user.model.js');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async (req, res) => {

    // console.log(' req.params:', req.params.id);
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknow: ' + req.params.id)
    await UserModel.findById(req.params.id, (err, docs) => {
        if (!err)
            res.send(docs);
        else
            console.log('ID unknow : ' + err);
    }).select('-password')
}

module.exports.updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknow: ' + req.params.id);
    try {
        await UserModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            },
            (err, docs) => {
                if (!err)
                    return res.send(docs);
                if (err)
                    return res.status(500).send({ message: err });
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }

}

module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send('ID unknow: ' + req.params.id);

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: 'Successfully deleted' })
    } catch (err) {
        return res.status(500).json({ message: err });

    }

}

module.exports.follow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknow: ' + req.params.id);

    try {
        // add to follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err)
                    res.status(200).json(docs);
                else
                    return res.status(400).json(err)
            }
        )

        //add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err)
                    res.status(400).json(err)// on affiche uniquement l'erreur 
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}


module.exports.unfollow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknow: ' + req.params.id);

    try {
        // delete to follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err)
                    res.status(200).json(docs);
                else
                    return res.status(400).json(err)
            }
        )

        //add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err)
                    res.status(400).json(err)// on affiche uniquement l'erreur 
            }
        )

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}