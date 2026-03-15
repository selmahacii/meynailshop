const { AppDataSource } = require('./apps/api/src/database/datasource');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function checkDb() {
    try {
        await AppDataSource.initialize();
        console.log('Connected');
        const productCount = await AppDataSource.getRepository('Product').count();
        console.log('Product count:', productCount);
        const categoryCount = await AppDataSource.getRepository('Category').count();
        console.log('Category count:', categoryCount);
        
        const products = await AppDataSource.getRepository('Product').find({ take: 1 });
        console.log('Sample Product:', JSON.stringify(products[0], null, 2));
        
        await AppDataSource.destroy();
    } catch (err) {
        console.error('Error:', err);
    }
}
checkDb();
