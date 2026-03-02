import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class Init1709452800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'firstName', type: 'varchar', isNullable: true },
          { name: 'lastName', type: 'varchar', isNullable: true },
          { name: 'phone', type: 'varchar', isNullable: true },
          { name: 'role', type: 'enum', enum: ['admin', 'client'], default: `'client'` },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );

    // Categories table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'image', type: 'varchar', isNullable: true },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );

    // Products table
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar' },
          { name: 'slug', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text' },
          { name: 'shortDescription', type: 'varchar', isNullable: true },
          { name: 'price', type: 'decimal', precision: 10, scale: 2 },
          { name: 'costPrice', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'discountPercentage', type: 'int', default: 0 },
          { name: 'images', type: 'jsonb', default: `'[]'` },
          { name: 'tags', type: 'jsonb', default: `'[]'` },
          { name: 'categoryId', type: 'uuid' },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'stockAlert', type: 'int', default: 5 },
          { name: 'badge', type: 'enum', enum: ['new', 'sale', 'bestseller'], isNullable: true },
          { name: 'isFeatured', type: 'boolean', default: false },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['categoryId'],
            referencedTableName: 'categories',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Addresses table
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'userId', type: 'uuid' },
          { name: 'firstName', type: 'varchar' },
          { name: 'lastName', type: 'varchar' },
          { name: 'phone', type: 'varchar' },
          { name: 'street', type: 'varchar' },
          { name: 'commune', type: 'varchar' },
          { name: 'wilaya', type: 'varchar' },
          { name: 'zipCode', type: 'varchar' },
          { name: 'isDefault', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Orders table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'orderNumber', type: 'varchar', isUnique: true },
          { name: 'userId', type: 'uuid' },
          { name: 'addressId', type: 'uuid' },
          { name: 'status', type: 'enum', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: `'pending'` },
          { name: 'paymentStatus', type: 'enum', enum: ['pending', 'completed', 'failed'], default: `'pending'` },
          { name: 'paymentMethod', type: 'enum', enum: ['cash_on_delivery', 'ccp', 'baridimob'] },
          { name: 'subtotal', type: 'decimal', precision: 10, scale: 2 },
          { name: 'shipping', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'discount', type: 'decimal', precision: 10, scale: 2, default: 0 },
          { name: 'total', type: 'decimal', precision: 10, scale: 2 },
          { name: 'couponCode', type: 'varchar', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'trackingNumber', type: 'varchar', isNullable: true },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
          {
            columnNames: ['addressId'],
            referencedTableName: 'addresses',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Order Items table
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'orderId', type: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'productName', type: 'varchar' },
          { name: 'productSku', type: 'varchar', isNullable: true },
          { name: 'unitPrice', type: 'decimal', precision: 10, scale: 2 },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['orderId'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['productId'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Reviews table
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'productId', type: 'uuid' },
          { name: 'userId', type: 'uuid' },
          { name: 'orderId', type: 'uuid' },
          { name: 'rating', type: 'int' },
          { name: 'title', type: 'varchar' },
          { name: 'content', type: 'text' },
          { name: 'status', type: 'enum', enum: ['pending', 'approved', 'rejected'], default: `'pending'` },
          { name: 'adminNote', type: 'text', isNullable: true },
          { name: 'deletedAt', type: 'timestamp', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['productId'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['orderId'],
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );

    // Coupons table
    await queryRunner.createTable(
      new Table({
        name: 'coupons',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'code', type: 'varchar', isUnique: true },
          { name: 'type', type: 'enum', enum: ['percentage', 'fixed'] },
          { name: 'value', type: 'decimal', precision: 10, scale: 2 },
          { name: 'minAmount', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'maxUsageCount', type: 'int' },
          { name: 'usedCount', type: 'int', default: 0 },
          { name: 'expiresAt', type: 'timestamp' },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );

    // Wishlist Items table
    await queryRunner.createTable(
      new Table({
        name: 'wishlist_items',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'userId', type: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['productId'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
        uniques: [
          {
            columnNames: ['userId', 'productId'],
          },
        ],
      }),
    );

    // Stock Movements table
    await queryRunner.createTable(
      new Table({
        name: 'stock_movements',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'productId', type: 'uuid' },
          { name: 'quantity', type: 'int' },
          { name: 'reason', type: 'varchar' },
          { name: 'reference', type: 'varchar', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
        foreignKeys: [
          {
            columnNames: ['productId'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    // Site Settings table
    await queryRunner.createTable(
      new Table({
        name: 'site_settings',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, default: 'gen_random_uuid()' },
          { name: 'siteTitle', type: 'varchar', default: `'MEEY'` },
          { name: 'siteDescription', type: 'text', isNullable: true },
          { name: 'supportEmail', type: 'varchar' },
          { name: 'supportPhone', type: 'varchar', isNullable: true },
          { name: 'shippingCost', type: 'decimal', precision: 10, scale: 2 },
          { name: 'freeShippingFrom', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updatedAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );

    // Create indexes
    await queryRunner.createIndex('products', new Index({ name: 'idx_product_slug', columnNames: ['slug'] }));
    await queryRunner.createIndex('products', new Index({ name: 'idx_product_category', columnNames: ['categoryId'] }));
    await queryRunner.createIndex('categories', new Index({ name: 'idx_category_slug', columnNames: ['slug'] }));
    await queryRunner.createIndex('users', new Index({ name: 'idx_user_email', columnNames: ['email'] }));
    await queryRunner.createIndex('orders', new Index({ name: 'idx_order_user', columnNames: ['userId'] }));
    await queryRunner.createIndex('orders', new Index({ name: 'idx_order_status', columnNames: ['status'] }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all tables in reverse order
    await queryRunner.dropTable('site_settings');
    await queryRunner.dropTable('stock_movements');
    await queryRunner.dropTable('wishlist_items');
    await queryRunner.dropTable('coupons');
    await queryRunner.dropTable('reviews');
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
    await queryRunner.dropTable('addresses');
    await queryRunner.dropTable('products');
    await queryRunner.dropTable('categories');
    await queryRunner.dropTable('users');
  }
}
