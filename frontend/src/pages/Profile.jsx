import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CosmeticDoodles from '../components/CosmeticDoodles';

const glassCard = {
  backdropFilter: 'blur(20px)',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(232,180,160,0.15)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(232,180,160,0.06)',
  marginBottom: 'var(--space-6)',
};

export default function Profile() {
  const { user, skinProfile, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <CosmeticDoodles />
      <div className="container" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="page-title">Your Profile</h1>
        <p className="page-subtitle">Your account details and skin profile.</p>

        <div className="card" style={glassCard}>
          <div className="profile-row">
            <span className="profile-label">Name</span>
            <span className="profile-value">{user?.name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user?.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Member Since</span>
            <span className="profile-value">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>

        <div className="card" style={glassCard}>
          <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Skin Profile</h3>
          {skinProfile ? (
            <>
              <div className="profile-row">
                <span className="profile-label">Skin Type</span>
                <span className="badge badge-cf">{skinProfile.skin_type}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Concerns</span>
                <span className="profile-value">
                  {skinProfile.concerns?.length ? skinProfile.concerns.join(', ') : 'None listed'}
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Allergens</span>
                <span className="profile-value">
                  {skinProfile.allergens?.length ? skinProfile.allergens.join(', ') : 'None listed'}
                </span>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
              You haven't taken the Skin Quiz yet.
            </p>
          )}
        </div>

        <button className="btn btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </>
  );
}
