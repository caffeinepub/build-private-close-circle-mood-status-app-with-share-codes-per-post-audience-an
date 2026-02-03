import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import {
  PREDEFINED_CONTEXT_TAGS,
  CONTEXT_TAG_SOFT_LIMIT,
} from '@/constants/contextTags';
import { validateCustomTag } from '@/utils/contextTags';

interface ContextTagsPickerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function ContextTagsPicker({
  selectedTags,
  onTagsChange,
}: ContextTagsPickerProps) {
  const [customTagInput, setCustomTagInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleTogglePredefinedTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const validation = validateCustomTag(customTagInput, selectedTags);

    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid tag');
      return;
    }

    const trimmed = customTagInput.trim();
    onTagsChange([...selectedTags, trimmed]);
    setCustomTagInput('');
    setValidationError(null);
  };

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const exceedsSoftLimit = selectedTags.length > CONTEXT_TAG_SOFT_LIMIT;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Add context (optional)
        </Label>
        <p className="text-xs text-muted-foreground">
          Add tags to give meaning to your mood without writing text
        </p>
      </div>

      {/* Predefined tags */}
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_CONTEXT_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Button
              key={tag}
              type="button"
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTogglePredefinedTag(tag)}
              className="h-8 text-xs"
            >
              {tag}
            </Button>
          );
        })}
      </div>

      {/* Custom tag input */}
      <div className="space-y-2">
        <Label htmlFor="custom-tag" className="text-xs text-muted-foreground">
          Or add your own
        </Label>
        <div className="flex gap-2">
          <Input
            id="custom-tag"
            type="text"
            placeholder="Type a custom tag..."
            value={customTagInput}
            onChange={(e) => {
              setCustomTagInput(e.target.value);
              setValidationError(null);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddCustomTag}
            disabled={!customTagInput.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {validationError && (
          <p className="text-xs text-destructive">{validationError}</p>
        )}
      </div>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Selected ({selectedTags.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="pl-2.5 pr-1.5 py-1 gap-1"
              >
                <span className="text-xs">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Soft limit message */}
      {exceedsSoftLimit && (
        <p className="text-xs text-muted-foreground/80">
          We recommend keeping it to {CONTEXT_TAG_SOFT_LIMIT} tags for clarity, but you can add more if needed.
        </p>
      )}
    </div>
  );
}
