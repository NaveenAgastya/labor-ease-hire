import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const skillCategories = [
  'Construction',
  'Plumbing',
  'Electrical Work',
  'Carpentry',
  'Painting',
  'Moving & Packing',
  'Cleaning',
  'Landscaping & Gardening',
  'General Labor',
  'Other'
];

const LaborerProfileSetup = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Personal Info
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  // Professional Info
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // ID Verification
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [idProofPreview, setIdProofPreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdProofFile(file);
      setIdProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => 
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
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
    
    if (!idProofFile) {
      toast({
        variant: "destructive",
        title: "Missing ID proof",
        description: "Please upload your ID proof to continue.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Upload ID proof
      const idFileExt = idProofFile.name.split('.').pop();
      const idFilePath = `${currentUser.id}/id_proof_${Date.now()}.${idFileExt}`;
      
      const { error: idUploadError } = await supabase.storage
        .from('user_documents')
        .upload(idFilePath, idProofFile);
        
      if (idUploadError) {
        throw idUploadError;
      }
      
      // Upload profile image if provided
      let profileImagePath = null;
      if (profileImageFile) {
        const profileFileExt = profileImageFile.name.split('.').pop();
        const profileFilePath = `${currentUser.id}/profile_${Date.now()}.${profileFileExt}`;
        
        const { error: profileUploadError } = await supabase.storage
          .from('user_documents')
          .upload(profileFilePath, profileImageFile);
          
        if (profileUploadError) {
          throw profileUploadError;
        }
        
        profileImagePath = profileFilePath;
      }
      
      // Update profile in Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          address: `${address}, ${city}, ${state}, ${zipCode}`,
          bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);
      
      if (profileError) {
        throw profileError;
      }
      
      // Update laborer details in Supabase
      const { error: laborerError } = await supabase
        .from('laborer_details')
        .update({
          skills: selectedSkills,
          experience_years: experience === 'beginner' ? 0 : 
                           experience === 'intermediate' ? 2 :
                           experience === 'experienced' ? 4 : 6,
          hourly_rate: parseFloat(hourlyRate),
          id_proof_url: idFilePath
        })
        .eq('id', currentUser.id);
      
      if (laborerError) {
        throw laborerError;
      }
      
      toast({
        title: "Profile created successfully",
        description: "Your profile is now set up and pending verification.",
      });
      
      navigate("/laborer-dashboard");
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Laborer Profile Setup</h1>
        
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                1
              </div>
              <div className={`h-1 w-12 ${step > 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
              <div className={`h-1 w-12 ${step > 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                3
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-primary' : 'text-gray-500'}>Personal Info</span>
            <span className={step >= 2 ? 'text-primary' : 'text-gray-500'}>Professional Details</span>
            <span className={step >= 3 ? 'text-primary' : 'text-gray-500'}>Verification</span>
          </div>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Personal Information"}
              {step === 2 && "Professional Details"}
              {step === 3 && "ID Verification"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us a bit about yourself"}
              {step === 2 && "Share your skills and experience"}
              {step === 3 && "Upload your ID proof for verification"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
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
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell clients about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Select onValueChange={setExperience} defaultValue={experience}>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="1"
                      step="0.01"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {skillCategories.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`skill-${skill}`} 
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <Label htmlFor={`skill-${skill}`} className="font-normal">
                            {skill}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
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
                    <Label htmlFor="idProof">ID Proof (Required)</Label>
                    <Input
                      id="idProof"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdProofChange}
                      required
                      className="cursor-pointer"
                    />
                    {idProofPreview && (
                      <div className="mt-2">
                        {idProofFile?.type.includes('image') ? (
                          <img 
                            src={idProofPreview} 
                            alt="ID preview" 
                            className="max-w-[200px] max-h-[200px] border-2 border-gray-200" 
                          />
                        ) : (
                          <div className="p-4 border border-gray-200 rounded flex items-center">
                            <span>PDF Document Selected</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Please upload a clear photo or scan of a government-issued ID. 
                      We accept driver's license, passport, or state ID card.
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
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
                </div>
              )}
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Complete Registration"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LaborerProfileSetup;
