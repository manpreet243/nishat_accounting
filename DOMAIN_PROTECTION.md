# Domain Protection System

This document explains the domain protection system implemented in the Nishat Beverages application to restrict access to authorized domains only.

## Overview

The domain protection system ensures that the application can only be accessed from pre-approved domains, making it suitable for personal or business use while preventing unauthorized access from other domains.

## Features

- ✅ **Domain Whitelist**: Only authorized domains can access the application
- ✅ **Localhost Support**: Configurable localhost access for development
- ✅ **Environment-Aware**: Different configurations for development and production
- ✅ **Wildcard Support**: Support for subdomain wildcards (e.g., `*.yourdomain.com`)
- ✅ **Professional UI**: Clean, professional unauthorized access page
- ✅ **Security Logging**: Logs unauthorized access attempts
- ✅ **Easy Configuration**: Simple configuration file for managing domains

## How It Works

1. **Domain Check**: When the application loads, it checks the current domain against the authorized list
2. **Access Control**: If the domain is not authorized, users see a professional "Access Restricted" page
3. **Environment Handling**: Different rules apply for development vs production environments
4. **Logging**: Unauthorized access attempts are logged for security monitoring

## Configuration

### Basic Setup

The domain configuration is managed in `config/domainConfig.ts`:



### Adding Your Domains

To authorize your own domains, edit the `authorizedDomains` array:

```typescript
authorizedDomains: [
  // Production domains
  'yourdomain.com',
  'www.yourdomain.com',
  'app.yourdomain.com',
  
  // Staging/Development
  'staging.yourdomain.com',
  'dev.yourdomain.com',
  
  // Wildcard subdomains
  '*.yourdomain.com',
  
  // Localhost (for development)
  'localhost',
  '127.0.0.1',
],
```

### Environment-Specific Configuration

The system automatically adjusts settings based on the environment:

#### Development Environment
- `allowLocalhost: true` - Localhost access enabled
- `allowDevelopment: true` - Development domains allowed
- `logAccessAttempts: false` - Reduced console noise

#### Production Environment
- `allowLocalhost: false` - Localhost access disabled
- `allowDevelopment: false` - Only production domains allowed
- `logAccessAttempts: true` - Full security logging

## Domain Matching Rules

### Exact Match
```typescript
'example.com' // Matches exactly example.com
```

### Wildcard Subdomains
```typescript
'*.example.com' // Matches app.example.com, api.example.com, etc.
```

### Localhost Patterns
```typescript
'localhost'     // Standard localhost
'127.0.0.1'     // Loopback IP
'192.168.*'     // Local network IPs
'10.*'          // Private network IPs
```

## Security Features

### Access Logging
Unauthorized access attempts are logged with:
- Domain that attempted access
- Timestamp
- Browser console warning

### Professional Blocking Page
Users from unauthorized domains see:
- Clear "Access Restricted" message
- Current domain information
- List of authorized domains
- Professional, branded design
- Security timestamp

### Headers (Optional)
The configuration includes security headers that can be implemented:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- Content Security Policy

## Implementation Details

### Component Structure
```
components/auth/DomainProtection.tsx  // Main protection component
config/domainConfig.ts                // Configuration file
App.tsx                              // Integration point
```

### Integration
The protection is implemented as a wrapper component around the entire application:

```typescript
return (
  <DomainProtection 
    authorizedDomains={domainConfig.authorizedDomains}
    allowLocalhost={domainConfig.allowLocalhost}
  >
    {renderApp()}
  </DomainProtection>
);
```

## Customization

### Styling
The unauthorized access page uses Tailwind CSS classes and can be customized by modifying the `DomainProtection.tsx` component.

### Messages
All user-facing messages can be customized in the component:
- Page title
- Description text
- Instructions
- Footer text

### Redirect (Optional)
You can configure automatic redirects for unauthorized users:

```typescript
export const domainConfig: DomainConfig = {
  // ... other config
  redirectUrl: 'https://yourdomain.com',
};
```

## Testing

### Local Testing
1. Run the application locally - should work with `localhost`
2. Access via IP address - should work with local IPs
3. Test with unauthorized domain (modify hosts file) - should show restriction page

### Production Testing
1. Deploy to authorized domain - should work normally
2. Test from unauthorized domain - should show restriction page
3. Check browser console for security logs

## Troubleshooting

### Common Issues

**Application not loading on localhost:**
- Check `allowLocalhost` is set to `true` in development
- Verify `localhost` is in `authorizedDomains` array

**Authorized domain showing restriction page:**
- Check domain spelling in configuration
- Verify wildcard patterns are correct
- Check for port number requirements

**Development domains not working:**
- Ensure `allowDevelopment` is `true`
- Add development domains to authorized list
- Check environment detection

### Debug Mode
Add console logging to see domain checking:

```typescript
console.log('Current domain:', window.location.hostname);
console.log('Authorized domains:', authorizedDomains);
console.log('Is authorized:', isAuthorized);
```

## Security Considerations

1. **Client-Side Only**: This is client-side protection and can be bypassed by determined users
2. **Server-Side Recommended**: For critical applications, implement server-side domain validation
3. **HTTPS**: Always use HTTPS in production
4. **Regular Updates**: Keep authorized domain list updated
5. **Monitoring**: Monitor access logs for security insights

## Best Practices

1. **Minimal Domain List**: Only add domains you actually need
2. **Environment Separation**: Use different configurations for dev/staging/production
3. **Regular Audits**: Review authorized domains periodically
4. **Documentation**: Keep domain list documented and updated
5. **Testing**: Test domain protection after any configuration changes

## Support

For issues or questions about the domain protection system:
1. Check this documentation
2. Review the configuration in `config/domainConfig.ts`
3. Test with browser developer tools
4. Check console logs for error messages

---

**Note**: This domain protection system is designed for legitimate use cases and basic access control. For high-security applications, implement additional server-side validation and authentication mechanisms.

