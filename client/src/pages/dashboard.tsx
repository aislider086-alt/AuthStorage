import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import StatsCard from "@/components/dashboard/stats-card";
import ProjectCard from "@/components/dashboard/project-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Clock, 
  CheckCircle2, 
  Users,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ["/api/projects"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
    retry: false,
    enabled: isAuthenticated,
  });

  // Handle query errors
  useEffect(() => {
    if (projectsError && isUnauthorizedError(projectsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [projectsError, toast]);

  const filteredProjects = projects?.filter((project: any) => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.status?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
              <h1 className="text-3xl font-bold text-gray-900">Project Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
            </div>
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  data-testid="input-search-projects"
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                data-testid="button-new-project"
                onClick={() => window.location.href = "/projects/new"}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Projects"
            value={statsLoading ? "..." : stats?.totalProjects?.toString() || "0"}
            icon={FolderOpen}
            iconColor="text-primary-600"
            iconBgColor="bg-primary-100"
            trend="+12%"
            trendLabel="from last month"
            isPositive={true}
          />
          
          <StatsCard
            title="Active Projects"
            value={statsLoading ? "..." : stats?.activeProjects?.toString() || "0"}
            icon={Clock}
            iconColor="text-success"
            iconBgColor="bg-success/10"
            trend="+3"
            trendLabel="this week"
            isPositive={true}
          />
          
          <StatsCard
            title="Completed"
            value={statsLoading ? "..." : stats?.completedProjects?.toString() || "0"}
            icon={CheckCircle2}
            iconColor="text-success"
            iconBgColor="bg-success/10"
            trend="94%"
            trendLabel="completion rate"
            isPositive={true}
          />
          
          <StatsCard
            title="Team Members"
            value="12"
            icon={Users}
            iconColor="text-accent"
            iconBgColor="bg-accent/10"
            trend="+2"
            trendLabel="new members"
            isPositive={true}
          />
        </div>

        {/* Projects Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
            {searchQuery && (
              <p className="text-sm text-gray-600">
                {filteredProjects.length} of {projects?.length || 0} projects
              </p>
            )}
          </div>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or create a new project.
            </p>
            <Button
              data-testid="button-clear-search"
              variant="outline"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
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
      </div>

      <Footer />
    </div>
  );
}
