import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";

import router from "./routes/index.js";

import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/*
|--------------------------------------------------------------------------
| Security
|--------------------------------------------------------------------------
*/

app.use(helmet());

// CORS configuration for development (ports 3000 and 5500)
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost ports
        const allowedOrigins = [
            'http://localhost:3000',  // Backend itself
            'http://localhost:5500',  // Go Live frontend
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5500',
            'http://localhost:8000'
        ];
        
        if (allowedOrigins.includes(origin)) {
            console.log('✅ CORS allowed for origin:', origin);
            return callback(null, true);
        } else {
            console.log('❌ CORS blocked for origin:', origin);
            return callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

app.use(env.app.apiPrefix, router);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(notFoundMiddleware);

/*
|--------------------------------------------------------------------------
| Error
|--------------------------------------------------------------------------
*/

app.use(errorMiddleware);

export default app;
