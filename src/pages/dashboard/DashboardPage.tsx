import React, { useEffect, useState, lazy, Suspense } from 'react';
import { FiRotateCw, FiDownload, FiAlertTriangle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAppSelector } from '../../hooks/reduxHooks';
import type { RiskScore, RiskAlert } from '../../services/riskService';
import { riskService } from '../../services/riskService';
const RiskScoreChart = lazy(() => import('../../components/charts/RiskScoreChart'));
const BehaviorDriftChart = lazy(() => import('../../components/charts/BehaviorDriftChart'));
import { MainLayout } from '../../components/layout/MainLayout';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { profiles } = useAppSelector((state) => state.kyc);
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // const scores = await riskService.getRiskScores();
      // const alerts = await riskService.getAlerts();
      // setRiskScores(scores);
      // setRiskAlerts(alerts);

      // Mock data
      setRiskScores([
        {
          customerId: '1',
          riskLevel: 'Low',
          score: 25,
          factors: ['Stable income', 'Regular transactions'],
          timestamp: new Date().toISOString(),
        },
        {
          customerId: '2',
          riskLevel: 'Medium',
          score: 60,
          factors: ['Income increase', 'Unusual spending pattern'],
          timestamp: new Date().toISOString(),
        },
      ]);

      setRiskAlerts([
        {
          id: '1',
          customerId: '2',
          riskLevel: 'Medium',
          message: 'Behavior shift detected - Income increase detected',
          timestamp: new Date().toISOString(),
          actionRequired: true,
        },
        {
          id: '2',
          customerId: '1',
          riskLevel: 'Low',
          message: 'KYC profile verification complete',
          timestamp: new Date().toISOString(),
          actionRequired: false,
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  };

  const handleExportReport = async (format: 'pdf' | 'csv') => {
    try {
      const blob = await riskService.exportReport(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `risk-report.${format}`;
      a.click();
      // lightweight feedback
      console.info(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Failed to export report`);
    }
  };

  const riskStatistics = {
    low: riskScores.filter((r) => r.riskLevel === 'Low').length,
    medium: riskScores.filter((r) => r.riskLevel === 'Medium').length,
    high: riskScores.filter((r) => r.riskLevel === 'High').length,
  };

  // simple render helpers for tables
  const [selectedTab, setSelectedTab] = useState<'risk-scores' | 'alerts'>('risk-scores');

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="dashboard-controls" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>
          <button onClick={fetchDashboardData} className="btn-secondary"><FiRotateCw /> Refresh</button>
          <button onClick={() => handleExportReport('pdf')} className="btn-secondary"><FiDownload /> Export PDF</button>
          <button onClick={() => handleExportReport('csv')} className="btn-secondary"><FiDownload /> Export CSV</button>
        </div>

        <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          <div className="stat-card stat-card-low">
            <div className="stat-icon"><FiCheckCircle /></div>
            <div className="stat-title">Low Risk</div>
            <div className="stat-value">{riskStatistics.low}</div>
          </div>
          <div className="stat-card stat-card-medium">
            <div className="stat-icon"><FiAlertTriangle /></div>
            <div className="stat-title">Medium Risk</div>
            <div className="stat-value">{riskStatistics.medium}</div>
          </div>
          <div className="stat-card stat-card-high">
            <div className="stat-icon"><FiAlertCircle /></div>
            <div className="stat-title">High Risk</div>
            <div className="stat-value">{riskStatistics.high}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Total Customers</div>
            <div className="stat-value">{profiles.length}</div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div className="card">
            <h3>Risk Score Distribution</h3>
            <Suspense fallback={<div className="chart-fallback">Loading chart...</div>}>
              <RiskScoreChart riskScores={riskScores} />
            </Suspense>
          </div>
          <div className="card">
            <h3>Behavior Drift Detection</h3>
            <Suspense fallback={<div className="chart-fallback">Loading chart...</div>}>
              <BehaviorDriftChart />
            </Suspense>
          </div>
        </section>

        <section className="tabs card" style={{ padding: 12 }}>
          <div className="tab-headers" style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button className={`tab-btn ${selectedTab === 'risk-scores' ? 'active' : ''}`} onClick={() => setSelectedTab('risk-scores')}>Risk Scores</button>
            <button className={`tab-btn ${selectedTab === 'alerts' ? 'active' : ''}`} onClick={() => setSelectedTab('alerts')}>Alerts {riskAlerts.filter(a => a.actionRequired).length > 0 && (<span className="badge">{riskAlerts.filter(a => a.actionRequired).length}</span>)}</button>
          </div>

          {selectedTab === 'risk-scores' && (
            <table className="data-table">
              <thead>
                <tr><th>Customer ID</th><th>Risk Score</th><th>Risk Level</th><th>Key Factors</th></tr>
              </thead>
              <tbody>
                {riskScores.map(r => (
                  <tr key={r.customerId}>
                    <td>{r.customerId}</td>
                    <td><div className={`risk-score risk-score-${r.score < 40 ? 'low' : r.score < 70 ? 'medium' : 'high'}`}>{r.score}%</div></td>
                    <td>{r.riskLevel}</td>
                    <td>{r.factors.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTab === 'alerts' && (
            <table className="data-table">
              <thead>
                <tr><th>Timestamp</th><th>Risk Level</th><th>Message</th><th>Action</th></tr>
              </thead>
              <tbody>
                {riskAlerts.map(a => (
                  <tr key={a.id}>
                    <td>{new Date(a.timestamp).toLocaleString()}</td>
                    <td>{a.riskLevel}</td>
                    <td>{a.message}</td>
                    <td>{a.actionRequired ? 'Required' : 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card" style={{ marginTop: 16 }}>
          <h3>Recent Activity Log</h3>
          <table className="data-table">
            <thead>
              <tr><th>Timestamp</th><th>Action</th><th>Details</th></tr>
            </thead>
            <tbody>
              {[{ key: '1', action: 'Profile Updated', details: 'KYC profile updated for customer ID 2' },{ key: '2', action: 'Alert Generated', details: 'High-risk transaction detected' },{ key: '3', action: 'Report Generated', details: 'Monthly compliance report generated' }].map((row, idx) => (
                <tr key={row.key}><td>{new Date(Date.now() - idx*5*60*1000).toLocaleString()}</td><td>{row.action}</td><td>{row.details}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </MainLayout>
  );
};
