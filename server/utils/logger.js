import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Log levels
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

// Colors for console output
const colors = {
    ERROR: '\x1b[31m', // Red
    WARN: '\x1b[33m',  // Yellow
    INFO: '\x1b[36m',  // Cyan
    DEBUG: '\x1b[35m', // Magenta
    RESET: '\x1b[0m'   // Reset
};

class Logger {
    constructor() {
        this.logLevel = process.env.LOG_LEVEL || 'INFO';
        this.enableFileLogging = process.env.ENABLE_FILE_LOGGING === 'true';
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
        return `[${timestamp}] [${level}] ${message} ${metaString}`.trim();
    }

    shouldLog(level) {
        const levels = Object.keys(LOG_LEVELS);
        const currentLevelIndex = levels.indexOf(this.logLevel);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= currentLevelIndex;
    }

    writeToFile(level, formattedMessage) {
        if (!this.enableFileLogging) return;

        const date = new Date().toISOString().split('T')[0];
        const filename = path.join(logsDir, `${date}.log`);
        
        fs.appendFileSync(filename, formattedMessage + '\n');

        // Also write errors to separate error log
        if (level === LOG_LEVELS.ERROR) {
            const errorFilename = path.join(logsDir, `${date}-error.log`);
            fs.appendFileSync(errorFilename, formattedMessage + '\n');
        }
    }

    log(level, message, meta = {}) {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message, meta);
        
        // Console output with colors
        const color = colors[level] || colors.RESET;
        console.log(`${color}${formattedMessage}${colors.RESET}`);

        // File output
        this.writeToFile(level, formattedMessage);
    }

    error(message, meta = {}) {
        this.log(LOG_LEVELS.ERROR, message, meta);
    }

    warn(message, meta = {}) {
        this.log(LOG_LEVELS.WARN, message, meta);
    }

    info(message, meta = {}) {
        this.log(LOG_LEVELS.INFO, message, meta);
    }

    debug(message, meta = {}) {
        this.log(LOG_LEVELS.DEBUG, message, meta);
    }

    // HTTP request logging middleware
    httpLogger() {
        return (req, res, next) => {
            const start = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - start;
                const { method, url, ip } = req;
                const { statusCode } = res;
                
                const level = statusCode >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
                const message = `${method} ${url} ${statusCode} ${duration}ms`;
                
                this.log(level, message, {
                    method,
                    url,
                    statusCode,
                    duration,
                    ip,
                    userAgent: req.get('User-Agent')
                });
            });
            
            next();
        };
    }

    // Database operation logging
    dbLogger(operation, collection, query = {}, result = {}) {
        this.info(`DB ${operation}`, {
            collection,
            query: JSON.stringify(query),
            result: typeof result === 'object' ? JSON.stringify(result) : result
        });
    }

    // Authentication logging
    authLogger(action, userId, success, details = {}) {
        const level = success ? LOG_LEVELS.INFO : LOG_LEVELS.WARN;
        this.log(level, `Auth ${action}`, {
            userId,
            success,
            ...details
        });
    }

    // Course operation logging
    courseLogger(action, courseId, userId, details = {}) {
        this.info(`Course ${action}`, {
            courseId,
            userId,
            ...details
        });
    }

    // Purchase logging
    purchaseLogger(action, courseId, userId, amount, status, details = {}) {
        this.info(`Purchase ${action}`, {
            courseId,
            userId,
            amount,
            status,
            ...details
        });
    }

    // Error logging with stack trace
    errorWithStack(error, context = {}) {
        this.error(error.message, {
            stack: error.stack,
            name: error.name,
            ...context
        });
    }

    // Performance logging
    performance(operation, duration, details = {}) {
        const level = duration > 1000 ? LOG_LEVELS.WARN : LOG_LEVELS.INFO;
        this.log(level, `Performance: ${operation} took ${duration}ms`, details);
    }

    // Security logging
    securityLogger(event, severity, details = {}) {
        const level = severity === 'high' ? LOG_LEVELS.ERROR : LOG_LEVELS.WARN;
        this.log(level, `Security: ${event}`, {
            severity,
            timestamp: new Date().toISOString(),
            ...details
        });
    }
}

// Create singleton instance
const logger = new Logger();

// Export both the class and instance
export { Logger };
export default logger;

// Helper functions for common logging patterns
export const logApiCall = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info(`API Call: ${req.method} ${req.originalUrl}`, {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration,
            userId: req.user?.id,
            ip: req.ip
        });
    });
    
    next();
};

export const logError = (error, context = {}) => {
    logger.errorWithStack(error, context);
};

export const logAuth = (action, userId, success, details = {}) => {
    logger.authLogger(action, userId, success, details);
};

export const logCourse = (action, courseId, userId, details = {}) => {
    logger.courseLogger(action, courseId, userId, details);
};

export const logPurchase = (action, courseId, userId, amount, status, details = {}) => {
    logger.purchaseLogger(action, courseId, userId, amount, status, details);
};
