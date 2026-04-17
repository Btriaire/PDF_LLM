import { useAuth } from './hooks/useAuth';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import './index.css';

function App() {
  // TEMPORARY: Bypass auth for testing
  return <Dashboard userId="test-user-123" />;
}

export default App;
