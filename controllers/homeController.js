nodeMailer = require("nodemailer");

module.exports = {
  index: (req, res) => {
    res.render("main", {
      layout: false,
    });
  },

  validate: (req, res) => {
    const userName = req.body.fname;

    if (req.body.email.length > 0) {
      req.check("email", "Email is invalid").trim().isEmail();
    }
    req.check("email", "Email cannot be empty").notEmpty();
    req.check("fname", "First name cannot be empty").notEmpty();
    req.check("lname", "Last name cannot be empty").notEmpty();
    req.check("password", "Password cannot be empty").notEmpty();

    if (req.body.password.length > 0) {
      req.check("password", "Password must be 6 to 12 characters").isLength({
        min: 6,
        max: 12,
      });
      req
        .check(
          "password",
          "Password must contain alphabetic/numeric values only"
        )
        .matches(/^[a-zA-Z0-9]+$/);
    }

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
          message: `Account for ${userName} has been created successfully!`,
        };
        //SENDING A WELCOME EMAIL TO USER
        let transporter = nodeMailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "8ec9660437b0e0",
            pass: "f035649050c9a3",
          },
        });
        let mailOptions = {
          from: "d642f85f6d-9ae820@inbox.mailtrap.io",
          to: req.body.email,
          subject: "You have submitted a sign-up form to Airbnb",
          text: `Dear, ${req.body.fname}. You have recently submitted a registration form to Airbnb`,
        };
        transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            console.log("Error" + err);
          } else {
            console.log(`Email sent to ${req.body.email} successfully.`);
          }
        });

        res.locals.message = req.session.message;
        res.json(res.locals.message);
      }
    });
  },
  logInValidate: (req, res) => {
    const userEmail = req.body.email;

    if (req.body.email.length > 0) {
      req.check("email", "Email is invalid").trim().isEmail();
    }
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
        res.json(res.locals.message);
      } else {
        req.session.message = {
          type: "success",
          message: `Welcome back, ${userEmail}!`,
        };
        res.locals.message = req.session.message;
        res.json(res.locals.message);
      }
    });
  },
};
