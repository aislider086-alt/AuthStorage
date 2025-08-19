import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface ChartContainerProps {
  title: string;
  type: 'line' | 'doughnut' | 'bar';
  data: any;
  loading?: boolean;
}

declare global {
  interface Window {
    Chart: any;
  }
}

export default function ChartContainer({ title, type, data, loading }: ChartContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically load Chart.js
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => initChart();
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, type]);

  const initChart = () => {
    if (!canvasRef.current || !data || !window.Chart) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new window.Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === 'doughnut',
            position: type === 'doughnut' ? 'bottom' : 'top'
          }
        },
        scales: type === 'line' || type === 'bar' ? {
          y: {
            beginAtZero: true
          }
        } : {}
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
          </div>
        ) : data ? (
          <div className="h-64 relative">
            <canvas 
              ref={canvasRef}
              data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}
            />
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
