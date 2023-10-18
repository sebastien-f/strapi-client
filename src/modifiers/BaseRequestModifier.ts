export abstract class BaseRequestModifier {
    public abstract modifyBody(body:any):any;
    public abstract enrichQueryParameters(parameters:any):any;
}