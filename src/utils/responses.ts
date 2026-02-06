export class SuccessResponse<T> {
    public success: {
        message: string;
        data?: T;
    };

    constructor(message: string, data?: T) {
        this.success = {
            message,
            data,
        };
    }
}

export class ErrorResponse {
    public error: {
        code: string;
        message: string;
        details: unknown[];
    };

    constructor(code: string, message: string, details: unknown[] = []) {
        this.error = {
            code,
            message,
            details,
        };
    }
}
