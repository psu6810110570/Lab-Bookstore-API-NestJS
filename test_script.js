const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function main() {
    try {
        // 1. Login or Create User
        let token;
        try {
            console.log('Attempting login...');
            const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'admin@test.com',
                password: 'password'
            });
            token = loginRes.data.access_token;
            console.log('Login successful');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                console.log('Login failed, creating user...');
                await axios.post(`${BASE_URL}/users`, {
                    email: 'admin@test.com',
                    password: 'password',
                    role: 'ADMIN'
                });
                const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'admin@test.com',
                    password: 'password'
                });
                token = loginRes.data.access_token;
                console.log('User created and logged in');
            } else {
                throw e;
            }
        }

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Get/Create Category
        console.log('Fetching categories...');
        let categoryId;
        try {
            const catRes = await axios.get(`${BASE_URL}/book-category`, authHeader);
            if (catRes.data.length > 0) {
                categoryId = catRes.data[0].id;
            } else {
                console.log('Creating category...');
                const newCat = await axios.post(`${BASE_URL}/book-category`, { title: 'Test Category' }, authHeader);
                categoryId = newCat.data.id;
            }
        } catch (e) {
            // Assuming endpoint is protected or something
            console.log('Error fetching/creating category, trying to create blind or check error:', e.message);
            // If 403, we might need to be admin. We are admin.
            // Let's assume we can just create one if we are admin.
            const newCat = await axios.post(`${BASE_URL}/book-category`, { title: 'Test Category' }, authHeader);
            categoryId = newCat.data.id;
        }
        console.log('Category ID:', categoryId);

        // 3. Create Book
        console.log('Creating book...');
        const bookTitle = `Test Book ${Date.now()}`;
        const bookRes = await axios.post(`${BASE_URL}/book`, {
            title: bookTitle,
            author: 'Tester',
            price: 100,
            categoryId: categoryId
        }, authHeader);
        const bookId = bookRes.data.id;
        console.log('Book created:', bookId);

        // 4. Initial Check
        let book = (await axios.get(`${BASE_URL}/book/${bookId}`)).data;
        console.log('Initial Like Count:', book.likeCount);

        // 5. Like (1st time)
        console.log('Toggling Like (1st time)...');
        await axios.patch(`${BASE_URL}/book/${bookId}/like`, {}, authHeader);
        book = (await axios.get(`${BASE_URL}/book/${bookId}`)).data;
        console.log('Like Count after 1st toggle:', book.likeCount);

        // 6. Like (2nd time - Unlike)
        console.log('Toggling Like (2nd time)...');
        await axios.patch(`${BASE_URL}/book/${bookId}/like`, {}, authHeader);
        book = (await axios.get(`${BASE_URL}/book/${bookId}`)).data;
        console.log('Like Count after 2nd toggle:', book.likeCount);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

main();
