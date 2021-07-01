module.exports = {
  validate: (req, res) => {
    req.check("email", "Email is invalid").trim().isEmail();
    req.check("email", "Email cannot be empty").notEmpty();
    req.check("fname", "First name cannot be empty").notEmpty();
    req.check("lname", "Last name cannot be empty").notEmpty();
    req.check("password", "Password cannot be empty").notEmpty();
    req.check("password", "Password must be 6 to 12 characters").isLength({
      min: 6,
      max: 12,
    });
    req
      .check("password", "Password must contain alphabetic/numeric values only")
      .matches(/^[a-zA-Z0-9]+$/);

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let errMessages = error.array().map((e) => e.msg);
        req.skip = true;
        req.session.message = {
          type: "danger",
          message: errMessages,
        };
        res.locals.message = req.session.message;
        res.json(res.locals.message);
      } else {
        req.session.message = {
          type: "success",
          message: "User account has been created successfully!",
        };
        res.json(res.locals.message);
      }
    });
  },
  logInValidate: (req, res) => {
    req.check("email", "Email is invalid").trim().isEmail();
    req.check("email", "Email cannot be empty").notEmpty();
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let errMessages = error.array().map((e) => e.msg);
        req.skip = true;
        req.session.message = {
          type: "danger",
          message: errMessages,
        };
        res.locals.message = req.session.message;
        console.log("error: ", res.locals.message);
        res.json(res.locals.message);
      } else {
        req.session.message = {
          type: "success",
          message: "You are logged in!",
        };
        console.log("success: ", res.locals.message);
        res.json(res.locals.message);
      }
    });
  },
  register: (req, res, next) => {
    console.log("registeration in process");
    // if (user) {
    //   req.flash(
    //     "success",
    //     `An account for ${user.email} has been created successfully!`
    //   );
    //   res.locals.redirect("/");
    //   next();
    // } else {
    //   req.flash(
    //     "error",
    //     `Failed to create user account because ${error.message}.`
    //   );
    next();
    // }
  },
  redirectView: (req, res) => {
    console.log(`redirectView - ${res.locals.redirect}`);
    res.redirect("/");
    let redirectPath = res.locals.redirect;
    // if (redirectPath !== undefined) {
    //   console.log("redirect path exists");
    //   res.redirect(redirectPath);
    // } else {
    //   console.log("redirect path not exists");
    //   //next();
    // }
  },
};
