
const databaseConnection = async (): Promise<void> => {
    try {
        
    } catch (error) {
        console.error('Error connecting to DataBase:', error);
        process.exit(1);
    }
};

export const disconnectDB = async (): Promise<void> => {
    try {

    } catch (error) {
        console.error('Error disconnecting from DataBase:', error);
        process.exit(1);
    }
};



export default databaseConnection;
