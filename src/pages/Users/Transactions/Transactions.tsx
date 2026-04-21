import { useParams } from 'react-router';
import { MESSAGES } from '@/constants';
import { TransactionsTable } from './TransactionContents';
import './styles/Transactions.css';

export const Transactions = () => {
  const { accountId } = useParams<{ accountId: string }>();

  if (!accountId) {
    return <p>{MESSAGES.ACCOUNT_NOT_FOUND}</p>;
  }

  return <TransactionsTable accountId={accountId} />;
};
