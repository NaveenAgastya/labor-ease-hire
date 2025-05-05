import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ClientSidebar from '@/components/dashboard/ClientSidebar';
import { Clock, CheckCircle, Search, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClientProfile {
  fullName: string;
  profileImageUrl: string | null;
}

interface Job {
  id: string;
  title: string;
  laborerName: string;
  status: string;
  date: string;
  amount: number;
}

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [ongoingJobs, setOngoingJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [recentLaborers, setRecentLaborers] = useState<any[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          // Fetch client profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, id')
            .eq('id', currentUser.id)
            .single();
            
          if (profileData) {
            setProfile({
              fullName: profileData.full_name || '',
              profileImageUrl: null
            });
          }
          
          if (profileError) {
            throw profileError;
          }

          // Fetch jobs
          const { data: ongoingData, error: ongoingError } = await supabase
            .from('jobs')
            .select('*')
            .eq('client_id', currentUser.id)
            .in('status', ['open', 'assigned']);
            
          if (ongoingData) {
            setOngoingJobs(ongoingData as unknown as Job[]);
          }
          
          if (ongoingError) {
            throw ongoingError;
          }
          
          // Completed jobs
          const { data: completedData, error: completedError } = await supabase
            .from('jobs')
            .select('*')
            .eq('client_id', currentUser.id)
            .eq('status', 'completed');
            
          if (completedData) {
            setCompletedJobs(completedData as unknown as Job[]);
            
            // Calculate total spent
            const spent = completedData.reduce((sum, job) => sum + (job.budget || 0), 0);
            setTotalSpent(spent);
          }
          
          if (completedError) {
            throw completedError;
          }
          
          // Fetch recent laborers (placeholder for now)
          setRecentLaborers([
            { id: '1', name: 'James Wilson', skills: ['Plumbing', 'Electrical'], hourlyRate: 25 },
            { id: '2', name: 'Maria Garcia', skills: ['Cleaning', 'Gardening'], hourlyRate: 20 },
            { id: '3', name: 'David Chen', skills: ['Moving', 'Assembly'], hourlyRate: 22 }
          ]);
          
        } catch (error) {
          console.error("Error fetching client data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  // For demo purposes, we'll show placeholder data if no data is found
  useEffect(() => {
    if (!loading && ongoingJobs.length === 0 && completedJobs.length === 0) {
      // Add sample data for demonstration
      setOngoingJobs([
        {
          id: '1',
          title: 'Kitchen Plumbing',
          laborerName: 'James Wilson',
          status: 'in-progress',
          date: '2023-05-15',
          amount: 120
        },
        {
          id: '2',
          title: 'Lawn Maintenance',
          laborerName: 'Maria Garcia',
          status: 'requested',
          date: '2023-05-20',
          amount: 80
        }
      ]);
      
      setCompletedJobs([
        {
          id: '3',
          title: 'Furniture Assembly',
          laborerName: 'David Chen',
          status: 'completed',
          date: '2023-05-01',
          amount: 150
        },
        {
          id: '4',
          title: 'TV Mounting',
          laborerName: 'James Wilson',
          status: 'completed',
          date: '2023-04-22',
          amount: 90
        }
      ]);
      
      setTotalSpent(240); // Sum of completed jobs
    }
  }, [loading, ongoingJobs.length, completedJobs.length]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Welcome, {profile?.fullName || 'Client'}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="hover-card">
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ongoing Jobs</p>
                <h3 className="text-2xl font-bold">{ongoingJobs.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-green-100 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Jobs</p>
                <h3 className="text-2xl font-bold">{completedJobs.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-amber-100 rounded-full mr-4">
                <Search className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Laborers</p>
                <h3 className="text-2xl font-bold">50+</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-emerald-100 rounded-full mr-4">
                <CreditCard className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <h3 className="text-2xl font-bold">${totalSpent}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Find Laborers CTA */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-blue-400 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold mb-2">Need help with a task?</h2>
                <p>Find skilled laborers in your area for your everyday tasks.</p>
              </div>
              <Button variant="secondary" size="lg" className="hover-scale" asChild>
                <Link to="/client-dashboard/find-laborers">Find Laborers Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Ongoing Jobs */}
        <Card className="mb-8 hover-card">
          <CardHeader>
            <CardTitle>Ongoing Jobs</CardTitle>
            <CardDescription>Jobs that are currently in progress or awaiting laborer acceptance</CardDescription>
          </CardHeader>
          <CardContent>
            {ongoingJobs.length > 0 ? (
              <div className="space-y-4">
                {ongoingJobs.map(job => (
                  <div key={job.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-500">
                          Laborer: {job.laborerName} | Date: {job.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        job.status === 'in-progress' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {job.status === 'in-progress' ? 'In Progress' : 'Requested'}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No ongoing jobs at this time.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Laborers */}
        <Card className="hover-card">
          <CardHeader>
            <CardTitle>Recommended Laborers</CardTitle>
            <CardDescription>Skilled workers available in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentLaborers.map(laborer => (
                <div key={laborer.id} className="border rounded-md overflow-hidden hover-card">
                  <div className="p-4">
                    <h4 className="font-medium">{laborer.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2 mb-3">
                      {laborer.skills.map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">${laborer.hourlyRate}/hour</p>
                    <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" className="text-primary" asChild>
                <Link to="/client-dashboard/find-laborers">View All Available Laborers</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
