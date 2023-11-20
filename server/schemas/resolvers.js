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
  


    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate('savedBooks');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    
    saveBooks: async (parent, { bookInput }, context ) => {
      if (!context.user) {
        throw new AuthenticationError('You need to be logged in!');
      }

      // Add code to check if the book is already saved, to avoid duplicates
      const bookAlreadySaved = context.user.savedBooks.find(book => book.bookId === bookInput.bookId);
      if (bookAlreadySaved) {
        throw new Error('Book already saved');
      }

      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookInput } },
        { new: true }
      );
    }
  
  },

};

module.exports = resolvers;
