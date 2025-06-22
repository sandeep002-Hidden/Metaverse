"use client"

import type React from "react"

import { useEffect, useRef, type FC, useState, useCallback } from "react"
import Phaser from "phaser"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Edit3,
  Eye,
  Grid3X3,
  Move,
  Brush,
  TreePine,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Zap,
  Settings,
  ChevronRight,
  ChevronLeft,
  Camera,
  Layers,
  Palette,
  Mountain,
  Waves,
  Sparkles,
} from "lucide-react"

// Types for surface customization
interface TileData {
  x: number
  y: number
  tileType: string
  color: number
}

interface FabricObject {
  type: string
  left: number
  top: number
  width: number
  height: number
  fill: string | any
  stroke?: string
  strokeWidth?: number
  path?: any[]
}

interface FabricJSON {
  version: string
  objects: FabricObject[]
  background?: string
}

interface GameObjects {
  x: number
  y: number
  objectType: string
  width?: number
  height?: number
  sprite?: Phaser.GameObjects.Sprite
}

interface SurfaceData {
  tiles: TileData[][]
  objects: GameObjects[]
  width: number
  height: number
}

// Enhanced tile types with better organization and icons
const TileTypes = {
  GRASS: { key: "grass", name: "Grass", color: 0x4caf50, emoji: "🌱", category: "nature" },
  DIRT: { key: "dirt", name: "Dirt", color: 0x8d6e63, emoji: "🟫", category: "nature" },
  STONE: { key: "stone", name: "Stone", color: 0x607d8b, emoji: "🪨", category: "terrain" },
  WATER: { key: "water", name: "Water", color: 0x2196f3, emoji: "💧", category: "nature" },
  SAND: { key: "sand", name: "Sand", color: 0xffc107, emoji: "🏖️", category: "terrain" },
  WOOD: { key: "wood", name: "Wood", color: 0x795548, emoji: "🪵", category: "material" },
  SNOW: { key: "snow", name: "Snow", color: 0xf5f5f5, emoji: "❄️", category: "terrain" },
  LAVA: { key: "lava", name: "Lava", color: 0xff5722, emoji: "🌋", category: "terrain" },
} as const

// Enhanced object types with categories
const ObjectTypes = {
  TREE: { key: "tree", name: "Tree", emoji: "🌳", width: 1, height: 1, category: "nature" },
  ROCK: { key: "rock", name: "Rock", emoji: "🪨", width: 1, height: 1, category: "terrain" },
  FLOWER: { key: "flower", name: "Flower", emoji: "🌸", width: 1, height: 1, category: "nature" },
  HOUSE: { key: "house", name: "House", emoji: "🏠", width: 3, height: 3, category: "building" },
  TORCH: { key: "torch", name: "Torch", emoji: "🔥", width: 1, height: 1, category: "light" },
  BRIDGE: { key: "bridge", name: "Bridge", emoji: "🌉", width: 2, height: 1, category: "building" },
  CASTLE: { key: "castle", name: "Castle", emoji: "🏰", width: 4, height: 4, category: "building" },
  MUSHROOM: { key: "mushroom", name: "Mushroom", emoji: "🍄", width: 1, height: 1, category: "nature" },
} as const

const EnhancedGameScene: FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<Phaser.Scene | null>(null)

  // Enhanced state management
  const [isEditMode, setIsEditMode] = useState<boolean>(true)
  const [selectedTile, setSelectedTile] = useState<string>("grass")
  const [selectedObject, setSelectedObject] = useState<string>("tree")
  const [brushSize, setBrushSize] = useState<number[]>([1])
  const [editTool, setEditTool] = useState<"tile" | "object" | "erase">("tile")
  const [showGrid, setShowGrid] = useState<boolean>(true)
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false)
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0 })
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<string>("tiles")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastAction, setLastAction] = useState<string>("")

  // Surface data
  const surfaceDataRef = useRef<SurfaceData>({
    tiles: [],
    objects: [],
    width: 50,
    height: 40,
  })

  // Refs for state used in Phaser events
  const stateRef = useRef({
    selectedTile,
    selectedObject,
    editTool,
    brushSize: brushSize[0],
    snapToGrid,
  })

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = {
      selectedTile,
      selectedObject,
      editTool,
      brushSize: brushSize[0],
      snapToGrid,
    }
  }, [selectedTile, selectedObject, editTool, brushSize, snapToGrid])

  // Tile colors mapping
  const getTileColor = useCallback((tileType: string): number => {
    const tileData = Object.values(TileTypes).find((t) => t.key === tileType)
    return tileData?.color || 0x4caf50
  }, [])

  // Initialize surface data with more interesting default terrain
  const initializeSurface = useCallback(() => {
    const { width, height } = surfaceDataRef.current
    const tiles: TileData[][] = []

    for (let y = 0; y < height; y++) {
      tiles[y] = []
      for (let x = 0; x < width; x++) {
        let tileType

        // Create more interesting default terrain
        if ((x > 10 && x < 20 && y > 15 && y < 25) || (x > 30 && x < 40 && y > 5 && y < 15)) {
          tileType = TileTypes.WATER.key
        } else if ((x === 25 && y > 10 && y < 30) || (y === 20 && x > 15 && x < 35)) {
          tileType = TileTypes.DIRT.key
        } else if (x > 35 && y > 25) {
          tileType = TileTypes.SAND.key
        } else if (y < 5) {
          tileType = TileTypes.SNOW.key
        } else {
          tileType = TileTypes.GRASS.key
        }

        tiles[y][x] = {
          x,
          y,
          tileType,
          color: getTileColor(tileType),
        }
      }
    }

    // Add more diverse default objects
    const defaultObjects: GameObjects[] = [
      { x: 5, y: 5, objectType: ObjectTypes.TREE.key, width: 1, height: 1 },
      { x: 8, y: 7, objectType: ObjectTypes.TREE.key, width: 1, height: 1 },
      { x: 12, y: 6, objectType: ObjectTypes.HOUSE.key, width: 3, height: 3 },
      { x: 15, y: 12, objectType: ObjectTypes.FLOWER.key, width: 1, height: 1 },
      { x: 28, y: 18, objectType: ObjectTypes.ROCK.key, width: 1, height: 1 },
      { x: 32, y: 22, objectType: ObjectTypes.TORCH.key, width: 1, height: 1 },
      { x: 22, y: 20, objectType: ObjectTypes.BRIDGE.key, width: 2, height: 1 },
      { x: 40, y: 30, objectType: ObjectTypes.MUSHROOM.key, width: 1, height: 1 },
    ]

    surfaceDataRef.current.tiles = tiles
    surfaceDataRef.current.objects = defaultObjects
  }, [getTileColor])

  const convertFabricToSurface = useCallback(
    (fabricData: FabricJSON): SurfaceData => {
      const width = surfaceDataRef.current.width
      const height = surfaceDataRef.current.height
      const tiles: TileData[][] = []
      const objects: GameObjects[] = []

      // Initialize empty tiles
      for (let y = 0; y < height; y++) {
        tiles[y] = []
        for (let x = 0; x < width; x++) {
          tiles[y][x] = {
            x,
            y,
            tileType: TileTypes.GRASS.key,
            color: getTileColor(TileTypes.GRASS.key),
          }
        }
      }

      // Set background color if provided
      if (fabricData.background) {
        const bgColor = hexToNumber(fabricData.background)
        if (bgColor) {
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              tiles[y][x].color = bgColor
            }
          }
        }
      }

      // Convert Fabric.js objects
      fabricData.objects.forEach((obj) => {
        const tileX = Math.floor(obj.left / 16)
        const tileY = Math.floor(obj.top / 16)
        const tileWidth = Math.max(1, Math.floor(obj.width / 16))
        const tileHeight = Math.max(1, Math.floor(obj.height / 16))

        if (obj.type === "rect" || obj.type === "Rect") {
          const fillColor = typeof obj.fill === "string" ? hexToNumber(obj.fill) : null

          for (let y = tileY; y < tileY + tileHeight && y < height; y++) {
            for (let x = tileX; x < tileX + tileWidth && x < width; x++) {
              if (fillColor) {
                tiles[y][x].color = fillColor
                tiles[y][x].tileType = "stone"
              }

              if (
                obj.stroke &&
                (x === tileX || x === tileX + tileWidth - 1 || y === tileY || y === tileY + tileHeight - 1)
              ) {
                tiles[y][x].tileType = TileTypes.WOOD.key
                tiles[y][x].color = hexToNumber(obj.stroke) || getTileColor(TileTypes.WOOD.key)
              }
            }
          }
        } else if (obj.type === "path" || obj.type === "Path") {
          let objectType = ObjectTypes.ROCK.key

          if (obj.path && obj.path.length > 3) {
            objectType = ObjectTypes.ROCK.key
          }

          objects.push({
            x: tileX,
            y: tileY,
            objectType,
            width: tileWidth,
            height: tileHeight,
          })
        }
      })

      return {
        tiles,
        objects,
        width,
        height,
      }
    },
    [getTileColor],
  )

  const hexToNumber = useCallback((hex: string): number | null => {
    if (!hex || typeof hex !== "string") return null

    const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex

    if (cleanHex.length === 3) {
      const r = Number.parseInt(cleanHex[0] + cleanHex[0], 16)
      const g = Number.parseInt(cleanHex[1] + cleanHex[1], 16)
      const b = Number.parseInt(cleanHex[2] + cleanHex[2], 16)
      return (r << 16) + (g << 8) + b
    }

    if (cleanHex.length === 6) {
      return Number.parseInt(cleanHex, 16)
    }

    return null
  }, [])

  useEffect(() => {
    if (!parentRef.current) return

    initializeSurface()

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      parent: parentRef.current,
      backgroundColor: "#0f172a",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: false,
        },
      },
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [initializeSurface])

  // Enhanced preload with better graphics
  const preload = function (this: Phaser.Scene) {
    sceneRef.current = this

    // Create enhanced tiles with better textures
    Object.values(TileTypes).forEach((tile) => {
      const graphics = this.add.graphics()

      // Base color
      graphics.fillStyle(tile.color)
      graphics.fillRect(0, 0, 16, 16)

      // Add texture based on tile type
      switch (tile.key) {
        case "grass":
          graphics.fillStyle(tile.color - 0x222222)
          for (let i = 0; i < 8; i++) {
            graphics.fillRect(Math.random() * 16, Math.random() * 16, 1, 1)
          }
          break
        case "water":
          graphics.fillStyle(tile.color + 0x333333)
          graphics.fillRect(0, 0, 16, 4)
          graphics.fillRect(0, 8, 16, 4)
          break
        case "stone":
          graphics.fillStyle(tile.color - 0x111111)
          graphics.fillRect(0, 0, 8, 8)
          graphics.fillRect(8, 8, 8, 8)
          break
        case "sand":
          graphics.fillStyle(tile.color - 0x111111)
          for (let i = 0; i < 12; i++) {
            graphics.fillCircle(Math.random() * 16, Math.random() * 16, 0.5)
          }
          break
      }

      // Add depth
      graphics.fillStyle(tile.color - 0x222222)
      graphics.fillRect(0, 0, 16, 1)
      graphics.fillRect(0, 0, 1, 16)

      graphics.fillStyle(tile.color + 0x222222)
      graphics.fillRect(0, 15, 16, 1)
      graphics.fillRect(15, 0, 1, 16)

      graphics.generateTexture(tile.key, 16, 16)
      graphics.destroy()
    })

    // Enhanced object sprites
    Object.values(ObjectTypes).forEach((obj) => {
      const graphics = this.add.graphics()

      switch (obj.key) {
        case "tree":
          graphics.fillStyle(0x2e7d32)
          graphics.fillCircle(8, 8, 7)
          graphics.fillStyle(0x1b5e20)
          graphics.fillCircle(6, 6, 4)
          graphics.fillStyle(0x8d6e63)
          graphics.fillRect(6, 14, 4, 6)
          break
        case "rock":
          graphics.fillStyle(0x424242)
          graphics.fillEllipse(8, 10, 12, 8)
          graphics.fillStyle(0x616161)
          graphics.fillEllipse(6, 8, 6, 4)
          break
        case "flower":
          graphics.fillStyle(0xe91e63)
          for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5
            graphics.fillCircle(8 + Math.cos(angle) * 3, 8 + Math.sin(angle) * 3, 2)
          }
          graphics.fillStyle(0xffeb3b)
          graphics.fillCircle(8, 8, 2)
          graphics.fillStyle(0x4caf50)
          graphics.fillRect(7, 12, 2, 4)
          break
        case "house":
          graphics.fillStyle(0x8d6e63)
          graphics.fillRect(2, 10, 12, 10)
          graphics.fillStyle(0xf44336)
          graphics.fillTriangle(2, 10, 14, 10, 8, 4)
          graphics.fillStyle(0x5d4037)
          graphics.fillRect(6, 14, 4, 6)
          graphics.fillStyle(0x2196f3)
          graphics.fillRect(10, 12, 2, 2)
          break
        case "torch":
          graphics.fillStyle(0x8d6e63)
          graphics.fillRect(7, 8, 2, 12)
          graphics.fillStyle(0xff5722)
          graphics.fillEllipse(8, 6, 6, 8)
          graphics.fillStyle(0xffeb3b)
          graphics.fillEllipse(8, 5, 4, 5)
          break
        case "bridge":
          graphics.fillStyle(0x8d6e63)
          graphics.fillRect(0, 6, 32, 4)
          graphics.fillStyle(0x5d4037)
          graphics.fillRect(4, 4, 2, 8)
          graphics.fillRect(26, 4, 2, 8)
          break
        case "castle":
          graphics.fillStyle(0x607d8b)
          graphics.fillRect(0, 8, 64, 32)
          graphics.fillStyle(0x455a64)
          graphics.fillRect(0, 0, 16, 16)
          graphics.fillRect(48, 0, 16, 16)
          graphics.fillRect(24, 4, 16, 12)
          break
        case "mushroom":
          graphics.fillStyle(0xf5f5f5)
          graphics.fillRect(7, 8, 2, 8)
          graphics.fillStyle(0xf44336)
          graphics.fillEllipse(8, 8, 12, 8)
          graphics.fillStyle(0xffffff)
          graphics.fillCircle(6, 6, 1)
          graphics.fillCircle(10, 7, 1)
          break
      }

      graphics.generateTexture(obj.key, obj.width * 16, obj.height * 16)
      graphics.destroy()
    })
  }

  // Enhanced create function
  const create = function (this: Phaser.Scene) {
    

    const tileGroup = this.add.group()
    const objectGroup = this.add.group()
    const gridGroup = this.add.group()
    ;(this as any).tileGroup = tileGroup
    ;(this as any).objectGroup = objectGroup
    ;(this as any).gridGroup = gridGroup

    renderSurface(this)
    renderGrid(this)

    const cursors = this.input.keyboard?.createCursorKeys()
    ;(this as any).cursors = cursors

    // Enhanced camera controls
    this.input.on("wheel", (_pointer: any, _gameObjects: any, _deltaX: number, deltaY: number) => {
      const camera = this.cameras.main
      const zoomAmount = deltaY > 0 ? -0.1 : 0.1
      const newZoom = Phaser.Math.Clamp(camera.zoom + zoomAmount, 0.3, 3)

      this.tweens.add({
        targets: camera,
        zoom: newZoom,
        duration: 100,
        ease: "Power2.easeOut",
        onUpdate: () => {
          setZoomLevel(camera.zoom)
        },
      })
    })

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!isEditMode) return
      handleSurfaceEdit(this, pointer.worldX, pointer.worldY)
    })

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (!isEditMode) {
        clearPreview(this)
        return
      }

      if (pointer.isDown) {
        handleSurfaceEdit(this, pointer.worldX, pointer.worldY)
      } else {
        showEditPreview(this, pointer.worldX, pointer.worldY)
      }
    })

    this.cameras.main.on("postupdate", () => {
      setCameraPosition({
        x: this.cameras.main.scrollX,
        y: this.cameras.main.scrollY,
      })
      setZoomLevel(this.cameras.main.zoom)
    })
  }

  // Enhanced grid rendering
  const renderGrid = (scene: Phaser.Scene) => {
    const gridGroup = (scene as any).gridGroup as Phaser.GameObjects.Group
    gridGroup.clear(true, true)

    if (!showGrid) return

    const { width, height } = surfaceDataRef.current
    const tileSize = 16

    const graphics = scene.add.graphics()
    graphics.lineStyle(1, 0x64748b, 0.3)

    for (let x = 0; x <= width; x++) {
      graphics.moveTo(x * tileSize, 0)
      graphics.lineTo(x * tileSize, height * tileSize)
    }

    for (let y = 0; y <= height; y++) {
      graphics.moveTo(0, y * tileSize)
      graphics.lineTo(width * tileSize, y * tileSize)
    }

    graphics.strokePath()
    gridGroup.add(graphics)
  }

  const showEditPreview = (scene: Phaser.Scene, worldX: number, worldY: number) => {
    clearPreview(scene)

    const tileSize = 16
    let tileX = Math.floor(worldX / tileSize)
    let tileY = Math.floor(worldY / tileSize)

    if (stateRef.current.snapToGrid) {
      tileX = Math.round(worldX / tileSize)
      tileY = Math.round(worldY / tileSize)
    }

    const { width, height } = surfaceDataRef.current

    if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) return

    const graphics = scene.add.graphics()

    if (stateRef.current.editTool === "tile" || stateRef.current.editTool === "erase") {
      graphics.lineStyle(2, stateRef.current.editTool === "erase" ? 0xef4444 : 0x10b981, 0.8)

      for (
        let dy = -Math.floor(stateRef.current.brushSize / 2);
        dy <= Math.floor(stateRef.current.brushSize / 2);
        dy++
      ) {
        for (
          let dx = -Math.floor(stateRef.current.brushSize / 2);
          dx <= Math.floor(stateRef.current.brushSize / 2);
          dx++
        ) {
          const x = tileX + dx
          const y = tileY + dy

          if (x < 0 || x >= width || y < 0 || y >= height) continue

          graphics.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize)
        }
      }
    } else if (stateRef.current.editTool === "object") {
      const objectType = Object.values(ObjectTypes).find((o) => o.key === stateRef.current.selectedObject)
      if (objectType) {
        const objWidth = objectType.width || 1
        const objHeight = objectType.height || 1

        graphics.lineStyle(2, 0x10b981, 0.8)
        for (let y = 0; y < objHeight; y++) {
          for (let x = 0; x < objWidth; x++) {
            const xPos = (tileX + x) * tileSize
            const yPos = (tileY + y) * tileSize
            graphics.strokeRect(xPos, yPos, tileSize, tileSize)
          }
        }

        const ghost = scene.add.sprite(
          tileX * tileSize + (objWidth * tileSize) / 2,
          tileY * tileSize + (objHeight * tileSize) / 2,
          objectType.key,
        )
        ghost.setOrigin(0.5, 1)
        ghost.setAlpha(0.7)
        ghost.setTint(0x88ff88)

        if (objWidth > 1 || objHeight > 1) {
          ghost.setScale(objWidth, objHeight)
        }
        ;(scene as any).previewSprite = ghost
      }
    }
    ;(scene as any).previewGraphics = graphics
  }

  const clearPreview = (scene: Phaser.Scene) => {
    if ((scene as any).previewGraphics) {
      ;(scene as any).previewGraphics.destroy()
      ;(scene as any).previewGraphics = null
    }
    if ((scene as any).previewSprite) {
      ;(scene as any).previewSprite.destroy()
      ;(scene as any).previewSprite = null
    }
  }

  const update = function (this: Phaser.Scene) {
    const cursors = (this as any).cursors
    const camera = this.cameras.main

    const speed = 5 / camera.zoom

    if (cursors?.left.isDown) {
      camera.scrollX -= speed
    } else if (cursors?.right.isDown) {
      camera.scrollX += speed
    }

    if (cursors?.up.isDown) {
      camera.scrollY -= speed
    } else if (cursors?.down.isDown) {
      camera.scrollY += speed
    }
  }

  const renderSurface = (scene: Phaser.Scene) => {
    const tileGroup = (scene as any).tileGroup as Phaser.GameObjects.Group
    const objectGroup = (scene as any).objectGroup as Phaser.GameObjects.Group

    tileGroup.clear(true, true)
    objectGroup.clear(true, true)

    const { tiles, objects } = surfaceDataRef.current
    const tileSize = 16

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y].length; x++) {
        const tile = tiles[y][x]
        const sprite = scene.add.sprite(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tile.tileType)
        tileGroup.add(sprite)
      }
    }

    objects.forEach((obj) => {
      const objectType = Object.values(ObjectTypes).find((o) => o.key === obj.objectType)
      const width = objectType?.width || 1
      const height = objectType?.height || 1

      const sprite = scene.add.sprite(
        obj.x * tileSize + (width * tileSize) / 2,
        obj.y * tileSize + (height * tileSize) / 2,
        obj.objectType,
      )
      sprite.setOrigin(0.5, 1)

      if (width > 1 || height > 1) {
        sprite.setScale(width, height)
      }

      objectGroup.add(sprite)
      obj.sprite = sprite
    })
  }

  const handleSurfaceEdit = (scene: Phaser.Scene, worldX: number, worldY: number) => {
    const tileSize = 16
    let tileX = Math.floor(worldX / tileSize)
    let tileY = Math.floor(worldY / tileSize)

    if (stateRef.current.snapToGrid) {
      tileX = Math.round(worldX / tileSize)
      tileY = Math.round(worldY / tileSize)
    }

    const { tiles, objects, width, height } = surfaceDataRef.current

    if (tileX < 0 || tileX >= width || tileY < 0 || tileY >= height) return

    let changed = false
    const currentState = stateRef.current

    for (let dy = -Math.floor(currentState.brushSize / 2); dy <= Math.floor(currentState.brushSize / 2); dy++) {
      for (let dx = -Math.floor(currentState.brushSize / 2); dx <= Math.floor(currentState.brushSize / 2); dx++) {
        const x = tileX + dx
        const y = tileY + dy

        if (x < 0 || x >= width || y < 0 || y >= height) continue

        if (currentState.editTool === "tile") {
          if (tiles[y][x].tileType !== currentState.selectedTile) {
            tiles[y][x] = {
              x,
              y,
              tileType: currentState.selectedTile,
              color: getTileColor(currentState.selectedTile),
            }
            changed = true
          }
        } else if (currentState.editTool === "object") {
          const objectType = Object.values(ObjectTypes).find((o) => o.key === currentState.selectedObject)
          const objWidth = objectType?.width || 1
          const objHeight = objectType?.height || 1

          let areaClear = true
          for (let oy = 0; oy < objHeight; oy++) {
            for (let ox = 0; ox < objWidth; ox++) {
              const checkX = x + ox
              const checkY = y + oy

              if (checkX >= width || checkY >= height) {
                areaClear = false
                break
              }

              const existingObject = objects.find((obj) => {
                const objType = Object.values(ObjectTypes).find((o) => o.key === obj.objectType)
                const objW = objType?.width || 1
                const objH = objType?.height || 1

                return checkX >= obj.x && checkX < obj.x + objW && checkY >= obj.y && checkY < obj.y + objH
              })

              if (existingObject) {
                areaClear = false
                break
              }
            }
            if (!areaClear) break
          }

          if (areaClear) {
            for (let oy = 0; oy < objHeight; oy++) {
              for (let ox = 0; ox < objWidth; ox++) {
                const checkX = x + ox
                const checkY = y + oy

                const index = objects.findIndex((obj) => obj.x === checkX && obj.y === checkY)

                if (index >= 0) {
                  objects.splice(index, 1)
                }
              }
            }

            objects.push({
              x,
              y,
              objectType: currentState.selectedObject,
              width: objWidth,
              height: objHeight,
            })
            changed = true
          }
        } else if (currentState.editTool === "erase") {
          const index = objects.findIndex((obj) => {
            const objectType = Object.values(ObjectTypes).find((o) => o.key === obj.objectType)
            const objWidth = objectType?.width || 1
            const objHeight = objectType?.height || 1

            return x >= obj.x && x < obj.x + objWidth && y >= obj.y && y < obj.y + objHeight
          })

          if (index >= 0) {
            objects.splice(index, 1)
            changed = true
          }
        }
      }
    }

    if (changed) {
      renderSurface(scene)
      setLastAction(
        `${currentState.editTool === "tile" ? "Painted" : currentState.editTool === "object" ? "Placed" : "Erased"} at (${tileX}, ${tileY})`,
      )
    }
  }

  const generateTerrain = async (type: "random" | "islands" | "rivers" | "clear") => {
    setIsLoading(true)
    setLastAction(`Generating ${type} terrain...`)

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const { width, height } = surfaceDataRef.current
    const tiles: TileData[][] = []

    for (let y = 0; y < height; y++) {
      tiles[y] = []
      for (let x = 0; x < width; x++) {
        let tileType

        switch (type) {
          case "random":
            const tileOptions = Object.values(TileTypes)
            tileType = tileOptions[Math.floor(Math.random() * tileOptions.length)].key
            break
          case "islands":
            const centerX = width / 2
            const centerY = height / 2
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
            tileType = distance > 15 ? TileTypes.WATER.key : distance > 12 ? TileTypes.SAND.key : TileTypes.GRASS.key
            break
          case "rivers":
            tileType =
              Math.abs(x - width / 2) < 3 || Math.abs(y - height / 2) < 3 ? TileTypes.WATER.key : TileTypes.GRASS.key
            break
          case "clear":
            tileType = TileTypes.GRASS.key
            break
          default:
            tileType = TileTypes.GRASS.key
        }

        tiles[y][x] = {
          x,
          y,
          tileType,
          color: getTileColor(tileType),
        }
      }
    }

    surfaceDataRef.current.tiles = tiles
    if (type === "clear") {
      surfaceDataRef.current.objects = []
    }

    if (sceneRef.current) {
      renderSurface(sceneRef.current)
    }

    setIsLoading(false)
    setLastAction(`Generated ${type} terrain successfully`)
  }

  const exportSurface = () => {
    const dataStr = JSON.stringify(surfaceDataRef.current, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `world-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    setLastAction("World exported successfully")
  }

  const importSurface = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setLastAction("Importing world...")

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.version && data.objects) {
          const fabricData = data as FabricJSON
          surfaceDataRef.current = convertFabricToSurface(fabricData)
        } else {
          surfaceDataRef.current = data
        }

        if (sceneRef.current) {
          renderSurface(sceneRef.current)
        }

        setLastAction("World imported successfully")
      } catch (error) {
        console.error("Failed to import surface data:", error)
        setLastAction("Failed to import world")
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsText(file)
  }

  const toggleGrid = () => {
    setShowGrid(!showGrid)
    if (sceneRef.current) {
      renderGrid(sceneRef.current)
    }
  }

  const resetSurface = () => {
    initializeSurface()
    if (sceneRef.current) {
      renderSurface(sceneRef.current)
    }
    setLastAction("World reset to default")
  }

  // Filter tiles and objects by category
  const getFilteredTiles = () => {
    if (selectedCategory === "all") return Object.values(TileTypes)
    return Object.values(TileTypes).filter((tile) => tile.category === selectedCategory)
  }

  const getFilteredObjects = () => {
    if (selectedCategory === "all") return Object.values(ObjectTypes)
    return Object.values(ObjectTypes).filter((obj) => obj.category === selectedCategory)
  }

  return (
    <TooltipProvider>
      <div className="relative w-full h-screen bg-slate-900 font-sans overflow-hidden">
        {/* Game Canvas */}
        <div ref={parentRef} className="w-full h-full" />

        {/* Enhanced Top Toolbar */}
        <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-slate-800/95 border-slate-700 backdrop-blur-lg z-10">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsEditMode(!isEditMode)}
                    variant={isEditMode ? "default" : "secondary"}
                    size="sm"
                    className="gap-2"
                  >
                    {isEditMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {isEditMode ? "Edit Mode" : "View Mode"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle between edit and view modes</p>
                </TooltipContent>
              </Tooltip>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={toggleGrid} variant={showGrid ? "default" : "outline"} size="sm">
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle grid overlay</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setSnapToGrid(!snapToGrid)}
                      variant={snapToGrid ? "default" : "outline"}
                      size="sm"
                    >
                      <Move className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle snap to grid</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <Select onValueChange={(value) => generateTerrain(value as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Generate Terrain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Clear All
                    </div>
                  </SelectItem>
                  <SelectItem value="random">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Random
                    </div>
                  </SelectItem>
                  <SelectItem value="islands">
                    <div className="flex items-center gap-2">
                      <Mountain className="w-4 h-4" />
                      Islands
                    </div>
                  </SelectItem>
                  <SelectItem value="rivers">
                    <div className="flex items-center gap-2">
                      <Waves className="w-4 h-4" />
                      Rivers
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Control Panel */}
        <Card
          className={`absolute top-20 transition-all duration-300 ease-in-out bg-slate-800/95 border-slate-700 backdrop-blur-lg z-10 ${
            isPanelCollapsed ? "right-[-320px]" : "right-4"
          }`}
        >
          <Button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className="absolute left-[-40px] top-4 w-10 h-10 rounded-full bg-slate-800 border-slate-700"
            size="sm"
          >
            {isPanelCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>

          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-100">
              <Settings className="w-5 h-5" />
              World Editor
            </CardTitle>
          </CardHeader>

          <CardContent className="w-80 max-h-[70vh] overflow-y-auto space-y-4">
            {isEditMode && (
              <>
                {/* Tool Selection */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Editing Tools
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "tile", name: "Tile", icon: Palette },
                      { key: "object", name: "Object", icon: TreePine },
                      { key: "erase", name: "Erase", icon: Trash2 },
                    ].map((tool) => (
                      <Button
                        key={tool.key}
                        onClick={() => setEditTool(tool.key as any)}
                        variant={editTool === tool.key ? "default" : "outline"}
                        className="flex flex-col gap-1 h-auto py-3"
                        size="sm"
                      >
                        <tool.icon className="w-4 h-4" />
                        <span className="text-xs">{tool.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Brush Size */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Brush className="w-4 h-4" />
                      Brush Size
                    </label>
                    <Badge variant="secondary">
                      {brushSize[0]}×{brushSize[0]}
                    </Badge>
                  </div>
                  <Slider value={brushSize} onValueChange={setBrushSize} max={5} min={1} step={1} className="w-full" />
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-300">Category Filter</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="building">Buildings</SelectItem>
                      <SelectItem value="material">Materials</SelectItem>
                      <SelectItem value="light">Lighting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Tile/Object Selection */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tiles" disabled={editTool !== "tile"}>
                      Tiles
                    </TabsTrigger>
                    <TabsTrigger value="objects" disabled={editTool !== "object"}>
                      Objects
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tiles" className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {getFilteredTiles().map((tile) => (
                        <Button
                          key={tile.key}
                          onClick={() => setSelectedTile(tile.key)}
                          variant={selectedTile === tile.key ? "default" : "outline"}
                          className="flex items-center gap-2 h-auto p-3"
                        >
                          <div
                            className="w-4 h-4 rounded border border-slate-600"
                            style={{ backgroundColor: `#${tile.color.toString(16).padStart(6, "0")}` }}
                          />
                          <div className="flex flex-col items-start">
                            <span className="text-xs">{tile.emoji}</span>
                            <span className="text-xs">{tile.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="objects" className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                      {getFilteredObjects().map((obj) => (
                        <Button
                          key={obj.key}
                          onClick={() => setSelectedObject(obj.key)}
                          variant={selectedObject === obj.key ? "default" : "outline"}
                          className="flex items-center gap-2 h-auto p-3"
                        >
                          <span className="text-lg">{obj.emoji}</span>
                          <div className="flex flex-col items-start">
                            <span className="text-xs">{obj.name}</span>
                            <span className="text-xs text-slate-400">
                              {obj.width}×{obj.height}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={exportSurface} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>

                <Button asChild variant="outline" size="sm" className="gap-2">
                  <label>
                    <Upload className="w-4 h-4" />
                    Import
                    <input type="file" accept=".json" onChange={importSurface} className="hidden" />
                  </label>
                </Button>

                <Button onClick={resetSurface} variant="outline" size="sm" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>

                <Button onClick={() => generateTerrain("clear")} variant="outline" size="sm" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>

            <Separator />

            {/* Enhanced Statistics */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">World Statistics</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <div className="text-xs text-slate-400">Size</div>
                  <div className="text-sm font-medium">
                    {surfaceDataRef.current.width} × {surfaceDataRef.current.height}
                  </div>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <div className="text-xs text-slate-400">Objects</div>
                  <div className="text-sm font-medium">{surfaceDataRef.current.objects.length}</div>
                </div>
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <div className="text-xs text-slate-400">Zoom</div>
                  <div className="text-sm font-medium">{Math.round(zoomLevel * 100)}%</div>
                </div>    
                <div className="bg-slate-700/50 p-2 rounded-lg">
                  <div className="text-xs text-slate-400">Tool</div>
                  <div className="text-sm font-medium capitalize">{editTool}</div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300">Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-slate-300">Show Grid</label>
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-slate-300">Snap to Grid</label>
                  <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                </div>
              </div>
            </div>

            {/* Controls Help */}
            <div className="text-xs text-slate-400 space-y-1">
              <div className="font-medium">Controls:</div>
              <ul className="space-y-1 pl-2">
                <li>• Arrow keys: Move camera</li>
                <li>• Mouse wheel: Zoom in/out</li>
                <li>• Click/drag: Paint with selected tool</li>
                <li>• Hover: Preview edit area</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Status Bar */}
        <Card className="absolute bottom-4 left-4 bg-slate-800/95 border-slate-700 backdrop-blur-lg z-10">
          <CardContent className="p-3">
            <div className="flex items-center gap-3 text-sm">
              <div className={`w-2 h-2 rounded-full ${isEditMode ? "bg-green-500" : "bg-red-500"}`} />
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <span>Editing with</span>
                  {editTool === "tile" ? (
                    <>
                      <div
                        className="w-3 h-3 rounded border"
                        style={{ backgroundColor: `#${getTileColor(selectedTile).toString(16).padStart(6, "0")}` }}
                      />
                      <span>{Object.values(TileTypes).find((t) => t.key === selectedTile)?.name}</span>
                    </>
                  ) : editTool === "object" ? (
                    <>
                      <span>{Object.values(ObjectTypes).find((o) => o.key === selectedObject)?.emoji}</span>
                      <span>{Object.values(ObjectTypes).find((o) => o.key === selectedObject)?.name}</span>
                    </>
                  ) : (
                    <span>Eraser</span>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {brushSize[0]}×{brushSize[0]}
                  </Badge>
                </div>
              ) : (
                <span>View mode - Enable edit mode to start creating</span>
              )}
              {isLoading && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-blue-400">Loading...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Camera Position Indicator */}
        <Card className="absolute top-4 left-4 bg-slate-800/95 border-slate-700 backdrop-blur-lg z-10">
          <CardContent className="p-2">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Camera className="w-3 h-3" />
              <span>
                ({Math.round(cameraPosition.x)}, {Math.round(cameraPosition.y)})
              </span>
              <span>•</span>
              <span>{Math.round(zoomLevel * 100)}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Last Action Indicator */}
        {lastAction && (
          <Card className="absolute bottom-4 right-4 bg-slate-800/95 border-slate-700 backdrop-blur-lg z-10">
            <CardContent className="p-2">
              <div className="text-xs text-slate-300">{lastAction}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}

export default EnhancedGameScene
