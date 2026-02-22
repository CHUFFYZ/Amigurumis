// =============================================
//  DATA.JS — Catálogo de Amigurumis
//  Para agregar un nuevo amigurumi, copia uno
//  de los objetos de abajo y modifica sus datos.
// =============================================

const PHONE_NUMBER = "9381780837";

const AMIGURUMIS = [
  {
    id: 1,
    name: "Capibara",
    price: 15.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/capibara.jpg",
    height: "15 cm",
    width: "10 cm",
    material: "Acrílico",
    description: "El amigurumi más tranquilo del catálogo, ideal para regalar."
  },
  {
    id: 2,
    name: "Oso Freddy",
    price: 12.00,
    available: false,
    image: "https://amigurumis-rosy.onrender.com/image/oso-freddy.jpg",
    height: "12 cm",
    width: "8 cm",
    material: "Acrílico",
    description: "Un oso entrañable con mucho carácter y personalidad."
  },
  {
    id: 4,
    name: "Luffy",
    price: 18.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/luffy.jpg",
    height: "18 cm",
    width: "12 cm",
    material: "Acrílico",
    description: "El rey de los piratas en versión amigurumi. ¡Perfecto para fans!"
  },
  {
    id: 5,
    name: "Chihuahua",
    price: 15.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/chihuahua.jpg",
    height: "15 cm",
    width: "10 cm",
    material: "Acrílico",
    description: "El perrito más famoso de México en versión tejida."
  },
  {
    id: 6,
    name: "Ramo tipo 1",
    price: 12.00,
    available: false,
    image: "https://amigurumis-rosy.onrender.com/image/ramo.jpg",
    height: "12 cm",
    width: "8 cm",
    material: "Acrílico",
    description: "Un ramo floral tejido que nunca se marchita. Regalo eterno."
  },
  {
    id: 7,
    name: "Ramo tipo 2",
    price: 18.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/ramo2.jpg",
    height: "18 cm",
    width: "12 cm",
    material: "Acrílico",
    description: "Versión premium del ramo floral, más elaborado y colorido."
  },
  {
    id: 8,
    name: "Flor reversible",
    price: 15.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/flor-reversible.jpg",
    height: "15 cm",
    width: "10 cm",
    material: "Acrílico",
    description: "¡Tiene dos caras! Reversible y sorprendente."
  },
  {
    id: 9,
    name: "Pollo",
    price: 12.00,
    available: false,
    image: "https://amigurumis-rosy.onrender.com/image/pollo.jpg",
    height: "12 cm",
    width: "8 cm",
    material: "Acrílico",
    description: "El pollito más adorable que vas a encontrar."
  },
  {
    id: 10,
    name: "Spunky Naranja",
    price: 18.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/spuky-naranja.jpg",
    height: "18 cm",
    width: "12 cm",
    material: "Acrílico",
    description: "Versión naranja del popular Spunky, lleno de energía."
  },
  {
    id: 11,
    name: "Spunky Amarillo",
    price: 15.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/spuky-amarillo.jpg",
    height: "15 cm",
    width: "10 cm",
    material: "Acrílico",
    description: "Versión amarilla del Spunky, brillante como el sol."
  },
  {
    id: 12,
    name: "Spunky Rosa",
    price: 12.00,
    available: false,
    image: "https://amigurumis-rosy.onrender.com/image/spuky-rosa.jpg",
    height: "12 cm",
    width: "8 cm",
    material: "Acrílico",
    description: "Versión rosa del Spunky, dulce y adorable."
  },
  {
    id: 13,
    name: "Spunky Verde",
    price: 18.00,
    available: true,
    image: "https://amigurumis-rosy.onrender.com/image/spuky-verde.jpg",
    height: "18 cm",
    width: "12 cm",
    material: "Acrílico",
    description: "Versión verde del Spunky, fresco y lleno de vida."
  }
];
