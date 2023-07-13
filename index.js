const express = require('express');
const qrcode = require('qrcode');

const app = express();
const port = 3000; 


// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Ruta para generar el código QR
app.get('/generate-qr', async (req, res) => {    
    const { url } = req.query;
    const format = req.query.format || 'png'; // Formato por defecto: PNG
    const size = parseInt(req.query.size) || 300; // Tamaño por defecto: 300px
    const margin = parseInt(req.query.margin) || 4; // Margen por defecto: 4
    const scale = parseInt(req.query.scale) || 4; // Escala por defecto: 4 [un valor de 1 significa 1px por módulos (puntos negros)]
    const colorDark = req.query.colorDark || '#000000'; // Color oscuro por defecto: negro
    const colorLight = req.query.colorLight || '#ffffff'; // Color claro por defecto: blanco

    try {
        const qrCodeData = await qrcode.toBuffer(url, {
            type: format,
            width: size,
            margin,
            scale,
            color: { dark: colorDark, light: colorLight }
        });

        // Establecer encabezados según el tipo de imagen
        if (format === 'webp') {
            res.set('Content-Type', 'image/webp');
        } else if (format === 'jpeg' || format === 'jpg') {
            res.set('Content-Type', 'image/jpeg');
        } else {
            res.set('Content-Type', 'image/png');
        }

        res.send(qrCodeData);
    } catch (err) {
        console.error('Error al generar el código QR:', err);
        res.status(500).send('Error al generar el código QR');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor API REST en ejecución en http://localhost:${port}`);
});