class StrapiError extends Error {
    public url?:string;
    public options?:RequestInit;
    public statusCode?:number;
    public statusMessage?:string;
    public executionTime?:number;

    constructor(message:string) {
        super(message);
        this.name = this.constructor.name;
    }
}