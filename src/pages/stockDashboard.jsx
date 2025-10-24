import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieIcon, BarChart3, RefreshCw, Search, Plus, Minus } from 'lucide-react';

const StockDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [portfolioBalance, setPortfolioBalance] = useState(50000);
    const [cashBalance, setCashBalance] = useState(50000);
    const [selectedStock, setSelectedStock] = useState(null);
    const [tradeAmount, setTradeAmount] = useState(1);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Simulated stock data
    const [stocks, setStocks] = useState([
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 178.50,
            change: 2.35,
            changePercent: 1.33,
            volume: '52.3M',
            marketCap: '2.8T',
            owned: 0
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            price: 141.20,
            change: -1.80,
            changePercent: -1.26,
            volume: '28.5M',
            marketCap: '1.8T',
            owned: 0
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corp.',
            price: 412.30,
            change: 5.20,
            changePercent: 1.28,
            volume: '21.7M',
            marketCap: '3.1T',
            owned: 0
        },
        {
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            price: 242.80,
            change: -3.45,
            changePercent: -1.40,
            volume: '98.2M',
            marketCap: '772B',
            owned: 0
        },
        {
            symbol: 'AMZN',
            name: 'Amazon.com Inc.',
            price: 178.90,
            change: 1.20,
            changePercent: 0.67,
            volume: '45.6M',
            marketCap: '1.9T',
            owned: 0
        }
    ]);

    const [portfolio, setPortfolio] = useState([]);
    const [transactions, setTransactions] = useState([]);

    // Historical chart data
    const [chartData] = useState([
        { time: '9:30', value: 49500 },
        { time: '10:00', value: 49800 },
        { time: '10:30', value: 49600 },
        { time: '11:00', value: 50200 },
        { time: '11:30', value: 50400 },
        { time: '12:00', value: 50100 },
        { time: '12:30', value: 50600 },
        { time: '1:00', value: 50800 },
        { time: '1:30', value: 50500 },
        { time: '2:00', value: 51200 },
        { time: '2:30', value: 51500 },
        { time: '3:00', value: 51800 }
    ]);

    // Simulate real-time price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setStocks(prevStocks =>
                prevStocks.map(stock => {
                    const fluctuation = (Math.random() - 0.5) * 2;
                    const newPrice = Number((stock.price + fluctuation).toFixed(2));
                    const newChange = Number((newPrice - (stock.price - stock.change)).toFixed(2));
                    const newChangePercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));

                    return {
                        ...stock,
                        price: newPrice,
                        change: newChange,
                        changePercent: newChangePercent
                    };
                })
            );
            setLastUpdate(new Date());
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Update portfolio balance
    useEffect(() => {
        const portfolioValue = portfolio.reduce((sum, item) => {
            const stock = stocks.find(s => s.symbol === item.symbol);
            return sum + (stock ? stock.price * item.shares : 0);
        }, 0);
        setPortfolioBalance(cashBalance + portfolioValue);
    }, [stocks, portfolio, cashBalance]);

    const handleBuy = (stock) => {
        const totalCost = stock.price * tradeAmount;
        if (cashBalance >= totalCost) {
            setCashBalance(prev => prev - totalCost);

            const existingPosition = portfolio.find(p => p.symbol === stock.symbol);
            if (existingPosition) {
                setPortfolio(prev => prev.map(p =>
                    p.symbol === stock.symbol
                        ? { ...p, shares: p.shares + tradeAmount, avgPrice: ((p.avgPrice * p.shares) + totalCost) / (p.shares + tradeAmount) }
                        : p
                ));
            } else {
                setPortfolio(prev => [...prev, { symbol: stock.symbol, name: stock.name, shares: tradeAmount, avgPrice: stock.price }]);
            }

            setTransactions(prev => [{
                id: Date.now(),
                type: 'BUY',
                symbol: stock.symbol,
                shares: tradeAmount,
                price: stock.price,
                total: totalCost,
                timestamp: new Date()
            }, ...prev]);

            setSelectedStock(null);
            setTradeAmount(1);
        }
    };

    const handleSell = (stock) => {
        const position = portfolio.find(p => p.symbol === stock.symbol);
        if (position && position.shares >= tradeAmount) {
            const totalRevenue = stock.price * tradeAmount;
            setCashBalance(prev => prev + totalRevenue);

            setPortfolio(prev => prev.map(p =>
                p.symbol === stock.symbol
                    ? { ...p, shares: p.shares - tradeAmount }
                    : p
            ).filter(p => p.shares > 0));

            setTransactions(prev => [{
                id: Date.now(),
                type: 'SELL',
                symbol: stock.symbol,
                shares: tradeAmount,
                price: stock.price,
                total: totalRevenue,
                timestamp: new Date()
            }, ...prev]);

            setSelectedStock(null);
            setTradeAmount(1);
        }
    };

    const filteredStocks = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const portfolioData = portfolio.map(p => {
        const stock = stocks.find(s => s.symbol === p.symbol);
        return {
            name: p.symbol,
            value: stock ? stock.price * p.shares : 0
        };
    });

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const totalGain = portfolioBalance - 50000;
    const totalGainPercent = ((totalGain / 50000) * 100).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">StockPro</h1>
                                <p className="text-xs text-slate-400">Real-time Trading Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Portfolio Value</p>
                                <p className="text-xl font-bold">${portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-2 mt-4">
                        {['dashboard', 'markets', 'portfolio', 'transactions'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${activeTab === tab
                                    ? 'bg-blue-600 text-white border border-white border'
                                    : 'text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Total Value</p>
                                        <p className="text-2xl font-bold mt-1">${portfolioBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-blue-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Cash Balance</p>
                                        <p className="text-2xl font-bold mt-1">${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Total Gain/Loss</p>
                                        <p className={`text-2xl font-bold mt-1 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            ${Math.abs(totalGain).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 ${totalGain >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center`}>
                                        {totalGain >= 0 ? <TrendingUp className="w-6 h-6 text-green-400" /> : <TrendingDown className="w-6 h-6 text-red-400" />}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm">Return</p>
                                        <p className={`text-2xl font-bold mt-1 ${totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent}%
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-6 h-6 text-purple-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                                <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="time" stroke="#64748b" />
                                        <YAxis stroke="#64748b" />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                            labelStyle={{ color: '#e2e8f0' }}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                                <h2 className="text-lg font-semibold mb-4">Portfolio Allocation</h2>
                                {portfolio.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={portfolioData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {portfolioData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                                formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-slate-400">
                                        <div className="text-center">
                                            <PieIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                                            <p>No positions yet</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Market Movers */}
                        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                            <h2 className="text-lg font-semibold mb-4">Market Movers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {stocks.map(stock => (
                                    <div key={stock.symbol} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors cursor-pointer">
                                        <p className="font-semibold">{stock.symbol}</p>
                                        <p className="text-xl font-bold mt-1">${stock.price}</p>
                                        <div className={`flex items-center gap-1 text-sm mt-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                            <span>{stock.change >= 0 ? '+' : ''}{stock.changePercent}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Markets Tab */}
                {activeTab === 'markets' && (
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search stocks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <p className="text-sm text-slate-400">Last update: {lastUpdate.toLocaleTimeString()}</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
                                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                                            <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                                            <th className="text-right py-3 px-4 text-slate-400 font-medium">Change</th>
                                            <th className="text-right py-3 px-4 text-slate-400 font-medium">Volume</th>
                                            <th className="text-right py-3 px-4 text-slate-400 font-medium">Market Cap</th>
                                            <th className="text-right py-3 px-4 text-slate-400 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStocks.map(stock => (
                                            <tr key={stock.symbol} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                                                <td className="py-4 px-4 font-semibold">{stock.symbol}</td>
                                                <td className="py-4 px-4 text-slate-300">{stock.name}</td>
                                                <td className="py-4 px-4 text-right font-semibold">${stock.price.toFixed(2)}</td>
                                                <td className={`py-4 px-4 text-right font-semibold ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                                </td>
                                                <td className="py-4 px-4 text-right text-slate-300">{stock.volume}</td>
                                                <td className="py-4 px-4 text-right text-slate-300">{stock.marketCap}</td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => setSelectedStock(stock)}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Trade
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                            <h2 className="text-lg font-semibold mb-4">Your Holdings</h2>
                            {portfolio.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Shares</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Avg Cost</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Current Price</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Market Value</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Gain/Loss</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {portfolio.map(position => {
                                                const stock = stocks.find(s => s.symbol === position.symbol);
                                                const currentValue = stock ? stock.price * position.shares : 0;
                                                const costBasis = position.avgPrice * position.shares;
                                                const gainLoss = currentValue - costBasis;
                                                const gainLossPercent = ((gainLoss / costBasis) * 100).toFixed(2);

                                                return (
                                                    <tr key={position.symbol} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                                                        <td className="py-4 px-4 font-semibold">{position.symbol}</td>
                                                        <td className="py-4 px-4 text-right">{position.shares}</td>
                                                        <td className="py-4 px-4 text-right">${position.avgPrice.toFixed(2)}</td>
                                                        <td className="py-4 px-4 text-right font-semibold">${stock?.price.toFixed(2)}</td>
                                                        <td className="py-4 px-4 text-right font-semibold">${currentValue.toFixed(2)}</td>
                                                        <td className={`py-4 px-4 text-right font-semibold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            ${Math.abs(gainLoss).toFixed(2)} ({gainLoss >= 0 ? '+' : ''}{gainLossPercent}%)
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button
                                                                onClick={() => setSelectedStock(stock)}
                                                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                Sell
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No holdings yet. Start trading to build your portfolio!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700">
                            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
                            {transactions.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-700">
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                                                <th className="text-left py-3 px-4 text-slate-400 font-medium">Symbol</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Shares</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Price</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Total</th>
                                                <th className="text-right py-3 px-4 text-slate-400 font-medium">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(transaction => (
                                                <tr key={transaction.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${transaction.type === 'BUY'
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : 'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            {transaction.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold">{transaction.symbol}</td>
                                                    <td className="py-4 px-4 text-right">{transaction.shares}</td>
                                                    <td className="py-4 px-4 text-right">${transaction.price.toFixed(2)}</td>
                                                    <td className="py-4 px-4 text-right font-semibold">${transaction.total.toFixed(2)}</td>
                                                    <td className="py-4 px-4 text-right text-slate-400 text-sm">
                                                        {transaction.timestamp.toLocaleTimeString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No transactions yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Trading Modal */}
            {selectedStock && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Trade {selectedStock.symbol}</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-slate-400 text-sm">Current Price</p>
                                <p className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</p>
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm mb-2">Number of Shares</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>)
            }
        </div>)
}

export default StockDashboard;
