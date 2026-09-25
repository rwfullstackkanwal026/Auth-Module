const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const cors = require('cors')


const connectDb = require('./Db/connect')
const authRoutes = require('./Routes/authRoutes');
require('dotenv').config()

const port = process.env.PORT  || 3000




//Middleware
app.use(express.json()) //allows your server to understand JSON data.
app.use(cookieParser())  //allows us to read cookies.
app.use(cors()) // allows requests from another frontend such as React.

//routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Authentication API is running'
  });
});




const startServer = async ()=>{
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, ()=>{
         console.log(`Server is listening on port ${port}`);}
        )
        
    } catch (error) {
        console.log(error);}

}
startServer()
    
