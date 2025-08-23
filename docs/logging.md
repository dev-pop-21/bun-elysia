# Logging Configuration

## Environment Variables

You can configure logging behavior through the following environment variables:

### LOG_MAX_FILES

- **Description**: How long to keep log files
- **Default**: `14d` (14 days)
- **Examples**:
    - `30d` - Keep for 30 days
    - `10` - Keep 10 files
    - `100m` - Keep files up to 100MB total

### LOG_MAX_SIZE

- **Description**: Maximum size of each log file before rotation
- **Default**: `20m` (20 megabytes)
- **Examples**:
    - `50m` - 50 megabytes
    - `1g` - 1 gigabyte
    - `500k` - 500 kilobytes

### LOG_DATE_PATTERN

- **Description**: Pattern for date-based log file rotation
- **Default**: `YYYY-MM-DD` (daily rotation)
- **Examples**:
    - `YYYY-MM-DD-HH` - Hourly rotation
    - `YYYY-MM` - Monthly rotation
    - `YYYY-ww` - Weekly rotation

### LOG_ZIPPED_ARCHIVE

- **Description**: Whether to compress archived log files
- **Default**: `true`
- **Options**: `true` or `false`

### LOG_AUDIT_FILE

- **Description**: Path to the audit file that tracks log rotations
- **Default**: `logs/audit.json`
- **Examples**:
    - `logs/audit-combined.json`
    - `audit/rotation.json`

### LOG_LEVEL

- **Description**: Minimum log level to output
- **Default**: `info`
- **Options**: `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`

## Example .env Configuration

```bash
# Logging Configuration
LOG_MAX_FILES=30d
LOG_MAX_SIZE=50m
LOG_DATE_PATTERN=YYYY-MM-DD
LOG_ZIPPED_ARCHIVE=true
LOG_AUDIT_FILE=logs/audit.json
LOG_LEVEL=debug
```

## Log Levels Hierarchy

1. **error** - Error messages only
2. **warn** - Warnings and errors
3. **info** - General information, warnings, and errors
4. **http** - HTTP requests, info, warnings, and errors
5. **verbose** - Verbose output and all above
6. **debug** - Debug information and all above
7. **silly** - Everything including silly debug messages
