const { User} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {






  Mutatation: {
    createUser: async(parent, args, { username, email, password}) => {
      const user = await User.create({ username, email, password});
      const token = signToken(user);
      return { token, user };
    }
  }
}