import axios from 'axios';
import exp from 'constants';

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

    expect(res.status).toBe(201);

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

describe('User registration and movie creation', () => {
  let accessToken: string, movieId: string;

  it('should register a new user and return an access token', async () => {
    const newUser = {
      username: 'newUser',
      email: 'newuser@example.com',
      password: 'strongpassword',
    };

    const res = await axios.post('http://localhost:3000/api/auth/register', newUser);
    
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('access_token');
    expect(res.data).toHaveProperty('role');

    accessToken = res.data.access_token;
  });

  it('should create a movie after registration', async () => {
    expect(accessToken).toBeDefined();

    const newMovie = {
      title: 'Inception',
      rating: 5,
    };

    const res = await axios.post('/api/movies',
      newMovie,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('_id');
    expect(res.data.title).toBe(newMovie.title);
    expect(res.data.rating).toBe(newMovie.rating);
    movieId=res.data._id;
  });

  it('should get the movie created', async () => {
    expect(accessToken).toBeDefined();

    const res = await axios.get('/api/movies',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
  });

  it('should modify the movie title and rating', async () => {
    const updatedMovie = {
      id: movieId,
      title: 'Updated Title',
      rating: 4,
    };

    const res = await axios.put(`/api/movies`,
      updatedMovie,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data.title).toBe(updatedMovie.title);
    expect(res.data.rating).toBe(updatedMovie.rating);
  });

  it('should remove the movie created', async () => {
    expect(accessToken).toBeDefined();
    expect(movieId).toBeDefined();

    const res = await axios.delete(`/api/movies/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    expect(res.status).toBe(200);
    expect(res.data).toBeDefined();
    expect(res.data).toHaveProperty("_id")
    expect(res.data).toHaveProperty("title")
    expect(res.data).toHaveProperty("rating")
  });  
});



describe('Admin', () => {
  it('should delete the users created', async () => {
    const user = {
      "email": "admin2@example.com",
      "password": "plaintext"
    };

    const res = await axios.post('/api/auth/login', user);
    expect(res.data).toHaveProperty('role');
    expect(res.data.role).toBe("admin");
    expect(res.data).toHaveProperty('access_token');
    const token = res.data.access_token;

    const deleteRes = await axios.delete('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: "newuser@example.com",
      },
    });
    expect(deleteRes.status).toBe(200);

    const deleteRes2 = await axios.delete('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: "newFreshUser@example.com",
      },
    });
    expect(deleteRes2.status).toBe(200);
  });
})