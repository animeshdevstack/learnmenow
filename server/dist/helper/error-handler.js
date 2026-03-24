"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
}
//# sourceMappingURL=error-handler.js.map