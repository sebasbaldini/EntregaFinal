import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "src/public/images");

    // Asegurarse de que la carpeta de destino exista
    fs.exists(uploadPath, (exists) => {
      if (!exists) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath); // Establecer la carpeta de destino
    });
  },
  filename: function (req, file, cb) {
    // Usar un nombre único para evitar sobrescribir archivos
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname); // Generar un nombre único con extensión
  },
});

// Filtro para aceptar solo imágenes (por ejemplo, jpg, png, gif)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Tipos de archivo permitidos
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Aceptar archivo
  } else {
    cb(new Error("Solo se permiten imágenes (JPG, PNG, GIF)"), false); // Rechazar archivo
  }
};

// Crear la instancia de multer con las configuraciones
export const uploader = multer({
  storage: storage, // Configuración de almacenamiento
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño a 5MB
  fileFilter: fileFilter, // Filtro de archivos
});
