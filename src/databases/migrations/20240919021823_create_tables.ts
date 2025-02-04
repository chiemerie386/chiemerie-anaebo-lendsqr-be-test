import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', table => {
        table.bigIncrements('id').unsigned().primary();
        table.string('email', 45).notNullable();
        table.string('password', 255).notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.boolean('deleted').defaultTo(false);
    })
    await knex.schema.createTable('wallets', table => {
        table.bigIncrements('id').unsigned().primary();
        table.decimal('balance', 10, 2).notNullable();
        table.bigInteger('userId').unsigned().index().references('id').inTable('users');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.boolean('deleted').defaultTo(false);
    })
        await knex.schema.createTable('transactions', table => {
        table.bigIncrements('id').unsigned().primary();
        table.decimal('amount', 10, 2).notNullable();
        table.bigInteger('userId').unsigned().index().references('id').inTable('users');
        table.enu('type', ['fund', 'withdraw', 'transfer']).notNullable();
        table.enu('status', ['pending', 'success', 'failed']).defaultTo('pending');
        table.enu('direction', ['credit', 'debit']).notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.boolean('deleted').defaultTo(false);
    })
    await knex.schema.createTable('transfers', table => {
        table.bigIncrements('id').unsigned().primary();
        table.bigInteger('sourceTransactionId').unsigned().index().references('id').inTable('transactions');
        table.bigInteger('destinationTransactionId').unsigned().index().references('id').inTable('transactions');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        table.boolean('deleted').defaultTo(false);
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('wallets');
    await knex.schema.dropTable('transactions');
    await knex.schema.dropTable('transfers');

}