
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeRecord } from '@/hooks/useRealtimeUpdates';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, DollarSign } from 'lucide-react';

interface JobDetail {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  status: string;
  created_at: string;
  client: {
    id: string;
    full_name: string;
    phone?: string;
  };
  laborerAssigned?: {
    id: string;
    full_name: string;
  } | null;
  skills?: string[];
}

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, userType } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [proposedRate, setProposedRate] = useState<number>(0);
  
  // Use the realtime hook to get updates when the job changes
  const { data: realtimeJob } = useRealtimeRecord<JobDetail | null>(
    'jobs',
    'id',
    id || '',
    'UPDATE',
    job
  );

  // Merge realtime data with state data when it updates
  useEffect(() => {
    if (realtimeJob) {
      setJob(current => ({...current, ...realtimeJob}));
    }
  }, [realtimeJob]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select(`
            *,
            client:client_id (
              id,
              full_name,
              phone
            )
          `)
          .eq('id', id)
          .single();
          
        if (jobError) throw jobError;
        
        // Check if a laborer is assigned
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('job_assignments')
          .select(`
            laborer_id,
            laborer:laborer_id (
              id,
              full_name
            )
          `)
          .eq('job_id', id)
          .maybeSingle();
          
        // Handle potential error from assignment query
        if (assignmentError) {
          console.error('Error fetching assignment data:', assignmentError);
        }
          
        // Check if the current user has applied for this job
        if (currentUser && userType === 'laborer') {
          const { data: applicationData } = await supabase
            .from('job_applications')
            .select('*')
            .eq('job_id', id)
            .eq('laborer_id', currentUser.id);
            
          setHasApplied(applicationData && applicationData.length > 0);
          
          if (applicationData && applicationData.length > 0) {
            setProposedRate(applicationData[0].proposed_rate || jobData.budget);
          } else {
            setProposedRate(jobData.budget);
          }
        }

        // Ensure we're safely handling the laborer data
        let laborerAssigned = null;
        if (assignmentData && assignmentData.laborer) {
          // Using non-null assertion after checking for null
          const laborer = assignmentData.laborer;
          if (laborer) {
            // Double-check type and required properties
            if (typeof laborer === 'object' && 'id' in laborer && 'full_name' in laborer) {
              laborerAssigned = {
                id: String(laborer.id),
                full_name: String(laborer.full_name)
              };
            }
          }
        }
        
        // Make sure client data is properly formed before setting the job state
        if (jobData) {
          // Create a default client object structure
          const clientData = {
            id: 'unknown',
            full_name: 'Unknown Client',
            phone: undefined as string | undefined
          };
          
          // Update with actual client data if it exists
          if (jobData.client && typeof jobData.client === 'object') {
            const client = jobData.client;
            
            // Safe access to client properties with fallbacks
            if (client && typeof client === 'object') {
              clientData.id = (client && 'id' in client && client.id) ? String(client.id) : 'unknown';
              clientData.full_name = (client && 'full_name' in client && client.full_name) 
                ? String(client.full_name) 
                : 'Unknown Client';
              
              if (client && 'phone' in client && client.phone) {
                clientData.phone = String(client.phone);
              }
            }
          }
          
          // Set the job state with validated data
          setJob({
            ...jobData,
            client: clientData,
            laborerAssigned
          });
        }
        
      } catch (error: any) {
        console.error('Error fetching job details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id, currentUser, userType, toast]);
  
  const handleApply = async () => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please login as a laborer to apply for jobs.",
      });
      navigate('/login');
      return;
    }
    
    if (userType !== 'laborer') {
      toast({
        variant: "destructive",
        title: "Not authorized",
        description: "Only laborers can apply for jobs.",
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      // Check if the user has already applied
      if (hasApplied) {
        toast({
          variant: "default",
          title: "Already applied",
          description: "You have already applied for this job.",
        });
        return;
      }
      
      // Create a job application
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: id,
          laborer_id: currentUser.id,
          proposed_rate: proposedRate,
          status: 'pending',
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setHasApplied(true);
      toast({
        title: "Application submitted",
        description: "Your job application has been submitted successfully.",
      });
      
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast({
        variant: "destructive",
        title: "Application failed",
        description: error.message,
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>
              The job you are looking for does not exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{job?.title}</CardTitle>
              <CardDescription>
                Posted {job ? new Date(job.created_at).toLocaleDateString() : ''}
              </CardDescription>
            </div>
            <Badge variant={job?.status === 'open' ? 'secondary' : 'outline'}>
              {job?.status === 'open' ? 'Open' : job?.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{job?.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Budget</div>
                <div className="font-medium">${job?.budget} per hour</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">{job?.location}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Client</div>
                <div className="font-medium">{job?.client.full_name}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium capitalize">
                  {job?.laborerAssigned ? 'Assigned' : job?.status}
                </div>
              </div>
            </div>
          </div>
          
          {job?.skills && job.skills.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {job?.laborerAssigned && (
            <div>
              <h3 className="font-medium mb-2">Assigned To</h3>
              <div className="flex items-center p-3 bg-gray-50 rounded-md">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {job.laborerAssigned.full_name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="font-medium">{job.laborerAssigned.full_name}</div>
                  <div className="text-sm text-gray-500">Laborer</div>
                </div>
              </div>
            </div>
          )}
          
          {userType === 'laborer' && job?.status === 'open' && !job.laborerAssigned && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Apply for this job</h3>
                {hasApplied && (
                  <Badge variant="outline" className="text-green-600 bg-green-50">
                    You have applied
                  </Badge>
                )}
              </div>
              
              {!hasApplied ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="proposedRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Proposed Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      id="proposedRate"
                      value={proposedRate}
                      onChange={(e) => setProposedRate(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min={0}
                      step={0.01}
                    />
                  </div>
                  <Button 
                    onClick={handleApply} 
                    className="w-full" 
                    disabled={isApplying}
                  >
                    {isApplying ? "Applying..." : "Apply Now"}
                  </Button>
                </div>
              ) : (
                <p className="text-gray-600">
                  Your application has been submitted with a proposed rate of ${proposedRate} per hour.
                </p>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          
          {userType === 'client' && job?.client.id === currentUser?.id && (
            <Button variant="destructive" onClick={() => {/* Handle close job */}}>
              Close Job
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobDetails;
