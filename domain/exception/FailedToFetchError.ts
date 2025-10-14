export class FailedToFetchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FailedToFetchError";
    }
}