const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

let bookingSchema = new Schema(
  {
    userId: {
      type: String,
      require: true,
    },
    roomId: {
      type: String,
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
      type: Date,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
