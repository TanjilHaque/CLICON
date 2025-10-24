const { apiResponse } = require("../uitils/apiResponse");
const { asyncHandler } = require("../uitils/asyncHandler");
const { customError } = require("../uitils/customError");
const orderModel = require("../models/order.model");
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.SSLC_STORE_ID;
const store_passwd = process.env.SSLC_STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "developement" ? false : true;
// sucess
exports.successPayment = asyncHandler(async (req, res) => {
  const { val_id } = req.body;
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const validateData = await sslcz.validate({ val_id });

  const { status, tran_id } = validateData;

  await orderModel.findOneAndUpdate(
    {
      transactionId: tran_id,
    },
    {
      paymentStatus: status == "VALID" && "success",
      transactionId: tran_id,
      paymentGatewayData: validateData,
      orderStatus: "Confirmed",
    }
  );
  apiResponse.sendSuccess(res, 200, "payment sucess", null);
});

exports.failPayment = asyncHandler(async (req, res) => {
  console.log(req.body);
  return res.redirect("https://www.npmjs.com/package/chalk/v/4.1.2");
});
exports.canclePayment = asyncHandler(async (req, res) => {
  console.log(req.body);
  return res.redirect("https://www.npmjs.com/package/chalk/v/4.1.2");
});
exports.ipnPayment = asyncHandler(async (req, res) => {
  console.log(req.body);
  apiResponse.sendSuccess(res, 200, "ipn notification", req.body);
});
