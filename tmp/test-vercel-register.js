async function run() {
  const url = 'https://meeynailshop.vercel.app/api/auth/register';
  const body = {
    email: 'newuser_' + Math.random().toString(36).substring(7) + '@meey.dz',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    phone: '0555555555'
  };

  console.log(`Sending POST to ${url} with body:`, body);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
