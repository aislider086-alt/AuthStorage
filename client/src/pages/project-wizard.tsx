import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import ProgressIndicator from "@/components/project/progress-indicator";
import WizardStep from "@/components/project/wizard-step";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertProjectSchema } from "@shared/schema";
import { z } from "zod";

interface ProjectData {
  // Step 1: Brand Information
  brandName: string;
  industry: string;
  brandDescription: string;
  
  // Step 2: Project Details
  name: string;
  objectives: string;
  targetAudience: string;
  startDate: string;
  deadline: string;
  
  // Step 3: Assets
  assets: File[];
  
  // Progress
  progress: number;
  status: string;
}

const initialData: ProjectData = {
  brandName: "",
  industry: "",
  brandDescription: "",
  name: "",
  objectives: "",
  targetAudience: "",
  startDate: "",
  deadline: "",
  assets: [],
  progress: 0,
  status: "planning",
};

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Education",
  "Entertainment",
  "Manufacturing",
  "Real Estate",
  "Food & Beverage",
  "Other"
];

export default function ProjectWizard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const createProjectMutation = useMutation({
    mutationFn: async (data: Partial<ProjectData>) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      
      toast({
        title: "Project Created!",
        description: `${project.name} has been created successfully.`,
      });
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProjectData = (field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!projectData.brandName.trim()) {
          newErrors.brandName = "Brand name is required";
        }
        if (!projectData.industry) {
          newErrors.industry = "Industry is required";
        }
        break;
      
      case 2:
        if (!projectData.name.trim()) {
          newErrors.name = "Project name is required";
        }
        break;
      
      case 3:
        // Asset upload is optional
        break;
      
      case 4:
        // Review step - final validation
        try {
          insertProjectSchema.parse({
            name: projectData.name,
            brandName: projectData.brandName,
            industry: projectData.industry,
            brandDescription: projectData.brandDescription,
            objectives: projectData.objectives,
            targetAudience: projectData.targetAudience,
            startDate: projectData.startDate ? new Date(projectData.startDate) : null,
            deadline: projectData.deadline ? new Date(projectData.deadline) : null,
            progress: projectData.progress,
            status: projectData.status,
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            error.errors.forEach(err => {
              if (err.path[0]) {
                newErrors[err.path[0] as string] = err.message;
              }
            });
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleFinish();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (validateStep(4)) {
      const finalData = {
        name: projectData.name,
        brandName: projectData.brandName,
        industry: projectData.industry,
        brandDescription: projectData.brandDescription,
        objectives: projectData.objectives,
        targetAudience: projectData.targetAudience,
        startDate: projectData.startDate ? new Date(projectData.startDate) : null,
        deadline: projectData.deadline ? new Date(projectData.deadline) : null,
        progress: projectData.progress,
        status: projectData.status,
      };
      
      createProjectMutation.mutate(finalData);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setProjectData(prev => ({
        ...prev,
        assets: [...prev.assets, ...fileArray]
      }));
    }
  };

  const removeFile = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }));
  };

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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Progress Header */}
          <div className="bg-gray-50 p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
              <span className="text-sm text-gray-600">
                Step <span data-testid="current-step">{currentStep}</span> of 4
              </span>
            </div>
            <ProgressIndicator currentStep={currentStep} totalSteps={4} />
          </div>

          <CardContent className="p-8">
            {/* Step 1: Brand Information */}
            <WizardStep step={1} currentStep={currentStep} title="Brand Information">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    data-testid="input-brand-name"
                    value={projectData.brandName}
                    onChange={(e) => updateProjectData("brandName", e.target.value)}
                    placeholder="Enter brand name"
                    className={errors.brandName ? "border-red-500" : ""}
                  />
                  {errors.brandName && (
                    <p className="text-sm text-red-600 mt-1" data-testid="error-brand-name">
                      {errors.brandName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select 
                    value={projectData.industry} 
                    onValueChange={(value) => updateProjectData("industry", value)}
                  >
                    <SelectTrigger data-testid="select-industry" className={errors.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.industry && (
                    <p className="text-sm text-red-600 mt-1" data-testid="error-industry">
                      {errors.industry}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Label htmlFor="brandDescription">Brand Description</Label>
                <Textarea
                  id="brandDescription"
                  data-testid="textarea-brand-description"
                  value={projectData.brandDescription}
                  onChange={(e) => updateProjectData("brandDescription", e.target.value)}
                  placeholder="Describe your brand, values, and unique characteristics..."
                  rows={4}
                />
              </div>
            </WizardStep>

            {/* Step 2: Project Details */}
            <WizardStep step={2} currentStep={currentStep} title="Project Details">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    data-testid="input-project-name"
                    value={projectData.name}
                    onChange={(e) => updateProjectData("name", e.target.value)}
                    placeholder="Enter project name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1" data-testid="error-project-name">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="objectives">Project Objectives</Label>
                  <Textarea
                    id="objectives"
                    data-testid="textarea-objectives"
                    value={projectData.objectives}
                    onChange={(e) => updateProjectData("objectives", e.target.value)}
                    placeholder="What are the main goals and objectives for this project?"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    data-testid="input-target-audience"
                    value={projectData.targetAudience}
                    onChange={(e) => updateProjectData("targetAudience", e.target.value)}
                    placeholder="Describe your target audience"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      data-testid="input-start-date"
                      type="date"
                      value={projectData.startDate}
                      onChange={(e) => updateProjectData("startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      data-testid="input-deadline"
                      type="date"
                      value={projectData.deadline}
                      onChange={(e) => updateProjectData("deadline", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </WizardStep>

            {/* Step 3: Asset Upload */}
            <WizardStep step={3} currentStep={currentStep} title="Upload Brand Assets">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                  <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h4>
                  <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>
                  <Button 
                    type="button" 
                    data-testid="button-choose-files"
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    Choose Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.ai,.psd"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Supported: JPG, PNG, PDF, AI, PSD (Max 10MB each)
                  </p>
                </div>
                
                {/* File Preview */}
                {projectData.assets.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {projectData.assets.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => removeFile(index)}
                          data-testid={`button-remove-file-${index}`}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </WizardStep>

            {/* Step 4: Review */}
            <WizardStep step={4} currentStep={currentStep} title="Review & Confirm">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Brand Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Brand Name:</span>
                      <span className="ml-2 font-medium" data-testid="review-brand-name">
                        {projectData.brandName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Industry:</span>
                      <span className="ml-2 font-medium" data-testid="review-industry">
                        {projectData.industry}
                      </span>
                    </div>
                  </div>
                  {projectData.brandDescription && (
                    <div className="mt-3">
                      <span className="text-gray-600">Description:</span>
                      <p className="mt-1 text-sm" data-testid="review-brand-description">
                        {projectData.brandDescription}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Project Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Project Name:</span>
                      <span className="ml-2 font-medium" data-testid="review-project-name">
                        {projectData.name}
                      </span>
                    </div>
                    {projectData.targetAudience && (
                      <div>
                        <span className="text-gray-600">Target Audience:</span>
                        <span className="ml-2 font-medium" data-testid="review-target-audience">
                          {projectData.targetAudience}
                        </span>
                      </div>
                    )}
                    {projectData.objectives && (
                      <div>
                        <span className="text-gray-600">Objectives:</span>
                        <p className="mt-1 text-sm" data-testid="review-objectives">
                          {projectData.objectives}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {projectData.assets.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Uploaded Assets</h4>
                    <div className="flex flex-wrap gap-2">
                      {projectData.assets.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </WizardStep>
          </CardContent>

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t flex justify-between">
            <Button
              data-testid="button-previous"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              data-testid="button-next"
              onClick={handleNext}
              disabled={createProjectMutation.isPending}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              {createProjectMutation.isPending 
                ? "Creating..." 
                : currentStep === 4 
                  ? "Create Project" 
                  : "Next"
              }
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
