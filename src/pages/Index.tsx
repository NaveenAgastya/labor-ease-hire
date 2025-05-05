
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Search, ShieldCheck, Star, Users } from 'lucide-react';

const serviceCategories = [
  {
    title: 'Construction',
    icon: <div className="bg-blue-100 p-3 rounded-full"><img src="https://api.iconify.design/mdi:hammer.svg" alt="Construction" className="w-6 h-6" /></div>,
  },
  {
    title: 'Plumbing',
    icon: <div className="bg-blue-100 p-3 rounded-full"><img src="https://api.iconify.design/mdi:pipe.svg" alt="Plumbing" className="w-6 h-6" /></div>,
  },
  {
    title: 'Electrical Work',
    icon: <div className="bg-blue-100 p-3 rounded-full"><img src="https://api.iconify.design/mdi:lightning-bolt.svg" alt="Electrical" className="w-6 h-6" /></div>,
  },
  {
    title: 'Carpentry',
    icon: <div className="bg-blue-100 p-3 rounded-full"><img src="https://api.iconify.design/mdi:saw.svg" alt="Carpentry" className="w-6 h-6" /></div>,
  },
  {
    title: 'Painting',
    icon: <div className="bg-blue-100 p-3 rounded-full"><img src="https://api.iconify.design/mdi:paint.svg" alt="Painting" className="w-6 h-6" /></div>,
  },
  {
    title: 'Moving',
    icon: <div className="bg-blue-100 p-3 rounded-full"><img src="https://api.iconify.design/mdi:truck-fast.svg" alt="Moving" className="w-6 h-6" /></div>,
  },
];

const benefits = [
  {
    title: 'Verified Laborers',
    description: 'All laborers undergo identity verification and background checks.',
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
  },
  {
    title: 'Quick Response',
    description: 'Find available laborers in your area within minutes.',
    icon: <Clock className="w-10 h-10 text-primary" />,
  },
  {
    title: 'Quality Assurance',
    description: 'Transparent ratings and reviews for all laborers on the platform.',
    icon: <Star className="w-10 h-10 text-primary" />,
  },
  {
    title: 'Broad Network',
    description: 'Access to a wide range of skilled workers for any job.',
    icon: <Users className="w-10 h-10 text-primary" />,
  },
];

const testimonials = [
  {
    quote: "LaborEase made it incredibly simple to find help for my moving day. The laborer was professional and completed the job quickly.",
    name: "Sarah M.",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
  },
  {
    quote: "As a laborer, I've been able to find consistent work through LaborEase. The platform makes it easy to manage my schedule and get paid.",
    name: "Michael T.",
    role: "General Laborer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
  },
  {
    quote: "I needed help with several home improvement tasks. LaborEase connected me with skilled workers quickly, and the work was excellent.",
    name: "Elena R.",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
  },
];

const Index = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-teal-400 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              Find Skilled Labor for Your Everyday Tasks
            </h1>
            <p className="text-lg md:text-xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Connect with verified laborers in your area for construction, plumbing, moving, and more. 
              Get help exactly when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover-scale" asChild>
                <Link to="/register?type=client">Hire a Laborer</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover-scale" asChild>
                <Link to="/register?type=laborer">Join as a Laborer</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <img 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=500&auto=format&fit=crop" 
              alt="Laborers at work" 
              className="rounded-lg shadow-lg max-w-full md:max-w-md"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              LaborEase connects you with skilled laborers in a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center hover-card p-6 rounded-lg">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Find Skilled Labor</h3>
              <p className="text-gray-600">
                Browse through our network of verified laborers based on skills, location, and availability.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center hover-card p-6 rounded-lg">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Book and Confirm</h3>
              <p className="text-gray-600">
                Select a laborer, schedule a time, and confirm your booking details securely through our platform.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center hover-card p-6 rounded-lg">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Get Work Done</h3>
              <p className="text-gray-600">
                The laborer arrives at the scheduled time, completes the task, and you pay only when satisfied.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find laborers for a wide range of tasks and services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="hover-card transform transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  {category.icon}
                  <h3 className="font-medium mt-4">{category.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button className="hover-scale" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose LaborEase</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing a reliable, safe, and efficient platform for connecting laborers and clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="hover-card p-6 rounded-lg bg-white shadow-sm">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from clients and laborers who use LaborEase
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-card">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-10 w-10 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already using LaborEase to find labor help or earn money with their skills.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover-scale" asChild>
              <Link to="/register?type=client">Hire a Laborer</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover-scale" asChild>
              <Link to="/register?type=laborer">Join as a Laborer</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Index;
