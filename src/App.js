import React, { useState } from "react";

const barbeiros = ["Daniel", "Micael"];

const servicos = [
  { nome: "Cabelo", duracao: 30 },
  { nome: "Barba", duracao: 30 },
  { nome: "Cabelo e Barba", duracao: 60 },
  { nome: "Pezinho + Barba", duracao: 30 },
  { nome: "Sobrancelha", duracao: 10 },
  { nome: "Depilação Nariz/Orelha", duracao: 20 },
  { nome: "Platinado", duracao: 180 },
  { nome: "Manutenção Prótese", duracao: 180 },
  { nome: "Colocação Prótese", duracao: 180 },
];

const horarios = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00","19:30","20:00"
];

export default function App() {
  const [agendamentos, setAgendamentos] = useState([]);

  const [form, setForm] = useState({
    cliente: "",
    telefone: "",
    barbeiro: "Daniel",
    data: "",
    horario: "",
    servicosSelecionados: []
  });

  const calcularDuracao = () =>
    form.servicosSelecionados.reduce((t, s) => t + s.duracao, 0);

  const gerarHorarios = (inicio, duracao) => {
    const index = horarios.indexOf(inicio);
    const blocos = Math.ceil(duracao / 30);
    return horarios.slice(index, index + blocos);
  };

  const disponivel = () => {
    const blocos = gerarHorarios(form.horario, calcularDuracao());

    return !agendamentos.some(a =>
      a.barbeiro === form.barbeiro &&
      a.data === form.data &&
      a.horarios.some(h => blocos.includes(h))
    );
  };

  const toggleServico = (s) => {
    const existe = form.servicosSelecionados.find(x => x.nome === s.nome);
    if (existe) {
      setForm({
        ...form,
        servicosSelecionados: form.servicosSelecionados.filter(x => x.nome !== s.nome)
      });
    } else {
      setForm({
        ...form,
        servicosSelecionados: [...form.servicosSelecionados, s]
      });
    }
  };

  const agendar = () => {
    if (!disponivel()) return alert("Horário ocupado");

    const duracao = calcularDuracao();
    const horariosOcupados = gerarHorarios(form.horario, duracao);

    const novo = { ...form, horarios: horariosOcupados };
    setAgendamentos([...agendamentos, novo]);

    const msg = `Olá, sou ${form.cliente}. Agendei ${form.servicosSelecionados.map(s=>s.nome).join(", ")} com ${form.barbeiro} dia ${form.data} às ${form.horario}`;

    window.open(`https://wa.me/5553984218613?text=${encodeURIComponent(msg)}`);
  };

  const cancelar = (index) => {
    const novos = agendamentos.filter((_, i) => i !== index);
    setAgendamentos(novos);
  };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0b0b0b", color: "white", minHeight: "100vh", padding: 20 }}>

      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "gold" }}>Barbearia Fígaro</h1>
        <p>Agende seu horário com estilo</p>
      </div>

      <div style={{ background: "#111", padding: 20, borderRadius: 10, maxWidth: 500, margin: "auto" }}>

        <input placeholder="Seu nome" onChange={e => setForm({ ...form, cliente: e.target.value })} />
        <input placeholder="Telefone" onChange={e => setForm({ ...form, telefone: e.target.value })} />

        <select onChange={e => setForm({ ...form, barbeiro: e.target.value })}>
          {barbeiros.map(b => <option key={b}>{b}</option>)}
        </select>

        <input type="date" onChange={e => setForm({ ...form, data: e.target.value })} />

        <select onChange={e => setForm({ ...form, horario: e.target.value })}>
          <option>Horário</option>
          {horarios.map(h => <option key={h}>{h}</option>)}
        </select>

        <h3>Serviços</h3>
        {servicos.map(s => (
          <label key={s.nome} style={{ display: "block" }}>
            <input type="checkbox" onChange={() => toggleServico(s)} /> {s.nome}
          </label>
        ))}

        <button onClick={agendar} style={{ marginTop: 10, background: "gold", color: "black", padding: 10, border: "none", borderRadius: 5 }}>
          FINALIZAR AGENDAMENTO
        </button>
      </div>

      <h2 style={{ textAlign: "center", marginTop: 30 }}>Agendamentos</h2>

      {agendamentos.map((a, i) => (
        <div key={i} style={{ background: "#111", margin: 10, padding: 10, borderRadius: 10 }}>
          <b>{a.cliente}</b>
          <p>{a.barbeiro} - {a.data}</p>
          <p>{a.horarios.join(", ")}</p>
          <p>{a.servicosSelecionados.map(s => s.nome).join(", ")}</p>

          <button onClick={() => cancelar(i)} style={{ background: "red", color: "white", border: "none", padding: 5 }}>
            Cancelar
          </button>
        </div>
      ))}

    </div>
  );
  }
