
const mongoose = require('mongoose');
module.exports= async function(){

    var User = mongoose.model('User');
    var Idea = mongoose.model('Idea');
    var Comment = mongoose.model('Comment');
    var Article = mongoose.model('Article');
    var Sequence = mongoose.model('Sequence');
    await User.remove({});
    await Idea.remove({});
    await Comment.remove({});
    await Article.remove({});
    await Sequence.remove({});

    var users = [
        new User({corpId:'a000011', name:'Bob'}),
        new User({corpId:'a000012', name:'Job'}),
        new User({corpId:'a566833', name:'Roc'}),
        new User({corpId:'a333333', name:'Three'}),
    ]
    users.forEach(async (user) => {
        await user.save()
    });
    console.log(users.length + ' Users saved');

    var idea1 = new Idea({
        name: 'first test Idea',
        creator: users[0],
        likedBy: [users[1],users[2]]
    })
    await idea1.save();
    var article = new Article({
        title: 'Our idea is real',
        author: users[0]
    })
    article = await article.save();
    idea1.articles.push(article);
    idea1.save();
    var idea2 = new Idea({
        name: 'test Idea',
        creator: users[1],
        likedBy: [users[0],users[2]]
    })
    await idea2.save();
    console.log("completed");
}
