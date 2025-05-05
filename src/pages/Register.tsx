
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, LockKeyhole, User } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('type') === 'laborer' ? 'laborer' : 'client';

  const [activeTab, setActiveTab] = useState<'laborer' | 'client'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please check your password and try again.",
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, activeTab);
      
      toast({
        title: "Registration successful",
        description: `Welcome to LaborEase! You've registered as a ${activeTab}.`,
      });
      
      navigate(activeTab === 'laborer' ? '/laborer-profile-setup' : '/client-profile-setup');
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-lg shadow-lg hover-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Choose your account type to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as 'laborer' | 'client')} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="laborer">I'm a Laborer</TabsTrigger>
              <TabsTrigger value="client">I'm Hiring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="laborer">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-2">
                  By signing up, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Register as Laborer"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="client">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mt-2">
                  By signing up, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Register as Client"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <div className="text-sm text-gray-500 text-center w-full">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
