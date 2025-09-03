import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Filter as FilterIcon,
  X,
  Star,
  Clock,
  Users,
  DollarSign,
  BookOpen
} from "lucide-react";
import React, { useState } from "react";

const categories = [
  { id: "Web Development", label: "Web Development", count: 45 },
  { id: "Data Science", label: "Data Science", count: 32 },
  { id: "Mobile Development", label: "Mobile Development", count: 28 },
  { id: "UI/UX Design", label: "UI/UX Design", count: 24 },
  { id: "Machine Learning", label: "Machine Learning", count: 18 },
  { id: "DevOps", label: "DevOps", count: 15 },
  { id: "Cloud Computing", label: "Cloud Computing", count: 12 },
  { id: "Cybersecurity", label: "Cybersecurity", count: 10 },
  { id: "Blockchain", label: "Blockchain", count: 8 },
  { id: "Game Development", label: "Game Development", count: 6 }
];

const levels = [
  { id: "Beginner", label: "Beginner" },
  { id: "Intermediate", label: "Intermediate" },
  { id: "Advanced", label: "Advanced" },
  { id: "Expert", label: "Expert" }
];

const durations = [
  { id: "0-2", label: "0-2 hours" },
  { id: "2-5", label: "2-5 hours" },
  { id: "5-10", label: "5-10 hours" },
  { id: "10+", label: "10+ hours" }
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

      handleFilterChange({
        categories: newCategories,
        levels: selectedLevels,
        durations: selectedDurations,
        priceRange,
        sortByPrice,
        showFreeOnly,
        minRating
      });
      return newCategories;
    });
  };

  const handleLevelChange = (levelId) => {
    setSelectedLevels((prevLevels) => {
      const newLevels = prevLevels.includes(levelId)
        ? prevLevels.filter((id) => id !== levelId)
        : [...prevLevels, levelId];

      handleFilterChange({
        categories: selectedCategories,
        levels: newLevels,
        durations: selectedDurations,
        priceRange,
        sortByPrice,
        showFreeOnly,
        minRating
      });
      return newLevels;
    });
  };

  const handleDurationChange = (durationId) => {
    setSelectedDurations((prevDurations) => {
      const newDurations = prevDurations.includes(durationId)
        ? prevDurations.filter((id) => id !== durationId)
        : [...prevDurations, durationId];

      handleFilterChange({
        categories: selectedCategories,
        levels: selectedLevels,
        durations: newDurations,
        priceRange,
        sortByPrice,
        showFreeOnly,
        minRating
      });
      return newDurations;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange({
      categories: selectedCategories,
      levels: selectedLevels,
      durations: selectedDurations,
      priceRange,
      sortByPrice: selectedValue,
      showFreeOnly,
      minRating
    });
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
    handleFilterChange({
      categories: selectedCategories,
      levels: selectedLevels,
      durations: selectedDurations,
      priceRange: newRange,
      sortByPrice,
      showFreeOnly,
      minRating
    });
  };

  const handleFreeOnlyChange = (checked) => {
    setShowFreeOnly(checked);
    handleFilterChange({
      categories: selectedCategories,
      levels: selectedLevels,
      durations: selectedDurations,
      priceRange,
      sortByPrice,
      showFreeOnly: checked,
      minRating
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setPriceRange([0, 10000]);
    setSortByPrice("");
    setShowFreeOnly(false);
    setMinRating(0);
    handleFilterChange({
      categories: [],
      levels: [],
      durations: [],
      priceRange: [0, 10000],
      sortByPrice: "",
      showFreeOnly: false,
      minRating: 0
    });
  };

  const hasActiveFilters = selectedCategories.length > 0 ||
    selectedLevels.length > 0 ||
    selectedDurations.length > 0 ||
    sortByPrice ||
    showFreeOnly ||
    minRating > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FilterIcon size={20} />
              Filters
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X size={16} className="mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort Options */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Sort By</Label>
            <Select onValueChange={selectByPriceHandler} value={sortByPrice}>
              <SelectTrigger>
                <SelectValue placeholder="Choose sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort Options</SelectLabel>
                  <SelectItem value="">Relevance</SelectItem>
                  <SelectItem value="low">Price: Low to High</SelectItem>
                  <SelectItem value="high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Price Options */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <DollarSign size={16} />
              Price
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free-only"
                  checked={showFreeOnly}
                  onCheckedChange={handleFreeOnlyChange}
                />
                <Label htmlFor="free-only" className="text-sm">
                  Free courses only
                </Label>
              </div>

              {!showFreeOnly && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <BookOpen size={16} />
              Categories
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Course Level */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Users size={16} />
              Level
            </Label>
            <div className="space-y-2">
              {levels.map((level) => (
                <div key={level.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={level.id}
                    checked={selectedLevels.includes(level.id)}
                    onCheckedChange={() => handleLevelChange(level.id)}
                  />
                  <Label
                    htmlFor={level.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Duration */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Clock size={16} />
              Duration
            </Label>
            <div className="space-y-2">
              {durations.map((duration) => (
                <div key={duration.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={duration.id}
                    checked={selectedDurations.includes(duration.id)}
                    onCheckedChange={() => handleDurationChange(duration.id)}
                  />
                  <Label
                    htmlFor={duration.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {duration.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
              <Star size={16} />
              Minimum Rating
            </Label>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={minRating === rating}
                    onCheckedChange={(checked) => {
                      const newRating = checked ? rating : 0;
                      setMinRating(newRating);
                      handleFilterChange({
                        categories: selectedCategories,
                        levels: selectedLevels,
                        durations: selectedDurations,
                        priceRange,
                        sortByPrice,
                        showFreeOnly,
                        minRating: newRating
                      });
                    }}
                  />
                  <Label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1"
                  >
                    {Array.from({ length: rating }, (_, i) => (
                      <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                    ))}
                    <span>& up</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Filter;