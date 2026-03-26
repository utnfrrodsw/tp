const Review = require('../models/review');

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar reseña' });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.findAll({
      where: { productId },
      include: ['User'], // Si tu modelo Review tiene asociación con User
    });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reseñas del producto' });
  }
};



const createReview = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productId, rating, comment } = req.body;

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};


const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    await review.update(req.body);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar reseña' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    await review.destroy();
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
};
