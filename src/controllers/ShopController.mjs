import shopModel from '../models/ShopModel.mjs'
import userModel from '../models/UserModel.mjs'
import jwt from 'jsonwebtoken'


export const createShop = async (req, res) => {
  const propietario = req.userID;
  const {
    name,
    about,
    shopAdress,
    email
  } = req.body;
  try {
    // Actualiza rol de usuario

    const userId = req.userID;
    const role = 'seller';
    console.log(userId)
    // Verificar si el usuario existe
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'El usuario no existe'
      });
    }
    // Actualizar usuario
    await userModel.findByIdAndUpdate(userId, {
      role
    }, {
      new: true
    });
    //actualiza el token
    const token = jwt.sign({
      _id: user._id,
      role: user.role
    }, process.env.JWT_SECRET);

    // Creacion de tienda
    const shop = new shopModel({
      name,
      about,
      shopAdress,
      propietario,
      email
    });
    await shop.save();
    res.status(201).json({
      message: 'Tienda creada',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al crear Tienda'
    });
  }
};

export const updateShop = async (req, res) => {
  const propietario = req.userID;
  const {
    name,
    about,
    shopAdress,
    email
  } = req.body;

  try {
    // Verificar si la tienda existe
    const shop = await shopModel.findOne({ propietario });

    if (!shop) {
      return res.status(404).json({
        message: 'La tienda no existe',
      });
    }

    // Actualizar los datos de la tienda
    shop.name = name;
    shop.about = about;
    shop.shopAdress = shopAdress;
    shop.email = email;

    await shop.save();

    res.status(200).json({
      message: 'Tienda actualizada',
      shop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al actualizar la tienda',
    });
  }
};


/* export default {
    createShop, 
    updateShop
} */