import shopModel from '../models/ShopModel.mjs'


export const createShop = async (req, res) => {
    const propietario = req.userID;
    const {
      name,
      about,
      shopAdress,
    } = req.body;
    try {
        // Creacion de tienda
        const shop = new shopModel({
          name,
          about,
          shopAdress,
          propietario
        });
        await shop.save();

        res.status(201).json({
            message: 'Tienda creada',
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