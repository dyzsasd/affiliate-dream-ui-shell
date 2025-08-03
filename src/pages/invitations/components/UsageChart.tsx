import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DomainInvitationUsageLog } from '@/generated-api/src/models';

interface UsageChartProps {
  usageHistory?: DomainInvitationUsageLog[];
}

export function UsageChart({ usageHistory }: UsageChartProps) {
  if (!usageHistory || usageHistory.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No usage data available
      </div>
    );
  }

  // Group usage by date
  const usageByDate = usageHistory.reduce((acc, usage) => {
    if (!usage.usedAt) return acc;
    
    const date = new Date(usage.usedAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, count: 0, successful: 0, failed: 0 };
    }
    
    acc[date].count++;
    if (usage.success) {
      acc[date].successful++;
    } else {
      acc[date].failed++;
    }
    
    return acc;
  }, {} as Record<string, { date: string; count: number; successful: number; failed: number }>);

  const chartData = Object.values(usageByDate).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Usage Over Time */}
      <div>
        <h4 className="text-lg font-medium mb-4">Usage Over Time</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Total Uses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success vs Failed */}
      <div>
        <h4 className="text-lg font-medium mb-4">Success Rate</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar 
                dataKey="successful" 
                fill="hsl(var(--primary))" 
                name="Successful"
                stackId="usage"
              />
              <Bar 
                dataKey="failed" 
                fill="hsl(var(--destructive))" 
                name="Failed"
                stackId="usage"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{usageHistory.length}</div>
          <div className="text-sm text-muted-foreground">Total Uses</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {usageHistory.filter(u => u.success).length}
          </div>
          <div className="text-sm text-muted-foreground">Successful</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {usageHistory.filter(u => !u.success).length}
          </div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
      </div>
    </div>
  );
}