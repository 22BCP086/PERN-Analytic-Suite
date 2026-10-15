import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading Suite...</div>;

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const avgProfit = (data.reduce((sum, item) => sum + item.profit, 0) / data.length).toFixed(0);
  const totalCustomers = data.reduce((sum, item) => sum + item.customers, 0);

  const downloadReport = () => window.print();

  // Reusable XAxis component with angled labels for PDF fix
  const CustomXAxis = ({ dataKey }) => (
    <XAxis 
      dataKey={dataKey} 
      tick={{ fill: '#94a3b8', fontSize: 11 }} 
      angle={-45} 
      textAnchor="end" 
      interval={0} 
      height={50} 
      axisLine={false} 
      tickLine={false} 
    />
  );

  return (
    <div className="dashboard-container">
      <div className="header-row">
        <h1 className="dashboard-title">PERN Analytics Suite</h1>
        <button onClick={downloadReport} className="export-btn">Export PDF Report</button>
      </div>

      <div className="kpi-row">
        <div className="kpi-card"><span>Total Revenue</span><h2>₹{totalRevenue.toLocaleString()}</h2></div>
        <div className="kpi-card"><span>Avg Profit</span><h2>₹{avgProfit.toLocaleString()}</h2></div>
        <div className="kpi-card"><span>Total Customers</span><h2>{totalCustomers}</h2></div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-card">
          <h3>Revenue vs Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <CustomXAxis dataKey="month" />
              <YAxis tick={{fill: '#94a3b8'}} axisLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Operational Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <CustomXAxis dataKey="month" />
              <YAxis tick={{fill: '#94a3b8'}} axisLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Growth Momentum (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CustomXAxis dataKey="month" />
              <YAxis tick={{fill: '#94a3b8'}} axisLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
              <Area type="monotone" dataKey="growth_rate" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Quarterly Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.slice(9, 12).map(d => ({ name: d.month, value: d.customers }))}
                cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
              >
                <Cell fill="#6366f1" /><Cell fill="#10b981" /><Cell fill="#f59e0b" />
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <h3>Annual Performance Log</h3>
        <table>
          <thead><tr><th>Month</th><th>Revenue</th><th>Profit</th><th>Growth</th></tr></thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}><td>{row.month}</td><td>₹{row.revenue}</td><td>₹{row.profit}</td><td>{row.growth_rate}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;