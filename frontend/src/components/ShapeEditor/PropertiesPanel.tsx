import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Baseline,
  Layers,
  MoveDown,
  MoveUp,
  ArrowBigLeft,
  SendToBack,
  BringToFront,
  Forward,
  Volleyball,
  Pencil,
} from "lucide-react";
import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";
import { MdWaterDrop } from 'react-icons/md';
interface ShadowOptions {
  color: string;
  blur: number;
  offsetx: number;
  offsety: number;
}

interface PropertiesPanelProps {
  selectedShape: any;
  selectedColor: string;
  strokeColor: string;
  strokeWidth: number;
  opacity: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  shadowEnabled: boolean;
  shadowOptions: ShadowOptions;
  brushWidth: number;
  isDrawingMode: boolean;
  fontFamilies: string[];
  fontWeights: string[];
  onColorChange: (color: string) => void;
  onStrokeColorChange: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  onOpacityChange: (opacity: number) => void;
  onFontSizeChange: (size: number) => void;
  onFontFamilyChange: (family: string) => void;
  onFontWeightChange: (weight: string) => void;
  onBrushWidthChange: (width: number) => void;
  onShadowEnabledChange: (enabled: boolean) => void;
  onShadowOptionsChange: (options: Partial<ShadowOptions>) => void;
  onAlignObjects: (position: string) => void;
  onChangeObjectZOrder: (action: string) => void;
  onPatternUpload: () => void;
}

export function PropertiesPanel({
  selectedShape,
  selectedColor,
  strokeColor,
  strokeWidth,
  opacity,
  fontSize,
  fontFamily,
  fontWeight,
  shadowEnabled,
  shadowOptions,
  brushWidth,
  isDrawingMode,
  fontFamilies,
  fontWeights,
  onColorChange,
  onStrokeColorChange,
  onStrokeWidthChange,
  onOpacityChange,
  onFontSizeChange,
  onFontFamilyChange,
  onFontWeightChange,
  onBrushWidthChange,
  onShadowEnabledChange,
  onShadowOptionsChange,
  onAlignObjects,
  onChangeObjectZOrder,
  onPatternUpload,
}: PropertiesPanelProps) {
  // const [activeSection, setActiveSection] = useState<string>("fill");

  return (
    <div className="h-full overflow-auto p-3 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Properties</h3>

      <Accordion
        type="single"
        collapsible
        defaultValue="fill"
        className="w-full"
      >
        <AccordionItem value="fill">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <MdWaterDrop className="h-4 w-4" />
              <span>Fill & Stroke</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="fillColor">Fill Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="fillColor"
                    type="color"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-8 h-8 rounded overflow-hidden"
                  />
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="strokeColor">Stroke Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    id="strokeColor"
                    type="color"
                    value={strokeColor}
                    onChange={(e) => onStrokeColorChange(e.target.value)}
                    className="w-8 h-8 rounded overflow-hidden"
                  />
                  <input
                    type="text"
                    value={strokeColor}
                    onChange={(e) => onStrokeColorChange(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="strokeWidth">Stroke Width</Label>
                  <span className="text-sm text-muted-foreground">
                    {strokeWidth}px
                  </span>
                </div>
                <input
                  id="strokeWidth"
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={strokeWidth}
                  onChange={(e) =>
                    onStrokeWidthChange(parseInt(e.target.value))
                  }
                  className="slider-control"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="opacity">Opacity</Label>
                  <span className="text-sm text-muted-foreground">
                    {opacity}%
                  </span>
                </div>
                <input
                  id="opacity"
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => onOpacityChange(parseInt(e.target.value))}
                  className="slider-control"
                />
              </div>

              {selectedShape && (
                <button
                  onClick={onPatternUpload}
                  className="btn-action w-full mt-2"
                >
                  Upload Pattern
                </button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {isDrawingMode && (
          <AccordionItem value="brush">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                
                <span>Brush Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="brushWidth">Brush Size</Label>
                  <span className="text-sm text-muted-foreground">
                    {brushWidth}px
                  </span>
                </div>
                <input
                  id="brushWidth"
                  type="range"
                  min="1"
                  max="50"
                  value={brushWidth}
                  onChange={(e) => onBrushWidthChange(parseInt(e.target.value))}
                  className="slider-control"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {selectedShape && selectedShape.type === "i-text" && (
          <AccordionItem value="text">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Volleyball className="h-4 w-4" />
                <span>Text</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <input
                    id="fontSize"
                    type="number"
                    min="8"
                    max="120"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                    className="form-control"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <select
                    id="fontFamily"
                    value={fontFamily}
                    onChange={(e) => onFontFamilyChange(e.target.value)}
                    className="form-control"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontWeight">Font Weight</Label>
                  <select
                    id="fontWeight"
                    value={fontWeight}
                    onChange={(e) => onFontWeightChange(e.target.value)}
                    className="form-control"
                  >
                    {fontWeights.map((weight) => (
                      <option key={weight} value={weight}>
                        {weight}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="shadow">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2H2v10h10V2Z" />
                <path d="M22 12h-9.9V2.1" />
                <path d="M22 22H12V12" />
                <path d="M12 22V12H2" />
              </svg>
              <span>Shadow</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="shadowEnabled"
                  checked={shadowEnabled}
                  onChange={(e) => onShadowEnabledChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="shadowEnabled">Enable Shadow</Label>
              </div>

              {shadowEnabled && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="shadowColor">Shadow Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="shadowColor"
                        type="color"
                        value={shadowOptions.color}
                        onChange={(e) =>
                          onShadowOptionsChange({ color: e.target.value })
                        }
                        className="w-8 h-8 rounded overflow-hidden"
                      />
                      <input
                        type="text"
                        value={shadowOptions.color}
                        onChange={(e) =>
                          onShadowOptionsChange({ color: e.target.value })
                        }
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="shadowBlur">Blur</Label>
                      <span className="text-sm text-muted-foreground">
                        {shadowOptions.blur}px
                      </span>
                    </div>
                    <input
                      id="shadowBlur"
                      type="range"
                      min="0"
                      max="50"
                      value={shadowOptions.blur}
                      onChange={(e) =>
                        onShadowOptionsChange({
                          blur: parseInt(e.target.value),
                        })
                      }
                      className="slider-control"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="shadowOffsetX">Offset X</Label>
                      <span className="text-sm text-muted-foreground">
                        {shadowOptions.offsetx}px
                      </span>
                    </div>
                    <input
                      id="shadowOffsetX"
                      type="range"
                      min="-50"
                      max="50"
                      value={shadowOptions.offsetx}
                      onChange={(e) =>
                        onShadowOptionsChange({
                          offsetx: parseInt(e.target.value),
                        })
                      }
                      className="slider-control"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="shadowOffsetY">Offset Y</Label>
                      <span className="text-sm text-muted-foreground">
                        {shadowOptions.offsety}px
                      </span>
                    </div>
                    <input
                      id="shadowOffsetY"
                      type="range"
                      min="-50"
                      max="50"
                      value={shadowOptions.offsety}
                      onChange={(e) =>
                        onShadowOptionsChange({
                          offsety: parseInt(e.target.value),
                        })
                      }
                      className="slider-control"
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {selectedShape && (
          <AccordionItem value="alignment">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <AlignCenter className="h-4 w-4" />
                <span>Alignment</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  className="btn-tool"
                  onClick={() => onAlignObjects("left")}
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onAlignObjects("center")}
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onAlignObjects("right")}
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onAlignObjects("top")}
                  title="Align Top"
                >
                  <MoveUp className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onAlignObjects("middle")}
                  title="Align Middle"
                >
                  <Baseline className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onAlignObjects("bottom")}
                  title="Align Bottom"
                >
                  <MoveDown className="h-4 w-4" />
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {selectedShape && (
          <AccordionItem value="layers">
            <AccordionTrigger className="py-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Layers</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  className="btn-tool"
                  onClick={() => onChangeObjectZOrder("front")}
                  title="Bring to Front"
                >
                  <BringToFront className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onChangeObjectZOrder("forward")}
                  title="Bring Forward"
                >
                  <Forward className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onChangeObjectZOrder("backward")}
                  title="Send Backward"
                >
                  <ArrowBigLeft className="h-4 w-4" />
                </button>
                <button
                  className="btn-tool"
                  onClick={() => onChangeObjectZOrder("back")}
                  title="Send to Back"
                >
                  <SendToBack className="h-4 w-4" />
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
