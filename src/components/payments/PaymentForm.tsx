
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, Lock, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  jobId: string;
  amount: number;
  laborerId: string;
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PaymentForm = ({
  jobId,
  amount,
  laborerId,
  clientId,
  onSuccess,
  onCancel
}: PaymentFormProps) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Mock payment info - in a real app, you'd use Stripe or another payment processor
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  // For simplicity in this demo, we're just simulating a payment
  // In a real app, you would integrate with Stripe or another payment processor
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || currentUser.id !== clientId) {
      toast({
        variant: "destructive",
        title: "Unauthorized",
        description: "Only the client who posted this job can make a payment.",
      });
      return;
    }
    
    // Validate form
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all payment details.",
      });
      return;
    }
    
    try {
      setProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update job_assignments table to mark payment as complete
      const { error } = await supabase
        .from('job_assignments')
        .update({
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('job_id', jobId)
        .eq('laborer_id', laborerId)
        .eq('client_id', clientId);
        
      if (error) throw error;
      
      setSuccess(true);
      toast({
        title: "Payment successful",
        description: `You have successfully paid $${amount.toFixed(2)} for this job.`,
      });
      
      // Wait a moment before calling onSuccess
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message,
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format card expiry as MM/YY
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  if (success) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <div className="text-center">
            <h3 className="text-lg font-medium">Payment Successful!</h3>
            <p className="text-gray-500">Your payment of ${amount.toFixed(2)} has been processed.</p>
          </div>
          <Button onClick={() => navigate('/client-dashboard')}>
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Pay securely for the services provided
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <span className="text-gray-500 mr-1">$</span>
              <span className="font-medium">{amount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Name on Card</Label>
            <Input
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              disabled={processing}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                disabled={processing}
                required
              />
              <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Expiry Date</Label>
              <Input
                id="cardExpiry"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                disabled={processing}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardCvc">CVC</Label>
              <div className="relative">
                <Input
                  id="cardCvc"
                  value={cardCvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 3) setCardCvc(value);
                  }}
                  placeholder="123"
                  maxLength={3}
                  disabled={processing}
                  required
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
            <Lock className="h-4 w-4 mr-1" /> Your payment information is secured
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
