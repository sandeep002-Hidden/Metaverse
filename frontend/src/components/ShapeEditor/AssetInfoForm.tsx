import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ShapeInfo {
  AssetName: string;
  AssetStatus: string;
  AssetCategory: string[];
}

interface AssetInfoFormProps {
  shapeInfo: ShapeInfo;
  onInfoChange: (field: string, value: string | string[]) => void;
  className?: string;
}

export function AssetInfoForm({ shapeInfo, onInfoChange, className }: AssetInfoFormProps) {
  const [categoryInput, setCategoryInput] = useState("");

  useEffect(() => {
    setCategoryInput(shapeInfo.AssetCategory.join(", "));
  }, [shapeInfo.AssetCategory]);

  const handleCategoryBlur = () => {
    const categories = categoryInput.split(",").map((cat) => cat.trim()).filter(Boolean);
    onInfoChange("AssetCategory", categories);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-3", className)}>
      <div>
        <Label htmlFor="assetName" className="mb-1 block">Asset Name</Label>
        <Input
          id="assetName"
          placeholder="Enter asset name"
          value={shapeInfo.AssetName}
          onChange={(e) => onInfoChange("AssetName", e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="assetStatus" className="mb-1 block">Status</Label>
        <Select 
          value={shapeInfo.AssetStatus} 
          onValueChange={(value:any) => onInfoChange("AssetStatus", value)}
        >
          <SelectTrigger id="assetStatus">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Review">Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="assetCategories" className="mb-1 block">Categories</Label>
        <Input
          id="assetCategories"
          placeholder="Enter categories (comma-separated)"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onBlur={handleCategoryBlur}
        />
      </div>
    </div>
  );
}