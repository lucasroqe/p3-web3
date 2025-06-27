import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import Reserva from './models/reserva'

const app = express()
app.use(bodyParser.json())

const PORT = 3000
const MONGO_URI = 'mongodb://127.0.0.1:27017/reserva'

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado ao banco de dados'))
  .catch((error) => console.log('Erro ao conectar ao banco de dados', error))

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`)
})

app.post('/reservas', async (req, res) => {
  const { nomeCliente, numeroMesa, dataHoraReserva, status, contatoCliente } = req.body
  try {
    const novaReserva = new Reserva({ nomeCliente, numeroMesa, dataHoraReserva, status, contatoCliente })
    await novaReserva.save()
    res.status(201).json({ message: 'Reserva criada com sucesso', reserva: novaReserva })
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar reserva', error })
  }
})

app.get('/reservas', async (req: express.Request, res: express.Response) => {
  const nomeCliente = req.query.nomeCliente as string;

  try {
    let query = {};

    if (nomeCliente) {
      query = { nomeCliente: { $regex: nomeCliente, $options: 'i' } };
    }

    const reservas = await Reserva.find(query);
    res.status(200).json(reservas);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar reservas', error });
  }
});

app.put('/reservas/:id', async (req, res) => {
  const { id } = req.params
  const { nomeCliente, numeroMesa, dataHoraReserva, status, contatoCliente } = req.body

  try {
    const reservaAtualizada = await Reserva.findByIdAndUpdate(
      id,
      { nomeCliente, numeroMesa, dataHoraReserva, status, contatoCliente },
      { new: true }
    )
    res.json(reservaAtualizada)
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar reserva', error })
  }
})

app.delete('/reservas/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Reserva.findByIdAndDelete(id)
    res.status(204).send()
    console.log('Reserva deletada')
  } catch (error) {
    res.status(400).json({ message: 'Erro ao deletar reserva', error })
  }
})

app.use(express.static('public'))
