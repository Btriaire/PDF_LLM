import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) await signup(email, password);
      else await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="bg-slate-800 border border-cyan-500/30 rounded-2xl p-8 w-full max-w-md backdrop-blur z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent mb-2 text-center">
          AuraDoc
        </h1>
        <p className="text-slate-400 text-center mb-8 text-sm">Intelligence PDF en direct</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            required
          />
          {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-sm border border-red-500/30">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg font-medium disabled:opacity-50 transition"
          >
            {loading ? '...' : isSignup ? 'S\'inscrire' : 'Connexion'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-400">
            {isSignup ? 'Compte existe? ' : 'Pas de compte? '}
            <button onClick={() => setIsSignup(!isSignup)} className="text-cyan-400 hover:text-cyan-300 font-medium">
              {isSignup ? 'Connexion' : 'S\'inscrire'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
