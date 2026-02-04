import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { MOODS, MOOD_CATEGORIES, getMoodsByCategory } from '@/constants/moods';
import { getMoodColorClasses } from '@/utils/moodColors';
import type { Mood } from '@/backend';
import type { MoodOption } from '@/constants/moods';

interface MoodPickerProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
  autoFocus?: boolean;
}

export default function MoodPicker({ selectedMood, onSelectMood, autoFocus = false }: MoodPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [autoFocus]);

  const filteredMoods = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOODS;
    }
    const query = searchQuery.toLowerCase();
    return MOODS.filter((mood) => mood.label.toLowerCase().includes(query));
  }, [searchQuery]);

  const groupedMoods = useMemo(() => {
    const groups: Record<MoodOption['category'], MoodOption[]> = {
      positive: [],
      calm: [],
      'low-energy': [],
      stressed: [],
      neutral: [],
      other: [],
    };

    filteredMoods.forEach((mood) => {
      groups[mood.category].push(mood);
    });

    return groups;
  }, [filteredMoods]);

  const renderMoodButton = (mood: MoodOption) => {
    const isSelected = selectedMood === mood.value;
    const colorClasses = getMoodColorClasses(mood.category);
    
    return (
      <Button
        key={mood.value}
        type="button"
        variant="outline"
        className={`h-auto flex-col gap-1.5 py-3 px-2 transition-all ${
          isSelected
            ? `${colorClasses.border} ${colorClasses.bg} ${colorClasses.ring} ring-2 shadow-sm`
            : 'hover:border-primary/30'
        }`}
        onClick={() => onSelectMood(mood.value)}
      >
        <span className="text-2xl">{mood.emoji}</span>
        <span className={`text-xs font-medium leading-tight text-center ${isSelected ? colorClasses.text : ''}`}>
          {mood.label}
        </span>
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {(Object.keys(groupedMoods) as Array<MoodOption['category']>).map((category) => {
            const moodsInCategory = groupedMoods[category];
            if (moodsInCategory.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold">{MOOD_CATEGORIES[category].label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {MOOD_CATEGORIES[category].description}
                  </p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {moodsInCategory.map(renderMoodButton)}
                </div>
              </div>
            );
          })}

          {filteredMoods.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No moods found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
