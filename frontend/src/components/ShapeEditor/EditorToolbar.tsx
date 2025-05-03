import { 
  Circle, 
  Eclipse,
  Eraser, 
  Image, 

  MousePointer, 
  Pencil, 
  Minus,
  Star,
  Text, 
  Triangle ,
  RectangleHorizontal,
} from "lucide-react";
import { TbSpray } from "react-icons/tb";
import { BiPolygon } from "react-icons/bi";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ToolbarProps {
  selectedTool: string;
  onSelectTool: (tool: string) => void;
  onAddShape: (type: string) => void;
  onAddImage: () => void;
}

export function EditorToolbar({ selectedTool, onSelectTool, onAddShape, onAddImage }: ToolbarProps) {
  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "pencil", icon: Pencil, label: "Pencil" },
    { id: "spray", icon: TbSpray, label: "Spray" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const shapes = [
    { id: "rectangle", icon: RectangleHorizontal, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "ellipse", icon: Eclipse, label: "Ellipse" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "polygon", icon: BiPolygon , label: "Polygon" },
    { id: "star", icon: Star, label: "Star" },
    { id: "text", icon: Text, label: "Text" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center space-x-1 p-1 bg-card shadow-sm rounded-lg border">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "btn-tool",
                  selectedTool === tool.id && "active"
                )}
                onClick={() => onSelectTool(tool.id)}
                aria-label={tool.label}
              >
                <tool.icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="divider" />

        {shapes.map((shape) => (
          <Tooltip key={shape.id}>
            <TooltipTrigger asChild>
              <button
                className="btn-tool"
                onClick={() => onAddShape(shape.id)}
                aria-label={`Add ${shape.label}`}
              >
                <shape.icon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add {shape.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="divider" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="btn-tool" onClick={onAddImage} aria-label="Add Image">
              <Image className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Image</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
