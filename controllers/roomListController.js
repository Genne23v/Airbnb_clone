module.exports = {
  index: (req, res) => {
    res.render("room-listing", {
      layout: false,
    });
  },
};
