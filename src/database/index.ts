import databaseConnection from "./connection";

export const connectDB = async (): Promise<void> => {
    try {
        await databaseConnection();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to DataBase:', error);
        process.exit(1);
    }
};
