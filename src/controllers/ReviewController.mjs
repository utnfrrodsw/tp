import reviewModel from '../models/ReviewModel.mjs'
import ProductModel from '../models/ProductModel.mjs'

export const createReview = async (req, res) => {
    
    try {
      const userId = req.userID;
      const { product, rating, comment } = req.body;

      // Crear Review
      const review = new reviewModel({
        user: userId,
        product,
        rating,
        comment
      });

      // Guardar review
      const createdReview = await review.save();

      // Actualizar el producto para guardar el ID de la reseña
      await ProductModel.findByIdAndUpdate(product, { $push: { reseña: createdReview._id } });
      
      res.status(201).json({
        message: 'Reseña creada',
        review: createdReview
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al crear Reseña'
        });
    }
};


export const getAll = async (req, res) => {
    try {

      let filters = { };
      let reviews = await reviewModel.find(filters, req.query.fields).exec();


      res.status(200).json({
        reviews
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener Reseñas'
        });
    }
};

