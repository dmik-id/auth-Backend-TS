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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const token_model_1 = require("../models/token-model");
const jwt = require('jsonwebtoken');
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15d' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        };
    }
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }
        catch (e) {
            return null;
        }
    }
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepo = typeorm_1.getRepository(token_model_1.Token);
            const tokenData = yield tokenRepo.findOne({ where: { user: userId } });
            if (tokenData) {
                tokenData.refreshToken = refreshToken;
                return tokenRepo;
            }
            const token = yield tokenRepo.create({ user: userId, refreshToken });
            yield tokenRepo.save(token);
            return token;
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepo = typeorm_1.getRepository(token_model_1.Token);
            const user = yield tokenRepo.findOne(refreshToken);
            const tokenData = yield tokenRepo.remove(user);
            return tokenData;
        });
    }
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepo = typeorm_1.getRepository(token_model_1.Token);
            const tokenData = yield tokenRepo.findOne({ refreshToken });
            return tokenData;
        });
    }
}
module.exports = new TokenService();
