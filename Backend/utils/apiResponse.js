class ApiResponse {
  statusCode;
  message;
  data;
  success;
  constructor(
    statusCode,
    message,
    data,
    success
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = success;
  }
}
module.exports = ApiResponse