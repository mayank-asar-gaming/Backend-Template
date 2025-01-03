import fs from "fs";
import axios from "axios";
import { BUNNYCDN } from "../config";

interface File {
    path: string;
    fieldname: string;
    originalname: string;
}

export const BunnyCDNUpload = async (file: File): Promise<string | false> => {
    const STORAGE_ZONE_NAME = BUNNYCDN.ZONE;
    const BUNNYCDN_API_KEY = BUNNYCDN.KEY;
    const BUNNYCDN_HOSTNAME = BUNNYCDN.HOST;

    const fileStream = fs.createReadStream(file.path);
    const uniqueFilename = `${Date.now()}-${file.fieldname}-${file.originalname}`;
    try {
        const response = await axios.put(`https://sg.storage.bunnycdn.com/${STORAGE_ZONE_NAME}/${uniqueFilename}`, fileStream, {
            headers: {
                AccessKey: BUNNYCDN_API_KEY,
            },
        });

        if (response.status === 201) {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
            return `https://${BUNNYCDN_HOSTNAME}/${uniqueFilename}`;
        } else {
            console.error("BunnyCDN Upload failed:", response.statusText);
            return false;
        }
    } catch (error: any) {
        console.error("BunnyCDN Upload error:", error.message);
        return false;
    }
};
