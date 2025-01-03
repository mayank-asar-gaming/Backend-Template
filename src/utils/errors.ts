interface AppError extends Error {
    statusCode: number;
}

export function createError(message: string, statusCode: number): AppError {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.name = 'AppError';
    return error;
}

export function ValidationError(message: string): AppError {
    return createError(message, 422); // Unprocessable Entity
}

export function ConflictError(message: string): AppError {
    return createError(message, 409); // Conflict
}

export function NotFoundError(message: string): AppError {
    return createError(message, 404); // Not Found
}

export function BadRequestError(message: string): AppError {
    return createError(message, 400); // Bad Request
}

export function InternalServerError(message: string): AppError {
    return createError(message, 500); // Internal Server Error
}

export function AuthenticationError(message: string): AppError {
    return createError(message, 401); // Unauthorized
}
