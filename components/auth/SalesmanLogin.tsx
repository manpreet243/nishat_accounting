
import React, { useState } from 'react';
import { Salesman } from '../../types';
import { TruckIcon } from '../icons/TruckIcon';

interface SalesmanLoginProps {
  salesmen: Salesman[];
  onLogin: (salesman: Salesman) => void;
  onBack: () => void;
}

const SalesmanLogin: React.FC<SalesmanLoginProps> = ({ salesmen, onLogin, onBack }) => {
  const [selectedSalesmanId, setSelectedSalesmanId] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalesmanId) {
      setError('Please select your name.');
      return;
    }
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const salesman = salesmen.find(s => s.id === Number(selectedSalesmanId));
      if (salesman) {
        onLogin(salesman);
      } else {
        setError('Salesman not found. Please contact an administrator.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-brand-blue rounded-full mb-4">
            <TruckIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
            Salesman Login
          </h2>
          <p className="mt-2 text-center text-md text-brand-text-secondary">
            Select your name to view your deliveries.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
                <select
                    id="salesman-select"
                    value={selectedSalesmanId}
                    onChange={(e) => setSelectedSalesmanId(e.target.value)}
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                >
                    <option value="" disabled>-- Select Your Name --</option>
                    {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading || !selectedSalesmanId}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 transition-colors"
            >
              {isLoading ? 'Loading...' : 'View My Dashboard'}
            </button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-brand-text-secondary">
          Not a salesman?{' '}
          <button onClick={onBack} className="font-medium text-brand-blue hover:text-brand-accent">
            Go Back
          </button>
        </p>
      </div>
    </div>
  );
};

export default SalesmanLogin;
