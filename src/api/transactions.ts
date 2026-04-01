/**
 * Transactions API client module
 * Provides methods for fetching and updating account transactions
 * @module api/transactions
 */

import { apiCall } from './client';

import { Transaction } from '@/types';

/**
 * Transactions API client object
 * Handles transaction-related HTTP requests with authentication
 */
export const transactionsApi = {
  /**
   * Fetches all transactions for a specific account
   * Requires valid authentication token
   * @async
   * @param {string} token - Valid JWT authentication token
   * @param {string} accountId - The account ID to fetch transactions for
   * @returns {Promise<Transaction[]>} Array of transaction objects
   * @throws {Error} Throws error if token is invalid or account not found
   *
   * @example
   * const transactions = await transactionsApi.getTransactions(authToken, 'account-123');
   * console.log(transactions.length); // 25
   */
  getTransactions: async (token: string, accountId: string): Promise<Transaction[]> => {
    return apiCall<Transaction[]>(`/api/v1/accounts/${accountId}/transactions`, {
      method: 'GET',
      token,
    });
  },

  /**
   * Updates a transaction's metadata (category, notes)
   * Requires valid authentication token
   * @async
   * @param {string} token - Valid JWT authentication token
   * @param {string} transactionId - The transaction ID to update
   * @param {Object} data - Transaction update data
   * @param {string} [data.category] - New transaction category
   * @param {string} [data.notes] - New transaction notes
   * @returns {Promise<any>} Updated transaction response
   * @throws {Error} Throws error if update fails or token is invalid
   *
   * @example
   * await transactionsApi.updateTransaction(authToken, 'txn-456', {
   *   category: 'Food & Dining',
   *   notes: 'Lunch with team'
   * });
   */
  updateTransaction: async (token: string, transactionId: string, data: { category?: string; notes?: string }) => {
    return apiCall(`/api/v1/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  },
};
