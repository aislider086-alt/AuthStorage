import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function Pricing() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/";
    } else {
      window.location.href = "/api/login";
    }
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "We'll connect you with our sales team soon. Please check the contact form below.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
                  onClick={handleContactSales}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
