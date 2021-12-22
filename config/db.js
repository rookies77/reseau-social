const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://'+ process.env.DB_USER_PASS +'@cluster0.hcso8.mongodb.net/reseau-social', {
    useNewUrlParser: true ,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(
    ()=>{
    console.log(' Conneced to MongoDB ');
    }
).catch(
    (err)=>{
    console.log(' Failed to connect to MongoDB:', err);
    }
)