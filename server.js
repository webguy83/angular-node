const express = require('express');
const postRoutes = require('./backend/routes/posts');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://jankguy83:${process.env.MONGO_DB_PASSWORD}@cluster-bunk.lfrbt.mongodb.net/node-angular?retryWrites=true&w=majority`)
  .then(() => console.log('DB is on yay!'))
  .catch(console.log)

app.use(bodyParser.json());
app.use(cors());

app.use('/posts', postRoutes)


app.listen(process.env.PORT || 3000, () => {
  console.log('Hazaah the server is going! Yes!')
})
