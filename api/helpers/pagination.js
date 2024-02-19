const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0

  return { limit, offset }
}

const getPaginationData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)

  return { items, totalItems, totalPages, currentPage }
}

module.exports = {
  getPagination,
  getPaginationData
}
