module.exports = {
  index: (req, res) => {
    let roomId = req.params.id;

    res.render("reserve", {
      layout: false,
    });
  },
  validate: (req, res, next) => {
    next();
  },
};
