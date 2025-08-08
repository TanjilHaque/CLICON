const apiResponse = class ApiResponse {
  constructor(status, message, data) {
    this.status = status >= 200 && status < 300 ? "OK" : "Error";
    this.statusCode = status || 500;
    this.message = message || "Success";
    this.data = data;
  }
  static sendSuccess(res, status, message, data) {
    return res.status(status).json(new apiResponse(status, message, data));
  }
};

module.exports = { apiResponse };

/*
  ✅ Example Usage in an Express.js Route:

  const express = require('express');
  const app = express();

  app.get('/api/user', (req, res) => {
    const user = {
      id: 1,
      name: "Tanjil",
      role: "Developer"
    };

    // Send formatted success response using the helper class
    return apiResponse.sendSuccess(res, 200, "User fetched successfully", user);
  });

  Output JSON:
  {
    "status": "OK",
    "statusCode": 200,
    "message": "User fetched successfully",
    "data": {
      "id": 1,
      "name": "Tanjil",
      "role": "Developer"
    }
  }

  📝 Notes:
  - `res` is the Express.js response object.
  - The `sendSuccess` method builds and sends the response in a clean format.
  - This helps keep route handlers clean and consistent.
*/
