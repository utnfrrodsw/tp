import { cleanup, render, screen } from '@testing-library/react';
import Stars from './Stars';
import { describe, it, expect } from 'vitest';

describe('Stars component', () => {
  it('Renderiza la cantidad correcta de estrellas, basado en el prop', () => {
    render(<Stars cant={3} />);
    const fullStars = screen.getAllByTestId('full-star-icon');
    expect(fullStars.length).toBe(3);
    const emptyStars = screen.getAllByTestId('empty-star-icon');
    expect(emptyStars.length).toBe(2);
    cleanup();
    render(<Stars cant={4.5} />);
    const fullStars2 = screen.getAllByTestId('full-star-icon');
    expect(fullStars2.length).toBe(4);
    const halfStars = screen.getAllByTestId('half-star-icon');
    expect(halfStars.length).toBe(1);
  });

  it('Muestra un mensaje cuando el prop es 0', () => {
    render(<Stars cant={0} />);

    const message = screen.getByTestId('no-rating');
    expect(message.textContent).toEqual('No tiene calificaciones');
  });
});
