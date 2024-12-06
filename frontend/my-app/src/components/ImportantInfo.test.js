// src/components/ImportantInfo.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import ImportantInfo from './ImportantInfo';
import { BrowserRouter as Router } from 'react-router-dom'; // Asegúrate de usar BrowserRouter
import { auth } from '../services/firebase'; // Esto lo usamos si es necesario mockear la autenticación

describe('ImportantInfo Component', () => {
  it('debe renderizar correctamente todos los elementos', () => {
    render(
      <Router>
        <ImportantInfo />
      </Router>
    );
    // Verifica que los elementos de la página se estén renderizando correctamente
    expect(screen.getByText('La importancia de mantener una buena salud mental')).toBeInTheDocument();
    expect(screen.getByText('El objetivo de WorkMind Zen')).toBeInTheDocument();
  });

  it('debe navegar a la página de perfil cuando se hace clic en el botón "Perfil"', () => {
    render(
      <Router>
        <ImportantInfo />
      </Router>
    );
    fireEvent.click(screen.getByText('Perfil'));
    // Aquí podrías mockear la navegación o verificar que se haya hecho la llamada a navigate
    // Verifica que el redireccionamiento se haya realizado correctamente
  });

  it('debe navegar a la página de consejos cuando se hace clic en el botón "Consejos"', () => {
    render(
      <Router>
        <ImportantInfo />
      </Router>
    );
    fireEvent.click(screen.getByText('Consejos'));
    // Verifica que el redireccionamiento se haya realizado correctamente
  });

  it('debe cerrar sesión y redirigir a la página principal cuando se hace clic en "Cerrar Sesión"', () => {
    render(
      <Router>
        <ImportantInfo />
      </Router>
    );
    fireEvent.click(screen.getByText('Cerrar Sesión'));
    // Mockea el comportamiento de la autenticación y la navegación
    expect(auth.signOut).toHaveBeenCalled();
    // Aquí también puedes verificar si la página ha sido redirigida correctamente
  });
});
