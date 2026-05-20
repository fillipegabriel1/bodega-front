import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

interface CategoriaData {
  _id: string;
  totalVendido: number;
  quantidadeItens: number;
}

interface ProdutoData {
  _id: string;
  totalVendido: number;
  quantidadeVendida: number;
}

interface TransacaoData {
  clienteId?: {
    nome: string;
    codigo: number;
  };
  produto?: string;
  categoria?: string;
  valor: number;
}

interface DashboardData {

  totalRecarga: number;

  totalDebito: number;

  saldoBodega: number;

  clientes: number;

  transacoes: number;

  ticketMedio: number;

  clientesComSaldo: number;

  vendasPorCategoria: CategoriaData[];

  produtosMaisVendidos: ProdutoData[];

  produtosMaisLucrativos: ProdutoData[];

  ultimasTransacoes: TransacaoData[];

}

const Dashboard = () => {

  const navigate = useNavigate();

  const token = Cookies.get("token");

  const [dados, setDados] =
    useState<DashboardData | null>(null);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    Cookies.remove("token");

    navigate("/login");

  };

  /* =========================
     FORMATAR MOEDA
  ========================= */

  const formatarMoeda = (
    valor: number
  ) => {

    return valor.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
    );

  };

  /* =========================
     BUSCAR DASHBOARD
  ========================= */

  const buscarDashboard = async () => {

    try {

      const response = await fetch(
        `${API_URL}/api/dashboard`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {

        setDados(data);

      }

    } catch (error) {

      console.log(
        "Erro ao carregar dashboard"
      );

    }

  };

  useEffect(() => {

    buscarDashboard();

  }, []);

  /* =========================
     LOADING
  ========================= */

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

          <button
            onClick={() =>
              navigate("/home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
          >
            Sair
          </button>

        </div>

      </nav>

      <div className="dashboard-content">

        {/* =========================
            HEADER
        ========================= */}

        <div className="dashboard-header">

          <div>

            <h2>
              Dashboard da Bodega
            </h2>

            <p className="subtitulo">
              Controle financeiro e
              operacional em tempo real
            </p>

          </div>

        </div>

        {/* =========================
            CARDS
        ========================= */}

        <div className="cards">

          <div className="card">

            <h3>
              Total de Créditos
            </h3>

            <p className="valor verde">
              {
                formatarMoeda(
                  dados.totalRecarga
                )
              }
            </p>

          </div>

          <div className="card">

            <h3>
              Total de Vendas
            </h3>

            <p className="valor vermelho">
              {
                formatarMoeda(
                  dados.totalDebito
                )
              }
            </p>

          </div>

          <div className="card">

            <h3>
              Saldo Disponível
            </h3>

            <p className="valor azul">
              {
                formatarMoeda(
                  dados.saldoBodega
                )
              }
            </p>

          </div>

          <div className="card">

            <h3>
              Clientes Cadastrados
            </h3>

            <p className="valor">
              {dados.clientes}
            </p>

          </div>

          <div className="card">

            <h3>
              Clientes com Saldo
            </h3>

            <p className="valor laranja">
              {
                dados.clientesComSaldo
              }
            </p>

          </div>

          <div className="card">

            <h3>
              Total de Transações
            </h3>

            <p className="valor">
              {dados.transacoes}
            </p>

          </div>

          <div className="card">

            <h3>
              Ticket Médio
            </h3>

            <p className="valor roxo">
              {
                formatarMoeda(
                  dados.ticketMedio
                )
              }
            </p>

          </div>

        </div>

        {/* =========================
            GRÁFICOS
        ========================= */}

        <div className="dashboard-grid-bottom">

          <div className="chart-card">

            <h3>
              Vendas por Categoria
            </h3>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={
                  dados.vendasPorCategoria
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="_id" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="totalVendido"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* =========================
              TOP PRODUTOS
          ========================= */}

          <div className="chart-card">

            <h3>
              Produtos Mais Vendidos
            </h3>

            <div className="metric-list">

              {dados
                .produtosMaisVendidos
                .map((produto) => (

                  <div
                    className="metric-item"
                    key={produto._id}
                  >

                    <strong>
                      {produto._id}
                    </strong>

                    <span className="metric-value">

                      {
                        produto.quantidadeVendida
                      } vendas

                    </span>

                  </div>

              ))}

            </div>

          </div>

        </div>

        {/* =========================
            PRODUTOS MAIS LUCRATIVOS
        ========================= */}

        <div className="dashboard-section">

          <h3>
            Produtos Mais Lucrativos
          </h3>

          <div className="cards">

            {dados
              .produtosMaisLucrativos
              .map((produto) => (

                <div
                  className="card"
                  key={produto._id}
                >

                  <h3>
                    {produto._id}
                  </h3>

                  <p className="valor verde">

                    {
                      formatarMoeda(
                        produto.totalVendido
                      )
                    }

                  </p>

                </div>

            ))}

          </div>

        </div>

        {/* =========================
            ÚLTIMAS TRANSAÇÕES
        ========================= */}

        <div className="dashboard-section">

          <h3>
            Últimas Transações
          </h3>

          <div className="dashboard-table">

            <table>

              <thead>

                <tr>

                  <th>Cliente</th>

                  <th>Produto</th>

                  <th>Categoria</th>

                  <th>Valor</th>

                </tr>

              </thead>

              <tbody>

                {dados
                  .ultimasTransacoes
                  .map((item, index) => (

                    <tr key={index}>

                      <td>
                        {
                          item?.clienteId?.nome
                          || "-"
                        }
                      </td>

                      <td>
                        {
                          item.produto
                          || "-"
                        }
                      </td>

                      <td>
                        {
                          item.categoria
                          || "-"
                        }
                      </td>

                      <td>

                        {
                          formatarMoeda(
                            item.valor
                          )
                        }

                      </td>

                    </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;