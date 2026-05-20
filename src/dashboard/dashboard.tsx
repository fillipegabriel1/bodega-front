import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface DashboardData {
  totalRecarga: number;
  totalDebito: number;
  saldoBodega: number;
  clientes: number;
  transacoes: number;
  ticketMedio: number;
}

const Dashboard = () => {

  const navigate = useNavigate();
  const token = Cookies.get("token");

  const [dados, setDados] = useState<DashboardData | null>(null);

  const handleLogout = () => {

    Cookies.remove("token");
    navigate("/login");

  };

  const formatarMoeda = (valor: number) => {

    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

  };

  const buscarDashboard = async () => {

    try {

      const response = await fetch(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setDados(data);
      }

    } catch (error) {

      console.log("Erro ao carregar dashboard");

    }

  };

  useEffect(() => {

    buscarDashboard();

  }, []);

  if (!dados) {

    return (
      <p style={{ padding: 40 }}>
        Carregando dashboard...
      </p>
    );

  }

  return (

    <div className="dashboard-page">

      <nav id="home-bar">

        <div id="brand">
          BODEGA EAC
        </div>

        <div id="options">

          <button onClick={() => navigate("/home")}>
            Home
          </button>

          <button onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button onClick={handleLogout}>
            Sair
          </button>

        </div>

      </nav>

      <div className="dashboard-content">

        <div className="dashboard-header">

          <div>

            <h2>Dashboard da Bodega</h2>

            <p className="subtitulo">
              Controle financeiro e operacional em tempo real
            </p>

          </div>

        </div>

        <div className="cards">

          <div className="card">

            <h3>Total de Créditos</h3>

            <p className="valor verde">
              {formatarMoeda(dados.totalRecarga)}
            </p>

          </div>

          <div className="card">

            <h3>Total de Vendas</h3>

            <p className="valor vermelho">
              {formatarMoeda(dados.totalDebito)}
            </p>

          </div>

          <div className="card">

            <h3>Saldo Disponível</h3>

            <p className="valor azul">
              {formatarMoeda(dados.saldoBodega)}
            </p>

          </div>

          <div className="card">

            <h3>Clientes Cadastrados</h3>

            <p className="valor">
              {dados.clientes}
            </p>

          </div>

          <div className="card">

            <h3>Total de Transações</h3>

            <p className="valor">
              {dados.transacoes}
            </p>

          </div>

          <div className="card">

            <h3>Ticket Médio</h3>

            <p className="valor roxo">
              {formatarMoeda(dados.ticketMedio)}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;