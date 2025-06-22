import { useEffect, useRef, FC, useState, useCallback } from 'react';
import Phaser from 'phaser';

// Types for surface customization
interface TileData {
  x: number;
  y: number;
  tileType: string;
  color: number;
}

interface GameObjects {
  x: number;
  y: number;
  objectType: string;
  sprite?: Phaser.GameObjects.Sprite;
}

interface SurfaceData {
  tiles: TileData[][];
  objects: GameObjects[];
  width: number;
  height: number;
}

// Available tile types with better organization
const TileTypes = {
  GRASS: { key: 'grass', name: 'Grass', color: 0x4CAF50, emoji: '🌱' },
  DIRT: { key: 'dirt', name: 'Dirt', color: 0x8D6E63, emoji: '🟫' },
  STONE: { key: 'stone', name: 'Stone', color: 0x607D8B, emoji: '🪨' },
  WATER: { key: 'water', name: 'Water', color: 0x2196F3, emoji: '💧' },
  SAND: { key: 'sand', name: 'Sand', color: 0xFFC107, emoji: '🏖️' },
  WOOD: { key: 'wood', name: 'Wood', color: 0x795548, emoji: '🪵' }
} as const;

// Available objects with better organization
const ObjectTypes = {
  TREE: { key: 'tree', name: 'Tree', emoji: '🌳' },
  ROCK: { key: 'rock', name: 'Rock', emoji: '🪨' },
  FLOWER: { key: 'flower', name: 'Flower', emoji: '🌸' },
  HOUSE: { key: 'house', name: 'House', emoji: '🏠' },
  TORCH: { key: 'torch', name: 'Torch', emoji: '🔥' }
} as const;

const GameScene: FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Phaser.Scene | null>(null);
  
  // Customization state
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [selectedTile, setSelectedTile] = useState<string>('grass');
  const [selectedObject, setSelectedObject] = useState<string>('tree');
  const [brushSize, setBrushSize] = useState<number>(1);
  const [editTool, setEditTool] = useState<'tile' | 'object' | 'erase'>('tile');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);

  // Surface data
  const surfaceDataRef = useRef<SurfaceData>({
    tiles: [],
    objects: [],
    width: 50,
    height: 40
  });

  // Refs for state used in Phaser events
  const stateRef = useRef({
    selectedTile,
    selectedObject,
    editTool,
    brushSize,
    snapToGrid
  });

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = {
      selectedTile,
      selectedObject,
      editTool,
      brushSize,
      snapToGrid
    };
  }, [selectedTile, selectedObject, editTool, brushSize, snapToGrid]);

  // Tile colors mapping
  const getTileColor = useCallback((tileType: string): number => {
    const tileData = Object.values(TileTypes).find(t => t.key === tileType);
    return tileData?.color || 0x4CAF50;
  }, []);

  // Initialize surface data with more interesting default terrain
  const initializeSurface = useCallback(() => {
    const { width, height } = surfaceDataRef.current;
    const tiles: TileData[][] = [];
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        let tileType
        
        // Add some water areas
        if ((x > 10 && x < 20 && y > 15 && y < 25) || 
            (x > 30 && x < 40 && y > 5 && y < 15)) {
          tileType = TileTypes.WATER.key;
        }
        // Add some dirt paths
        else if ((x === 25 && y > 10 && y < 30) || 
                 (y === 20 && x > 15 && x < 35)) {
          tileType = TileTypes.DIRT.key;
        }
        // Add some sandy areas
        else if (x > 35 && y > 25) {
          tileType = TileTypes.SAND.key;
        }
        else{
          tileType=TileTypes.GRASS.key
        }
        tiles[y][x] = {
          x,
          y,
          tileType,
          color: getTileColor(tileType)
        };
      }
    }
    
    // Add some default objects
    const defaultObjects: GameObjects[] = [
      { x: 5, y: 5, objectType: ObjectTypes.TREE.key },
      { x: 8, y: 7, objectType: ObjectTypes.TREE.key },
      { x: 12, y: 6, objectType: ObjectTypes.HOUSE.key },
      { x: 15, y: 12, objectType: ObjectTypes.FLOWER.key },
      { x: 28, y: 18, objectType: ObjectTypes.ROCK.key },
      { x: 32, y: 22, objectType: ObjectTypes.TORCH.key },
    ];
    
    surfaceDataRef.current.tiles = tiles;
    surfaceDataRef.current.objects = defaultObjects;
  }, [getTileColor]);

  useEffect(() => {
    if (!parentRef.current) return;

    // Initialize surface data
    initializeSurface();

    // Phaser configuration
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      parent: parentRef.current,
      backgroundColor: '#1a1a2e',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [initializeSurface]);

  // Preload assets with better graphics
  const preload = function (this: Phaser.Scene) {
    sceneRef.current = this;
    
    // Create better looking tiles with gradients and textures
    Object.values(TileTypes).forEach(tile => {
      const graphics = this.add.graphics();
      graphics.fillStyle(tile.color);
      graphics.fillRect(0, 0, 16, 16);
      
      // Add some texture/depth
      graphics.fillStyle(tile.color - 0x111111);
      graphics.fillRect(0, 0, 16, 2);
      graphics.fillRect(0, 0, 2, 16);
      
      graphics.fillStyle(tile.color + 0x111111);
      graphics.fillRect(0, 14, 16, 2);
      graphics.fillRect(14, 0, 2, 16);
      
      graphics.generateTexture(tile.key, 16, 16);
      graphics.destroy();
    });

    // Create better object sprites
    // Tree
    let graphics = this.add.graphics();
    graphics.fillStyle(0x2E7D32);
    graphics.fillCircle(8, 8, 7);
    graphics.fillStyle(0x1B5E20);
    graphics.fillCircle(6, 6, 4);
    graphics.fillStyle(0x8D6E63);
    graphics.fillRect(6, 14, 4, 6);
    graphics.generateTexture('tree', 16, 20);
    graphics.destroy();
    
    // Rock
    graphics = this.add.graphics();
    graphics.fillStyle(0x424242);
    graphics.fillEllipse(8, 10, 12, 8);
    graphics.fillStyle(0x616161);
    graphics.fillEllipse(6, 8, 6, 4);
    graphics.generateTexture('rock', 16, 16);
    graphics.destroy();
    
    // Flower
    graphics = this.add.graphics();
    graphics.fillStyle(0xE91E63);
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      graphics.fillCircle(8 + Math.cos(angle) * 3, 8 + Math.sin(angle) * 3, 2);
    }
    graphics.fillStyle(0xFFEB3B);
    graphics.fillCircle(8, 8, 2);
    graphics.fillStyle(0x4CAF50);
    graphics.fillRect(7, 12, 2, 4);
    graphics.generateTexture('flower', 16, 16);
    graphics.destroy();
    
    // House
    graphics = this.add.graphics();
    graphics.fillStyle(0x8D6E63);
    graphics.fillRect(2, 10, 12, 10);
    graphics.fillStyle(0xF44336);
    graphics.fillTriangle(2, 10, 14, 10, 8, 4);
    graphics.fillStyle(0x5D4037);
    graphics.fillRect(6, 14, 4, 6);
    graphics.fillStyle(0x2196F3);
    graphics.fillRect(10, 12, 2, 2);
    graphics.generateTexture('house', 16, 20);
    graphics.destroy();
    
    // Torch
    graphics = this.add.graphics();
    graphics.fillStyle(0x8D6E63);
    graphics.fillRect(7, 8, 2, 12);
    graphics.fillStyle(0xFF5722);
    graphics.fillEllipse(8, 6, 6, 8);
    graphics.fillStyle(0xFFEB3B);
    graphics.fillEllipse(8, 5, 4, 5);
    graphics.generateTexture('torch', 16, 20);
    graphics.destroy();
  };

  // Create scene with grid overlay
  const create = function (this: Phaser.Scene) {
    const scene = this;
    
    // Create groups
    const tileGroup = scene.add.group();
    const objectGroup = scene.add.group();
    const gridGroup = scene.add.group();
    
    // Store groups
    (scene as any).tileGroup = tileGroup;
    (scene as any).objectGroup = objectGroup;
    (scene as any).gridGroup = gridGroup;
    
    // Initial render
    renderSurface(scene);
    renderGrid(scene);
    
    // Camera controls
    const cursors = scene.input.keyboard?.createCursorKeys();
    (scene as any).cursors = cursors;
    
    // Camera zoom with smooth animation
    scene.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      const camera = scene.cameras.main;
      const zoomAmount = deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Phaser.Math.Clamp(camera.zoom + zoomAmount, 0.3, 3);
      
      scene.tweens.add({
        targets: camera,
        zoom: newZoom,
        duration: 100,
        ease: 'Power2.easeOut'
      });
    });
    
    // Enhanced editing with preview
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!isEditMode) return;
      handleSurfaceEdit(scene, pointer.worldX, pointer.worldY);
    });
    
    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!isEditMode) {
        clearPreview(scene);
        return;
      }
      
      if (pointer.isDown) {
        handleSurfaceEdit(scene, pointer.worldX, pointer.worldY);
      } else {
        showEditPreview(scene, pointer.worldX, pointer.worldY);
      }
    });
  };

  // Render grid overlay with improved visuals
  const renderGrid = (scene: Phaser.Scene) => {
    const gridGroup = (scene as any).gridGroup as Phaser.GameObjects.Group;
    gridGroup.clear(true, true);
    
    if (!showGrid) return;
    
    const { width, height } = surfaceDataRef.current;
    const tileSize = 16;
    
    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0xFFFFFF, 0.1); // Lighter, more subtle grid
    
    // Vertical lines
    for (let x = 0; x <= width; x++) {
      graphics.moveTo(x * tileSize, 0);
      graphics.lineTo(x * tileSize, height * tileSize);
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y++) {
      graphics.moveTo(0, y * tileSize);
      graphics.lineTo(width * tileSize, y * tileSize);
    }
    
    graphics.strokePath();
    gridGroup.add(graphics);
  };

  // Show edit preview with object ghosting
  const showEditPreview = (scene: Phaser.Scene, worldX: number, worldY: number) => {
    clearPreview(scene);
    
    const tileSize = 16;
    let tileX = Math.floor(worldX / tileSize);
    let tileY = Math.floor(worldY / tileSize);
    
    // Apply snap-to-grid if enabled
    if (stateRef.current.snapToGrid) {
      tileX = Math.round(worldX / tileSize);
      tileY = Math.round(worldY / tileSize);
    }
    
    const { width, height } = surfaceDataRef.current;
    
    if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) return;
    
    const graphics = scene.add.graphics();
    
    // Draw preview area
    if (stateRef.current.editTool === 'tile' || stateRef.current.editTool === 'erase') {
      graphics.lineStyle(2, stateRef.current.editTool === 'erase' ? 0xFF5555 : 0x55FF55, 0.8);
      
      for (let dy = -Math.floor(stateRef.current.brushSize / 2); dy <= Math.floor(stateRef.current.brushSize / 2); dy++) {
        for (let dx = -Math.floor(stateRef.current.brushSize / 2); dx <= Math.floor(stateRef.current.brushSize / 2); dx++) {
          const x = tileX + dx;
          const y = tileY + dy;
          
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          
          graphics.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    } else if (stateRef.current.editTool === 'object') {
      // Show ghost image of the object
      const objectType = Object.values(ObjectTypes).find(o => o.key === stateRef.current.selectedObject);
      if (objectType) {
        const ghost = scene.add.sprite(
          tileX * tileSize + tileSize / 2,
          tileY * tileSize + tileSize / 2,
          objectType.key
        );
        ghost.setOrigin(0.5, 1);
        ghost.setAlpha(0.7);
        ghost.setTint(0x88FF88);
        (scene as any).previewSprite = ghost;
      }
    }
    
    (scene as any).previewGraphics = graphics;
  };

  // Clear preview
  const clearPreview = (scene: Phaser.Scene) => {
    if ((scene as any).previewGraphics) {
      (scene as any).previewGraphics.destroy();
      (scene as any).previewGraphics = null;
    }
    if ((scene as any).previewSprite) {
      (scene as any).previewSprite.destroy();
      (scene as any).previewSprite = null;
    }
  };

  // Update loop
  const update = function (this: Phaser.Scene) {
    const cursors = (this as any).cursors;
    const camera = this.cameras.main;
    
    // Smooth camera movement
    const speed = 5 / camera.zoom;
    
    if (cursors?.left.isDown) {
      camera.scrollX -= speed;
    } else if (cursors?.right.isDown) {
      camera.scrollX += speed;
    }
    
    if (cursors?.up.isDown) {
      camera.scrollY -= speed;
    } else if (cursors?.down.isDown) {
      camera.scrollY += speed;
    }
  };

  // Render the surface
  const renderSurface = (scene: Phaser.Scene) => {
    const tileGroup = (scene as any).tileGroup as Phaser.GameObjects.Group;
    const objectGroup = (scene as any).objectGroup as Phaser.GameObjects.Group;
    
    // Clear existing
    tileGroup.clear(true, true);
    objectGroup.clear(true, true);
    
    const { tiles, objects } = surfaceDataRef.current;
    const tileSize = 16;
    
    // Render tiles
    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = tiles[y][x];
        const sprite = scene.add.sprite(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tile.tileType
        );
        tileGroup.add(sprite);
      }
    }
    
    // Render objects
    objects.forEach((obj) => {
      const sprite = scene.add.sprite(
        obj.x * tileSize + tileSize / 2,
        obj.y * tileSize + tileSize / 2,
        obj.objectType
      );
      sprite.setOrigin(0.5, 1);
      objectGroup.add(sprite);
      obj.sprite = sprite;
    });
  };

  // Handle surface editing
  const handleSurfaceEdit = (scene: Phaser.Scene, worldX: number, worldY: number) => {
    const tileSize = 16;
    let tileX = Math.floor(worldX / tileSize);
    let tileY = Math.floor(worldY / tileSize);
    
    // Apply snap-to-grid if enabled
    if (stateRef.current.snapToGrid) {
      tileX = Math.round(worldX / tileSize);
      tileY = Math.round(worldY / tileSize);
    }
    
    const { tiles, objects, width, height } = surfaceDataRef.current;
    
    if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) return;
    
    let changed = false;
    const currentState = stateRef.current;
    
    // Apply brush size
    for (let dy = -Math.floor(currentState.brushSize / 2); dy <= Math.floor(currentState.brushSize / 2); dy++) {
      for (let dx = -Math.floor(currentState.brushSize / 2); dx <= Math.floor(currentState.brushSize / 2); dx++) {
        const x = tileX + dx;
        const y = tileY + dy;
        
        if (x < 0 || x >= width || y < 0 || y >= height) continue;
        
        if (currentState.editTool === 'tile') {
          if (tiles[y][x].tileType !== currentState.selectedTile) {
            tiles[y][x] = {
              x,
              y,
              tileType: currentState.selectedTile,
              color: getTileColor(currentState.selectedTile)
            };
            changed = true;
          }
        } else if (currentState.editTool === 'object') {
          const existingIndex = objects.findIndex(obj => obj.x === x && obj.y === y);
          if (existingIndex >= 0) {
            if (objects[existingIndex].objectType !== currentState.selectedObject) {
              objects[existingIndex].objectType = currentState.selectedObject;
              changed = true;
            }
          } else {
            objects.push({ x, y, objectType: currentState.selectedObject });
            changed = true;
          }
        } else if (currentState.editTool === 'erase') {
          const existingIndex = objects.findIndex(obj => obj.x === x && obj.y === y);
          if (existingIndex >= 0) {
            objects.splice(existingIndex, 1);
            changed = true;
          }
        }
      }
    }
    
    if (changed) {
      renderSurface(scene);
    }
  };

  // Quick terrain generation
  const generateTerrain = (type: 'random' | 'islands' | 'rivers' | 'clear') => {
    const { width, height } = surfaceDataRef.current;
    const tiles: TileData[][] = [];
    
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        let tileType 
        
        switch (type) {
          case 'random':
            const tileOptions = Object.values(TileTypes);
            tileType = tileOptions[Math.floor(Math.random() * tileOptions.length)].key;
            break;
          case 'islands':
            const centerX = width / 2;
            const centerY = height / 2;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            tileType = distance > 15 ? TileTypes.WATER.key : 
                      distance > 12 ? TileTypes.SAND.key : TileTypes.GRASS.key;
            break;
          case 'rivers':
            tileType = (Math.abs(x - width/2) < 3 || Math.abs(y - height/2) < 3) 
              ? TileTypes.WATER.key : TileTypes.GRASS.key;
            break;
          case 'clear':
            tileType = TileTypes.GRASS.key;
            break;
          default:
            tileType=TileTypes.GRASS.key;
        }
        
        tiles[y][x] = {
          x, y, tileType,
          color: getTileColor(tileType)
        };
      }
    }
    
    surfaceDataRef.current.tiles = tiles;
    if (type === 'clear') {
      surfaceDataRef.current.objects = [];
    }
    
    if (sceneRef.current) {
      renderSurface(sceneRef.current);
    }
  };

  // Export surface data
  const exportSurface = () => {
    const dataStr = JSON.stringify(surfaceDataRef.current, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'surface-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import surface data
  const importSurface = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        surfaceDataRef.current = data;
        if (sceneRef.current) {
          renderSurface(sceneRef.current);
        }
      } catch (error) {
        console.error('Failed to import surface data:', error);
        alert('Failed to import file. Please check if it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    if (sceneRef.current) {
      renderGrid(sceneRef.current);
    }
  };

  const resetSurface = () => {
    initializeSurface();
    if (sceneRef.current) {
      renderSurface(sceneRef.current);
    }
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh', 
      backgroundColor: '#0f172a',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden'
    }}>
      {/* Game Canvas */}
      <div ref={parentRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Top Toolbar */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15, 23, 42, 0.95)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '12px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(94, 234, 212, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 10
      }}>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          style={{
            padding: '8px 16px',
            background: isEditMode ? 'linear-gradient(145deg, #0ea5e9, #0891b2)' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isEditMode ? '🎨 Edit Mode' : '👁️ View Mode'}
        </button>
        
        <button
          onClick={toggleGrid}
          style={{
            padding: '8px 12px',
            background: showGrid ? 'linear-gradient(145deg, #0ea5e9, #0891b2)' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🔳</span> Grid
        </button>
        
        <button
          onClick={() => setSnapToGrid(!snapToGrid)}
          style={{
            padding: '8px 12px',
            background: snapToGrid ? 'linear-gradient(145deg, #0ea5e9, #0891b2)' : '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>⧉</span> Snap
        </button>
        
        <select
          onChange={(e) => generateTerrain(e.target.value as any)}
          style={{
            padding: '8px 12px',
            background: '#334155',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
          defaultValue=""
        >
          <option value="" disabled>🌍 Generate Terrain</option>
          <option value="clear">Clear All</option>
          <option value="random">Random</option>
          <option value="islands">Islands</option>
          <option value="rivers">Rivers</option>
        </select>
      </div>

      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        top: 80,
        right: isPanelCollapsed ? -280 : 10,
        background: 'rgba(15, 23, 42, 0.95)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        width: '300px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(94, 234, 212, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        transition: 'right 0.3s ease',
        zIndex: 10
      }}>
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          style={{
            position: 'absolute',
            left: -40,
            top: 20,
            width: 40,
            height: 40,
            background: 'rgba(15, 23, 42, 0.95)',
            color: 'white',
            border: '1px solid rgba(94, 234, 212, 0.2)',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isPanelCollapsed ? '◀' : '▶'}
        </button>

        <h3 style={{ 
          margin: '0 0 20px 0', 
          textAlign: 'center',
          color: '#5eead4',
          fontWeight: 600
        }}>
          🌎 World Editor
        </h3>

        {isEditMode && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>🛠️ Editing Tools</h4>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[
                { key: 'tile', name: 'Tile', emoji: '🟫' },
                { key: 'object', name: 'Object', emoji: '🌳' },
                { key: 'erase', name: 'Erase', emoji: '🗑️' }
              ].map(tool => (
                <button
                  key={tool.key}
                  onClick={() => setEditTool(tool.key as any)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: editTool === tool.key 
                      ? 'linear-gradient(145deg, #0ea5e9, #0891b2)' 
                      : '#334155',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '14px',
                    fontWeight: editTool === tool.key ? 600 : 400
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{tool.emoji}</span>
                  {tool.name}
                </button>
              ))}
            </div>

            {/* Brush Size */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#cbd5e1' }}>
                🖌️ Brush Size: {brushSize}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button 
                  onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
                  style={{ 
                    padding: '4px 10px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={() => setBrushSize(Math.min(5, brushSize + 1))}
                  style={{ 
                    padding: '4px 10px',
                    background: '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Tile Selection */}
            {editTool === 'tile' && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>🟫 Tile Selection</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {Object.values(TileTypes).map(tile => (
                    <button
                      key={tile.key}
                      onClick={() => setSelectedTile(tile.key)}
                      style={{
                        padding: '10px',
                        background: selectedTile === tile.key 
                          ? 'linear-gradient(145deg, #0ea5e9, #0891b2)' 
                          : '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px'
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          background: `#${tile.color.toString(16).padStart(6, '0')}`,
                          borderRadius: '4px',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      />
                      <span>{tile.emoji}</span>
                      <span>{tile.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Object Selection */}
            {editTool === 'object' && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>🌳 Object Selection</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {Object.values(ObjectTypes).map(obj => (
                    <button
                      key={obj.key}
                      onClick={() => setSelectedObject(obj.key)}
                      style={{
                        padding: '10px',
                        background: selectedObject === obj.key 
                          ? 'linear-gradient(145deg, #0ea5e9, #0891b2)' 
                          : '#334155',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '14px'
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{obj.emoji}</span>
                      <span>{obj.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ padding: '15px 0', borderTop: '1px solid rgba(94, 234, 212, 0.2)' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#cbd5e1' }}>⚡ Quick Actions</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={exportSurface}
              style={{
                padding: '12px',
                background: 'linear-gradient(145deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 500
              }}
            >
              💾 Export
            </button>
            
            <label style={{
              padding: '12px',
              background: 'linear-gradient(145deg, #8b5cf6, #7c3aed)',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 500
            }}>
              📁 Import
              <input
                type="file"
                accept=".json"
                onChange={importSurface}
                style={{ display: 'none' }}
              />
            </label>
            
            <button
              onClick={resetSurface}
              style={{
                padding: '12px',
                background: 'linear-gradient(145deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 500
              }}
            >
              🔄 Reset
            </button>
            
            <button
              onClick={() => generateTerrain('clear')}
              style={{
                padding: '12px',
                background: 'linear-gradient(145deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 500
              }}
            >
              🧹 Clear All
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div style={{ padding: '15px 0', borderTop: '1px solid rgba(94, 234, 212, 0.2)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>📊 World Stats</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px',
            fontSize: '14px',
            color: '#e2e8f0'
          }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8' }}>Size</div>
              <div>{surfaceDataRef.current.width} × {surfaceDataRef.current.height}</div>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8' }}>Objects</div>
              <div>{surfaceDataRef.current.objects.length}</div>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8' }}>Tool</div>
              <div>
                {editTool === 'tile' ? 'Tile' : 
                 editTool === 'object' ? 'Object' : 'Eraser'}
              </div>
            </div>
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '8px', borderRadius: '8px' }}>
              <div style={{ color: '#94a3b8' }}>Brush</div>
              <div>{brushSize}×{brushSize}</div>
            </div>
          </div>
        </div>

        {/* Controls Help */}
        <div style={{ 
          fontSize: '12px', 
          color: '#94a3b8', 
          paddingTop: '15px', 
          borderTop: '1px solid rgba(94, 234, 212, 0.2)'
        }}>
          <strong>🎮 Controls:</strong>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0 0' }}>
            <li>Arrow keys: Move camera</li>
            <li>Mouse wheel: Zoom in/out</li>
            <li>Click/drag: Paint with selected tool</li>
            <li>Hover: Preview edit area</li>
          </ul>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        background: 'rgba(15, 23, 42, 0.95)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(94, 234, 212, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: isEditMode ? '#10b981' : '#ef4444'
        }} />
        {isEditMode ? (
          <>
            Editing with 
            {editTool === 'tile' ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  background: `#${getTileColor(selectedTile).toString(16).padStart(6, '0')}`,
                  borderRadius: '3px'
                }} />
                {Object.values(TileTypes).find(t => t.key === selectedTile)?.name}
              </>
            ) : editTool === 'object' ? (
              <>
                <span style={{ fontSize: '18px' }}>
                  {Object.values(ObjectTypes).find(o => o.key === selectedObject)?.emoji}
                </span>
                {Object.values(ObjectTypes).find(o => o.key === selectedObject)?.name}
              </>
            ) : (
              <>🗑️ Eraser</>
            )}
            <span style={{ margin: '0 5px' }}>•</span>
            Brush: {brushSize}×{brushSize}
            <span style={{ margin: '0 5px' }}>•</span>
            Grid: {showGrid ? 'ON' : 'OFF'}
            <span style={{ margin: '0 5px' }}>•</span>
            Snap: {snapToGrid ? 'ON' : 'OFF'}
          </>
        ) : (
          <>👁️ Viewing mode - Click Edit Mode to start creating!</>
        )}
      </div>
    </div>
  );
};

export default GameScene;