import { useAuth } from '../hooks/useAuth';

export const Header = ({ title = 'AuraDoc' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-cyan-500/20 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">{title}</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg font-medium transition duration-200"
            >
              Quitter
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
