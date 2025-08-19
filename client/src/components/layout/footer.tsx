import { Layers, Twitter, Linkedin, Github, Dribbble } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CreativeFlow</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Streamline your creative workflow with powerful project management, asset organization, and team collaboration tools designed specifically for agencies and brand teams.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                data-testid="social-link-twitter"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                data-testid="social-link-linkedin"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                data-testid="social-link-github"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                data-testid="social-link-dribbble"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Dribbble"
              >
                <Dribbble className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="/pricing" 
                  data-testid="footer-link-pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-security"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-integrations"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Integrations
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-api"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  API
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-blog"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-careers"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  data-testid="footer-link-privacy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2023 CreativeFlow. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="#" 
              data-testid="footer-link-privacy-policy"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              data-testid="footer-link-terms"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              data-testid="footer-link-cookies"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
