const express = require('express')
const app = express()

require('dotenv').config()

const cookieParser = require('cookie-parser')
const cors = require('cors')


const connectDb = require('./Db/connect')
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoute');


const notFound = require('./Middlewares/not-found');
const errorHandlerMiddleware = require('./Middlewares/error-handler');


const port = process.env.PORT  || 3000




//Middleware
app.use(express.json()) //allows your server to understand JSON data.
app.use(cookieParser())  //allows us to read cookies.
app.use(cors()) // allows requests from another frontend such as React.



app.get('/', (req, res) => {
  res.json({
    message: 'Authentication API is running'
  });
});

//routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);


app.use(notFound);
app.use(errorHandlerMiddleware);



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
    
