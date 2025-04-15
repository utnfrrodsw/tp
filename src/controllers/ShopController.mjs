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
    // Creacion de tienda
    const shop = new shopModel({
      name,
      about,
      shopAdress,
      propietario,
      email
    });
    const savedShop = await shop.save();
    const shopId = savedShop._id;

    // Actualizar usuario
    const nuevoUser= await userModel.findByIdAndUpdate(userId, {
      
      tienda:shopId,
      role: role
    }, {
      new: true
    });
    //actualiza el token
    const token = jwt.sign({
      _id: nuevoUser._id,
      role: nuevoUser.role
    }, process.env.JWT_SECRET);

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


export const deleteShop = async (req, res) => {
  const propietario = req.userID; 

  try {
    // verificar si la tienda existe
    console.log(propietario)
    const shop = await shopModel.findOne({ propietario: propietario });
    console.log(shop)
    if (!shop) {
      return res.status(404).json({
        message: 'La tienda no existe',
      });
    }

    // eliminar la tienda
    await shopModel.findOneAndRemove({ propietario: propietario });
    const role='user'
    const user = await userModel.findByIdAndUpdate(propietario, {
      role: role
    }, {
      new: true
    });
    //actualiza el token
    const token = jwt.sign({
      _id: user._id,
      role: user.role
    }, process.env.JWT_SECRET);
    res.status(200).json({
      message: 'Tienda eliminada con éxito',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error al eliminar la tienda',
    });
  }
};