import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  newsletter: boolean;
}

const initialData: ContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  subject: "",
  message: "",
  newsletter: false,
};

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      setFormData(initialData);
      setErrors({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    try {
      insertContactSubmissionSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      submitContactMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            data-testid="input-first-name"
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="Enter your first name"
            className={errors.firstName ? "border-red-500" : ""}
            required
          />
          {errors.firstName && (
            <p className="text-sm text-red-600 mt-1" data-testid="error-first-name">
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            data-testid="input-last-name"
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="Enter your last name"
            className={errors.lastName ? "border-red-500" : ""}
            required
          />
          {errors.lastName && (
            <p className="text-sm text-red-600 mt-1" data-testid="error-last-name">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          data-testid="input-email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          placeholder="Enter your email address"
          className={errors.email ? "border-red-500" : ""}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-600 mt-1" data-testid="error-email">
            {errors.email}
          </p>
        )}
      </div>
      
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          data-testid="input-company"
          type="text"
          value={formData.company}
          onChange={(e) => updateFormData("company", e.target.value)}
          placeholder="Enter your company name"
        />
      </div>
      
      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Select 
          value={formData.subject} 
          onValueChange={(value) => updateFormData("subject", value)}
        >
          <SelectTrigger data-testid="select-subject" className={errors.subject ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="demo">Request Demo</SelectItem>
            <SelectItem value="pricing">Pricing Questions</SelectItem>
            <SelectItem value="support">Technical Support</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
          </SelectContent>
        </Select>
        {errors.subject && (
          <p className="text-sm text-red-600 mt-1" data-testid="error-subject">
            {errors.subject}
          </p>
        )}
      </div>
      
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          data-testid="textarea-message"
          value={formData.message}
          onChange={(e) => updateFormData("message", e.target.value)}
          placeholder="Tell us about your project or inquiry..."
          rows={5}
          className={`resize-none ${errors.message ? "border-red-500" : ""}`}
          required
        />
        {errors.message && (
          <p className="text-sm text-red-600 mt-1" data-testid="error-message">
            {errors.message}
          </p>
        )}
      </div>
      
      <div className="flex items-start space-x-3">
        <Checkbox
          id="newsletter"
          data-testid="checkbox-newsletter"
          checked={formData.newsletter}
          onCheckedChange={(checked) => updateFormData("newsletter", !!checked)}
        />
        <Label htmlFor="newsletter" className="text-sm text-gray-700 leading-relaxed">
          I'd like to receive updates about CreativeFlow and new features
        </Label>
      </div>
      
      <Button
        type="submit"
        data-testid="button-send-message"
        className="w-full bg-primary-600 text-white hover:bg-primary-700 py-3 text-lg font-medium"
        disabled={submitContactMutation.isPending}
      >
        {submitContactMutation.isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
