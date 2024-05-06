import React from 'react';
import './styles.css'; // Importar el archivo de estilos CSS

function CustomButton({ text, icon, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      <p className="paragraph">{text}</p>
      <span className="icon-wrapper">
        {icon}
      </span>
    </button>
  );
}

export default CustomButton;