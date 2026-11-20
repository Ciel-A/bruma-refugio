const U = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Imágenes locales generadas en Google Stitch (public/images)
const STITCH_EXTERIOR = "/images/stitch-exterior.jpg";
const STITCH_INTERIOR = "/images/stitch-interior.jpg";

export const CABINS = [
  {
    id: "helecho",
    slug: "helecho",
    name: "Helecho",
    eyebrow: "Cabaña 01 · Bosque de lengas",
    headline: "Madera oscura entre helechos y niebla.",
    shortDescription:
      "La más amplia del bosque: living a doble altura, estufa a leña y ventanales que se pierden entre las lengas.",
    exteriorImage: STITCH_EXTERIOR,
    pricePerNight: 240,
    maxGuests: 4,
    surface: 68,
    heating: "Estufa a leña + piso radiante",
    coordinates: "40° 46' S · 71° 38' O",
    interiorTitle: "Calma mineral, calor de leña.",
    interiorDescription:
      "Revestimientos de lenga ahumada, lino crudo y luz natural filtrada por el bosque. Un interior pensado para bajar el ritmo.",
    rooms: [
      { id: "helecho-dormitorio", label: "Dormitorio principal", meta: "Cama king · ventanal al bosque", image: STITCH_INTERIOR },
      { id: "helecho-living", label: "Living", meta: "Paneles de madera · luz natural", image: U("1604014237800-1c9102c219da") },
      { id: "helecho-cocina", label: "Cocina y comedor", meta: "Mesada de madera · equipada", image: U("1505873242700-f289a29e1e0f") },
      { id: "helecho-bano", label: "Baño", meta: "Bañera de inmersión · ventana al bosque", image: U("1620626011761-996317b8d101") },
      { id: "helecho-estar", label: "Rincón de lectura", meta: "Madera natural · calma", image: U("1585128792020-803d29415281") },
    ],
    detailGallery: [
      { id: "helecho-detalle-1", label: "Fachada", image: U("1587061949409-02df41d5e562") },
      { id: "helecho-detalle-2", label: "Entorno", image: U("1595521624992-48a59aef95e3") },
    ],
    amenities: [
      "Estufa a leña",
      "Wi-Fi satelital",
      "Cocina equipada",
      "Deck con parrilla",
      "Ropa de cama de lino",
      "Desayuno patagónico",
    ],
  },
  {
    id: "lago",
    slug: "lago",
    name: "Lago",
    eyebrow: "Cabaña 02 · Orilla norte",
    headline: "Silencio frente al agua quieta.",
    shortDescription:
      "Refugio íntimo para dos sobre la costa: ventanal panorámico al lago, bañera exterior y atardeceres de espejo.",
    exteriorImage: U("1470770841072-f978cf4d019e"),
    pricePerNight: 280,
    maxGuests: 2,
    surface: 54,
    heating: "Estufa a leña + losa radiante",
    coordinates: "40° 46' S · 71° 38' O",
    interiorTitle: "Un ambiente, un solo horizonte.",
    interiorDescription:
      "Planta abierta, madera clara sobre paleta oscura y el lago como único cuadro. Diseñada para parejas que buscan intimidad.",
    rooms: [
      { id: "lago-dormitorio", label: "Dormitorio", meta: "Cama queen · textiles crudos", image: U("1522771739844-6a9f6d5f14af") },
      { id: "lago-living", label: "Living", meta: "Pared de madera · ventanal", image: U("1600607687939-ce8a6c25118c") },
      { id: "lago-cocina", label: "Cocina", meta: "Madera clara · abierta al living", image: U("1600585152220-90363fe7e115") },
      { id: "lago-bano", label: "Baño", meta: "Bañera de piedra · microcemento", image: U("1507652313519-d4e9174996dd") },
      { id: "lago-estar", label: "Rincón de lectura", meta: "Madera natural · luz de tarde", image: U("1585128792020-803d29415281") },
    ],
    detailGallery: [
      { id: "lago-detalle-1", label: "Deck", image: U("1499696010180-025ef6e1a8f9") },
      { id: "lago-detalle-2", label: "Bosque", image: U("1595877244574-e90ce41ce089") },
    ],
    amenities: [
      "Bañera exterior",
      "Muelle privado",
      "Estufa a leña",
      "Wi-Fi satelital",
      "Kayaks incluidos",
      "Desayuno patagónico",
    ],
  },
  {
    id: "cumbre",
    slug: "cumbre",
    name: "Cumbre",
    eyebrow: "Cabaña 03 · Ladera alta",
    headline: "Arquitectura a la altura de la montaña.",
    shortDescription:
      "La más grande: dos dormitorios, vistas a los picos y un living de vidrio suspendido sobre la ladera.",
    exteriorImage: U("1510798831971-661eb04b3739"),
    pricePerNight: 320,
    maxGuests: 4,
    surface: 82,
    heating: "Estufa a leña + calefacción central",
    coordinates: "40° 46' S · 71° 38' O",
    interiorTitle: "Vidrio, piedra y cielo abierto.",
    interiorDescription:
      "Volúmenes limpios, madera tostada y grandes paños vidriados con vista a la cordillera. La suite más reservada de BRUMA.",
    rooms: [
      { id: "cumbre-dormitorio", label: "Suite principal", meta: "Cama king · madera y ventanales", image: U("1578683010236-d716f9a3f461") },
      { id: "cumbre-living", label: "Living", meta: "Doble altura · vidrio piso a techo", image: U("1564078516393-cf04bd966897") },
      { id: "cumbre-cocina", label: "Cocina y comedor", meta: "Mesa frente al ventanal", image: U("1537726235470-8504e3beef77") },
      { id: "cumbre-bano", label: "Baño", meta: "Bañera exenta · piedra oscura", image: U("1600566752355-35792bedcfea") },
      { id: "cumbre-estar", label: "Estar", meta: "Paneles de madera · luz natural", image: U("1604014237800-1c9102c219da") },
    ],
    detailGallery: [
      { id: "cumbre-detalle-1", label: "Fachada", image: U("1600566753190-17f0baa2a6c3") },
      { id: "cumbre-detalle-2", label: "Cordillera", image: U("1506905925346-21bda4d32df4") },
    ],
    amenities: [
      "Jacuzzi exterior",
      "Estufa a leña",
      "Cocina equipada",
      "Wi-Fi satelital",
      "Telescopio",
      "Desayuno patagónico",
    ],
  },
];

export const getCabinById = (id) => CABINS.find((c) => c.id === id) || CABINS[0];
