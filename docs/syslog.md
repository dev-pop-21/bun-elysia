# Syslog-ng Integration

This application supports sending logs to syslog-ng for centralized logging.

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```bash
# Syslog Configuration
SYSLOG_ENABLED=true
SYSLOG_HOST=localhost
SYSLOG_PORT=514
SYSLOG_PROTOCOL=udp4
SYSLOG_FACILITY=local0
SYSLOG_APP_NAME=bun-elysia
```

### Configuration Options

- **SYSLOG_ENABLED**: Enable/disable syslog logging (`true`/`false`)
- **SYSLOG_HOST**: Syslog server hostname or IP address
- **SYSLOG_PORT**: Syslog server port (default: 514)
- **SYSLOG_PROTOCOL**: Protocol to use (`udp4`, `udp6`, `tcp4`, `tcp6`)
- **SYSLOG_FACILITY**: Syslog facility (`local0` to `local7`, `user`, `daemon`, etc.)
- **SYSLOG_APP_NAME**: Application name in syslog messages

## Syslog-ng Server Configuration

### Example syslog-ng.conf

```conf
@version: 4.4
@include "scl.conf"

# Sources
source s_local {
    internal();
    unix-dgram("/dev/log");
    unix-dgram("/var/run/log");
    file("/proc/kmsg" program_override("kernel"));
};

source s_network {
    udp(ip("0.0.0.0") port(514));
    tcp(ip("0.0.0.0") port(514));
};

# Destinations
destination d_local {
    file("/var/log/messages");
};

destination d_bun_elysia {
    file("/var/log/bun-elysia/application.log"
         create_dirs(yes)
         template("${ISODATE} ${HOST} ${PROGRAM}[${PID}]: ${LEVEL} ${MSG}\n"));
};

# Filters
filter f_bun_elysia {
    program("bun-elysia");
};

# Log paths
log {
    source(s_local);
    source(s_network);
    filter(f_bun_elysia);
    destination(d_bun_elysia);
};

log {
    source(s_local);
    destination(d_local);
};
```

### macOS Setup with Homebrew

```bash
# Install syslog-ng
brew install syslog-ng

# Create configuration directory
sudo mkdir -p /usr/local/etc/syslog-ng

# Create log directory
sudo mkdir -p /var/log/bun-elysia
sudo chown $(whoami):staff /var/log/bun-elysia

# Start syslog-ng
sudo brew services start syslog-ng
```

### Linux Setup

```bash
# Ubuntu/Debian
sudo apt-get install syslog-ng

# CentOS/RHEL/Fedora
sudo yum install syslog-ng
# or
sudo dnf install syslog-ng

# Start and enable service
sudo systemctl start syslog-ng
sudo systemctl enable syslog-ng
```

## Log Format

Logs sent to syslog-ng will have the following format:

```
2025-08-23T10:30:45.123Z [bun-elysia] INFO: Incoming request {"ip":"127.0.0.1","method":"GET","url":"http://localhost:3000/api/v1/users","user":"","timestamp":"2025-08-23T10:30:45.123Z","request_id":"550e8400-e29b-41d4-a716-446655440000"}
```

## Testing

To test syslog integration:

1. Enable syslog in your `.env` file:
   ```bash
   SYSLOG_ENABLED=true
   ```

2. Start your application:
   ```bash
   bun run dev
   ```

3. Make some API requests to generate logs

4. Check syslog messages:
   ```bash
   # On macOS
   tail -f /var/log/bun-elysia/application.log

   # On Linux
   tail -f /var/log/syslog | grep bun-elysia
   ```

## Troubleshooting

### Common Issues

1. **Permission denied**: Ensure the application has permission to write to syslog
2. **Connection refused**: Check if syslog-ng is running and listening on the correct port
3. **No logs appearing**: Verify the syslog-ng configuration and filters

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
LOG_LEVEL=debug
SYSLOG_ENABLED=true
```

### Check syslog-ng Status

```bash
# macOS
brew services list | grep syslog-ng

# Linux
sudo systemctl status syslog-ng
```
