const express = require('express');
const app =express();
const connectDB =require('./config/db');

app.get('/',(req,res) => res.send('API running'));

// connectDB
connectDB();

// Init middleware
app.use(express.json({extended:false}))

// Define Route

 app.use('/api/users', require('./routes/api/users'));
 app.use('/api/auth', require('./routes/api/auth'));
 app.use('/api/posts', require('./routes/api/posts'));
 app.use('/api/profile', require('./routes/api/profile'));



const PORT =process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is running ${PORT}`));

