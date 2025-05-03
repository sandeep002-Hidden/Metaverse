import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { useUser } from "@/context/userContext/usercontext";
import * as fabric from "fabric";

interface Asset {
  id: string;
  ShapeName: string;
  Properties: {
    version: string;
    background: string;
    objects: any;
  };
  Category?: string;
  AccessSpecifier?: string;
}

export default function MyAssets() {
  const { user } = useUser();
  const canvasContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const canvasRefs = useRef<{ [key: string]: fabric.Canvas | null }>({});

  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [response, setResponse] = useState({ message: "", isGood: true });
  const [loading, setLoading] = useState(true);

  const getMyAssets = async () => {
    try {
      setLoading(true);
      const getMyAssetsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/assets/getUserAssets/${user?.id}`,
        { withCredentials: true }
      );

      if (getMyAssetsResponse.data.success) {
        const assets =
          getMyAssetsResponse.data.userAssets ||
          getMyAssetsResponse.data.assets ||
          getMyAssetsResponse.data.designs ||
          [];
        setUserAssets(assets);
        setResponse({ message: "Got User Assets", isGood: true });
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      setResponse({ message: "Failed to get User Assets", isGood: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getMyAssets();
    }
  }, [user?.id]);

  useEffect(() => {
    if (response.message) {
      const timer = setTimeout(() => {
        setResponse({ message: "", isGood: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [response]);

  useEffect(() => {
    if (loading) return;

    Object.values(canvasRefs.current).forEach((canvas) => {
      if (canvas) {
        canvas.dispose();
      }
    });
    canvasRefs.current = {};

    const renderCanvasTimeout = setTimeout(() => {
      userAssets.forEach((asset) => {
        const containerId = asset.id;
        const containerElement = canvasContainerRefs.current[containerId];

        if (containerElement) {
          containerElement.innerHTML = "";

          const canvasElement = document.createElement("canvas");
          containerElement.appendChild(canvasElement);

          try {
            const canvas = new fabric.Canvas(canvasElement, {
              width: 250,
              height: 200,
              backgroundColor: asset.Properties.background,
              selection: false,
            });

            canvasRefs.current[containerId] = canvas;

            const jsonString = asset.Properties || "[]";
            let jsonData;

            try {
              jsonData =
                typeof jsonString === "string"
                  ? JSON.parse(jsonString)
                  : jsonString;
            } catch (e) {
              console.error("Failed to parse JSON for asset:", asset.id, e);
              jsonData = {};
            }

            canvas.loadFromJSON(jsonData, () => {
              const objects = canvas.getObjects();
              objects.forEach((obj) => {
                obj.set({
                  selectable: false,
                  hasControls: false,
                  hasBorders: false,
                  lockMovementX: true,
                  lockMovementY: true,
                });
              });

              if (objects.length > 0) {
                const group = new fabric.Group(objects, { canvas });
                const groupWidth = group.width || 1;
                const groupHeight = group.height || 1;

                const containerWidth = containerElement.clientWidth;
                const containerHeight = containerElement.clientHeight;

                const scaleX = containerWidth / groupWidth;
                const scaleY = containerHeight / groupHeight;
                const scale = Math.min(scaleX, scaleY, 1);

                objects.forEach((obj) => {
                  obj.scaleX = (obj.scaleX || 1) * scale;
                  obj.scaleY = (obj.scaleY || 1) * scale;
                  obj.left = (obj.left || 0) * scale;
                  obj.top = (obj.top || 0) * scale;
                  obj.setCoords();
                });

                canvas.setWidth(containerWidth);
                canvas.setHeight(containerHeight);

                const selection = new fabric.ActiveSelection(objects, { canvas });
                canvas.setActiveObject(selection);
                canvas.centerObject(selection);
                canvas.discardActiveObject();
              }

              canvas.renderAll();
            });
          } catch (e) {
            console.error("Error initializing canvas for asset:", asset.id, e);
            containerElement.innerHTML =
              '<div class="text-red-500 text-xs p-2">Error loading design</div>';
          }
        }
      });
    }, 0);

    return () => {
      clearTimeout(renderCanvasTimeout);
      Object.values(canvasRefs.current).forEach((canvas) => {
        if (canvas) {
          canvas.dispose();
        }
      });
    };
  }, [userAssets, loading]);

  useEffect(() => {
    const handleResize = () => {
      Object.values(canvasRefs.current).forEach((canvas) => {
        if (canvas) {
          canvas.renderAll();
        }
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getAssetName = (asset: Asset) => {
    return asset.ShapeName || "Untitled Design";
  };

  const handleAssetDelete = (asset: Asset, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Delete asset:", asset);
  };

  useEffect(() => {
    if (!loading && userAssets.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              Object.values(canvasRefs.current).forEach((canvas) => {
                if (canvas) {
                  canvas.renderAll();
                }
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      Object.values(canvasContainerRefs.current).forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [loading, userAssets]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <Loader />
      ) : (
        <>
          {response.message && (
            <div
              className={`mb-4 p-3 rounded ${
                response.isGood
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {response.message}
            </div>
          )}

          {userAssets.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                You don't have any saved designs yet.
              </p>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Create New Design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userAssets.map((asset) => {
                const assetId = asset.id;
                return (
                  <div
                    key={assetId}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      const canvas = canvasRefs.current[assetId];
                      if (canvas) {
                        canvas.renderAll();
                      }
                    }}
                  >
                    <div className="bg-gray-50 p-2 h-52 flex items-center justify-center">
                      <div
                        ref={(el) =>
                          (canvasContainerRefs.current[assetId] = el)
                        }
                        className="w-full h-full flex items-center justify-center"
                      ></div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 truncate">
                        {getAssetName(asset)}
                      </h3>
                      <div className="mt-2 flex justify-between">
                        <button
                          className="text-sm text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Code for edit action
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm text-red-500 hover:text-red-700"
                          onClick={(e) => handleAssetDelete(asset, e)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
