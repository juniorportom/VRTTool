describe('Generar paleta de colores', function() {
    it('Visits vrt-colorpallete-taller6 at generate palette', function() {
        cy.visit('https://juniorportom.github.io/vrt-colorpallete-taller6/palette.html')
        cy.wait(1000)
        cy.screenshot('1_palette-1')
        cy.contains(' Generar nueva paleta').click()
        cy.wait(1000)
        cy.screenshot('2_palette-2')
    })
})