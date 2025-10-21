import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '../card';

describe('Card', () => {
  test('01 - should render without crashing', () => {
    render(
      <Card>
        <CardContent>Test Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('02 - should render with header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Test Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('03 - should render with custom className', () => {
    render(
      <Card className="custom-class">
        <CardContent>Test Content</CardContent>
      </Card>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
