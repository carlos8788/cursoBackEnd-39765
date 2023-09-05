import { Router } from 'express';
import { passportCall } from '../middleware/auth.js';

export default class BaseRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    init() { };

    getRouter = () => this.router;

    get(path, policies, ...callbacks) {
        this.router.get(path, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    post(path, policies, ...callbacks) {
        this.router.post(path, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    put(path, policies, ...callbacks) {
        this.router.put(path, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    patch(path, policies, ...callbacks) {
        this.router.patch(path, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path, passportCall('jwt', { strategyType: 'jwt' }), this.handlePolicies(policies), this.generateCustomResponses, this.applyCallbacks(callbacks));
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: 'success', payload });
        res.sendSuccessUser = user => res.send({ status: 'success', user });
        res.sendSuccessUserCreate = message => res.status(201).send({ status: 'success', message });
        res.sendSuccessWithPayload = payload => res.send({ status: 'success', payload });
        res.sendInternalError = error => res.status(500).send({ status: 'error', error });
        res.sendUnauthorized = error => res.status(401).send({ status: 'error', error });
        res.sendBadRequest = error => res.status(400).send({ status: 'error', error });
        res.sendNotFound = error => res.status(404).send({ status: 'error', error });
        res.sendSuccessGitHub = () => res.redirect('/viewGitHub')
        next();
    };

    handlePolicies = policies => {
            
        return (req, res, next) => {
            if (policies[0] === "PUBLIC") return next();
            const user = req.user;
            if ((policies[0] === "ADMIN") && user?.role === 'ADMIN') return next()
            if ((policies[1] === "PREMIUM" || (policies[2] === "PREMIUM" )) && user?.role === 'premium' ) return next();
            if (policies[0] === "LOGIN" && !user) return res.redirect('/login')
            if (policies[0] === "LOGIN" && policies[1] === "USER" && user.role === 'user') return next()
            if (policies[0] === "GITHUB") return next();
            if (policies[0] === "USER" || policies[1] === 'ADMIN') return next();
            if (policies[0] === "AUTH" && policies[1] === ['USER'] && user) return next();
            if (policies[0] === "AUTH" && !user) return res.status(401).send({ status: "error", error: "Unauthorized Router doesn't exist the user" });
            if (policies[0] === "NO_AUTH" && user) return res.status(401).send({ status: "error", error: "Unauthorized Router" });
            if (policies[0] === "NO_AUTH" && !user) return next();
            if (!user) return res.status(401).send({ status: "error", error: req.error });
            // if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ status: "error", error: "Forbidden" });            
            if (!policies.includes(user.role.toUpperCase())) {
                if (req.headers.accept.includes('text/html')) {
                    
                    return res.redirect('/forbidden');
                  } else {
                    
                    return res.status(403).send({ status: "error", error: "Forbidden" });
                  }
                  
            }
            next();
        }
    }

    applyCallbacks(callbacks) {
        return callbacks.map(callback => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                
                params[1].status(500).send(error);
            }
        })
    }
}