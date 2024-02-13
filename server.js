const express = require('express');
const app =express();
const connectDB =require('./config/db');

app.get('/',(req,res) => res.send('API running'));

// connectDB
connectDB();

// Init middleware
app.use(express.json({extended:false}))

// Define Route

const userRoute =require('./routes/api/users');
const authRoute=require('./routes/api/auth');
const authPosts=require('./routes/api/posts');
const authProfile=require('./routes/api/profile');

 app.use('/api/users', userRoute);
 app.use('/api/auth', authRoute);
 app.use('/api/posts', authPosts);
 app.use('/api/profile',authProfile );



const PORT =process.env.PORT ||  5000

app.listen(PORT, () => console.log(`Server is running ${PORT}`));

