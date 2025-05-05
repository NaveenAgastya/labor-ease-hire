import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LaborerSidebar from '@/components/dashboard/LaborerSidebar';
import { Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';

interface LaborerProfile {
  fullName: string;
  hourlyRate: number;
  verified: boolean;
  profileImageUrl: string | null;
  skills: string[];
}

interface Job {
  id: string;
  title: string;
  clientName: string;
  status: string;
  date: string;
  amount: number;
}

const LaborerDashboard = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<LaborerProfile | null>(null);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [jobRequests, setJobRequests] = useState<Job[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          // Fetch laborer profile and details
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, id')
            .eq('id', currentUser.id)
            .single();
            
          const { data: laborerData, error: laborerError } = await supabase
            .from('laborer_details')
            .select('hourly_rate, verification_status, skills')
            .eq('id', currentUser.id)
            .single();
            
          if (profileData && laborerData) {
            setProfile({
              fullName: profileData.full_name || '',
              hourlyRate: laborerData.hourly_rate || 0,
              verified: laborerData.verification_status === 'verified',
              profileImageUrl: null,
              skills: laborerData.skills || []
            });
          }
          
          if (profileError || laborerError) {
            throw profileError || laborerError;
          }

          // Fetch job assignments where laborer is assigned
          const { data: pendingData, error: pendingError } = await supabase
            .from('job_assignments')
            .select('*, jobs(*)')
            .eq('laborer_id', currentUser.id)
            .eq('status', 'in_progress');
            
          if (pendingData) {
            setPendingJobs(pendingData.map(item => ({
              id: item.id,
              title: item.jobs?.title || '',
              clientName: 'Client', // Would need to join with profiles to get actual name
              status: item.status,
              date: item.start_date,
              amount: item.final_amount || 0
            })));
          }
          
          if (pendingError) {
            throw pendingError;
          }
          
          // Completed jobs
          const { data: completedData, error: completedError } = await supabase
            .from('job_assignments')
            .select('*, jobs(*)')
            .eq('laborer_id', currentUser.id)
            .eq('status', 'completed');
            
          if (completedData) {
            setCompletedJobs(completedData.map(item => ({
              id: item.id,
              title: item.jobs?.title || '',
              clientName: 'Client', // Would need to join with profiles to get actual name
              status: item.status,
              date: item.end_date,
              amount: item.final_amount || 0
            })));
            
            // Calculate total earnings
            const earnings = completedData.reduce((sum, job) => sum + (job.final_amount || 0), 0);
            setTotalEarnings(earnings);
          }
          
          if (completedError) {
            throw completedError;
          }
          
          // Job applications (requests)
          const { data: requestsData, error: requestsError } = await supabase
            .from('job_applications')
            .select('*, jobs(*)')
            .eq('laborer_id', currentUser.id)
            .eq('status', 'pending');
            
          if (requestsData) {
            setJobRequests(requestsData.map(item => ({
              id: item.id,
              title: item.jobs?.title || '',
              clientName: 'Client', // Would need to join with profiles to get actual name
              status: 'requested',
              date: item.created_at,
              amount: item.proposed_rate || 0
            })));
          }
          
          if (requestsError) {
            throw requestsError;
          }
          
        } catch (error) {
          console.error("Error fetching laborer data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  // For demo purposes, we'll show placeholder data if no data is found
  useEffect(() => {
    if (!loading && pendingJobs.length === 0 && completedJobs.length === 0 && jobRequests.length === 0) {
      // Add sample data for demonstration
      setPendingJobs([
        {
          id: '1',
          title: 'Furniture Assembly',
          clientName: 'John Smith',
          status: 'in-progress',
          date: '2023-05-15',
          amount: 120
        },
        {
          id: '2',
          title: 'Moving Heavy Items',
          clientName: 'Sarah Johnson',
          status: 'in-progress',
          date: '2023-05-20',
          amount: 180
        }
      ]);
      
      setCompletedJobs([
        {
          id: '3',
          title: 'Garden Cleanup',
          clientName: 'Michael Brown',
          status: 'completed',
          date: '2023-05-01',
          amount: 150
        },
        {
          id: '4',
          title: 'House Painting',
          clientName: 'Emma Wilson',
          status: 'completed',
          date: '2023-04-22',
          amount: 320
        }
      ]);
      
      setJobRequests([
        {
          id: '5',
          title: 'Bathroom Plumbing',
          clientName: 'Robert Davis',
          status: 'requested',
          date: '2023-05-25',
          amount: 200
        }
      ]);
      
      setTotalEarnings(470); // Sum of completed jobs
    }
  }, [loading, pendingJobs.length, completedJobs.length, jobRequests.length]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LaborerSidebar />
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Welcome, {profile?.fullName || 'Laborer'}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <Card className="hover-card">
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Jobs</p>
                <h3 className="text-2xl font-bold">{pendingJobs.length}</h3>
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
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Requests</p>
                <h3 className="text-2xl font-bold">{jobRequests.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-card">
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-emerald-100 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <h3 className="text-2xl font-bold">${totalEarnings}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card className="mb-8 hover-card">
          <CardHeader>
            <CardTitle>Recent Job Requests</CardTitle>
            <CardDescription>New opportunities that need your response</CardDescription>
          </CardHeader>
          <CardContent>
            {jobRequests.length > 0 ? (
              <div className="space-y-4">
                {jobRequests.map(job => (
                  <div key={job.id} className="p-4 border rounded-md flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-500">
                        Client: {job.clientName} | Date: {job.date}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-primary text-white rounded-md hover:bg-blue-600">
                        Accept
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No new job requests at this time.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Jobs */}
        <Card className="hover-card">
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
            <CardDescription>Your scheduled work for the next few days</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingJobs.length > 0 ? (
              <div className="space-y-4">
                {pendingJobs.map(job => (
                  <div key={job.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-500">
                          Client: {job.clientName} | Date: {job.date}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        In Progress
                      </span>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming jobs scheduled.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaborerDashboard;
