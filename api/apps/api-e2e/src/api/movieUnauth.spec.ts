import axios from 'axios';

describe('User Registration and Unauthorized Access to Movie', () => {
    let user1Token: string, user2Token: string, movieId: string;

    it('should register a new user and return an access token', async () => {
        const newUser1 = {
        username: 'newUser',
        email: 'newuser1@example.com',
        password: 'strongpassword',
        };

        const res = await axios.post('/api/auth/register', newUser1);
        
        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty('access_token');
        expect(res.data).toHaveProperty('role');

        user1Token = res.data.access_token;
    });

    it('should register User 2 and return an access token', async () => {
        const newUser2 = {
            username: 'newUser',
            email: 'newuser2@example.com',
            password: 'strongpassword',
            };
    
            const res = await axios.post('/api/auth/register', newUser2);
            
            expect(res.status).toBe(201);
            expect(res.data).toHaveProperty('access_token');
            expect(res.data).toHaveProperty('role');
        user2Token = res.data.access_token;
    });

    it('User 1 should create a movie after registration', async () => {
        expect(user1Token).toBeDefined();

        const newMovie = {
            title: 'Inception',
            rating: 5,
        };

        const res = await axios.post('/api/movies',
            newMovie,
            {
                headers: {
                    Authorization: `Bearer ${user1Token}`,
                },
            }
        );

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty('_id');
        expect(res.data.title).toBe(newMovie.title);
        expect(res.data.rating).toBe(newMovie.rating);
        movieId = res.data._id;
    });

    it('User 2 should NOT modify the movie created by User 1', async () => {
        const updatedMovie = {
            id: movieId,
            title: 'Updated Title by User 2',
            rating: 4,
        };

        try {
            await axios.put(`/api/movies`,
                updatedMovie,
                {
                    headers: {
                        Authorization: `Bearer ${user2Token}`,
                    },
                }
            );
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    it('User 1 should successfully modify their own movie', async () => {
        const updatedMovie = {
            id: movieId,
            title: 'Updated Title by User 1',
            rating: 4,
        };

        const res = await axios.put(`/api/movies`,
            updatedMovie,
            {
                headers: {
                    Authorization: `Bearer ${user1Token}`,
                },
            }
        );

        expect(res.status).toBe(200);
        expect(res.data.title).toBe(updatedMovie.title);
        expect(res.data.rating).toBe(updatedMovie.rating);
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
            email: "newuser1@example.com",
        },
        });
        expect(deleteRes.status).toBe(200);
        const deleteRes2 = await axios.delete('/api/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                email: "newuser2@example.com",
            },
        });
        expect(deleteRes2.status).toBe(200);
    });
})

