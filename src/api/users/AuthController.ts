import * as Hapi from "hapi";
import * as Boom from "boom";
import _ from "lodash";
import * as Bcrypt from "bcryptjs";

import { IUser, User } from "../../models/User";
import { IRequest } from "../../config/request";
import * as Helper from "../../utils/helper";

export default class AuthController {
    // Login with email and password -> return token
    public async login(request: IRequest, reply: Hapi.ResponseToolkit) {
        try {
            const payload = request.payload
            const user = await User.findOne(
                { email: payload.email },
                { createdAt: 0, updateAt: 0 }
            )
            if (user) {
                const passwordCheck = await Bcrypt.compare(payload.password, user.password)
                if (passwordCheck) {
                    const token = Helper.generateToken(user)
                    const users = await User.findOne(
                        { _id: user._id },
                        { createdAt: 0, updateAt: 0, roles: 0, password: 0, status: 0, forgetPasswordToken: 0 }
                    )
                    await User.findOneAndUpdate(
                        { _id: user._id },
                        { $set: { forgetPasswordToken: '' } }
                    )
                    return reply.response({
                        status: true,
                        message: "Logged-in successfully.",
                        data: { token, user: users }
                    }).code(200)
                } else {
                    return reply.response({
                        status: false,
                        message: "Wrong Password. Please try again.",
                        data: {}
                    }).code(200)
                }
            } else {
                return reply.response({
                    status: false,
                    message: "Login email not found. Please register.",
                    data: {}
                }).code(200)
            }
        } catch (error) {
            return reply.response({
                status: false,
                message: error.message,
                data: {}
            }).code(401);
        }
    }
    // Authenticate user and get deatils from token
    public async authenticate(request: IRequest, reply: Hapi.ResponseToolkit) {
        const userId = request.auth.credentials.id;
        const user = await User.findOne(
            { _id: userId, status: true },
            { createdAt: 0, updateAt: 0, roles: 0, password: 0, status: 0, forgetPasswordToken: 0 }
        )
        if (user) {
            const token = Helper.generateToken(user)
            return reply.response({
                status: true,
                message: "ok",
                data: user,
                token: token
            }).code(200)
        } else {
            return reply.response({
                status: false,
                message: "Token expire. Please Login Again.",
                data: []
            }).code(200)
        }
    }
    // Registration user based on email and basic details
    public async registration(request: IRequest, reply: Hapi.ResponseToolkit) {
        try {
            const payload: IUser = <IUser>request.payload;
            let user = await User.findOne({ email: payload.email })
            if (!user) {
                user = await User.create(payload)
                return reply.code(200).response({
                    status: true,
                    message: "User created successfully.",
                    data: _.pick(user, [
                        "name",
                        "userName",
                        "email",
                        "_id",
                        "country",
                        "title"
                    ])
                })
            } else {
                return reply.code(200).response({
                    status: false,
                    message: "User already exists with this email address!!!",
                    data: []
                })
            }
        } catch (error) {
            return reply.code(200).response({
                status: false,
                message: error.message,
                data: []
            })
        }
    }

}
