import express, { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import fs from "fs";
import { PORT } from "./config";
import { connectDB } from "./database/index";
import configureExpress from "./express-config";

const StartServer = async (): Promise<void> => {
    // Check if uploads folder exists
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const app: Express = express();

    // Connect to DB
    await connectDB();

    app.get("/", (req: Request, res: Response) => {
        res.status(200).send({ message: `Server Responsing........` });
    });

    // Rate limit
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 1000 request in 15 mins
        max: 1000,
        message: "Too many requests from this IP, please try again later.",
    });

    app.use(limiter);

    // Use Helmet first for security headers
    app.use(helmet());

    // Configure express
    await configureExpress(app);

    app.listen(PORT, () => {
        console.log(`⚡️[Server]: YourSay Exchange matching engine running at http://localhost:${PORT}`);
    });
};

StartServer();
