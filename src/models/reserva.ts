import mongoose from 'mongoose';

const ReservaSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  numeroMesa: { type: Number, required: true },
  dataHoraReserva: { type: Date, required: true },
  status: {
    type: String,
    enum: ['reservado', 'ocupado', 'disponível'],
    default: 'reservado'
  },
  contatoCliente: { type: String, required: true }
});


const Reserva = mongoose.model('Reserva', ReservaSchema);
export default Reserva;
