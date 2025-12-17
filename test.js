const axios = require('axios');

async function test() {
  try {
    // Create category
    const categoryResponse = await axios.post('http://localhost:3000/api/book-category', {
      name: 'Tech',
      description: 'Technology books'
    });
    const category = categoryResponse.data;
    console.log('Created category:', category);
    const categoryId = category.id;

    // Create book
    const bookResponse = await axios.post('http://localhost:3000/api/book', {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      price: 45.99,
      categoryId: categoryId
    });
    const book = bookResponse.data;
    console.log('Created book:', book);
    const bookId = book.id;

    // Get book with relations
    const getBookResponse = await axios.get(`http://localhost:3000/api/book/${bookId}`);
    const bookWithCategory = getBookResponse.data;
    console.log('Book with category:', bookWithCategory);

    // Like the book 3 times
    for (let i = 0; i < 3; i++) {
      await axios.patch(`http://localhost:3000/api/book/${bookId}/like`);
    }

    // Get book again to check likeCount
    const finalBookResponse = await axios.get(`http://localhost:3000/api/book/${bookId}`);
    const finalBook = finalBookResponse.data;
    console.log('Final book with likeCount:', finalBook);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

test();