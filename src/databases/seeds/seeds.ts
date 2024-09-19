import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Clear the existing entries before seeding
  await knex('transfers').del();
  await knex('transactions').del();
  await knex('wallets').del();
  await knex('users').del();

  // Hash password before inserting
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Insert users (use insert with no .returning())
  const [user1Id] = await knex('users').insert({ email: 'user1@example.com', password: hashedPassword });
  const [user2Id] = await knex('users').insert({ email: 'user2@example.com', password: hashedPassword });

  // Insert wallets
  const [wallet1Id] = await knex('wallets').insert({ balance: 100.00, userId: user1Id });
  const [wallet2Id] = await knex('wallets').insert({ balance: 200.00, userId: user2Id });

  // Insert transactions
  const [transaction1Id] = await knex('transactions').insert({ amount: 50.00, userId: user1Id, type: 'fund', status: 'success', direction: 'credit' });
  const [transaction2Id] = await knex('transactions').insert({ amount: 30.00, userId: user2Id, type: 'withdraw', status: 'success', direction: 'debit' });
  const [transaction3Id] = await knex('transactions').insert({ amount: 70.00, userId: user1Id, type: 'transfer', status: 'pending', direction: 'debit' });

  // Insert transfers
  await knex('transfers').insert({ sourceTransactionId: transaction3Id, destinationTransactionId: transaction2Id });
}
