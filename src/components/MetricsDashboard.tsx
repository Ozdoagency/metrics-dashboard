import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Globe, UserCheck, Calculator, BarChart, Wallet, UserCog, LucideIcon } from 'lucide-react';
import { fetchSheetData } from '../utils/sheets';

interface MetricData {
  date: string;
  actual: number;
  leads: number;
  leadCost: number;
  cr: number;
  quals: number;
  qualCost: number;
}

type Lang = 'en' | 'uk' | 'ru';
type MetricFormatter = (val: MetricValue) => string | number;

interface MetricConfig {
  name: string;
  color: string;
  icon: LucideIcon;
  format: MetricFormatter;
}

type MetricKey = 'leads' | 'leadCost' | 'cr' | 'actual' | 'quals' | 'qualCost';
type MetricValue = number;

interface SparkLineProps {
  data: MetricData[];
  dataKey: string;
  color: string;
  height?: number;
}

interface Metrics {
  leads: MetricConfig;
  leadCost: MetricConfig;
  cr: MetricConfig;
  actual: MetricConfig;
  quals: MetricConfig;
  qualCost: MetricConfig;
}

const translations = {
    en: {
      title: 'Metrics Dashboard',
      average: 'Average',
      metrics: {
        leads: 'Tech Leads',
        leadCost: 'Lead Cost',
        cr: 'CR %',
        actual: 'Budget',
        quals: 'quals Amount',
        qualCost: 'quals Cost'
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
        quals: 'Кількість квалів',
        qualCost: 'Ціна квала'
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
        quals: 'Количество квалов',
        qualCost: 'Цена квала'
      },
      min: 'мин',
      max: 'макс',
      madeIn: 'Сделано в'
    }
  };

const SparkLine = ({ data, dataKey, color, height = 30 }: SparkLineProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data}>
      <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

const MetricsDashboard: React.FC = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [activeMetric, setActiveMetric] = useState<MetricKey>('leads');
  const [startIdx, setStartIdx] = useState(0);
  const [endIdx, setEndIdx] = useState(0);
  const [showAverage, setShowAverage] = useState(true);
  const [lang, setLang] = useState<Lang>('ru');
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting data load in MetricsDashboard');
        setLoading(true);
        const sheetData = await fetchSheetData();
        console.log('Data received in MetricsDashboard:', sheetData);
        
        if (!sheetData || sheetData.length === 0) {
          throw new Error('No data received from sheets');
        }

        setData(sheetData);
        setEndIdx(sheetData.length - 1);
        setError(null);
      } catch (err) {
        console.error('Error in MetricsDashboard:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-blue-600">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-blue-600">No data available</div>
      </div>
    );
  }

  const isMobile = width < 768;
  const t = translations[lang];
  const filteredData = useMemo(() => data.slice(startIdx, endIdx + 1), [startIdx, endIdx, data]);

  const metrics: Metrics = {
    leads: { 
      name: t.metrics.leads,
      color: '#2563eb',
      icon: UserCog,
      format: (val: MetricValue) => Math.round(val)
    },
    leadCost: { 
      name: t.metrics.leadCost,
      color: '#1d4ed8', 
      icon: Calculator,     
      format: (val: MetricValue) => `₴${val.toFixed(2)}`
    },
    cr: { 
      name: t.metrics.cr,
      color: '#1e40af', 
      icon: BarChart,       
      format: (val: MetricValue) => `${val}%`
    },
    actual: { 
      name: t.metrics.actual,
      color: '#1e3a8a', 
      icon: Wallet,         
      format: (val: MetricValue) => `₴${val.toFixed(2)}`
    },
    quals: {            // изменено с quals на quals
      name: t.metrics.quals,
      color: '#172554',
      icon: UserCheck,      
      format: (val: MetricValue) => Math.round(val)
    },
    qualCost: {           
      name: t.metrics.qualCost,
      color: '#0f172a', 
      icon: DollarSign,
      format: (val: MetricValue) => `₴${val.toFixed(2)}`
    }
};

  // Обновляем функцию getAverageValue с правильной типизацией
  const getAverageValue = (data: MetricData[], key: MetricKey): number => {
    const validData = data.filter(item => typeof item[key] === 'number');
    return validData.length > 0 
      ? validData.reduce((sum, item) => sum + (item[key] as number), 0) / validData.length 
      : 0;
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Lang);
  };

  const handleMetricChange = (key: MetricKey) => {
    setActiveMetric(key);
  };

  return (
    <div className="w-full space-y-4 bg-blue-500 p-2 sm:p-6 rounded-xl">
      <div className="flex justify-between items-center">
        <h1 className={`font-bold text-blue-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>{t.title}</h1>
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
          <Globe className="w-4 h-4 text-blue-600" />
          <select 
            value={lang}
            onChange={handleLangChange}
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
                {data.map((_, idx) => (
                  <option key={idx} value={idx}>{data[idx].date}</option>
                ))}
              </select>
              <select 
                className="p-2 border rounded bg-white"
                value={endIdx}
                onChange={e => setEndIdx(Number(e.target.value))}
              >
                {data.map((_, idx) => (
                  <option key={idx} value={idx}>{data[idx].date}</option>
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
                  onClick={() => handleMetricChange(key as MetricKey)}
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

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-6'} gap-4`}>
        {Object.entries(metrics).map(([key, { name, color, icon: Icon, format }]) => {
          const keyAsMetric = key as MetricKey;
          const latestValue = filteredData[filteredData.length - 1]?.[keyAsMetric] ?? 0;
          const previousValue = filteredData[filteredData.length - 2]?.[keyAsMetric] ?? latestValue;
          const change = Number(((latestValue - previousValue) / previousValue * 100).toFixed(1));
          const isPositive = Number(change) > 0;
          
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
                      dataKey={key as MetricKey} 
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
};

export default MetricsDashboard;