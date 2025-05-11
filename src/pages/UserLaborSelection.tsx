
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Construction, Wrench } from 'lucide-react';

const UserLaborSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to LaborEase</h1>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Connect with skilled workers or find jobs that match your skills
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="bg-blue-100 p-6 rounded-full mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                <Construction size={40} className="text-blue-600" />
              </div>
              <CardTitle className="text-xl">I need to hire workers</CardTitle>
              <CardDescription>Find skilled workers for your project</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Button onClick={() => navigate('/signup')} className="w-full" size="lg">
                Continue as User
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="bg-green-100 p-6 rounded-full mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                <Wrench size={40} className="text-green-600" />
              </div>
              <CardTitle className="text-xl">I'm looking for work</CardTitle>
              <CardDescription>Find jobs that match your skills</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Button onClick={() => navigate('/register')} variant="outline" className="w-full" size="lg">
                Continue as Worker
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserLaborSelection;
