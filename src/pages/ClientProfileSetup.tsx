
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ClientProfileSetup = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  
  // Client info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('email');
  
  // Profile image
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to complete your profile.",
      });
      navigate("/login");
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload profile image if provided
      let profileImageUrl = null;
      if (profileImageFile) {
        const fileExt = profileImageFile.name.split('.').pop();
        const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('user_documents')
          .upload(filePath, profileImageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        profileImageUrl = filePath;
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          address: `${address}, ${city}, ${state}, ${zipCode}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile created successfully",
        description: "Your client profile is now set up.",
      });
      
      navigate("/client-dashboard");
    } catch (error: any) {
      console.error("Error setting up profile:", error);
      toast({
        variant: "destructive",
        title: "Failed to create profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Client Profile</h1>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Tell us a bit about yourself so we can connect you with the right laborers
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Picture (Optional)</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="cursor-pointer"
                />
                {profileImagePreview && (
                  <div className="mt-2">
                    <img 
                      src={profileImagePreview} 
                      alt="Profile preview" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
                <Select onValueChange={setPreferredContactMethod} defaultValue={preferredContactMethod}>
                  <SelectTrigger id="preferredContactMethod">
                    <SelectValue placeholder="Select your preferred contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" required />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I confirm that all information provided is accurate, and I agree to the{" "}
                      <a href="/terms" className="text-primary underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary underline">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          
          <CardFooter>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Completing Profile..." : "Complete Profile"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ClientProfileSetup;
