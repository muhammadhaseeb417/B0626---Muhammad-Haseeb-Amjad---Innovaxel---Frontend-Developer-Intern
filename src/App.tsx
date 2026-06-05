import { MainLayout } from './layouts/MainLayout';
import { ExpenseForm } from './components/ExpenseForm';
import { DeleteModal } from './components/DeleteModal';
import { ToastContainer } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import './index.css';

/**
 * Root application component.
 * Renders the layout shell, main dashboard, and global modals/toasts.
 */
function App() {
  return (
    <>
      <MainLayout>
        <Dashboard />
      </MainLayout>
      <ExpenseForm />
      <DeleteModal />
      <ToastContainer />
    </>
  );
}

export default App;
