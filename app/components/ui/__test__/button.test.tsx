import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  test('01 - should render without crashing', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('02 - should render with different variants', () => {
    render(<Button variant="outline">Outline Button</Button>);
    expect(screen.getByText('Outline Button')).toBeInTheDocument();
  });

  test('03 - should render with different sizes', () => {
    render(<Button size="lg">Large Button</Button>);
    expect(screen.getByText('Large Button')).toBeInTheDocument();
  });

  test('04 - should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByText('Disabled Button')).toBeDisabled();
  });
});
