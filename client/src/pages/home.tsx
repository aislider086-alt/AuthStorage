import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus, 
  BarChart3, 
  Users, 
  FolderOpen, 
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: recentProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
    enabled: isAuthenticated,
  });

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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your projects today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Button
            data-testid="button-new-project"
            onClick={() => window.location.href = "/projects/new"}
            className="h-auto py-6 bg-primary-600 hover:bg-primary-700 text-white"
          >
            <div className="flex flex-col items-center space-y-2">
              <Plus className="w-8 h-8" />
              <span className="font-medium">New Project</span>
            </div>
          </Button>
          
          <Button
            data-testid="button-dashboard"
            variant="outline"
            onClick={() => window.location.href = "/dashboard"}
            className="h-auto py-6"
          >
            <div className="flex flex-col items-center space-y-2">
              <FolderOpen className="w-8 h-8" />
              <span className="font-medium">View Dashboard</span>
            </div>
          </Button>
          
          <Button
            data-testid="button-analytics"
            variant="outline"
            onClick={() => window.location.href = "/analytics"}
            className="h-auto py-6"
          >
            <div className="flex flex-col items-center space-y-2">
              <BarChart3 className="w-8 h-8" />
              <span className="font-medium">Analytics</span>
            </div>
          </Button>
          
          {user?.role === 'admin' && (
            <Button
              data-testid="button-admin"
              variant="outline"
              onClick={() => window.location.href = "/admin"}
              className="h-auto py-6"
            >
              <div className="flex flex-col items-center space-y-2">
                <Users className="w-8 h-8" />
                <span className="font-medium">Admin Panel</span>
              </div>
            </Button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.totalProjects || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success font-medium">+12%</span>
                <span className="text-gray-600 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.activeProjects || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-success font-medium">+3</span>
                <span className="text-gray-600 ml-1">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.completedProjects || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-success font-medium">94%</span>
                <span className="text-gray-600 ml-1">completion rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg. Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : `${stats?.avgCompletionTime || 0}d`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-success font-medium">-2.3d</span>
                <span className="text-gray-600 ml-1">faster</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Button
                data-testid="button-view-all-projects"
                variant="outline"
                size="sm"
                onClick={() => window.location.href = "/dashboard"}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentProjects && Array.isArray(recentProjects) && recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects?.slice(0, 5).map((project: any) => (
                  <div 
                    key={project.id} 
                    className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/projects/${project.id}`}
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{project.name}</h4>
                      <p className="text-sm text-gray-600">
                        {project.brandName} • {project.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {project.progress || 0}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all" 
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first project.
                </p>
                <Button
                  data-testid="button-create-first-project"
                  onClick={() => window.location.href = "/projects/new"}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
