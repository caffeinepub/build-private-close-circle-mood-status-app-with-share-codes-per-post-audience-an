import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateAge } from '@/utils/age';
import type { Principal } from '@dfinity/principal';
import type { UserProfile } from '@/backend';

type AudienceOption = 'wholeCircle' | 'specificPeople' | 'safePeople' | 'justMe';

interface AudienceSelectorProps {
  selectedOption: AudienceOption;
  onOptionChange: (option: AudienceOption) => void;
  selectedPeople: Set<string>;
  onPeopleChange: (people: Set<string>) => void;
  circleMembers: Principal[];
  profiles: Record<string, UserProfile>;
  safePeopleCount: number;
  isLoadingMembers: boolean;
  currentUserPrincipal?: string;
}

export default function AudienceSelector({
  selectedOption,
  onOptionChange,
  selectedPeople,
  onPeopleChange,
  circleMembers,
  profiles,
  safePeopleCount,
  isLoadingMembers,
  currentUserPrincipal,
}: AudienceSelectorProps) {
  // Filter out the current user from selectable members
  const selectableMembers = circleMembers.filter(
    (member) => member.toString() !== currentUserPrincipal
  );

  const handlePersonToggle = (principalStr: string) => {
    const newSet = new Set(selectedPeople);
    if (newSet.has(principalStr)) {
      newSet.delete(principalStr);
    } else {
      newSet.add(principalStr);
    }
    onPeopleChange(newSet);
  };

  return (
    <div className="space-y-4">
      <Label>Choose audience</Label>
      
      <RadioGroup value={selectedOption} onValueChange={(value) => onOptionChange(value as AudienceOption)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wholeCircle" id="wholeCircle" />
            <Label htmlFor="wholeCircle" className="font-normal cursor-pointer">
              Whole circle
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specificPeople" id="specificPeople" />
            <Label htmlFor="specificPeople" className="font-normal cursor-pointer">
              Specific people
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="safePeople" id="safePeople" />
            <Label htmlFor="safePeople" className="font-normal cursor-pointer">
              Only Safe People
              {safePeopleCount > 0 && (
                <span className="text-xs text-muted-foreground ml-1">({safePeopleCount})</span>
              )}
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="justMe" id="justMe" />
            <Label htmlFor="justMe" className="font-normal cursor-pointer">
              Just me (private)
            </Label>
          </div>
        </div>
      </RadioGroup>

      {selectedOption === 'specificPeople' && (
        <div className="mt-4 space-y-2">
          {isLoadingMembers ? (
            <div className="py-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : selectableMembers.length === 0 ? (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No circle members yet — switch to "Just me (private)" to post
            </div>
          ) : (
            <div className="space-y-2 rounded-lg border p-4 max-h-64 overflow-y-auto">
              {selectableMembers.map((member) => {
                const principalStr = member.toString();
                const profile = profiles[principalStr];
                const displayName = profile?.name || `User ${principalStr.slice(0, 8)}...`;
                const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;
                const showAge = profile?.showAge && age !== null;

                return (
                  <div key={principalStr} className="flex items-center space-x-2">
                    <Checkbox
                      id={`person-${principalStr}`}
                      checked={selectedPeople.has(principalStr)}
                      onCheckedChange={() => handlePersonToggle(principalStr)}
                    />
                    <label
                      htmlFor={`person-${principalStr}`}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        {displayName}
                        {showAge && <span className="text-xs text-muted-foreground font-normal">• {age}</span>}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Select who can see this post
          </p>
        </div>
      )}

      {selectedOption === 'safePeople' && safePeopleCount === 0 && (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No Safe People set yet — this will be private until you add Safe People
        </div>
      )}
    </div>
  );
}
