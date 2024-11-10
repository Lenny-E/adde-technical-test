import axios from 'axios';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('POST /api/auth/register', () => {
  it('should not register because the password is too short', async () => {
    const newUser = {
      username: 'newFreshUser',
      email: 'newFreshUser@example.com',
      password: 'st',
    };

    try {
      await axios.post('/api/auth/register', newUser);
    } catch (error) {
      const res = error.response;
      expect(res.status).toBe(400);
      expect(res.data.message).toBe("Invalid data");
      expect(res.data.error).toBe("Bad Request");
    }
  });
  it('should register a new user', async () => {
    const newUser = {
      username: 'newFreshUser',
      email: 'newFreshUser@example.com',
      password: 'strongpassword123',
    };

    const res = await axios.post('/api/auth/register', newUser);

    expect(res.status).toBe(200);

    expect(res.data).toHaveProperty('role');
    expect(res.data).toHaveProperty('access_token');
  });

  it('should not register because the email already exists', async () => {
    const newUser = {
      username: 'newFreshUser',
      email: 'newFreshUser@example.com',
      password: 'strongpassword123',
    };
    try {
      await axios.post('/api/auth/register', newUser);
    } catch (error) {
      const res = error.response;
      expect(res.status).toBe(409);
      expect(res.data.message).toBe("Email is already in use");
      expect(res.data.error).toBe("Conflict");
    }
  });
});

describe('POST /login', () => {
  it('should receive an access token and a role', async () => {
    const newUser = {
      username: 'newFreshUser',
      email: 'newFreshUser@example.com',
      password: 'strongpassword123',
    };

    const res = await axios.post('/api/auth/login', newUser);
    expect(res.data).toHaveProperty('role');
    expect(res.data).toHaveProperty('access_token');
  });
  it('should receive unauthorized', async () => {
    const newUser = {
      username: 'newFreshUser',
      email: 'newFreshUser@example.com',
      password: 'strongpassword',
    };

    try{
      const res = await axios.post('/api/auth/login', newUser);
    }
    catch(error){
      const res = error.response;
      expect(res.status).toBe(401);
      expect(res.data.message).toBe("Invalid credentials");
      expect(res.data.error).toBe("Unauthorized");
    }
  });
});

