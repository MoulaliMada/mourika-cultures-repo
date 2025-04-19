const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/place-order/:customerid", orderController.addOrder);
router.get("/all-orders", orderController.getAllOrders);
router.get("/all-orders/:customerid", orderController.getAllOrdersByCustomerId);
router.put(
  "/cancel/:orderId/:customerId",
  orderController.cancelOrderByCustomer
);

router.put(
  "/update-order-status/:orderId",
  orderController.updateOrderStatusByVendor
);

router.get("/orders-by-customer", orderController.getOrdersByCustomerForVendor);
module.exports = router;
