
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentForm from '@/components/payments/PaymentForm';

interface JobAssignment {
  id: string;
  job_id: string;
  laborer_id: string;
  client_id: string;
  final_amount: number;
  payment_status: string;
  job?: {
    title: string;
  };
  laborer?: {
    full_name: string;
  };
}

const JobPayment = () => {
  const { id: assignmentId } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<JobAssignment | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  useEffect(() => {
    const fetchJobAssignment = async () => {
      if (!assignmentId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('job_assignments')
          .select(`
            *,
            job:job_id (
              title
            ),
            laborer:laborer_id (
              full_name
            )
          `)
          .eq('id', assignmentId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Ensure laborer data is in the correct format
          const formattedData: JobAssignment = {
            ...data,
            job: data.job,
            laborer: data.laborer && typeof data.laborer === 'object' ? 
              data.laborer as { full_name: string } : 
              { full_name: 'Unknown Laborer' }
          };
          
          setAssignment(formattedData);
        }
      } catch (error: any) {
        console.error('Error fetching job assignment:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobAssignment();
  }, [assignmentId, toast]);
  
  // Check if the current user is authorized to make the payment
  const isAuthorized = currentUser && assignment && currentUser.id === assignment.client_id;
  const isPaid = assignment && assignment.payment_status === 'completed';
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!assignment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Job Assignment Not Found</h2>
              <p className="text-gray-500 mb-4">The job assignment you are looking for does not exist or has been removed.</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Unauthorized</h2>
              <p className="text-gray-500 mb-4">Only the client who posted this job can make a payment.</p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (isPaid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Payment Already Complete</h2>
              <p className="text-gray-500 mb-4">
                You have already made a payment for this job assignment.
              </p>
              <Button onClick={() => navigate('/client-dashboard')}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        {showPaymentForm ? (
          <PaymentForm
            jobId={assignment?.job_id || ''}
            amount={assignment?.final_amount || 0}
            laborerId={assignment?.laborer_id || ''}
            clientId={assignment?.client_id || ''}
            onSuccess={() => navigate('/client-dashboard')}
            onCancel={() => setShowPaymentForm(false)}
          />
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold">Payment Required</h2>
                <p className="text-gray-500">
                  Complete your payment for the services provided
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Job</p>
                  <p className="font-medium">{assignment.job?.title}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Service Provider</p>
                  <p className="font-medium">{assignment.laborer?.full_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Amount Due</p>
                  <p className="text-2xl font-bold">${assignment.final_amount?.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setShowPaymentForm(true)} className="flex-1">
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobPayment;
