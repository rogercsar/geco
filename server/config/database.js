const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI não configurado. Pulando conexão com MongoDB.');
    return;
  }
  try {
    const conn = await mongoose.connect(uri, {
      // As opções abaixo são deprecadas no driver v4+, mantidas por compatibilidade
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar no MongoDB: ${error.message}`);
    // Não derrubar o servidor se não houver Mongo disponível
  }
};

module.exports = connectDB;
