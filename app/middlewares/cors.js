export const corsMiddleware = (req, res, next) => {
    console.log("Solicitud entrante:", req.method, req.url);
    console.log("CORS origin:", req.get('Origin'));
    next();
}