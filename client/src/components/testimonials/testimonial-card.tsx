import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  rating: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  image: string;
}

export default function TestimonialCard({
  rating,
  quote,
  name,
  title,
  company,
  image
}: TestimonialCardProps) {
  return (
    <Card className="p-8 shadow-sm border border-gray-100">
      <CardContent className="p-0">
        <div className="flex items-center mb-4">
          <div className="flex text-yellow-400">
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          "{quote}"
        </p>
        
        <div className="flex items-center">
          <img 
            src={image} 
            alt={`${name}, ${title}`}
            className="w-12 h-12 rounded-full mr-4"
            data-testid={`testimonial-image-${name.toLowerCase().replace(/\s+/g, '-')}`}
          />
          <div>
            <div className="font-medium text-gray-900" data-testid={`testimonial-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
              {name}
            </div>
            <div className="text-sm text-gray-600" data-testid={`testimonial-title-${name.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}, {company}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
