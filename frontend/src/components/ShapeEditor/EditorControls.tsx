import { 
  Check, 
  Copy, 
  Delete, 
  Download, 
  FileJson, 
  Grid, 
  Group, 
  Loader2, 
  Redo, 
  Save, 
  Undo, 
  Ungroup, 
  Upload, 
  ZoomIn, 
  ZoomOut 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditorControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  zoomLevel: number;
  selectedShape: any;
  isUploading: boolean;
  hasObjects: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  onToggleGrid: (enabled: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
  onDownloadJson: () => void;
  onJsonUpload: () => void;
  onExport: (format: string) => void;
  onSave: () => void;
}

export function EditorControls({
  canUndo,
  canRedo,
  showGrid,
  zoomLevel,
  selectedShape,
  isUploading,
  hasObjects,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onGroup,
  onUngroup,
  onToggleGrid,
  onZoomIn,
  onZoomOut,
  onClear,
  onDownloadJson,
  onJsonUpload,
  onExport,
  onSave
}: EditorControlsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center justify-between gap-2 p-1 bg-card rounded-lg shadow-sm border">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("btn-tool", !canUndo && "opacity-50 cursor-not-allowed")}
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
              >
                <Undo className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("btn-tool", !canRedo && "opacity-50 cursor-not-allowed")}
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
              >
                <Redo className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>
          
          <div className="divider" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("btn-tool", !selectedShape && "opacity-50 cursor-not-allowed")}
                onClick={onDelete}
                disabled={!selectedShape}
                aria-label="Delete"
              >
                <Delete className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete (Del)</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("btn-tool", !selectedShape && "opacity-50 cursor-not-allowed")}
                onClick={onDuplicate}
                disabled={!selectedShape}
                aria-label="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Duplicate (Ctrl+D)</TooltipContent>
          </Tooltip>
          
          <div className="divider" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="btn-tool" onClick={onGroup} aria-label="Group">
                <Group className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Group Objects</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="btn-tool" onClick={onUngroup} aria-label="Ungroup">
                <Ungroup className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Ungroup Objects</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-md bg-secondary px-1">
            <button
              className="btn-tool"
              onClick={onZoomOut}
              disabled={zoomLevel <= 25}
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="px-2 text-xs font-medium">{zoomLevel}%</span>
            <button
              className="btn-tool"
              onClick={onZoomIn}
              disabled={zoomLevel >= 400}
              aria-label="Zoom In"
            >
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn("btn-tool", showGrid && "active")}
                onClick={() => onToggleGrid(!showGrid)}
                aria-label={showGrid ? "Hide Grid" : "Show Grid"}
              >
                <Grid className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {showGrid ? "Hide Grid" : "Show Grid"}
            </TooltipContent>
          </Tooltip>
          
          <div className="divider" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="btn-tool" onClick={onClear} aria-label="Clear Canvas">
                <Delete className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="btn-tool" onClick={onDownloadJson} aria-label="Save as JSON">
                <FileJson className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Save as JSON</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="btn-tool" onClick={onJsonUpload} aria-label="Load from JSON">
                <Upload className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Load from JSON</TooltipContent>
          </Tooltip>
          
          <div className="divider" />
          
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="btn-tool" aria-label="Export" onClick={() => onExport('png')}>
                  <Download className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block bg-popover border border-border rounded-md shadow-md z-10 w-24 py-1">
              <button className="w-full px-3 py-1 text-left text-sm hover:bg-accent" onClick={() => onExport('png')}>
                PNG
              </button>
              <button className="w-full px-3 py-1 text-left text-sm hover:bg-accent" onClick={() => onExport('jpg')}>
                JPG
              </button>
              <button className="w-full px-3 py-1 text-left text-sm hover:bg-accent" onClick={() => onExport('svg')}>
                SVG
              </button>
            </div>
          </div>
          
          <ThemeToggle />
          
          <div className="divider" />
          
          <Button
            className="rounded-md h-8 px-3 flex items-center gap-2"
            onClick={onSave}
            disabled={isUploading || !hasObjects}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}