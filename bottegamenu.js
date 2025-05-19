 function normalizar(texto) {
  return texto
    .normalize('NFD')                // descompone letras y diacríticos
    .replace(/[\u0300-\u036f]/g, '') // elimina los diacríticos
    .toLowerCase();
}

// Menús según la hora
const menus = {
  desayuno: {
    rango: [8, 11],
    primerPlato: {
      "Té": 2,
      "Café solo": 2,
      "Café con leche": 2.5
    },
    segundoPlato: {
      "Huevos revueltos": 4,
      "Croissant": 3,
      "Bocadillo de jamón": 6.5
    },
    postre: {
      "Yogur natural": 2,
      "Pieza de fruta": 1.5,
      "Zumo de naranja": 3.5
    }
  },
  comida: {
    rango: [12, 15],
    primerPlato: {
      "Ensalada mixta": 5,
      "Sopa del día": 4,
      "Paella": 6
    },
    segundoPlato: {
      "Pollo asado": 8,
      "Merluza en salsa verde": 10.5,
      "Filete de ternera": 9.9
    },
    postre: {
      "Flan casero": 3,
      "Helado": 3.5,
      "Fruta con nata": 3.9
    }
  },
  cena: {
    rango: [19, 22],
    primerPlato: {
      "Gazpacho": 4,
      "Pasta con verduras": 6.5,
      "Ensalada César": 6
    },
    segundoPlato: {
      "Entrecot": 12,
      "Salmón con basmati": 13,
      "Lasaña de verduras": 9
    },
    postre: {
      "Tarta de queso casera": 6,
      "Yogur": 3,
      "Cocktail de frutas": 4.5
    }
  }
};

// Comentarios aleatorios después de cada confirmación
const comentarios = [
  "¡Buena elección!",
  "¡Eso es tener buen gusto!",
  "Eso suena delicioso",
  "¡Menuda elección acertada!",
  "¡Te va a encantar!"
];

// Pedimos la hora al cliente
let hora = parseInt(prompt(
  "Hola, soy Carolina y seré tu camarera hoy en Bottega Diner.\n" +
  "Dime qué hora es en formato 0–23"
));
if (isNaN(hora) || hora < 0 || hora > 23) {
  alert("Hora no válida. Recarga y prueba de nuevo.");
  throw new Error("Hora inválida");
}

// Determinar menú según la hora
let claveMenu = null;
for (let clave in menus) {
  const [inicio, fin] = menus[clave].rango;
  if (hora >= inicio && hora <= fin) {
    claveMenu = clave;
    break;
  }
}
if (!claveMenu) {
  alert("Lo siento, en este momento la cocina está cerrada.");
  throw new Error("Fuera de horario");
}
const menu = menus[claveMenu];

// Detallar el menú
let descripcion = `Menú de ${claveMenu.toUpperCase()} hoy:\n\n` +
  "PRIMEROS:\n" +
  Object.entries(menu.primerPlato)
    .map(([plato, precio]) => ` - ${plato}: ${precio}€`)
    .join("\n") +
  "\n\nSEGUNDOS:\n" +
  Object.entries(menu.segundoPlato)
    .map(([plato, precio]) => ` - ${plato}: ${precio}€`)
    .join("\n") +
  "\n\nPOSTRES:\n" +
  Object.entries(menu.postre)
    .map(([plato, precio]) => ` - ${plato}: ${precio}€`)
    .join("\n");
alert(descripcion);

// Función para elegir plato, confirmar y comentar
function elegirYConfirmar(categoria, opciones) {
  const nombres = Object.keys(opciones);
  let platoSeleccionado, precioSeleccionado;
  const maxIntentos = 10;  
  let intentos = 0;

  while (intentos < maxIntentos) {
    let entrada = prompt(
      `Elige un ${categoria} \n` +
      nombres.map(n => `• ${n}`).join("\n")
    );
    if (entrada === null) {
      alert("Proceso cancelado. Recarga para empezar de nuevo.");
      throw new Error("Cancelado por usuario");
    }
    entrada = normalizar(entrada.trim());

    // Buscamos coincidencia por prefijo en cualquier palabra del nombre normalizado
    const encontrado = nombres.find(nombre =>
      normalizar(nombre)
        .split(" ")
        .some(pal => pal.startsWith(entrada))
    );

    if (!encontrado) {
      intentos++;
      if (intentos < maxIntentos) {
        alert(`Ha habido un error, inténtalo de nuevo. (${intentos}/${maxIntentos})`);
        continue;
      } else {
        alert("Has excedido el número de intentos. Recarga para empezar de nuevo.");
        throw new Error("Demasiados intentos fallidos");
      }
    }

    // Confirmación
    platoSeleccionado = encontrado;
    precioSeleccionado = opciones[encontrado];
    if (!confirm(`¿Confirmas tu ${categoria}: "${platoSeleccionado}" por ${precioSeleccionado}€?`)) {
      alert("Proceso cancelado. Recarga para empezar de nuevo.");
      throw new Error("Cancelado por usuario");
    }

    // Comentario aleatorio al confirmar
    alert(comentarios[Math.floor(Math.random() * comentarios.length)]);
    break;
  }

  return { plato: platoSeleccionado, precio: precioSeleccionado };
}

// Elegir primero, segundo y postre
const eleccion1 = elegirYConfirmar("primer plato", menu.primerPlato);
const eleccion2 = elegirYConfirmar("segundo plato", menu.segundoPlato);
const eleccion3 = elegirYConfirmar("postre", menu.postre);

// Alert final con el detalle del pedido y total precio
const total = eleccion1.precio + eleccion2.precio + eleccion3.precio;
alert(
  `Resumen de tu pedido:\n\n` +
  `1º ${eleccion1.plato}: ${eleccion1.precio}€\n` +
  `2º ${eleccion2.plato}: ${eleccion2.precio}€\n` +
  `Postre: ${eleccion3.plato}: ${eleccion3.precio}€\n\n` +
  `TOTAL: ${total.toFixed(2)}€\n\n` +
  `¡Gracias por elegirnos, deseo que te guste!`
);
