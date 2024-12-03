import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Percent, Target, Globe } from 'lucide-react';

const rawData = [
  { date: '07.10', budget: 143, actual: 4240.85, leads: 12, leadCost: 353.40, cr: 100, qualified: 12, trialCost: 353.40 },
  { date: '08.10', budget: 143, actual: 4188.93, leads: 11, leadCost: 380.81, cr: 100, qualified: 11, trialCost: 380.81 },
  { date: '09.10', budget: 143, actual: 4005.29, leads: 8, leadCost: 500.66, cr: 88, qualified: 7, trialCost: 572.18 },
  { date: '10.10', budget: 143, actual: 5731.62, leads: 21, leadCost: 272.93, cr: 86, qualified: 18, trialCost: 318.42 },
  { date: '11.10', budget: 143, actual: 3867.01, leads: 16, leadCost: 241.69, cr: 106, qualified: 17, trialCost: 227.47 },
  { date: '12.10', budget: 143, actual: 3816.92, leads: 22, leadCost: 173.50, cr: 100, qualified: 22, trialCost: 173.50 },
  { date: '13.10', budget: 143, actual: 4313.49, leads: 16, leadCost: 269.59, cr: 100, qualified: 16, trialCost: 269.59 }
];

const translations = {
  en: {
    title: 'Metrics Dashboard',
    from: 'From',
    to: 'To',
    metrics: {
      leads: 'Tech Leads',
      leadCost: 'Lead Cost',
      cr: 'CR %',
      actual: 'Budget Spent',
      trialCost: 'Trial Cost'
    },
    madeIn: 'Made in'
  },
  uk: {
    title: 'Панель метрик',
    from: 'Від',
    to: 'До',
    metrics: {
      leads: 'Тех ліди',
      leadCost: 'Вартість ліда',
      cr: 'CR %',
      actual: 'Витрачений бюджет',
      trialCost: 'Вартість пробного'
    },
    madeIn: 'Зроблено в'
  },
  ru: {
    title: 'Панель метрик',
    from: 'От',
    to: 'До',
    metrics: {
      leads: 'Тех лиды',
      leadCost: 'Стоимость лида',
      cr: 'CR %',
      actual: 'Потраченный бюджет',
      trialCost: 'Цена пробного'
    },
    madeIn: 'Сделано в'
  }
};

type Lang = 'en' | 'uk' | 'ru';

interface SparkLineProps {
  data: any[];
  dataKey: string;
  color: string;
  height?: number;
}

const SparkLine = ({ data, dataKey, color, height = 30 }: SparkLineProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data}>
      <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metrics: { [key: string]: { color: string; format: (value: any) => string } };
}

const CustomTooltip = ({ active, payload, label, metrics }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0];
  const metricInfo = metrics[data.dataKey];
  const value = data.value;
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
      <div className="font-medium text-gray-600">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        <div className="font-bold" style={{ color: metricInfo.color }}>
          {metricInfo.format(value)}
        </div>
      </div>
    </div>
  );
};

export default function MetricsDashboard() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const viewMode = width < 768 ? 'mobile' : 'desktop';
  
  const [activeMetric, setActiveMetric] = useState('leads');
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(rawData.length - 1);
  const [lang, setLang] = useState<Lang>('en');
  const [showAverage, setShowAverage] = useState(false);

  const t = translations[lang];

  const filteredData = useMemo(() => rawData.slice(startIdx, endIdx + 1), [startIdx, endIdx]);

  const metrics = {
    leads: { name: t.metrics.leads, color: '#2563eb', icon: Users, format: (value) => value },
    leadCost: { name: t.metrics.leadCost, color: '#16a34a', icon: DollarSign, format: (value) => `$${value.toFixed(2)}` },
    cr: { name: t.metrics.cr, color: '#dc2626', icon: Percent, format: (value) => `${value}%` },
    actual: { name: t.metrics.actual, color: '#9333ea', icon: DollarSign, format: (value) => `$${value.toFixed(2)}` },
    trialCost: { name: t.metrics.trialCost, color: '#f59e0b', icon: Target, format: (value) => `$${value.toFixed(2)}` }
  };

  const styles = {
    datePickerContainer: viewMode === 'desktop' 
      ? "flex flex-row items-center gap-4" 
      : "flex flex-col gap-2 w-full",
    dateSelect: viewMode === 'desktop'
      ? "w-32"
      : "w-full",
    metricsGrid: viewMode === 'desktop'
      ? "grid-cols-5"
      : "grid-cols-1",
    chartHeight: viewMode === 'desktop' ? "h-96" : "h-64",
    fontSize: viewMode === 'desktop' ? "text-sm" : "text-xs",
    iconSize: viewMode === 'desktop' ? "w-5 h-5" : "w-4 h-4",
  };

  const getAverageValue = (data, key) => {
    return data.length > 0 ? data.reduce((sum, item) => sum + item[key], 0) / data.length : 0;
  };

  const getMinMaxValues = (data, key) => {
    if (!data || data.length === 0) return { min: 0, max: 0 };
    const values = data.map(item => item[key]);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  return (
    <div className="w-full space-y-4 bg-gradient-to-br from-blue-50 to-white p-2 sm:p-6 rounded-xl">
      <div className="flex justify-end">
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
          <Globe className="w-4 h-4 text-blue-600" />
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="bg-transparent border-none text-sm focus:outline-none text-blue-600"
          >
            <option value="en">EN</option>
            <option value="uk">UK</option>
            <option value="ru">RU</option>
          </select>
        </div>
      </div>

      <Card className="bg-white/80 backdrop-blur shadow-lg">
        <CardHeader className="flex flex-col space-y-4 pb-2 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className={`font-bold text-blue-900 ${viewMode === 'desktop' ? 'text-2xl' : 'text-xl'}`}>
              {t.title}
            </CardTitle>
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
          <div className={`bg-blue-50 p-2 rounded-lg ${styles.datePickerContainer}`}>
            <div className={`flex items-center gap-2 ${styles.dateSelect}`}>
              <label className={`font-medium text-blue-900 ${styles.fontSize}`}>{t.from}:</label>
              <select 
                className={`p-2 border rounded bg-white text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1`}
                value={startIdx}
                onChange={(e) => {
                  const newStart = parseInt(e.target.value);
                  setStartIdx(newStart);
                  if (newStart > endIdx) setEndIdx(newStart);
                }}
              >
                {rawData.map((item, idx) => (
                  <option key={idx} value={idx}>{item.date}</option>
                ))}
              </select>
            </div>
            <div className={`flex items-center gap-2 ${styles.dateSelect}`}>
              <label className={`font-medium text-blue-900 ${styles.fontSize}`}>{t.to}:</label>
              <select 
                className={`p-2 border rounded bg-white text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1`}
                value={endIdx}
                onChange={(e) => {
                  const newEnd = parseInt(e.target.value);
                  setEndIdx(newEnd);
                  if (newEnd < startIdx) setStartIdx(newEnd);
                }}
              >
                {rawData.map((item, idx) => (
                  <option key={idx} value={idx}>{item.date}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-1 rounded-lg flex flex-nowrap gap-1 overflow-x-auto">
              {Object.entries(metrics).map(([key, { name, icon: Icon }]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md min-w-fit whitespace-nowrap
                    ${activeMetric === key ? 'bg-blue-600 text-white' : 'text-blue-600'}
                  `}
                >
                  <Icon className={styles.iconSize} />
                  <span className={styles.fontSize}>{name}</span>
                </button>
              ))}
            </div>
            
            <div className={styles.chartHeight}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="date" stroke="#1e40af" fontSize={viewMode === 'desktop' ? 12 : 10} />
                  <YAxis stroke="#1e40af" fontSize={viewMode === 'desktop' ? 12 : 10} width={40} />
                  <Tooltip 
                    content={(props) => <CustomTooltip {...props} metrics={metrics} />}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: viewMode === 'desktop' ? '12px' : '10px'
                    }}
                  />
                  <Legend />
                  {showAverage && (
                    <ReferenceLine 
                      y={getAverageValue(filteredData, activeMetric)} 
                      stroke="#94a3b8" 
                      strokeDasharray="3 3"
                      label={{ value: t.average, position: 'right' }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={metrics[activeMetric].color}
                    strokeWidth={viewMode === 'desktop' ? 3 : 2}
                    dot={{ r: viewMode === 'desktop' ? 6 : 4, strokeWidth: 2 }}
                    activeDot={{ r: viewMode === 'desktop' ? 8 : 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={`grid ${styles.metricsGrid} gap-4`}>
        {Object.entries(metrics).map(([key, { name, color, icon: Icon, format }]) => {
          const latestValue = filteredData[filteredData.length - 1][key];
          const previousValue = filteredData[filteredData.length - 2]?.[key] ?? latestValue;
          const change = ((latestValue - previousValue) / previousValue * 100).toFixed(1);
          const isPositive = change > 0;
          const { min, max } = getMinMaxValues(filteredData, key);
          
          return (
            <Card key={key} className="bg-white/80 backdrop-blur transition-transform hover:scale-105">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                    <Icon className={styles.iconSize} style={{ color }} />
                  </div>
                  {isPositive ? 
                    <ArrowUpRight className={styles.iconSize + " text-green-600"} /> :
                    <ArrowDownRight className={styles.iconSize + " text-red-600"} />
                  }
                </div>
                <div className="mt-4">
                  <div className={`${styles.fontSize} text-gray-500`}>{name}</div>
                  <div className={`${viewMode === 'desktop' ? 'text-2xl' : 'text-xl'} font-bold mt-1`} style={{ color }}>
                    {format(latestValue)}
                  </div>
                  <div className={`${styles.fontSize} mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                  </div>
                  <div className="h-8 mt-2">
                    <SparkLine 
                      data={filteredData.slice(-7)} 
                      dataKey={key} 
                      color={color} 
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{t.min}: {format(min)}</span>
                    <span>{t.max}: {format(max)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className={`text-center ${styles.fontSize} text-gray-500 mt-4`}>
        {t.madeIn} <span className="font-semibold text-blue-600">OZDO AI</span>
      </div>
    </div>
  );
}