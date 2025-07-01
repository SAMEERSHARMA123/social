   const jwt = require('jsonwebtoken');

   const user_token = (user) => {
      const token = jwt.sign(
              { id: user._id, email: user.email },
              process.env.JWT_SECRET,
              { expiresIn: '1h' }
            );

            return token

            
   }


   module.exports = {user_token}


   