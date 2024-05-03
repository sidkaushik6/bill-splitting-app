const Order = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    const { title, description, totalAmount } = req.body;
    // const newOrder = new Order({ title, description, totalAmount, participants: [] });
    const newOrder = new Order({
      title,
      description,
      totalAmount,
      participants: [{ user: req.userId, share: totalAmount }],
    });
    const savedOrder = await newOrder.save();
    //console.log('Request stuf ::::: ', req)
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "participants.user": req.userId,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      "participants.user": req.userId,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateOrder = async (req, res) => {
  // try {
  //   const updatedOrder = await Order.findByIdAndUpdate(
  //     req.params.id,
  //     { $set: req.body },
  //     { new: true }
  //   );
  //   if (!updatedOrder) {
  //     return res.status(404).json({ message: 'Order not found' });
  //   }
  //   res.status(200).json(updatedOrder);
  // } catch (error) {
  //   res.status(500).json({ message: 'Something went wrong' });
  // }

  try {
    const { title, description, totalAmount } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the current user is the creator of the order
    if (order.participants[0].user.toString() === req.userId) {
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        totalAmount,
      };

      // Calculate the new share for each participant
      const totalParticipants = order.participants.length;
      const newShare = totalAmount / totalParticipants;

      // Update the totalAmount and the share for each participant
      const updatedParticipants = order.participants.map((p) => ({
        user: p.user,
        share: newShare,
      }));

      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...updateData,
            participants: updatedParticipants,
          },
        },
        { new: true }
      );

      res.status(200).json(updatedOrder);
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this order" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
