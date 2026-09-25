const User = require('../Models/user')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../Errors')

const cookieOptions = {
  // modieifed by server only
  httpOnly: true, 
  secure: true 
};

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    //save token into DB
    await user.save({validateBeforeSave: false})

    return {accessToken , refreshToken}

}

const register = async (req, res ) =>{

    const { username, fullName, email, password } = req.body;

    const user = await User.create({ username, fullName, email, password });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    res.status(StatusCodes.CREATED).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
}



const login = async (req,res ) =>{
    const {email, username, password} = req.body
    
    if((!email && !username) || !password){
        throw new BadRequestError("Please Provide email and password")
    }

    // const user = await User.findOne({ email });
    const user = await User.findOne({ 
      $or: [{username}, {email}]
    })
    .select('+password')

    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }

    //comapre pass
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials")
    }

    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    //user info without password
    const safeUser = {
    id: user._id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };


  if (user.role === 'admin') {
    return res
      .status(StatusCodes.OK)
      //create cookie                        // ... spread operator copies properties from cookieOptions
      .cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 }) // 15 min
      .cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }) // 7 days
      .json({ message: 'Login successful', user: safeUser });
  }

  return res.status(StatusCodes.OK).json({
    message: 'Login successful',
    user: safeUser,
    accessToken,
    refreshToken,
  });
    
}

//logout user
const logout = async (req, res) => {
  //Remove the refresh token from the database
  await User.findByIdAndUpdate(req.user.userId, { refreshToken: '' });

  if (req.user.role === 'admin') {
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }

  res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
};


module.exports = {
    register,
    login
}