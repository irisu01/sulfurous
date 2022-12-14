import { RouteFunction } from "./types/RouteFunction";
import { Request } from "./requests/Request";
import { Response } from "./requests/Response";
import { Router } from "./Router";
import { NextValue } from "./types/NextValue";
import { RouteMethod } from "./types/RouteMethod";

export class Layer {
    /**
     * The route function of this layer.
     */
    public routeFunction: RouteFunction;
    
    /**
     * The path of this layer.
     */
    public path?: string;

    public router: Router;

    public methods: RouteMethod[];

    constructor(router: Router, routeFunction: RouteFunction, path?: string) {
        this.router = router;
        this.path = path;
        this.routeFunction = routeFunction;
        this.methods = routeFunction.routeDescriptor?.routeMethods || [];
    }

    get absolutePath() {
        return `${this.router.path}${this.path?.startsWith("/") ? "" : "/"}${this.path}`;
    }

    /**
     * Whether or not this layer is a middleware.
     */
    get isMiddleware() {
        return this.routeFunction.routeDescriptor?.isMiddleware;
    }

    /**
     * Handles a request to this layer.
     * @param req The request to handle.
     * @param res The response to handle.
     */
    handle(req: Request, res: Response, next: (value?: NextValue) => void, value?: NextValue) {
        // Handle the request.
        try {
            this.routeFunction(req, res, next, value);
        } catch (err) {
            next(err as Error);
        }
    }
}