import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    brandName?: string;
    status: string;
    progress: number;
    deadline?: string;
    createdAt: string;
  };
}

const projectImages = [
  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
  "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
];

const teamMembers = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"
];

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'completed':
        return 'bg-primary-100 text-primary-800';
      case 'review':
        return 'bg-warning/10 text-warning';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Use project ID hash to select consistent image and team members
  const imageIndex = parseInt(project.id.slice(-1), 16) % projectImages.length;
  const selectedMembers = teamMembers.slice(0, 2 + (parseInt(project.id.slice(-2), 16) % 3));

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => window.location.href = `/projects/${project.id}`}
      data-testid={`project-card-${project.id}`}
    >
      <img 
        src={projectImages[imageIndex]} 
        alt={`${project.name} workspace`}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <Badge 
            className={getStatusColor(project.status)}
            data-testid={`project-status-${project.id}`}
          >
            {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown'}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description || `${project.brandName ? `Brand project for ${project.brandName}` : 'Creative project'} with comprehensive deliverables and timeline.`}
        </p>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium" data-testid={`project-progress-${project.id}`}>
              {project.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                (project.progress || 0) >= 75 
                  ? 'bg-success' 
                  : (project.progress || 0) >= 50 
                    ? 'bg-primary-600' 
                    : 'bg-warning'
              }`}
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {selectedMembers.map((member, index) => (
              <img 
                key={index}
                src={member} 
                alt={`Team member ${index + 1}`}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="text-sm text-gray-600" data-testid={`project-deadline-${project.id}`}>
            Due {formatDate(project.deadline)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
