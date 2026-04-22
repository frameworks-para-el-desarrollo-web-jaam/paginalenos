export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.issues) {
      return res.status(400).json({
        message: error.issues.map((err) => err.message),
      });
    }

    // fallback por si no es error de Zod
    return res.status(400).json({
      message: ["Error de validación"],
    });
  }
};