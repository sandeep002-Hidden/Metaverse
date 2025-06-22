import { useState, useEffect, useRef } from "react";
import { Search, User, Map, FileBox } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/Dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface SearchResults {
  users: any[];
  maps: any[];
  assets: any[];
}

export default function SearchField() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    users: [],
    maps: [],
    assets: [],
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setQuery("");
    setIsOpen(false);
    setFocusedIndex(-1);
  };
  const navigate=useNavigate()
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const all = [...results.users, ...results.maps, ...results.assets];
    if (!all.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, all.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleResultSelect(all[focusedIndex],"user");
    }
    if (resultsRef.current && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const el = resultsRef.current.querySelector(
        `[data-index=\"${focusedIndex}\"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], maps: [], assets: [] });
      setFocusedIndex(-1);
      return;
    }
    const timer = setTimeout(fetchQuery, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchQuery = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/search/${query}`,
        { withCredentials: true }
      );
      if (data.success) {
        setResults({
          users: data.users,
          maps: data.worlds,
          assets: data.shapes,
        });
        setFocusedIndex(0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResultSelect = (item: any,type:string) => {
    if(type==="user"){
      navigate(`/home/${type}/find/${item.id}`)
    }
    console.log("Select:", item);
    handleClose();
  };

  const renderItem = (item: any, idx: number, type: string) => {
    const isFocused = idx === focusedIndex;
    const base =
      "flex items-center gap-3 p-2 rounded transition-colors cursor-pointer";
    const focused = "bg-blue-100 dark:bg-blue-900";
    return (
      <div
        key={type + idx}
        data-index={idx}
        className={`${base} ${
          isFocused ? focused : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        onMouseEnter={() => setFocusedIndex(idx)}
        onClick={() => handleResultSelect(item,type)}
      >
        {type === "user" && <User className="h-5 w-5" />}
        {type === "map" && <Map className="h-5 w-5" />}
        {type === "asset" && <FileBox className="h-5 w-5" />}
        <div className="flex flex-col">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {type === "user"
              ? `${item.FirstName} ${item.LastName}`
              : item.ShapeName || item.WorldName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {type === "user"
              ? item.UserName
              : type === "map"
              ? item.WorldDescription
              : ""}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-xs mx-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="w-full" aria-label="Open search">
            <div className="relative w-full">
              <input
                readOnly
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="p-4">
            <div className="relative">
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Search users, maps, assets..."
                className="w-[90%] pl-10 pr-10 py-2 rounded-lg border border-b-0 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </DialogHeader>
          <DialogTitle></DialogTitle>
          <div
            ref={resultsRef}
            className="max-h-64 overflow-y-auto bg-white dark:bg-gray-800"
          >
            {results.users.length > 0 && (
              <p className="px-4 pt-2 text-xs font-semibold uppercase text-gray-500">
                Users
              </p>
            )}
            {results.users.map((u, i) => renderItem(u, i, "user"))}
            {results.maps.length > 0 && (
              <p className="px-4 pt-2 text-xs font-semibold uppercase text-gray-500">
                Maps
              </p>
            )}
            {results.maps.map((m, i) =>
              renderItem(m, results.users.length + i, "map")
            )}
            {results.assets.length > 0 && (
              <p className="px-4 pt-2 text-xs font-semibold uppercase text-gray-500">
                Assets
              </p>
            )}
            {results.assets.map((a, i) =>
              renderItem(
                a,
                results.users.length + results.maps.length + i,
                "asset"
              )
            )}
          </div>

          <DialogFooter className="flex justify-end p-4">
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-b-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
                Close
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
