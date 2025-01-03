interface FormatData {
    data: any;
    success: boolean;
}

interface ErrorFormat {
    error: any;
    success: boolean;
}

export const FormatData = (data: any): FormatData => {
    return {
        data,
        success: true,
    };
}


export const FormatError = (error: any): ErrorFormat => {
    return {
        error: error.message,
        success: false,
    };
}