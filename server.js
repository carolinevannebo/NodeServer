import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import router from "./router.js";
import cors from "cors";

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Enable parsing of JSON bodies
app.use(bodyParser.json());

// Enable parsing of cookies
app.use(cookieParser());

// Add CSRF protection middleware
app.use(csurf({ cookie: true }));

// Generate CSRF token and include it in every response
app.use((req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

// Routes should be defined after CSRF middleware
app.use("", router);

// Error handling for CSRF token validation failure
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        res.status(403).json({ message: "Invalid CSRF token" });
    } else {
        next(err);
    }
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Started on http://localhost:${port}`);
});
