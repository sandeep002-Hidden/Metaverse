import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import { AssetInfoForm } from "./AssetInfoForm";
import { EditorToolbar } from "./EditorToolbar";
import { EditorControls } from "./EditorControls";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog"; // Fixed dialog imports
import { AlertTriangle, FileImage, Palette } from "lucide-react";
import { PropertiesPanel } from "./PropertiesPanel";
import { cn } from "@/lib/utils";
import axios from "axios";

interface ShadowOptions {
  color: string;
  blur: number;
  offsetx: number;
  offsety: number;
}

interface ShapeInfo {
  AssetName: string;
  AssetStatus: string;
  AssetCategory: string[];
}

export interface CanvasObject {
  id: string;
  files?: File[];
  properties: {
    type: string;
    left: number;
    top: number;
    width: number;
    height: number;
    radius?: number;
    fill:
      | string
      | {
          type: string;
          fileName: string;
          repeat: string;
          scaleX: number;
          scaleY: number;
        };
    stroke?: string;
    strokeWidth?: number;
    path?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    scaleX?: number;
    scaleY?: number;
    angle?: number;
    opacity?: number;
    shadow?: {
      color: string;
      blur: number;
      offsetx: number;
      offsety: number;
    };
  };
}

const ShapeEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [brushWidth, setBrushWidth] = useState(5);
  const [selectedShape, setSelectedShape] = useState<fabric.Object | null>(
    null
  );
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);

  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [canvasObjects, setCanvasObjects] = useState<CanvasObject[]>([]);
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowOptions, setShadowOptions] = useState<ShadowOptions>({
    color: "#000000",
    blur: 10,
    offsetx: 5,
    offsety: 5,
  });
  const [shapeInfo, setShapeInfo] = useState<ShapeInfo>({
    AssetName: "",
    AssetStatus: "",
    AssetCategory: [],
  });
  const [opacity, setOpacity] = useState(100);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmClearDialog, setShowConfirmClearDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Available font families
  const fontFamilies = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Impact",
  ];

  const fontWeights = ["normal", "bold", "300", "500", "700", "900"];

  useEffect(() => {
    const assetDetails = localStorage.getItem("AssetDetails");
    if (assetDetails) {
      setShapeInfo(JSON.parse(assetDetails));
    }
  }, []);



  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [_error, setError] = useState<string | null>(null);

  // Initialize canvas and event handlers
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#ffffff",
      isDrawingMode: false,
    });

    fabricRef.current = canvas;

    // Set up grid
    createGrid(canvas);

    // Function to resize canvas and scale objects
    const resizeCanvas = () => {
      const containerWidth =
        window.innerWidth > 800 ? 800 : window.innerWidth - 40;
      const containerHeight = 600; // You can adjust this as needed

      const scaleX = containerWidth / canvas.getWidth();
      const scaleY = containerHeight / canvas.getHeight();

      // Scale all objects on the canvas
      canvas.getObjects().forEach((obj) => {
        obj.scaleX = (obj.scaleX || 1) * scaleX;
        obj.scaleY = (obj.scaleY || 1) * scaleY;
        obj.left = (obj.left || 0) * scaleX;
        obj.top = (obj.top || 0) * scaleY;
        obj.setCoords();
      });

      // Resize the canvas
      canvas.setWidth(containerWidth);
      canvas.setHeight(containerHeight);
      canvas.renderAll();
      canvas.calcOffset();
    };

    // Initial resize
    resizeCanvas();

    // Add event listener for window resize
    window.addEventListener("resize", resizeCanvas);

    // Initialize the pencil brush
    if (canvas.freeDrawingBrush instanceof fabric.PencilBrush) {
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }

    // Event handlers for selection
    canvas.on("selection:created", (e) => {
      const selected = e.selected?.[0];
      setSelectedShape(selected || null);
      updateControlsFromSelectedObject(selected);
    });

    canvas.on("selection:updated", (e) => {
      const selected = e.selected?.[0];
      setSelectedShape(selected || null);
      updateControlsFromSelectedObject(selected);
    });

    canvas.on("selection:cleared", () => {
      setSelectedShape(null);
      resetControls();
    });

    // Make object editable after being added to canvas
    canvas.on("object:added", (e) => {
      const obj = e.target;
      if (obj) {
        obj.set({
          hasControls: true,
          hasBorders: true,
          selectable: true,
        });

        // Special settings for text objects
        if (obj.type === "i-text" || obj.type === "text") {
          (obj as fabric.IText).set({
            editable: true,
          });
        }

        canvas.renderAll();
        addToHistory();
      }
    });

    // Update canvas state after modifications
    canvas.on("object:modified", () => {
      updateCanvasState();
      addToHistory();
    });

    canvas.on("path:created", () => {
      addToHistory();
    });

    // Add initial state to history
    setTimeout(() => {
      addToHistory();
    }, 100);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.dispose();
    };
  }, []);

  // Add event listener for keyboard events
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedShape]); // Add dependency on selectedShape

  // Memoize handlers to prevent unnecessary re-renders
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!fabricRef.current) return;

      if (e.key === "Delete" && selectedShape) {
        e.preventDefault();
        deleteSelectedObject();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "c" &&
        selectedShape
      ) {
        e.preventDefault();
        copySelectedObject();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteObject();
      }
    },
    [selectedShape]
  );

  // Reset controls to default when no object is selected
  const resetControls = () => {
    setStrokeWidth(1);
    setOpacity(100);
    setFontSize(20);
    setFontFamily("Arial");
    setFontWeight("normal");
    setShadowEnabled(false);
  };

  // Update controls UI with the selected object's properties
  const updateControlsFromSelectedObject = useCallback(
    (obj: fabric.Object | undefined) => {
      if (!obj) return;

      const fill = obj.fill;
      if (typeof fill === "string") {
        setSelectedColor(fill || "#000000");
      }
      setStrokeColor((obj.stroke as string) || "#000000");
      setStrokeWidth(obj.strokeWidth || 1);
      setOpacity(
        typeof obj.opacity === "number" ? Math.round(obj.opacity * 100) : 100
      );

      if (obj.type === "i-text" || obj.type === "text") {
        const textObj = obj as fabric.IText;
        setFontSize(
          typeof textObj.fontSize === "number" ? textObj.fontSize : 20
        );
        setFontFamily(textObj.fontFamily || "Arial");
        setFontWeight(textObj.fontWeight?.toString() || "normal");
      }

      if (obj.shadow) {
        setShadowEnabled(true);
        setShadowOptions({
          color: obj.shadow.color || "#000000",
          blur: obj.shadow.blur || 10,
          offsetx: obj.shadow.offsetX || 5,
          offsety: obj.shadow.offsetY || 5,
        });
      } else {
        setShadowEnabled(false);
      }
    },
    []
  );

  // Create grid background
  const createGrid = useCallback(
    (canvas: fabric.Canvas) => {
      if (!canvas) return;

      // Clear existing grid
      const objects = canvas.getObjects();
      objects.forEach((obj: any) => {
        if (obj.data?.isGrid) {
          canvas.remove(obj);
        }
      });

      if (!showGrid) {
        canvas.renderAll();
        return;
      }

      const gridSize = 20;
      const canvasWidth = canvas.width || 1200;
      const canvasHeight = canvas.height || 600;

      try {
        // Create grid lines
        for (let i = 0; i <= canvasWidth / gridSize; i++) {
          const lineX = new fabric.Line(
            [i * gridSize, 0, i * gridSize, canvasHeight],
            {
              stroke: "#ddd",
              selectable: false,
              evented: false,
              strokeWidth: 1,
            }
          );

          lineX.set("data", { isGrid: true });
          canvas.add(lineX);
          canvas.sendObjectToBack(lineX);
        }

        for (let i = 0; i <= canvasHeight / gridSize; i++) {
          const lineY = new fabric.Line(
            [0, i * gridSize, canvasWidth, i * gridSize],
            {
              stroke: "#ddd",
              selectable: false,
              evented: false,
              strokeWidth: 1,
            }
          );

          lineY.set("data", { isGrid: true });
          canvas.add(lineY);
          canvas.sendObjectToBack(lineY);
        }

        canvas.renderAll();
      } catch (error) {
        console.error("Error creating grid:", error);
      }
    },
    [showGrid]
  );

  // Update grid when showGrid changes
  useEffect(() => {
    if (fabricRef.current) {
      createGrid(fabricRef.current);
    }
  }, [showGrid, createGrid]);

  // Apply zoom level to canvas
  useEffect(() => {
    if (fabricRef.current) {
      const zoomFactor = zoomLevel / 100;
      fabricRef.current.setZoom(zoomFactor);
      fabricRef.current.renderAll();
    }
  }, [zoomLevel]);

  // Add current canvas state to history
  const addToHistory = () => {
    if (!fabricRef.current) return;

    const json = JSON.stringify(fabricRef.current.toJSON());

    // Don't add if it's the same as the last entry
    if (canvasHistory.length > 0 && canvasHistory[historyIndex] === json) {
      return;
    }

    // If we're not at the end of the history, remove everything after current point
    const newHistory =
      historyIndex >= 0 ? canvasHistory.slice(0, historyIndex + 1) : [];

    setCanvasHistory([...newHistory, json]);
    setHistoryIndex(newHistory.length);
    setUnsavedChanges(true);
  };

  // Undo function
  const undo = () => {
    if (historyIndex <= 0 || !fabricRef.current) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);

    fabricRef.current.clear();
    fabricRef.current.loadFromJSON(JSON.parse(canvasHistory[newIndex]), () => {
      fabricRef.current?.renderAll();
      updateCanvasState();
    });
  };

  // Redo function
  const redo = () => {
    if (historyIndex >= canvasHistory.length - 1 || !fabricRef.current) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);

    fabricRef.current.clear();
    fabricRef.current.loadFromJSON(JSON.parse(canvasHistory[newIndex]), () => {
      fabricRef.current?.renderAll();
      updateCanvasState();
    });
  };

  // Copy selected object to clipboard
  const copySelectedObject = () => {
    if (!fabricRef.current || !selectedShape) return;

    // Use the Promise-based clone() signature:
    selectedShape
      .clone() // returns Promise<FabricObject>
      .then((cloned: any) => {
        // Store the cloned object's JSON in localStorage
        localStorage.setItem(
          "fabricClipboard",
          JSON.stringify(cloned.toJSON())
        );
      })
      .catch((err: any) => {
        console.error("Error cloning object:", err);
      });
  };

  // Paste object from clipboard
  const pasteObject = () => {
    if (!fabricRef.current) return;

    const clipboard = localStorage.getItem("fabricClipboard");
    if (!clipboard) return;

    const objectData = JSON.parse(clipboard);

    // Use the Promise-based API:
    fabric.util
      .enlivenObjects<
        fabric.FabricObject<
          Partial<fabric.FabricObjectProps>,
          fabric.SerializedObjectProps,
          fabric.ObjectEvents
        >
      >([objectData])
      .then((objects) => {
        const canvas = fabricRef.current!;
        objects.forEach((obj) => {
          // Now typed as FabricObject, safe to add:
          obj.set({
            left: (obj.left ?? 0) + 20,
            top: (obj.top ?? 0) + 20,
            evented: true,
          });
          if (obj.type === "i-text") {
            (obj as fabric.IText).editable = true;
          }
          canvas.add(obj);
          canvas.setActiveObject(obj);
        });
        canvas.requestRenderAll();
        updateCanvasState();
      })
      .catch((err) => {
        console.error("Error pasting object:", err);
      });
  };

  // Duplicate selected object
  const duplicateSelectedObject = () => {
    if (!fabricRef.current || !selectedShape) return;
  
    // 1. Call clone() without a callback—returns a Promise<FabricObject>.
    selectedShape.clone()
      .then((cloned: fabric.Object) => {
        // 2. Adjust position to offset the duplicate.
        cloned.set({
          left: (cloned.left ?? 0) + 20,
          top:  (cloned.top  ?? 0) + 20,
          evented: true,
        });
        // 3. Add to canvas and select.
        fabricRef.current!.add(cloned);
        fabricRef.current!.setActiveObject(cloned);
        updateCanvasState();
      })
      .catch((err: any) => {
        console.error('Error duplicating object:', err);
      });
  };
  

  // Align objects
  const alignObjects = (position: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
  
    // Capture and narrow activeObject
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;  // <-- narrow: after this, activeObject is non-undefined
  
    const { width = 0, height = 0, scaleX = 1, scaleY = 1 } = activeObject;
    const canvasWidth  = canvas.width  ?? 1200;
    const canvasHeight = canvas.height ??  600;
  
    let left: number, top: number;
  
    switch (position) {
      case "left":
        left = (width * scaleX) / 2;
        activeObject.set({ left });
        break;
      case "center":
        activeObject.set({ left: canvasWidth / 2 });
        break;
      case "right":
        left = canvasWidth - (width * scaleX) / 2;
        activeObject.set({ left });
        break;
      case "top":
        top = (height * scaleY) / 2;
        activeObject.set({ top });
        break;
      case "middle":
        activeObject.set({ top: canvasHeight / 2 });
        break;
      case "bottom":
        top = canvasHeight - (height * scaleY) / 2;
        activeObject.set({ top });
        break;
    }
  
    canvas.renderAll();
    updateCanvasState();
  };
  

  // Bring selected object forward/backward
  const changeObjectZOrder = (action: string) => {
    if (!fabricRef.current || !selectedShape) return;

    switch (action) {
      case "front":
        fabricRef.current.bringObjectToFront(selectedShape);
        break;
      case "back":
        fabricRef.current.sendObjectToBack(selectedShape);
        break;
    }

    fabricRef.current.renderAll();
    updateCanvasState();
  };

  // Update canvas objects state
  const updateCanvasState = () => {
    if (!fabricRef.current) return;

    const objects = fabricRef.current
      .getObjects()
      .filter((obj: any) => !obj.data?.isGrid);

    const serializedObjects: CanvasObject[] = objects.map((obj: any) => {
      const id = obj.data?.id || Date.now().toString();
      let fillValue: any = obj.fill as string;
      let files: File[] = [];

      if (obj.fill instanceof fabric.Pattern && obj.fill.source) {
        if ((obj as any)._patternFile) {
          const file = (obj as any)._patternFile;
          files.push(file);
          fillValue = {
            type: "pattern",
            fileName: file.name,
            repeat: obj.fill.repeat || "repeat",
            scaleX: obj.fill.patternTransform?.[0] || 1,
            scaleY: obj.fill.patternTransform?.[3] || 1,
          };
        }
      }

      // Set object id for history tracking
      obj.set("data", { id });

      return {
        id,
        files: files.length > 0 ? files : undefined,
        properties: {
          type: obj.type || "unknown",
          left: obj.left || 0,
          top: obj.top || 0,
          width: obj.width || 0,
          height: obj.height || 0,
          radius: (obj as any).radius,
          fill: fillValue,
          stroke: obj.stroke as string,
          strokeWidth: obj.strokeWidth,
          path: (obj as any).path?.toString(),
          text: (obj as any).text,
          fontSize: (obj as any).fontSize,
          fontFamily: (obj as any).fontFamily,
          fontWeight: (obj as any).fontWeight?.toString(),
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
          angle: obj.angle,
          opacity: obj.opacity,
          shadow: obj.shadow
            ? {
                color: obj.shadow.color || "",
                blur: obj.shadow.blur || 0,
                offsetx: obj.shadow.offsetX || 0,
                offsety: obj.shadow.offsetY || 0,
              }
            : undefined,
        },
      };
    });

    setCanvasObjects(serializedObjects);
  };

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    if (fabricRef.current) {
      setSelectedTool(tool);

      // Set drawing mode based on tool
      const isDrawing =
        tool === "pencil" || tool === "spray" || tool === "eraser";
      fabricRef.current.isDrawingMode = isDrawing;
      setIsDrawingMode(isDrawing);

      // Set appropriate brush
      if (tool === "spray") {
        fabricRef.current.freeDrawingBrush = new fabric.SprayBrush(
          fabricRef.current
        );
        fabricRef.current.freeDrawingBrush.color = selectedColor;
        fabricRef.current.freeDrawingBrush.width = brushWidth;
      } else if (tool === "pencil") {
        fabricRef.current.freeDrawingBrush = new fabric.PencilBrush(
          fabricRef.current
        );
        fabricRef.current.freeDrawingBrush.color = selectedColor;
        fabricRef.current.freeDrawingBrush.width = brushWidth;
      }
    }
  };

  // Add shape to canvas
  const addShape = (type: string) => {
    if (!fabricRef.current) return;

    let shape: fabric.Object;

    switch (type) {
      case "rectangle":
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: selectedColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          opacity: opacity / 100,
        });
        break;
      case "circle":
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: selectedColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          opacity: opacity / 100,
        });
        break;
      case "triangle":
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 100,
          height: 100,
          fill: selectedColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          opacity: opacity / 100,
        });
        break;
      case "ellipse":
        shape = new fabric.Ellipse({
          left: 100,
          top: 100,
          rx: 75,
          ry: 50,
          fill: selectedColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          opacity: opacity / 100,
        });
        break;
      case "line":
        shape = new fabric.Line([50, 50, 150, 150], {
          stroke: selectedColor,
          strokeWidth: brushWidth,
          opacity: opacity / 100,
        });
        break;
      case "text":
        shape = new fabric.IText("Edit this text", {
          left: 100,
          top: 100,
          fontSize: fontSize,
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fill: selectedColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth > 0 ? strokeWidth / 3 : 0, // Thinner stroke for text
          opacity: opacity / 100,
          editable: true,
        });
        break;
      case "polygon":
        shape = new fabric.Polygon(
          [
            { x: 0, y: 0 },
            { x: 50, y: 0 },
            { x: 75, y: 50 },
            { x: 50, y: 100 },
            { x: 0, y: 100 },
            { x: -25, y: 50 },
          ],
          {
            left: 100,
            top: 100,
            fill: selectedColor,
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            opacity: opacity / 100,
          }
        );
        break;
      case "star":
        const points = [];
        const outerRadius = 50;
        const innerRadius = 25;
        const spikes = 5;

        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI / spikes) * i;
          points.push({
            x: radius * Math.sin(angle),
            y: radius * Math.cos(angle),
          });
        }

        shape = new fabric.Polygon(points, {
          left: 100,
          top: 100,
          fill: selectedColor,
          stroke: strokeColor,
          strokeWidth: strokeWidth,
          opacity: opacity / 100,
        });
        break;
      default:
        return;
    }

    // Apply shadow if enabled
    if (shadowEnabled) {
      shape.set(
        "shadow",
        new fabric.Shadow({
          color: shadowOptions.color,
          blur: shadowOptions.blur,
          offsetX: shadowOptions.offsetx,
          offsetY: shadowOptions.offsety,
        })
      );
    }

    fabricRef.current.add(shape);
    fabricRef.current.setActiveObject(shape);
    updateCanvasState();
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (fabricRef.current && selectedShape) {
      fabricRef.current.remove(selectedShape);
      setSelectedShape(null);
      updateCanvasState();
      addToHistory();
    }
  };

  // Apply pattern to selected shape
  const applyPatternToShape = (file: File) => {
    if (!fabricRef.current || !selectedShape) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const shapeWidth = selectedShape.width! * (selectedShape.scaleX || 1);
        const shapeHeight = selectedShape.height! * (selectedShape.scaleY || 1);
        const scale = Math.min(
          shapeWidth / img.width,
          shapeHeight / img.height
        );

        const pattern = new fabric.Pattern({
          source: img,
          repeat: "repeat",
          offsetX: 0,
          offsetY: 0,
          patternTransform: [scale, 0, 0, scale, 0, 0],
        });

        (selectedShape as any)._patternFile = file;
        selectedShape.set("fill", pattern);
        fabricRef.current?.renderAll();
        updateCanvasState();
        addToHistory();
      };

      img.src = imgUrl;
    };
    reader.readAsDataURL(file);
  };

  // Update selected object's shadow
  const updateSelectedObjectShadow = () => {
    if (!fabricRef.current || !selectedShape) return;

    if (shadowEnabled) {
      selectedShape.set(
        "shadow",
        new fabric.Shadow({
          color: shadowOptions.color,
          blur: shadowOptions.blur,
          offsetX: shadowOptions.offsetx,
          offsetY: shadowOptions.offsety,
        })
      );
    } else {
      selectedShape.set("shadow", null);
    }

    fabricRef.current.renderAll();
    updateCanvasState();
  };

  // Update properties of selected shape
  const updateSelectedObject = () => {
    if (!fabricRef.current || !selectedShape) return;

    selectedShape.set({
      fill: selectedColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      opacity: opacity / 100,
    });

    // Update text-specific properties
    if (selectedShape.type === "i-text" || selectedShape.type === "text") {
      (selectedShape as fabric.IText).set({
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
      });
    }

    fabricRef.current.renderAll();
    updateCanvasState();
  };

  // Effect to update object properties when controls change
  useEffect(() => {
    updateSelectedObject();
  }, [
    selectedColor,
    strokeColor,
    strokeWidth,
    opacity,
    fontSize,
    fontFamily,
    fontWeight,
  ]);

  // Save design to server
  const handleDesignSave = async (canvasObjects: any[]) => {
    if (!canvasObjects.length) return;
    console.log(canvasObjects);
    try {
      setIsUploading(true);
      setError(null);

      if (!fabricRef.current) return;

      // Convert the canvas to JSON string
      const json = JSON.stringify(fabricRef.current.toJSON());

      // Send the JSON string directly in the properties field
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/assets/createAssets`,
        {
          shapeName: shapeInfo.AssetName,
          shapeStatus: shapeInfo.AssetStatus,
          shapeCategory: shapeInfo.AssetCategory,
          properties: json,
        },
        { withCredentials: true }
      );

      if (!uploadResponse.data.success) {
        throw new Error(`HTTP error! status: ${uploadResponse.status}`);
      }

      if (uploadResponse.data.success) {
        // alert("Design saved successfully!");
        setUnsavedChanges(false);
      } else {
        throw new Error(uploadResponse.data.message || "Save failed");
      }
    } catch (error: any) {
      setError(error.message);
      // alert(`Error saving design: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Export canvas as image
  // Fixed exportCanvas function with proper type handling
  const exportCanvas = (format: string) => {
    if (!fabricRef.current) return;

    // Temporarily hide grid for export
    const gridVisible = showGrid;
    if (gridVisible) {
      fabricRef.current.getObjects().forEach((obj: any) => {
        if (obj.data?.isGrid) {
          obj.set("visible", false);
        }
      });
      fabricRef.current.renderAll();
    }

    let dataURL: string;
    switch (format) {
      case "png":
        dataURL = fabricRef.current.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 0,
        });
        break;
      case "jpg":
        dataURL = fabricRef.current.toDataURL({
          format: "jpeg",
          quality: 0.8,
          multiplier: 0,
        });
        break;
      case "svg":
        // Fix the SVG export method
        const svgData = fabricRef.current.toSVG();
        dataURL = svgData;
        break;
      default:
        dataURL = fabricRef.current.toDataURL();
    }

    // Show grid again if it was visible
    if (gridVisible) {
      fabricRef.current.getObjects().forEach((obj: any) => {
        if (obj.data?.isGrid) {
          obj.set("visible", true);
        }
      });
      fabricRef.current.renderAll();
    }

    if (format === "svg") {
      const blob = new Blob([dataURL], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${shapeInfo.AssetName || "canvas-design"}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `${shapeInfo.AssetName || "canvas-design"}.${format}`;
      link.click();
    }
  };

  // Fixed loadDesign function with proper error handling
  const loadDesign = (jsonData: string) => {
    if (!fabricRef.current) return;

    try {
      const parsedData = JSON.parse(jsonData);
      fabricRef.current.clear();
      fabricRef.current.loadFromJSON(parsedData, () => {
        fabricRef.current?.renderAll();
        updateCanvasState();
        addToHistory();
      });
    } catch (e) {
      console.error("Error loading design:", e);
      alert("Failed to load design. Invalid format.");
    }
  };

  // Fixed handleBackgroundDrop function with proper type handling
  const handleBackgroundDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvas = fabricRef.current;
    if (!canvas) return;
  
    const file = e.dataTransfer.files?.[0];
    if (!file?.type.match("image.*")) {
      alert("Only image files are allowed");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imgUrl = event.target?.result as string;
      if (!imgUrl) return;
  
      try {
        const img = await fabric.Image.fromURL(imgUrl);
        const iw = img.width  ?? 0;
        const ih = img.height ?? 0;
        const cw = canvas.width  ?? 1200;
        const ch = canvas.height ?? 600;
        const scale = Math.min(cw / iw, ch / ih);
  
        img.set({
          scaleX: scale,
          scaleY: scale,
          left:   (cw - iw * scale) / 2,
          top:    (ch - ih * scale) / 2,
          selectable: true,
        });
  
        canvas.add(img);
        // <- Use the canvas method, not img.sendToBack()
        canvas.sendObjectToBack(img);
        // Or alternatively: img.moveTo(0);
  
        updateCanvasState();
        addToHistory();
      } catch (err) {
        console.error("Error loading image:", err);
      }
    };
    reader.readAsDataURL(file);
  };
  
  

  // Fixed handleDragOver function
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricRef.current || !e.target.files || e.target.files.length === 0)
      return;

    const selectedObject = fabricRef.current.getActiveObject();
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.match("image.*"));

    if (imageFiles.length === 0) {
      alert("Only image files are allowed");
      e.target.value = "";
      return;
    }

    // If no shape is selected, inform the user
    if (!selectedObject) {
      alert("Please select a shape first to apply the image as a fill");
      e.target.value = "";
      return;
    }

    // For multiple images, use only the first one as we're applying as fill
    const file = imageFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      if (!imgUrl) return;

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (!selectedObject || !fabricRef.current) return;

        // Calculate appropriate scaling based on shape dimensions
        const shapeWidth = selectedObject.width! * (selectedObject.scaleX || 1);
        const shapeHeight =
          selectedObject.height! * (selectedObject.scaleY || 1);
        const scale = Math.min(
          shapeWidth / img.width,
          shapeHeight / img.height
        );

        // Create a pattern with the image
        const pattern = new fabric.Pattern({
          source: img,
          repeat: "no-repeat", // Default to no-repeat for fills
          offsetX: 0,
          offsetY: 0,
          patternTransform: [scale, 0, 0, scale, 0, 0],
        });

        // Store original file reference for serialization
        (selectedObject as any)._patternFile = file;

        // Apply the pattern as fill to the selected object
        selectedObject.set("fill", pattern);

        fabricRef.current.renderAll();
        updateCanvasState();
        addToHistory();
      };

      img.onerror = () => {
        console.error(`Error loading image: ${file.name}`);
        alert(`Failed to load image: ${file.name}`);
      };

      img.src = imgUrl;
    };

    reader.onerror = () => {
      console.error(`Error reading file: ${file.name}`);
      alert(`Failed to read file: ${file.name}`);
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };
  // Fixed handlePatternUpload function with proper error handling
  const handlePatternUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedShape) return;

    const file = e.target.files[0];
    if (!file.type.match("image.*")) {
      alert("Only image files are allowed");
      return;
    }

    applyPatternToShape(file);

    // Reset file input
    e.target.value = "";
  };

  // Fixed handleJsonUpload function with proper error handling
  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (!file.name.endsWith(".json")) {
      alert("Only JSON files are allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonData = event.target?.result as string;
      if (jsonData) {
        loadDesign(jsonData);
      }
    };
    reader.readAsText(file);

    // Reset file input
    e.target.value = "";
  };

  // Fixed clearCanvas function with confirm dialog
  const clearCanvas = () => {
    if (!fabricRef.current) return;

    fabricRef.current.getObjects().forEach((obj: any) => {
      if (!obj.data?.isGrid) {
        fabricRef.current!.remove(obj);
      }
    });

    fabricRef.current.renderAll();
    updateCanvasState();
    addToHistory();
    setShowConfirmClearDialog(false);
  };

  // Fixed downloadJson function with proper error handling
  const downloadJson = () => {
    if (!fabricRef.current) return;

    try {
      const json = JSON.stringify(fabricRef.current.toJSON());
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${shapeInfo.AssetName || "canvas-design"}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating JSON:", error);
      alert("Failed to download design. Please try again.");
    }
  };

  // Fixed groupObjects function with proper type checking
  const groupObjects = () => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject) {
      alert("Please select multiple objects to group");
      return;
    }

    if (activeObject.type !== "activeSelection") {
      alert("Please select multiple objects to group");
      return;
    }

    // Convert active selection to a group
    // const group = (activeObject as fabric.ActiveSelection).group();
    fabricRef.current.renderAll();
    updateCanvasState();
    addToHistory();
  };

  // Fixed ungroupObjects function with proper type checking
  const ungroupObjects = () => {
    if (!fabricRef.current) return;

    const activeObject = fabricRef.current.getActiveObject();
    if (!activeObject) {
      alert("Please select a group to ungroup");
      return;
    }

    if (activeObject.type !== "group") {
      alert("Please select a group to ungroup");
      return;
    }

    // Ungroup objects
    const items = (activeObject as fabric.Group).getObjects();
    // (activeObject as fabric.Group).destroy();
    const selection = new fabric.ActiveSelection(items, {
      canvas: fabricRef.current,
    });
    fabricRef.current.setActiveObject(selection);
    fabricRef.current.renderAll();
    updateCanvasState();
    addToHistory();
  };

  // Fixed changeCanvasBackground function with proper callback
  const changeCanvasBackground = (color: string) => {
    if (!fabricRef.current) return;

    fabricRef.current.set("backgroundColor", color);
    fabricRef.current.renderAll();
    addToHistory();
  };

  // Fixed handleShapeInfoChange function
  const handleShapeInfoChange = (field: string, value: string | string[]) => {
    setShapeInfo({ ...shapeInfo, [field]: value });

    // Save to localStorage
    localStorage.setItem(
      "AssetDetails",
      JSON.stringify({
        ...shapeInfo,
        [field]: value,
      })
    );
  };

  // Fixed useEffect for beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  // Fixed button trigger handlers
  const handleTriggerImageUpload = () => {
    const element = document.getElementById("imageUpload");
    if (element) {
      (element as HTMLInputElement).click();
    }
  };

  const handleTriggerPatternUpload = () => {
    const element = document.getElementById("patternUpload");
    if (element) {
      (element as HTMLInputElement).click();
    }
  };

  const handleTriggerJsonUpload = () => {
    const element = document.getElementById("jsonUpload");
    if (element) {
      (element as HTMLInputElement).click();
    }
  };

  // Fixed zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(400, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(25, prev - 25));
  };
  return (
    <div className="flex flex-col min-h-screen bg-background animate-fade-in">
      <div className="p-4 border-b bg-card">
        <div className="container max-w-screen-2xl mx-auto">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Shape Editor</h1>
            <AssetInfoForm
              shapeInfo={shapeInfo}
              onInfoChange={handleShapeInfoChange}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-screen-2xl mx-auto flex-grow flex flex-col p-4">
        <div className="mb-4 space-y-2">
          <EditorToolbar
            selectedTool={selectedTool}
            onSelectTool={handleToolSelect}
            onAddShape={addShape}
            onAddImage={handleTriggerImageUpload}
          />

          <EditorControls
            canUndo={historyIndex > 0}
            canRedo={historyIndex < canvasHistory.length - 1}
            showGrid={showGrid}
            zoomLevel={zoomLevel}
            selectedShape={selectedShape}
            isUploading={isUploading}
            hasObjects={canvasObjects.length > 0}
            onUndo={undo}
            onRedo={redo}
            onDelete={deleteSelectedObject}
            onDuplicate={duplicateSelectedObject}
            onGroup={groupObjects}
            onUngroup={ungroupObjects}
            onToggleGrid={setShowGrid}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onClear={() => setShowConfirmClearDialog(true)}
            onDownloadJson={downloadJson}
            onJsonUpload={handleTriggerJsonUpload}
            onExport={(format) => exportCanvas(format)}
            onSave={() => handleDesignSave(canvasObjects)}
          />
        </div>

        <div className="flex-grow flex flex-col lg:flex-row gap-4">
          <div
            className={cn(
              "lg:w-72 flex-shrink-0 transition-all duration-300 ease-in-out bg-card rounded-lg overflow-hidden",
              isPropertiesPanelOpen ? "w-full" : "w-10"
            )}
          >
            {isPropertiesPanelOpen ? (
              <div className="h-full flex flex-col">
                <PropertiesPanel
                  selectedShape={selectedShape}
                  selectedColor={selectedColor}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  fontWeight={fontWeight}
                  shadowEnabled={shadowEnabled}
                  shadowOptions={shadowOptions}
                  brushWidth={brushWidth}
                  isDrawingMode={isDrawingMode}
                  fontFamilies={fontFamilies}
                  fontWeights={fontWeights}
                  onColorChange={setSelectedColor}
                  onStrokeColorChange={setStrokeColor}
                  onStrokeWidthChange={setStrokeWidth}
                  onOpacityChange={setOpacity}
                  onFontSizeChange={setFontSize}
                  onFontFamilyChange={setFontFamily}
                  onFontWeightChange={setFontWeight}
                  onBrushWidthChange={(width: any) => {
                    setBrushWidth(width);
                    if (
                      fabricRef.current &&
                      fabricRef.current.freeDrawingBrush
                    ) {
                      fabricRef.current.freeDrawingBrush.width =
                        selectedTool === "eraser" ? width * 2 : width;
                    }
                  }}
                  onShadowEnabledChange={(enabled: any) => {
                    setShadowEnabled(enabled);
                    setTimeout(updateSelectedObjectShadow, 0);
                  }}
                  onShadowOptionsChange={(options: any) => {
                    setShadowOptions({ ...shadowOptions, ...options });
                    setTimeout(updateSelectedObjectShadow, 0);
                  }}
                  onAlignObjects={alignObjects}
                  onChangeObjectZOrder={changeObjectZOrder}
                  onPatternUpload={handleTriggerPatternUpload}
                />

                <button
                  className="lg:hidden p-2 bg-secondary text-secondary-foreground mt-auto"
                  onClick={() => setIsPropertiesPanelOpen(false)}
                >
                  Hide Properties
                </button>
              </div>
            ) : (
              <button
                className="w-10 h-full flex items-center justify-center"
                onClick={() => setIsPropertiesPanelOpen(true)}
              >
                <Palette className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex-grow flex flex-col items-center justify-center bg-editor p-4 rounded-lg border border-editor-border">
            <div
              className="canvas-container relative"
              onDragOver={handleDragOver}
              onDrop={handleBackgroundDrop}
            >
              <canvas ref={canvasRef} />
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <div>Drag and drop images onto the canvas</div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="color"
                      value="#ffffff"
                      onChange={(e) => changeCanvasBackground(e.target.value)}
                      className="w-5 h-5 mr-2"
                    />
                    Background
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        onChange={handleImageUpload}
        accept="image/*"
      />
      <input
        type="file"
        id="patternUpload"
        style={{ display: "none" }}
        onChange={handlePatternUpload}
        accept="image/*"
      />
      <input
        type="file"
        id="jsonUpload"
        style={{ display: "none" }}
        onChange={handleJsonUpload}
        accept=".json"
      />

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Design</DialogTitle>
            <DialogDescription>
              Choose a format to export your design
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-4 h-auto"
              onClick={() => exportCanvas("png")}
            >
              <FileImage className="h-8 w-8 mb-2" />
              PNG
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-4 h-auto"
              onClick={() => exportCanvas("jpg")}
            >
              <FileImage className="h-8 w-8 mb-2" />
              JPG
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center p-4 h-auto"
              onClick={() => exportCanvas("svg")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2"
              >
                <path d="M4 4h16v16H4z" />
                <path d="M4 12h16" />
                <path d="M12 4v16" />
              </svg>
              SVG
            </Button>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Canvas Confirmation Dialog */}
      <Dialog
        open={showConfirmClearDialog}
        onOpenChange={setShowConfirmClearDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Clear Canvas</span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to clear the canvas? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmClearDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearCanvas}>
              Clear Canvas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShapeEditor;
