module.exports = {
  index: (req, res, next) => {
    if (req.session.loggedIn) {
      if (req.session.user.admin) {
        console.log(`Admin logged in!`);
        res.redirect("/admin");
        // res.render("admin", { layout: false, userFname: req.session.user });
      } else {
        res.render("room-listing", {
          layout: false,
          loggedIn: req.session.loggedIn,
          userFname: req.session.user,
        });
      }
    } else {
      console.log(`room-listing refreshed after logout`);
      res.render("room-listing", { layout: false });
    }
  },
  logout: (req, res, next) => {
    req.logout();
    req.session.loggedIn = false;
    console.log(`User logged out on room listing page ${req.baseUrl}`);
    console.dir(req.baseUrl);
    res.locals.redirect = "/room-listing";
    next();
    // res.render("room-listing", {
    //   layout: false,
    //   loggedIn: req.session.loggedIn,
    // });
  },
  redirectView: (req, res, next) => {
    console.log(`Login status: ${res.locals.loggedIn}`);
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      console.log(`Redirecting to ${redirectPath}`);
      res.redirect(redirectPath);
    } else next();
  },
};
