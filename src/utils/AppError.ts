class AppError {
    message: string
    error: number

    constructor(message: string, error: number = 400){
        this.message = message
        this.error = error
    }
}

export { AppError }