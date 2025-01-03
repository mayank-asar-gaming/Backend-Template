import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import { ErrorHandler } from "./utils/error_handler";
import {} from "./api";

export const configureExpress = async (app: Express) => {
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));
    app.use(
        cors({
            origin: "*",
            credentials: true,
        }),
    );

    app.use(morgan("common"));

    app.use((req: any, res: any, next: any) => {
        const userAgent: any = req.headers["user-agent"];

        // You can parse the user agent string to get information about the client
        if (userAgent.includes("Windows")) {
            req.clientPlatform = "Windows";
        } else if (userAgent.includes("Android")) {
            req.clientPlatform = "Android";
        } else if (userAgent.includes("iOS")) {
            req.clientPlatform = "iOS";
        } else if (userAgent.includes("Linux")) {
            req.clientPlatform = "Linux";
        } else {
            req.clientPlatform = "Other";
        }

        next();
    });

    // API

    // Error Handler
    app.use(ErrorHandler);
};

export default configureExpress;
