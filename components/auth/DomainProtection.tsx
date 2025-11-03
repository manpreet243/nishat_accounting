import React, { useState, useEffect } from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';

interface DomainProtectionProps {
  children: React.ReactNode;
  authorizedDomains?: string[];
  allowLocalhost?: boolean;
}

const DomainProtection: React.FC<DomainProtectionProps> = ({ 
  children, 
  authorizedDomains = ['localhost', '127.0.0.1', 'nishatbeverages.com', 'www.nishatbeverages.com'],
  allowLocalhost = true 
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDomain, setCurrentDomain] = useState<string>('');

  useEffect(() => {
    const checkDomain = () => {
      const hostname = window.location.hostname;
      const port = window.location.port;
      const fullDomain = port ? `${hostname}:${port}` : hostname;
      
      setCurrentDomain(fullDomain);

      // Check if current domain is in authorized list
      const isAuthorizedDomain = authorizedDomains.some(domain => {
        // Exact match
        if (domain === hostname || domain === fullDomain) return true;
        
        // Wildcard subdomain match (e.g., *.example.com)
        if (domain.startsWith('*.')) {
          const baseDomain = domain.substring(2);
          return hostname.endsWith(baseDomain);
        }
        
        return false;
      });

      // Check localhost access
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
      
      const authorized = isAuthorizedDomain || (allowLocalhost && isLocalhost);
      
      setIsAuthorized(authorized);
      setIsLoading(false);

      // Log access attempt for security monitoring
      //if (!authorized) {
       // console.warn(`Unauthorized domain access attempt: ${fullDomain}`);
     // }
    };

    checkDomain();
  }, [authorizedDomains, allowLocalhost]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying domain access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
            <p className="text-gray-600 mb-4">
              This application is restricted to authorized domains only.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Current Domain:</span>
            </p>
            <code className="text-sm bg-white px-3 py-1 rounded border text-red-600 font-mono">
              {currentDomain}
            </code>
          </div>

          <div className="text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Authorized Domains:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {authorizedDomains.map((domain, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <code className="font-mono">{domain}</code>
                </li>
              ))}
              {allowLocalhost && (
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <code className="font-mono">localhost (development)</code>
                </li>
              )}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-1">For Personal Use Only</h4>
            <p className="text-sm text-blue-700">
              This application is designed for personal use by authorized users only. 
              If you believe you should have access, please contact the administrator.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Access attempt logged • {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DomainProtection;

