const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    experimentalStudio: true, // Habilita a gravação de scripts por cliques
    supportFile: false,
    baseUrl: "http://localhost:3000", // URL padrão do Vite 
    setupNodeEvents(on, config) {
      // listeners de eventos 
    },
  },
});