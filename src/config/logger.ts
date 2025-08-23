import { LOG_CONFIG, SYSLOG_CONFIG } from '../utils/constants';

export const logConfig = {
    maxFiles: LOG_CONFIG.MAX_FILES, // Keep logs for configurable days
    maxSize: LOG_CONFIG.MAX_SIZE, // Max file size configurable
    datePattern: LOG_CONFIG.DATE_PATTERN, // Configurable rotation pattern
    zippedArchive: LOG_CONFIG.ZIPPED_ARCHIVE, // Compress old log files
    auditFile: LOG_CONFIG.AUDIT_FILE, // Audit file for tracking rotated logs
    level: LOG_CONFIG.LOG_LEVEL, // Log level
};

export const syslogConfig = {
    host: SYSLOG_CONFIG.HOST,
    port: SYSLOG_CONFIG.PORT,
    protocol: SYSLOG_CONFIG.PROTOCOL,
    facility: SYSLOG_CONFIG.FACILITY,
    appName: SYSLOG_CONFIG.APP_NAME,
    enabled: SYSLOG_CONFIG.ENABLED,
};
