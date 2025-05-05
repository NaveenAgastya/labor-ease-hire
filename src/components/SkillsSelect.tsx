
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface SkillsSelectProps {
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  suggestedSkills?: string[];
  placeholder?: string;
  maxSkills?: number;
  label?: string;
}

const DEFAULT_SKILLS = [
  'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Cleaning',
  'Moving', 'Assembly', 'Landscaping', 'Demolition', 'Drywall',
  'Roofing', 'Flooring', 'General Labor'
];

const SkillsSelect = ({
  selectedSkills,
  onChange,
  suggestedSkills = DEFAULT_SKILLS,
  placeholder = 'Add skills...',
  maxSkills = 10,
  label = 'Skills'
}: SkillsSelectProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue) {
      const filtered = suggestedSkills.filter(
        skill => skill.toLowerCase().includes(inputValue.toLowerCase()) && 
                !selectedSkills.includes(skill)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestedSkills, selectedSkills]);
  
  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    
    if (
      trimmedSkill && 
      !selectedSkills.includes(trimmedSkill) && 
      selectedSkills.length < maxSkills
    ) {
      onChange([...selectedSkills, trimmedSkill]);
    }
    
    setInputValue('');
    setShowSuggestions(false);
  };
  
  const removeSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      
      // If we have a matching suggestion, use that
      const exactMatch = filteredSuggestions.find(
        skill => skill.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (exactMatch) {
        addSkill(exactMatch);
      } else {
        addSkill(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedSkills.length > 0) {
      // Remove the last skill when backspace is pressed with empty input
      removeSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white min-h-[42px]">
          {selectedSkills.map(skill => (
            <Badge 
              key={skill}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Input
            type="text"
            className="flex-grow min-w-[100px] border-none shadow-none focus-visible:ring-0 p-0 h-auto"
            placeholder={selectedSkills.length ? '' : placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {filteredSuggestions.map(skill => (
                <li
                  key={skill}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {selectedSkills.length > 0 && (
        <p className="text-xs text-gray-500">
          {selectedSkills.length} of {maxSkills} skills selected
        </p>
      )}
    </div>
  );
};

export default SkillsSelect;
