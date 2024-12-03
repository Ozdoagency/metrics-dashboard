import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Percent, Target, Globe } from 'lucide-react';

const rawData = [
  { date: '07.10', actual: 4240.85, leads: 12, leadCost: 353.40, cr: 100, trialCost: 353.40 },
  { date: '08.10', actual: 4188.93, leads: 11, leadCost: 380.81, cr: 100, trialCost: 380.81 },
  { date: '09.10', actual: 4005.29, leads: 8, leadCost: 500.66, cr: 88, trialCost: 572.18 },
  { date: '10.10', actual: 5731.62, leads: 21, leadCost: 272.93, cr: 86, trialCost: 318.42 },
  { date: '11.10', actual: 3867.01, leads: 16, leadCost: 241.69, cr: 106, trialCost: 227.47 },
  { date: '12.10', actual: 3816.92, leads: 22, leadCost: 173.50, cr: 100, trialCost: 173.50 },
  { date: '13.10', actual: 4313.49, leads: 16, leadCost: 269.59, cr: 100, trialCost: 269.59 }
];

const translations = {
  en: {
    title: 'Metrics Dashboard',
    average: 'Average',
    metrics: {
      leads: 'Tech Leads',
      leadCost: 'Lead Cost',
      cr: 'CR %',
      actual: 'Budget',
      trialCost: 'Trial Cost'
    },
    min: 'min',
    max: 'max',
    madeIn: 'Made in'
  },
  uk: {
    title: 'Панель метрик',
    average: 'Середнє',
    metrics: {
      leads: 'Тех ліди',
      leadCost: 'Вартість ліда',
      cr: 'CR %',
      actual: 'Бюджет',
      trialCost: 'Вартість пробного'
    },
    min: 'мін',
    max: 'макс',
    madeIn: 'Зроблено в'
  },
  ru: {
    title: 'Панель метрик',
    average: 'Среднее',
    metrics: {
      leads: 'Тех лиды',
      leadCost: 'Стоимость лида',
      cr: 'CR %',
      actual: 'Бюджет',
      trialCost: 'Цена пробного'
    },
    min: 'мин',
    max: 'макс',
    madeIn: 'Сделано в'
  }
};

const SparkLine = ({ data, dataKey, color, height = 30 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data}>
      <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

export default function MetricsDashboard() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [activeMetric, setActiveMetric] = useState('leads');
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(rawData.length - 1);
  const [showAverage, setShowAverage] = useState(true);
  const [lang, setLang] = useState('ru');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobile = width < 768;
  const t = translations[lang];
  const filteredData = useMemo(() => rawData.slice(startIdx, endIdx + 1), [startIdx, endIdx]);

  const metrics = {
    leads: { 
      name: t.metrics.leads,
      color: '#2563eb', 
      icon: Users,
      format: val => Math.round(val)
    },
    leadCost: { 
      name: t.metrics.leadCost,
      color: '#1d4ed8', 
      icon: DollarSign,
      format: val => `₴${val.toFixed(2)}`
    },
    cr: { 
      name: t.metrics.cr,
      color: '#1e40af', 
      icon: Percent,
      format: val => `${val}%`
    },
    actual: { 
      name: t.metrics.actual,
      color: '#1e3a8a', 
      icon: DollarSign,
      format: val => `₴${val.toFixed(2)}`
    },
    trialCost: { 
      name: t.metrics.trialCost,
      color: '#172554', 
      icon: Target,
      format: val => `₴${val.toFixed(2)}`
    }
  };

  const getAverageValue = (data, key) => {
    return data.length > 0 ? data.reduce((sum, item) => sum + item[key], 0) / data.length : 0;
  };

  return (
    <div className="w-full space-y-4 bg-gradient-to-br from-blue-50 to-white p-2 sm:p-6 rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className={`font-bold text-blue-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{t.title}</h1>
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
          <Globe className="w-4 h-4 text-blue-600" />
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent border-none text-sm focus:outline-none text-blue-600"
          >
            <option value="en">EN</option>
            <option value="uk">UK</option>
            <option value="ru">RU</option>
          </select>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur shadow-lg rounded-lg">
        <div className="pb-2 border-b p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between'} gap-4`}>
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
              <select 
                className="p-2 border rounded bg-white"
                value={startIdx}
                onChange={e => setStartIdx(Number(e.target.value))}
              >
                {rawData.map((_, idx) => (
                  <option key={idx} value={idx}>{rawData[idx].date}</option>
                ))}
              </select>
              <select 
                className="p-2 border rounded bg-white"
                value={endIdx}
                onChange={e => setEndIdx(Number(e.target.value))}
              >
                {rawData.map((_, idx) => (
                  <option key={idx} value={idx}>{rawData[idx].date}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">{t.average}:</label>
              <input
                type="checkbox"
                checked={showAverage}
                onChange={(e) => setShowAverage(e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          </div>
        </div>
        <div className={isMobile ? 'p-2' : 'p-6'}>
          <div className="space-y-6">
            <div className={`bg-blue-50 p-1 rounded-lg flex flex-wrap gap-1 ${isMobile ? 'justify-between' : ''}`}>
              {Object.entries(metrics).map(([key, { name, icon: Icon }]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md
                    ${isMobile ? 'flex-1 min-w-[45%] justify-center' : ''}
                    ${activeMetric === key ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'}
                  `}
                >
                  <Icon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                  <span className={isMobile ? 'text-xs' : 'text-sm'}>{name}</span>
                </button>
              ))}
            </div>
            
            <div className={isMobile ? 'h-64' : 'h-96'}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <XAxis dataKey="date" stroke="#1e40af" fontSize={isMobile ? 10 : 12} />
                  <YAxis stroke="#1e40af" width={40} fontSize={isMobile ? 10 : 12} />
                  <Tooltip />
                  {!isMobile && <Legend />}
                  {showAverage && (
                    <ReferenceLine 
                      y={getAverageValue(filteredData, activeMetric)} 
                      stroke="#94a3b8" 
                      strokeDasharray="3 3"
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={metrics[activeMetric].color}
                    strokeWidth={isMobile ? 1.5 : 2}
                    dot={{ r: isMobile ? 3 : 4 }}
                    activeDot={{ r: isMobile ? 5 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-5'} gap-4`}>
        {Object.entries(metrics).map(([key, { name, color, icon: Icon, format }]) => {
          const latestValue = filteredData[filteredData.length - 1]?.[key] ?? 0;
          const previousValue = filteredData[filteredData.length - 2]?.[key] ?? latestValue;
          const change = latestValue && previousValue ? ((latestValue - previousValue) / previousValue * 100).toFixed(1) : 0;
          const isPositive = change > 0;
          
          return (
            <div key={key} className="bg-white/80 backdrop-blur hover:scale-105 transition-transform rounded-lg">
              <div className={isMobile ? 'p-3' : 'p-6'}>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                    <Icon className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} style={{ color }} />
                  </div>
                  {isPositive ? 
                    <ArrowUpRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-green-600`} /> :
                    <ArrowDownRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-red-600`} />
                  }
                </div>
                <div className="mt-4">
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>{name}</div>
                  <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mt-1`} style={{ color }}>
                    {format(latestValue)}
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                  </div>
                  <div className="h-8 mt-2">
                    <SparkLine 
                      data={filteredData.slice(-7)} 
                      dataKey={key} 
                      color={color} 
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        {t.madeIn} <span className="font-semibold text-blue-600">OZDO AI</span>
      </div>
    </div>
  );
}
