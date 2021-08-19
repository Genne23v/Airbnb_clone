const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      fname: {
        type: String,
        trim: true,
      },
      lname: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) console.log('An error occurred while hashing password', err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePasswords = async function (userPassword, isMatch) {
  isMatch = await bcrypt.compare(userPassword, this.password);

  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
