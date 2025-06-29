import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('employee').unsigned().references('id').inTable('users')
      table.integer('customer').unsigned().references('id').inTable('users')
      table.integer('time').unsigned().references('id').inTable('times')
      table.integer('work_status').unsigned().references('id').inTable('work_statuses')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
