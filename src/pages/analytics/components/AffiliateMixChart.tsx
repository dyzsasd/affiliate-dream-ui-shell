
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface AffiliateMixChartProps {
  chartData: ChartDataItem[];
}

const AffiliateMixChart: React.FC<AffiliateMixChartProps> = ({ chartData }) => {
  const { t } = useTranslation();

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('analytics.affiliateMixChart')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-12">
          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-base text-gray-700 capitalize">{item.name}</span>
                <span className="text-sm text-gray-500 ml-2">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateMixChart;
