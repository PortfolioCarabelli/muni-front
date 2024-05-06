export const textCapitalization = (text) => {
  if (!text) return ""; // Si no hay texto, retornar una cadena vacía
  const words = text.split(" "); // Dividir el texto en palabras
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return capitalizedWords.join(" "); // Unir las palabras capitalizadas
};

export function capitalizar(texto) {
  const palabras = texto.split(" ");

  const palabrasCapitalizadas = palabras.map((palabra) => {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
  });

  const textoFinal = palabrasCapitalizadas.join(" ");

  return textoFinal;
}

export const getFieldErrorNames = (formikErrors) => {
  const transformObjectToDotNotation = (obj, prefix = "", result = []) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!value) return;

      const nextKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object") {
        transformObjectToDotNotation(value, nextKey, result);
      } else {
        result.push(nextKey);
      }
    });

    return result;
  };

  return transformObjectToDotNotation(formikErrors);
};

export const validatePermissions = (elements, permissions) => {
  if (permissions.length && elements.length) {
    const matches = elements.filter((element) =>
      permissions.includes(element.key)
    );
    return matches;
  } else {
    return [];
  }
};

export const categories = [
  {
    icon: "healthicons:running-water-outline",
    name: "Agua",
    color: "blue",
  },
  {
    icon: "game-icons:double-street-lights",
    name: "Alumbrado",
    color: "lightgreen",
  },
  {
    icon: "streamline:street-road",
    name: "Calle",
    color: "#333",
  },
  {
    icon: "icon-park-solid:circles-seven",
    name: "Otros",
    color: "#f9523e",
  },
];
