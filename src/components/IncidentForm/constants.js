import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  titulo: Yup.string().required("El título del incidente es requerido"),
  tipoIncidente: Yup.string().required("El tipo de incidente es requerido"),
  descripcion: Yup.string().required("La descripción del incidente es requerida"),
  observacion: Yup.string(), 
  reclamante: Yup.object().shape({
    nombreCompleto: Yup.string().required("El nombre completo del reclamante es requerido"),
    telefono: Yup.string().required("El teléfono del reclamante es requerido"),
    email: Yup.string(),
    direccion: Yup.object().shape({
      calle: Yup.string().required("La dirección es requerida"),
      calle1: Yup.string(),
      calle2: Yup.string()
    })
  })
});



