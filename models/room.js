const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      default: 0,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    photos: {
      fileName: {
        type: String,
        require: true,
      },
      filePath: {
        type: String,
      },
      fileType: {
        type: String,
      },
      fileSize: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Room', roomSchema);
