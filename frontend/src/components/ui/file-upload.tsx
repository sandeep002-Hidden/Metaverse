// import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 }
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
};

export const FileUpload = ({
  onChange
}: {
  onChange?: (file: File | null) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    const newFile = newFiles[0];
    setFile(newFile);
    onChange?.(newFile);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="group/file flex items-center justify-start    gap-4 mb-2 cursor-pointer w-full relative"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        <div className=" w-full  h-full">

        <p className="text-nowrap font-bold text-black dark:text-neutral-300">
          Upload a Profile Photo
        </p>
        </div>

        <div className="relative flex-1 max-w-xl">
          {file ? (
            <motion.div
              layoutId="file-upload"
              className="bg-gray-300 dark:bg-neutral-900 flex flex-col p-3 rounded-md shadow-sm"
            >
              <div className="flex justify-between items-center gap-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="text-black dark:text-neutral-300  truncate max-w-xs"
                >
                  {file.name}
                </motion.p>
                
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center">
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 bg-neutral-900 flex items-center justify-center h-12 w-12 rounded-md shadow-lg"
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-neutral-400 text-sm"
                  >
                    Drop
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 text-neutral-300" />
                )}
              </motion.div>
              <motion.div
                variants={secondaryVariant}
                className="absolute inset-0 border border-dashed border-sky-400 rounded-md opacity-0"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};