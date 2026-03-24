"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const configuration_1 = __importDefault(require("../config/configuration"));
/** Await before app.listen() so requests never hit Mongoose while still buffering (10s timeout). */
const Connection = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(configuration_1.default.MONGO_URI);
    console.log("successfully connected to database", mongoose_1.default.connection.host);
});
exports.default = Connection;
//# sourceMappingURL=connection.js.map