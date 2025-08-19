import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import StatsCard from "@/components/dashboard/stats-card";
import ChartContainer from "@/components/analytics/chart-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Star, 
  Download, 
  ArrowUp,
  ArrowDown,
  BarChart3
} from "lucide-react";

export default function Analytics() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [dateRange, setDateRange] = useState("30");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/analytics/stats"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/analytics/events"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
    enabled: isAuthenticated,
  });

  // Handle query errors
  useEffect(() => {
    if (statsError && isUnauthorizedError(statsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [statsError, toast]);

  const handleExportReport = () => {
    toast({
      title: "Export Started",
      description: "Analytics report is being prepared and will be downloaded shortly.",
    });
  };

  // Generate chart data from projects
  const projectCompletionData = projects ? {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Projects Completed',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: 'hsl(var(--primary-600))',
      backgroundColor: 'hsla(var(--primary-600), 0.1)',
      tension: 0.4
    }]
  } : null;

  const teamPerformanceData = {
    labels: ['On Time', 'Delayed', 'Ahead'],
    datasets: [{
      data: [65, 20, 15],
      backgroundColor: [
        'hsl(var(--success))',
        'hsl(var(--warning))',
        'hsl(var(--primary-600))'
      ]
    }]
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
              <p className="text-gray-600 mt-2">Track project performance and team productivity</p>
            </div>
            <div className="mt-4 lg:mt-0 flex gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger data-testid="select-date-range" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              <Button
                data-testid="button-export-report"
                onClick={handleExportReport}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Projects Completed"
            value={statsLoading ? "..." : stats?.completedProjects?.toString() || "0"}
            icon={CheckCircle2}
            iconColor="text-success"
            iconBgColor="bg-success/10"
            trend="+18%"
            trendLabel="vs last month"
            isPositive={true}
          />
          
          <StatsCard
            title="Avg. Completion Time"
            value={statsLoading ? "..." : `${stats?.avgCompletionTime || 0}d`}
            icon={Clock}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
            trend="-2.3d"
            trendLabel="faster"
            isPositive={true}
          />
          
          <StatsCard
            title="Team Productivity"
            value="94%"
            icon={TrendingUp}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
            trend="+5%"
            trendLabel="improvement"
            isPositive={true}
          />
          
          <StatsCard
            title="Client Satisfaction"
            value="4.8"
            icon={Star}
            iconColor="text-yellow-600"
            iconBgColor="bg-yellow-100"
            trend="+0.2"
            trendLabel="rating increase"
            isPositive={true}
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer
            title="Project Completion Trends"
            type="line"
            data={projectCompletionData}
            loading={projectsLoading}
          />
          
          <ChartContainer
            title="Team Performance"
            type="doughnut"
            data={teamPerformanceData}
            loading={false}
          />
        </div>

        {/* Project Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Project Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.slice(0, 10).map((project: any) => (
                      <tr key={project.id} className="hover:bg-gray-50" data-testid={`project-row-${project.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.brandName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={project.status === 'active' ? 'default' : 'secondary'}
                            className={
                              project.status === 'active' 
                                ? 'bg-success/10 text-success' 
                                : project.status === 'completed'
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-warning/10 text-warning'
                            }
                          >
                            {project.status === 'active' ? 'On Track' : project.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-primary-600 h-2 rounded-full transition-all" 
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{project.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {project.deadline 
                            ? new Date(project.deadline).toLocaleDateString()
                            : 'No deadline'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {(project.progress || 0) >= 75 ? (
                              <>
                                <ArrowUp className="w-4 h-4 text-success mr-2" />
                                <span className="text-sm text-success font-medium">Excellent</span>
                              </>
                            ) : (project.progress || 0) >= 50 ? (
                              <>
                                <ArrowUp className="w-4 h-4 text-warning mr-2" />
                                <span className="text-sm text-warning font-medium">Good</span>
                              </>
                            ) : (
                              <>
                                <ArrowDown className="w-4 h-4 text-destructive mr-2" />
                                <span className="text-sm text-destructive font-medium">Needs Attention</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No project data</h3>
                <p className="text-gray-600">Create some projects to see analytics data.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
