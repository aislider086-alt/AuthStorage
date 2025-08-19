import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: string;
  trendLabel?: string;
  isPositive?: boolean;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary-600",
  iconBgColor = "bg-primary-100",
  trend,
  trendLabel,
  isPositive = true
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1" data-testid={`stats-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900" data-testid={`stats-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        {trend && trendLabel && (
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? 'text-success' : 'text-destructive'}`} />
            <span className={`font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {trend}
            </span>
            <span className="text-gray-600 ml-1">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
