const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  marketName: {
    type: String,
    min: 5,
    max: 80,
    required: [true, 'Please add market name btw [5-80] characters.'],
  },
  cmdtyName: {
    type: String,
    required: [true, 'Please add cmdtyName.'],
  },
  users: {
    type: [String],
    required: [true, 'Please add users.'],
  },
  marketID: {
    type: String,
    required: [true, 'Please add marketID'],
  },
  cmdtyID: {
    type: String,
    required: [true, 'Please add cmdtyId.'],
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
  priceUnit: {
    type: String,
    default: 'Kg',
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Report', reportSchema);
