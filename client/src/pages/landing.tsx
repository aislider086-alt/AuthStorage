import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/contact/contact-form";
import TestimonialCard from "@/components/testimonials/testimonial-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Check, 
  ArrowRight, 
  Layers, 
  Users, 
  BarChart3, 
  Shield, 
  Smartphone, 
  CloudUpload,
  MapPin,
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Calendar
} from "lucide-react";

export default function Landing() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleWatchDemo = () => {
    toast({
      title: "Demo Coming Soon",
      description: "We're preparing an amazing demo for you. Stay tuned!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Project Management<br />
                <span className="text-primary-600">For Creative Teams</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline your creative workflow with powerful project management, asset organization, and team collaboration tools designed specifically for agencies and brand teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  data-testid="button-get-started"
                  onClick={handleGetStarted}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                >
                  Start Free Trial
                </Button>
                <Button
                  data-testid="button-watch-demo"
                  variant="outline"
                  onClick={handleWatchDemo}
                  className="border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 text-lg font-semibold"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Creative team collaborating on projects" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Project Completed</p>
                    <p className="text-sm text-gray-600">Brand redesign delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your creative workflow and enhance team collaboration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Management</h3>
                <p className="text-gray-600">
                  Organize projects with multi-step wizards, track progress, and manage deadlines with intuitive tools.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                  <CloudUpload className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Asset Management</h3>
                <p className="text-gray-600">
                  Upload, organize, and share brand assets with advanced file management and cloud storage integration.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Collaboration</h3>
                <p className="text-gray-600">
                  Real-time collaboration with comments, file sharing, and live editing capabilities for seamless teamwork.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics & Reporting</h3>
                <p className="text-gray-600">
                  Track project metrics, team performance, and client satisfaction with comprehensive analytics dashboard.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Authentication</h3>
                <p className="text-gray-600">
                  OAuth integration with Google and GitHub, plus traditional authentication for secure access control.
                </p>
              </CardContent>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-shadow border border-gray-100">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Ready</h3>
                <p className="text-gray-600">
                  Fully responsive design that works perfectly on desktop, tablet, and mobile devices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options to fit your team's needs. Start free and scale as you grow.
            </p>
            <div className="mt-8 flex items-center justify-center">
              <span className="text-gray-600 mr-3">Monthly</span>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors">
                <span className="sr-only">Enable notifications</span>
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition transform translate-x-6"></span>
              </div>
              <span className="text-gray-900 ml-3 font-medium">Yearly</span>
              <Badge className="ml-2 bg-success/10 text-success">Save 20%</Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="border border-gray-200 p-8 relative">
              <CardContent className="p-0 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
                <p className="text-gray-600 mb-6">Perfect for small teams getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$9</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">Up to 5 projects</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">3 team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">5GB storage</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">Basic analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                </ul>
                <Button 
                  data-testid="button-starter-trial"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGetStarted}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan (Featured) */}
            <Card className="bg-primary-600 text-white p-8 relative transform scale-105 border-0">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-warning text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-0 text-center">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <p className="text-primary-100 mb-6">Ideal for growing creative teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-primary-100">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-white mr-3" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-white mr-3" />
                    <span>Up to 15 team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-white mr-3" />
                    <span>100GB storage</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-white mr-3" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-white mr-3" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-white mr-3" />
                    <span>Real-time collaboration</span>
                  </li>
                </ul>
                <Button 
                  data-testid="button-professional-trial"
                  className="w-full bg-white text-primary-600 hover:bg-gray-50"
                  onClick={handleGetStarted}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border border-gray-200 p-8 relative">
              <CardContent className="p-0 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For large agencies and organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">Unlimited everything</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">Unlimited team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">1TB storage</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">Custom analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">24/7 phone support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-success mr-3" />
                    <span className="text-gray-700">SSO & advanced security</span>
                  </li>
                </ul>
                <Button 
                  data-testid="button-contact-sales"
                  variant="outline" 
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of creative teams who trust CreativeFlow to manage their projects and streamline their workflow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <TestimonialCard
              rating={5}
              quote="CreativeFlow has completely transformed how our agency manages projects. The intuitive interface and powerful collaboration tools have increased our productivity by 40%."
              name="Sarah Johnson"
              title="Creative Director"
              company="BrandCraft"
              image="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48"
            />
            
            <TestimonialCard
              rating={5}
              quote="The file management and asset organization features are game-changers. We can finally keep all our brand assets organized and accessible to the entire team."
              name="Michael Chen"
              title="Project Manager"
              company="DesignHub"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48"
            />
            
            <TestimonialCard
              rating={5}
              quote="The analytics dashboard gives us incredible insights into our project performance. We can now make data-driven decisions to improve our processes."
              name="Emily Rodriguez"
              title="Agency Owner"
              company="Pixel Perfect"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Office Address</h4>
                    <p className="text-gray-600">123 Creative Street<br />San Francisco, CA 94102</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone Number</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Address</h4>
                    <p className="text-gray-600">hello@creativeflow.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
