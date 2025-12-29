import React, { useState, useEffect, lazy, Suspense } from 'react';
import { FiPlay, FiPause, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  setTransactions,
  setIsSimulating,
  setSimulationParams,
  addTransaction,
  setLoading,
} from '../../store/slices/transactionSlice';
const TransactionChart = lazy(() => import('../../components/charts/TransactionChart'));
import { MainLayout } from '../../components/layout/MainLayout';
import './SimulatorPage.css';

export const SimulatorPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transactions, isSimulating, simulationParams, loading } = useAppSelector(
    (state) => state.transaction
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  // Mock customer data
  const customers = [
    { label: 'Ahmed Ali', value: '1' },
    { label: 'Fatima Khan', value: '2' },
  ];

  const handleStartSimulation = async () => {
    if (!selectedCustomerId) {
      // eslint-disable-next-line no-alert
      alert('Please select a customer');
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setIsSimulating(true));
      // eslint-disable-next-line no-alert
      alert('Simulation started');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to start simulation', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleStopSimulation = () => {
    dispatch(setIsSimulating(false));
    // eslint-disable-next-line no-alert
    alert('Simulation stopped');
  };



  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isSimulating) {
      interval = setInterval(() => {
        const transaction = {
          id: `TXN-${Date.now()}`,
          customerId: selectedCustomerId,
          amount: Math.floor(Math.random() * 50000) + 1000,
          type: [
            'Income',
            'Expense',
            'Transfer',
          ][Math.floor(Math.random() * 3)] as 'Income' | 'Expense' | 'Transfer',
          date: new Date().toISOString(),
          description: `Simulated ${simulationParams.transactionType}`,
          category: 'Simulated',
        };
        dispatch(addTransaction(transaction));
      }, simulationParams.frequency * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, simulationParams.frequency, dispatch, selectedCustomerId]);

  // simple columns will be rendered in a plain table below

  return (
    <MainLayout>
      <div className="simulator-page">
        <div className="card">
          <h3>Transaction Simulator Configuration</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ flex: '1 1 220px' }}>
              <label>Select Customer</label>
              <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} style={{ width: '100%', padding: 8 }}>
                <option value="">-- Choose a customer --</option>
                {customers.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 180px' }}>
              <label>Transaction Type</label>
              <select
                value={simulationParams.transactionType}
                onChange={(e) => dispatch(setSimulationParams({ transactionType: e.target.value as 'Income' | 'Expense' | 'Transfer' }))}
                style={{ width: '100%', padding: 8 }}
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div style={{ flex: '1 1 180px' }}>
              <label>Amount (PKR)</label>
              <input type="number" min={100} value={simulationParams.amount} onChange={(e) => dispatch(setSimulationParams({ amount: Number(e.target.value || 0) }))} style={{ width: '100%', padding: 8 }} />
            </div>

            <div style={{ flex: '1 1 180px' }}>
              <label>Frequency (seconds)</label>
              <input type="number" min={1} max={60} value={simulationParams.frequency} onChange={(e) => dispatch(setSimulationParams({ frequency: Number(e.target.value || 1) }))} style={{ width: '100%', padding: 8 }} />
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {!isSimulating ? (
              <button className="btn-primary" onClick={handleStartSimulation} disabled={loading}><FiPlay /> Start Simulation</button>
            ) : (
              <button className="btn-danger" onClick={handleStopSimulation}><FiPause /> Stop Simulation</button>
            )}
            <button className="btn-secondary" onClick={() => dispatch(setTransactions([]))}><FiTrash2 /> Clear Transactions</button>
          </div>

          {isSimulating && (
            <div style={{ marginTop: 12 }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>🟢 Simulation Active - Generating transactions every {simulationParams.frequency}s</span>
            </div>
          )}
        </div>

        {transactions.length > 0 && (
          <>
            <div className="card" style={{ marginTop: 16 }}>
              <h3>Transaction Trends</h3>
              <Suspense fallback={<div className="chart-fallback">Loading chart...</div>}>
                <TransactionChart transactions={transactions} />
              </Suspense>
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <h3>Real-time Transaction Feed ({transactions.length} transactions)</h3>
              {loading ? (
                <div style={{ padding: 16 }}>Loading...</div>
              ) : (
                <table className="data-table" style={{ width: '100%', marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Type</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                      <th>Date</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t: any) => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td><span className={`transaction-type ${t.type.toLowerCase()}`}>{t.type}</span></td>
                        <td style={{ textAlign: 'right' }}>{`PKR ${t.amount.toLocaleString()}`}</td>
                        <td>{new Date(t.date).toLocaleString()}</td>
                        <td>{t.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};
