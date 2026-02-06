class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;
    public readonly details: unknown[];

    constructor(
        message: string,
        statusCode: number,
        code: string,
        details: unknown[] = [],
        isOperational: boolean = true,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;

        Error.captureStackTrace?.(this, this.constructor);
    }
}

export default AppError;
