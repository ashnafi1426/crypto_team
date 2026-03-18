import { DepositForm } from '../components/deposit/DepositForm';
import '../styles/components/deposit.css';
import { useLanguage } from '../context/LanguageContext';

const Deposit = () => {
  const { t } = useLanguage();
  return (
    <main className="main-content">
      <div className="deposit-header">
        <h1 className="page-title">{t('deposit')}</h1>
        <p className="page-subtitle">Deposit cryptocurrency to your account</p>
      </div>

      <DepositForm />
    </main>
  );
};

export default Deposit;
