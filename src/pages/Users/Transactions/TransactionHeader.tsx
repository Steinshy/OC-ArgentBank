import { Account } from '@/types';

interface Props {
  account: Account;
}

export const TransactionHeader = ({ account }: Props) => (
  <div className="transaction-header">
    <h2>{account.title}</h2>
    <p className="transaction-balance">${account.amount.toFixed(2)}</p>
    <p className="transaction-balance-label">{account.description}</p>
  </div>
);
