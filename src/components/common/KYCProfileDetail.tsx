import React, { useEffect, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import { useAppSelector } from '../../hooks/reduxHooks';

export const KYCProfileDetail: React.FC = () => {
  const selectedProfile = useAppSelector((state) => state.kyc.selectedProfile);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProfile) {
      fetchSuggestions();
    }
  }, [selectedProfile]);

  const fetchSuggestions = async () => {
    if (!selectedProfile) return;
    try {
      setLoading(true);
      // const data = await kycService.getUpdateSuggestions(selectedProfile.id);
      // setSuggestions(data);
      
      // Mock suggestions
      setSuggestions([
        'Update income information - Current employment shows higher income',
        'Consider updating occupation profile',
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProfile) return <div>No profile selected</div>;

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="details-grid">
            <div className="detail-row"><strong>Full Name:</strong> {selectedProfile.name}</div>
            <div className="detail-row"><strong>Email:</strong> {selectedProfile.email}</div>
            <div className="detail-row"><strong>CNIC:</strong> {selectedProfile.cnic}</div>
            <div className="detail-row"><strong>Occupation:</strong> {selectedProfile.occupation}</div>
            <div className="detail-row"><strong>Expected Income:</strong> PKR {selectedProfile.expectedIncome.toLocaleString()}</div>
            <div className="detail-row"><strong>Risk Level:</strong> <span className={`risk-badge risk-${selectedProfile.riskLevel.toLowerCase()}`}>{selectedProfile.riskLevel}</span></div>
            <div className="detail-row"><strong>Created:</strong> {selectedProfile.createdAt}</div>
            <div className="detail-row"><strong>Last Updated:</strong> {selectedProfile.lastUpdated}</div>
          </div>

          <hr />

          <h3>Update Suggestions</h3>
          {suggestions.length > 0 ? (
            <div style={{ marginBottom: 16 }}>
              {suggestions.map((s, i) => (
                <div key={i} className="alert-warning">⚠️ {s}</div>
              ))}
              <button className="btn-primary" style={{ marginTop: 8 }}>Accept Suggestions</button>
            </div>
          ) : (
            <div className="alert-success">No suggestions at this time</div>
          )}

          <hr />

          <h3>Documents</h3>
          <div className="docs-grid">
            {selectedProfile.documents?.map((doc: string, idx: number) => (
              <div key={idx} className="doc-card"><FiFileText /> {doc}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
