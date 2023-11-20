const { sign } = require('jsonwebtoken');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {  
    // Query to get the logged-in user's data, including saved books
    me: async (parent, args, context ) => {
      if (context.user) {
        return User.findOne({_id: context.user._id}).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged-in');
    },

  },
  Mutation: {
    // Existing createUser mutation
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    
    // Corrected login mutation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        // Make sure to provide a message when throwing an AuthenticationError
        throw new AuthenticationError('No user found with this email address');
      }

      // Check the provided password against the user's stored password
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        // Again, provide an error message
        throw new AuthenticationError('Incorrect credentials');
      }

      // Generate a token with the user object, not profile
      const token = signToken(user);
      return { token, user };
    },

      saveBook: async ( __ , { input }, context) => {
        if (context.user) {
            return User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
            );
        }
        throw new AuthenticationError('Please login.');
    },

    removeBook: async (_, { bookId }, context) => {
      if (context.user) {
        try {
          const updateUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          );
          return updateUser;
        } catch (error) {
          console.error(error); // Log the error for debugging
          throw new Error('Error removing the book.'); // Throw a more generic error to the client
        }
      }
      throw new AuthenticationError('Please login.');
    },
    


  },
};

module.exports = resolvers;
  


