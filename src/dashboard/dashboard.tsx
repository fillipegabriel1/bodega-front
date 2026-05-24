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
  Tooltip,
  LabelList
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   TYPES
========================= */

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
    nome?: string;
    codigo?: number;
  };

  produto?: string;

  categoria?: string;

  valor: number;

}

interface ClienteCreditoData {

  codigo: number;

  nome: string;

  saldo: number;

}

interface RankingClienteData {

  nome: string;

  codigo: number;

  totalGasto: number;

  totalCompras: number;

}

interface DashboardData {

  totalRecarga: number;

  totalDebito: number;

  saldoBodega: number;

  clientes: number;

  transacoes: number;

  ticketMedio: number;

  clientesComSaldo: number;

  vendasPorCategoria?: CategoriaData[];

  produtosMaisVendidos?: ProdutoData[];

  produtosMaisLucrativos?: ProdutoData[];

  ultimasTransacoes?: TransacaoData[];

  clientesComCredito?: ClienteCreditoData[];

  rankingClientes?: RankingClienteData[];

}

/* =========================
   COMPONENT
========================= */

const Dashboard = () => {

  const navigate = useNavigate();

  const token = Cookies.get("token");

  const [dados, setDados] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

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
    valor: number = 0
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

      setLoading(true);

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

        setDados({

          totalRecarga:
            data.totalRecarga || 0,

          totalDebito:
            data.totalDebito || 0,

          saldoBodega:
            data.saldoBodega || 0,

          clientes:
            data.clientes || 0,

          transacoes:
            data.transacoes || 0,

          ticketMedio:
            data.ticketMedio || 0,

          clientesComSaldo:
            data.clientesComSaldo || 0,

          vendasPorCategoria:
            data.vendasPorCategoria || [],

          produtosMaisVendidos:
            data.produtosMaisVendidos || [],

          produtosMaisLucrativos:
            data.produtosMaisLucrativos || [],

          ultimasTransacoes:
            data.ultimasTransacoes || [],

          clientesComCredito:
            data.clientesComCredito || [],

          rankingClientes:
            (data.rankingClientes || [])
              .filter(
                (cliente: RankingClienteData) =>
                  cliente.nome !==
                  "Felipe Gabriel"
              )

        });

      }

    } catch (error) {

      console.log(
        "Erro ao carregar dashboard",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    buscarDashboard();

  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >

        <p>
          Carregando dashboard...
        </p>

      </div>

    );

  }

  return (

    <div className="dashboard-page">

      {/* =========================
          NAVBAR
      ========================= */}

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

      {/* =========================
          CONTENT
      ========================= */}

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
              Controle financeiro e operacional
              em tempo real
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
                  dados?.totalRecarga
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
                  dados?.totalDebito
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
                  dados?.saldoBodega
                )
              }
            </p>

          </div>

          <div className="card">

            <h3>
              Clientes Cadastrados
            </h3>

            <p className="valor">
              {dados?.clientes || 0}
            </p>

          </div>

          <div className="card">

            <h3>
              Clientes com Saldo
            </h3>

            <p className="valor laranja">
              {
                dados?.clientesComSaldo || 0
              }
            </p>

          </div>

          <div className="card">

            <h3>
              Total de Transações
            </h3>

            <p className="valor">
              {dados?.transacoes || 0}
            </p>

          </div>

          <div className="card">

            <h3>
              Ticket Médio
            </h3>

            <p className="valor roxo">
              {
                formatarMoeda(
                  dados?.ticketMedio
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
                  dados?.vendasPorCategoria || []
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
                >

                  <LabelList
                    dataKey="totalVendido"
                    position="top"
                    formatter={(value) =>
                      `R$ ${value}`
                    }
                  />

                </Bar>

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
                ?.produtosMaisVendidos
                ?.map((produto) => (

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
            MAIS LUCRATIVOS
        ========================= */}

        <div className="dashboard-section">

          <h3>
            Produtos Mais Lucrativos
          </h3>

          <div className="cards">

            {dados
              ?.produtosMaisLucrativos
              ?.map((produto) => (

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
            RANKING CLIENTES
        ========================= */}

        <div className="dashboard-section">

          <h3>
            🏆 Clientes que Mais Compraram
          </h3>

          <div className="dashboard-table">

            <table>

              <thead>

                <tr>

                  <th>Posição</th>

                  <th>Nome</th>

                  <th>Código</th>

                  <th>Total Compras</th>

                  <th>Total Gasto</th>

                </tr>

              </thead>

              <tbody>

                {dados
                  ?.rankingClientes
                  ?.map((cliente, index) => (

                    <tr key={index}>

                      <td>
                        #{index + 1}
                      </td>

                      <td>
                        {cliente.nome}
                      </td>

                      <td>
                        {cliente.codigo}
                      </td>

                      <td>
                        {cliente.totalCompras}
                      </td>

                      <td>

                        {
                          formatarMoeda(
                            cliente.totalGasto
                          )
                        }

                      </td>

                    </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* =========================
            CLIENTES COM SALDO
        ========================= */}

        <div className="dashboard-section">

          <h3>
            Clientes com Saldo Disponível
          </h3>

          <div className="dashboard-table">

            <table>

              <thead>

                <tr>

                  <th>Código</th>

                  <th>Nome</th>

                  <th>Saldo</th>

                </tr>

              </thead>

              <tbody>

                {dados
                  ?.clientesComCredito
                  ?.map((cliente, index) => (

                    <tr key={index}>

                      <td>
                        {cliente.codigo}
                      </td>

                      <td>
                        {cliente.nome}
                      </td>

                      <td>

                        {
                          formatarMoeda(
                            cliente.saldo
                          )
                        }

                      </td>

                    </tr>

                ))}

              </tbody>

            </table>

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
                  ?.ultimasTransacoes
                  ?.map((item, index) => (

                    <tr key={index}>

                      <td>
                        {
                          item?.clienteId?.nome
                          || "-"
                        }
                      </td>

                      <td>
                        {
                          item?.produto
                          || "-"
                        }
                      </td>

                      <td>
                        {
                          item?.categoria
                          || "-"
                        }
                      </td>

                      <td>

                        {
                          formatarMoeda(
                            item?.valor
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