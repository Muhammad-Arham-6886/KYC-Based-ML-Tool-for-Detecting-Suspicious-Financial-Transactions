import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  setProfiles,
  setSelectedProfile,
  deleteProfile,
  setFilter,
  setLoading,
} from '../../store/slices/kycSlice';
// kycService removed (unused) — API calls will be wired later
import { KYCForm } from '../../components/forms/KYCForm';
import { KYCProfileDetail } from '../../components/common/KYCProfileDetail';
import { MainLayout } from '../../components/layout/MainLayout';
import './KYCPage.css';

export const KYCPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profiles, loading, filter } = useAppSelector((state) => state.kyc);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any | null>(null);

  // Fetch profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      dispatch(setLoading(true));
      // const data = await kycService.fetchProfiles();
      // dispatch(setProfiles(data));
      
      // Mock data for now
      const mockData = [
        {
          id: '1',
          name: 'Ahmed Ali',
          email: 'ahmed@example.com',
          occupation: 'Software Engineer',
          expectedIncome: 150000,
          cnic: '12345-6789012-3',
          createdAt: '2024-01-15',
          riskLevel: 'Low' as const,
          lastUpdated: '2024-12-20',
          documents: ['CNIC', 'Salary Slip'],
        },
        {
          id: '2',
          name: 'Fatima Khan',
          email: 'fatima@example.com',
          occupation: 'Housewife',
          expectedIncome: 0,
          cnic: '98765-4321098-7',
          createdAt: '2024-02-01',
          riskLevel: 'Medium' as const,
          lastUpdated: '2024-12-15',
          documents: ['CNIC'],
        },
      ];
      dispatch(setProfiles(mockData));
    } catch (error) {
      // lightweight feedback
      // eslint-disable-next-line no-console
      console.error('Failed to fetch KYC profiles', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddProfile = () => {
    setEditingProfile(null);
    setIsFormModalVisible(true);
  };

  const handleEditProfile = (profile: any) => {
    setEditingProfile(profile);
    setIsFormModalVisible(true);
  };

  const handleViewProfile = (profile: any) => {
    dispatch(setSelectedProfile(profile));
    setIsDetailModalVisible(true);
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      // await kycService.deleteProfile(id);
      dispatch(deleteProfile(id));
      // eslint-disable-next-line no-alert
      alert('Profile deleted successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete profile', error);
    }
  };

  const handleFormSubmit = async (_data: any) => {
    try {
      dispatch(setLoading(true));
      if (editingProfile) {
        // await kycService.updateProfile(editingProfile.id, data);
        // eslint-disable-next-line no-alert
        alert('Profile updated successfully');
      } else {
        // await kycService.createProfile(data);
        // eslint-disable-next-line no-alert
        alert('Profile created successfully');
      }
      await fetchProfiles();
      setIsFormModalVisible(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save profile', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (filter.riskLevel !== 'All' && profile.riskLevel !== filter.riskLevel) {
      return false;
    }
    if (
      filter.searchTerm &&
      !profile.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) &&
      !profile.email.toLowerCase().includes(filter.searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // We'll render a simple table instead of AntD Table

  return (
    <MainLayout>
      <div className="kyc-page">
        <div className="filters-row" style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <input
              className="input-search"
              placeholder="Search by name or email"
              value={filter.searchTerm}
              onChange={(e) => dispatch(setFilter({ searchTerm: e.target.value }))}
              style={{ width: '100%', padding: 8 }}
            />
          </div>
          <div>
            <select
              value={filter.riskLevel}
              onChange={(e) => dispatch(setFilter({ riskLevel: e.target.value as 'All' | 'Low' | 'Medium' | 'High' }))}
              style={{ padding: 8 }}
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={() => { /* export placeholder */ }}><FiDownload /> Export</button>
            <button className="btn-primary" onClick={handleAddProfile}><FiPlus /> Add New Customer</button>
          </div>
        </div>

        <div className="card kyc-table-card">
          {loading ? (
            <div style={{ padding: 24 }}>Loading...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Occupation</th>
                  <th>Expected Income</th>
                  <th>Risk Level</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.occupation}</td>
                    <td>{`PKR ${p.expectedIncome.toLocaleString()}`}</td>
                    <td><span className={`risk-badge risk-${p.riskLevel.toLowerCase()}`}>{p.riskLevel}</span></td>
                    <td>{p.lastUpdated}</td>
                    <td>
                      <button className="icon-btn" title="View" onClick={() => handleViewProfile(p)}><FiEye /></button>
                      <button className="icon-btn" title="Edit" onClick={() => handleEditProfile(p)}><FiEdit2 /></button>
                      <button className="icon-btn" title="Delete" onClick={() => { if (confirm('Delete profile?')) handleDeleteProfile(p.id); }}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isFormModalVisible && (
          <div className="modal-overlay">
            <div className="modal" style={{ width: 700 }}>
              <div className="modal-header">
                <h3>{editingProfile ? 'Edit KYC Profile' : 'Add New Customer'}</h3>
                <button onClick={() => setIsFormModalVisible(false)}>×</button>
              </div>
              <div className="modal-body">
                <KYCForm profile={editingProfile} onSubmit={handleFormSubmit} onCancel={() => setIsFormModalVisible(false)} />
              </div>
            </div>
          </div>
        )}

        {isDetailModalVisible && (
          <div className="modal-overlay">
            <div className="modal" style={{ width: 700 }}>
              <div className="modal-header">
                <h3>KYC Profile Details</h3>
                <button onClick={() => setIsDetailModalVisible(false)}>×</button>
              </div>
              <div className="modal-body">
                <KYCProfileDetail />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
