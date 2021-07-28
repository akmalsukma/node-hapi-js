const { addBookHandler, getAllBooksHandler, getBooksByIdHandler, deleteBooksByIdHandler, editBooksByIdHandler } = require('./handler')
const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookid}',
    handler: getBooksByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookid}',
    handler: editBooksByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookid}',
    handler: deleteBooksByIdHandler
  }
]

module.exports = routes
