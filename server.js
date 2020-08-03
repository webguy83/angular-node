
const express = require('express');
const postRoutes = require('./backend/routes/posts');
const userRoutes = require('./backend/routes/users');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config();

const app = express();

mongoose.connect(`mongodb+srv://jankguy83:${process.env.MONGO_DB_PASSWORD}@cluster-bunk.lfrbt.mongodb.net/node-angular?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB is on yay!'))
  .catch(console.log)

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join("backend/images")))

app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log('Hazaah the server is going! Yes!')
})
