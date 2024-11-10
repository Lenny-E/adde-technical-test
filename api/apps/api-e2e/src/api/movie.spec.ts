import axios from 'axios';

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

    it('should remove the brackets to input', async () => {
        const updatedMovie = {
        id: movieId,
        title: '<script>alert("xss")</script>',
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
        expect(res.data.title).toBe("scriptalert(\"xss\")/script");
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

describe('Admin movie', () => {
    it('should delete the user created', async () => {
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
    });
})

  
  