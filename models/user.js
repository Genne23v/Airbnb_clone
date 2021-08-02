const mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  passportLocalMongoose = require("passport-local-mongoose"),
  Schema = mongoose.Schema;

let userSchema = new Schema(
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
  }
);

userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) console.log("An error occurred while hashing password", err);
      user.password = hash;
      console.log(`User on save: ${user}`);
      next();
    });
  });
});

userSchema.methods.comparePasswords = async function (userPassword, isMatch) {
  console.log(`User Password: ${userPassword}`);
  console.log(`this: ${this}`);
  isMatch = await bcrypt.compare(userPassword, this.password);

  return isMatch;
};

//AUTHENTICATION STRATEGY TEST
// userSchema.methods.authenticate = async function (userPassword, isMatch) {
//   console.log(`User Password: ${userPassword}`);
//   console.log(`this: ${this}`);
//   isMatch = await bcrypt.compare(userPassword, this.password);

//   return isMatch;
// };

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  saltlen: 10,
});

module.exports = mongoose.model("User", userSchema);
