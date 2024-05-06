import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('El nombre es requerido'),
  last_name: Yup.string().required('El apellido es requerido'),
  email: Yup.string().email('Ingrese un correo electrónico válido').required('El email es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  roleCode: Yup.string().required('El rol es requerido'),
});

export const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  roleCode: ''
};
