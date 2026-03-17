import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';

export async function seedUsers(connection: DataSource) {
  const userRepo = connection.getRepository(User);
  const addressRepo = connection.getRepository(Address);

  const hashedPassword = await bcrypt.hash('meey2026', 12);

  const admin = userRepo.create({
    email: 'meeybouabdellah@gmail.com',
    password: hashedPassword,
    firstName: 'Mey',
    lastName: 'Bouabdellah',
    phone: '0775436562',
    role: 'admin',
    isActive: true,
  });
  await userRepo.save(admin);

  const clients = [];
  for (let i = 1; i <= 5; i++) {
    const hashedClientPassword = await bcrypt.hash('Client@2026', 12);
    const client = userRepo.create({
      email: `client${i}@meey.dz`,
      password: hashedClientPassword,
      firstName: `Client${i}`,
      lastName: 'MEEY',
      phone: `+21350123456${i}`,
      role: 'client',
      isActive: true,
    });
    clients.push(await userRepo.save(client));
  }

  for (const client of clients) {
    await addressRepo.save(
      addressRepo.create({
        userId: client.id,
        label: 'Domicile',
        fullName: client.firstName + ' ' + client.lastName,
        phone: client.phone,
        wilaya: '16', // Wilaya code for Alger
        commune: 'Alger-Centre',
        address: '123 Rue Didouche Mourad',
        postalCode: '16000',
        isDefault: true,
      })
    );
  }
}
