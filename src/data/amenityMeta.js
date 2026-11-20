import {
  Flame,
  Wifi,
  CookingPot,
  Sunset,
  BedDouble,
  Coffee,
  Bath,
  Anchor,
  Waves,
  Telescope,
  Sparkles,
} from "lucide-react";

// Metadatos editoriales de cada amenity (ícono, descripción, etiqueta técnica)
const META = {
  "Estufa a leña": {
    icon: Flame,
    description: "Calor real de leña nativa, con reposición diaria incluida en la estadía.",
    tag: "Incluido",
    highlight: true,
  },
  "Wi-Fi satelital": {
    icon: Wifi,
    description: "Conexión estable en medio del bosque, pensada para desconectar cuando quieras.",
    tag: "100 Mbps",
  },
  "Cocina equipada": {
    icon: CookingPot,
    description: "Utensilios, vajilla y despensa básica para cocinar sin salir de la cabaña.",
    tag: "Completa",
  },
  "Deck con parrilla": {
    icon: Sunset,
    description: "Deck de madera con parrilla a leña y vista abierta al bosque.",
    tag: "Uso exclusivo",
    highlight: true,
  },
  "Ropa de cama de lino": {
    icon: BedDouble,
    description: "Sábanas y toallas de lino lavadas a diario para un descanso profundo.",
    tag: "Premium",
  },
  "Desayuno patagónico": {
    icon: Coffee,
    description: "Pan casero, dulces regionales y café de especialidad cada mañana.",
    tag: "Incluido",
    highlight: true,
  },
  "Bañera exterior": {
    icon: Bath,
    description: "Bañera de inmersión al aire libre para mirar las estrellas.",
    tag: "Acceso exclusivo",
    highlight: true,
  },
  "Muelle privado": {
    icon: Anchor,
    description: "Muelle propio sobre la orilla, ideal para atardeceres de espejo.",
    tag: "Acceso exclusivo",
    highlight: true,
  },
  "Kayaks incluidos": {
    icon: Waves,
    description: "Dos kayaks y chalecos disponibles para recorrer el lago.",
    tag: "Incluido",
    highlight: true,
  },
  "Jacuzzi exterior": {
    icon: Bath,
    description: "Jacuzzi climatizado en la terraza con vista a la cordillera.",
    tag: "Acceso exclusivo",
    highlight: true,
  },
  Telescopio: {
    icon: Telescope,
    description: "Cielos sin contaminación lumínica y un telescopio para explorarlos.",
    tag: "Incluido",
    highlight: true,
  },
};

export function getAmenityMeta(name) {
  return (
    META[name] || {
      icon: Sparkles,
      description: "Un detalle pensado para que tu estadía sea simple.",
      tag: "Incluido",
      highlight: true,
    }
  );
}
