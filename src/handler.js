const { nanoid } = require('nanoid')
const bookshelf = require('./bookshelf')

const addBookHandler = (request, h) => {
  const name = request.payload.name

  const readPage = request.payload.readPage
  const pageCount = request.payload.pageCount
  const { year, author, summary, publisher, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  if (name == null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  if (readPage === pageCount) {
    const finished = true
    const newBooks = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }
    bookshelf.push(newBooks)
  }
  const finished = false
  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  bookshelf.push(newBooks)

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query
  if (name) {
    const searchname = bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const response = h.response({
      status: 'success',
      data: {
        books: searchname.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else if (reading) {
    if (reading === 1) {
      const searchread = bookshelf.filter((book) => book.reading === true)
      const response = h.response({
        status: 'success',
        data: {
          books: searchread.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      })
      response.code(200)
      return response
    } else {
      const searchread = bookshelf.filter((book) => book.reading === false)
      const response = h.response({
        status: 'success',
        data: {
          books: searchread.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }
      })
      response.code(200)
      return response
    }
  } else if (finished) {
    const searchfinish = bookshelf.filter(book => Number(book.finished) === Number(finished))
    const response = h.response({
      status: 'success',
      data: {
        books: searchfinish.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: bookshelf.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }
}

const getBooksByIdHandler = (request, h) => {
  const { bookid } = request.params

  const book = bookshelf.filter((n) => n.id === bookid)[0]

  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}
const editBooksByIdHandler = (request, h) => {
  const { bookid } = request.params

  const index = bookshelf.findIndex((note) => note.id === bookid)

  if (index !== -1) {
    const name = request.payload.name

    const readPage = request.payload.readPage
    const pageCount = request.payload.pageCount
    const { year, author, summary, publisher, reading } = request.payload
    const updatedAt = new Date().toISOString()

    if (name == null) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      readPage,
      pageCount,
      year,
      author,
      summary,
      publisher,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBooksByIdHandler = (request, h) => {
  const { bookid } = request.params

  const index = bookshelf.findIndex((note) => note.id === bookid)

  if (index !== -1) {
    bookshelf.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBookHandler, getAllBooksHandler, getBooksByIdHandler, deleteBooksByIdHandler, editBooksByIdHandler }
