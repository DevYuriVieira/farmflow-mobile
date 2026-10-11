describe('FarmFlow — Cypress Multi-Viewport Visual Snapshot Suite', () => {
  const viewports: Array<{ name: string; width: number; height: number }> = [
    { name: 'mobile-portrait', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ];

  viewports.forEach(({ name, width, height }) => {
    it(`captures baseline visual snapshot on ${name} (${width}x${height})`, () => {
      cy.viewport(width, height);
      cy.visit('/');
      cy.get('#root').should('be.visible');
      cy.screenshot(`visual-baseline-${name}`, {
        capture: 'viewport',
        overwrite: true,
      });
    });
  });
});
