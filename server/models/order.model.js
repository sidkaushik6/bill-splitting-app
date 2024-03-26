const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      share: { type: Number, required: true },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;