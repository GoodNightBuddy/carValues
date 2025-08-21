const {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} = require('typeorm');

module.exports = class InitialSchema1755710891111 {
  name = 'InitialSchema1755710891111';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'admin',
            type: 'boolean',
            default: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'report',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'price', type: 'integer', isNullable: false },
          { name: 'make', type: 'varchar', isNullable: false },
          { name: 'model', type: 'varchar', isNullable: false },
          { name: 'year', type: 'integer', isNullable: false },
          { name: 'lng', type: 'integer', isNullable: false },
          { name: 'lat', type: 'integer', isNullable: false },
          { name: 'mileage', type: 'integer', isNullable: false },
          { name: 'approved', type: 'boolean', default: false },
          { name: 'userId', type: 'uuid', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'report',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  async down(queryRunner) {
    const table = await queryRunner.getTable('report');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('report', foreignKey);
    }

    await queryRunner.dropTable('report');
    await queryRunner.dropTable('user');
  }
};
