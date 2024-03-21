class ApiError extends Error  {
    statusCode;
    success
    errors;

    constructor(
        statusCode,
        message= "Something went wrong",
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.success = false;
        this.stack = ''

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

module.exports = ApiError