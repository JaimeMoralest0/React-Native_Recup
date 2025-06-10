// Importar libreria para manejo de ficheros de configuración dependiendo de la variable de entorno NODE_ENV
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

// Importar fichero de configuración con variables de entorno
const config = require("./config/config.js");
// Importar librería express --> web server
const express = require("express");
// Importar librería path, para manejar rutas de ficheros en el servidor
const path = require("path");
// Importar libreria CORS
const cors = require("cors");

// Importar librería de manejo de cookies
const cookieParser = require("cookie-parser");
// Importar gestores de rutas
const episodiosRoutes = require("./routes/episodiosRoutes");
const seriesRoutes = require("./routes/seriesRoutes");

const app = express();

// Configurar middleware para analizar JSON en las solicitudes
app.use(express.json());

// Configurar CORS para admitir cualquier origen
// app.use(cors()); // No permitite el envío de cookies en una API pública

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: true, // Permite cualquier origen en desarrollo
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
    })
  );
}

// Habilitar el análisis de cookies
app.use(cookieParser());

// Configurar rutas de la API Rest
app.use("/api/series", seriesRoutes);
app.use("/api/episodios", episodiosRoutes);

if (process.env.NODE_ENV !== "production") {
  console.log("Sirviendo ficheros de desarrollo");
  // Configurar el middleware para servir archivos estáticos desde el directorio public/dev en desarrollo
  app.use(express.static(path.join(__dirname, "public/dev")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/dev", "index.html"));
  });
} else {
  console.log("Sirviendo ficheros de producción");
  // Configurar el middleware para servir archivos estáticos desde el directorio public/dev en producción
  app.use(express.static(path.join(__dirname, "public/prod")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/prod", "index.html"));
  });
}

// Iniciar el servidor solo si no estamos en modo de prueba
// en modo de prueba, el servidor se inicia en el archivo de prueba
if (process.env.NODE_ENV !== "test") {
  const startServer = (port) => {
    try {
      app.listen(port, () => {
        console.log(`Servidor escuchando en el puerto ${port}`);
      });
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.log(`El puerto ${port} está en uso, intentando con el puerto ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error('Error al iniciar el servidor:', error);
      }
    }
  };

  startServer(config.port);
}

// Exportamos la aplicación para poder hacer pruebas
module.exports = app; 