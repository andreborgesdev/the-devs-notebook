# File Uploads in React

File uploads are a common requirement in modern web applications. React provides several approaches to handle file uploads, from basic HTML file inputs to advanced drag-and-drop interfaces with progress tracking and validation.

## Basic File Upload Component

### Simple File Input

```tsx
import React, { useState, ChangeEvent } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "*/*",
  multiple = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="file-input"
      />
      {selectedFile && (
        <div className="file-info">
          <p>Selected: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};
```

### Multiple File Upload

```tsx
import React, { useState, ChangeEvent } from "react";

interface MultiFileUploadProps {
  onFilesSelect: (files: FileList) => void;
  maxFiles?: number;
  accept?: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onFilesSelect,
  maxFiles = 5,
  accept = "*/*",
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, maxFiles);
      setSelectedFiles(fileArray);
      onFilesSelect(files);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="multi-file-upload">
      <input
        type="file"
        accept={accept}
        multiple
        onChange={handleFileChange}
        className="file-input"
      />

      {selectedFiles.length > 0 && (
        <div className="file-list">
          <h4>
            Selected Files ({selectedFiles.length}/{maxFiles})
          </h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name}</span>
              <span>{(file.size / 1024).toFixed(2)} KB</span>
              <button onClick={() => removeFile(index)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Advanced File Upload Hook

```tsx
import { useState, useCallback } from "react";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

interface UseFileUploadOptions {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const useFileUpload = (options: UseFileUploadOptions) => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  const upload = useCallback(
    async (file: File, additionalData?: Record<string, any>) => {
      setState({
        isUploading: true,
        progress: 0,
        error: null,
        success: false,
      });

      try {
        const formData = new FormData();
        formData.append("file", file);

        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, JSON.stringify(value));
          });
        }

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setState((prev) => ({ ...prev, progress }));
            options.onProgress?.(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            setState({
              isUploading: false,
              progress: 100,
              error: null,
              success: true,
            });
            options.onSuccess?.(response);
          } else {
            throw new Error(`Upload failed with status ${xhr.status}`);
          }
        });

        xhr.addEventListener("error", () => {
          const error = new Error("Upload failed");
          setState({
            isUploading: false,
            progress: 0,
            error: error.message,
            success: false,
          });
          options.onError?.(error);
        });

        xhr.open(options.method || "POST", options.endpoint);

        if (options.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(formData);
      } catch (error) {
        const err = error as Error;
        setState({
          isUploading: false,
          progress: 0,
          error: err.message,
          success: false,
        });
        options.onError?.(err);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    upload,
    reset,
  };
};
```

## Drag and Drop File Upload

```tsx
import React, { useState, useRef, DragEvent, ChangeEvent } from "react";

interface DragDropUploadProps {
  onFilesSelect: (files: File[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  className?: string;
}

const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFilesSelect,
  accept = [],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (accept.length > 0 && !accept.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB limit`;
    }

    return null;
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const fileErrors: string[] = [];

    fileArray.slice(0, maxFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        fileErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(fileErrors);
    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      processFiles(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`drag-drop-upload ${className}`}>
      <div
        className={`drop-zone ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept.join(",")}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="drop-zone-content">
          <svg className="upload-icon" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          <p>Drag and drop files here or click to browse</p>
          <p className="file-info">
            Max {maxFiles} files, up to {(maxSize / 1024 / 1024).toFixed(2)}MB
            each
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="upload-errors">
          {errors.map((error, index) => (
            <p key={index} className="error-message">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
```

## File Upload with Progress

```tsx
import React, { useState } from "react";
import { useFileUpload } from "./useFileUpload";

interface FileWithProgress {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

const FileUploadWithProgress: React.FC = () => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);

  const { upload } = useFileUpload({
    endpoint: "/api/upload",
    onProgress: (progress, fileId) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress, status: "uploading" } : f
        )
      );
    },
    onSuccess: (response, fileId) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "success", progress: 100 } : f
        )
      );
    },
    onError: (error, fileId) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "error", error: error.message } : f
        )
      );
    },
  });

  const addFiles = (newFiles: File[]) => {
    const filesWithProgress: FileWithProgress[] = newFiles.map((file) => ({
      file,
      id: `${file.name}-${Date.now()}`,
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...filesWithProgress]);
  };

  const uploadFile = async (fileWithProgress: FileWithProgress) => {
    await upload(fileWithProgress.file, fileWithProgress.id);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    for (const file of pendingFiles) {
      await uploadFile(file);
    }
  };

  return (
    <div className="file-upload-with-progress">
      <DragDropUpload onFilesSelect={addFiles} />

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Files ({files.length})</h3>
            <button
              onClick={uploadAll}
              disabled={files.every((f) => f.status !== "pending")}
            >
              Upload All
            </button>
          </div>

          {files.map((fileWithProgress) => (
            <FileProgressItem
              key={fileWithProgress.id}
              fileWithProgress={fileWithProgress}
              onUpload={() => uploadFile(fileWithProgress)}
              onRemove={() => removeFile(fileWithProgress.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileProgressItemProps {
  fileWithProgress: FileWithProgress;
  onUpload: () => void;
  onRemove: () => void;
}

const FileProgressItem: React.FC<FileProgressItemProps> = ({
  fileWithProgress,
  onUpload,
  onRemove,
}) => {
  const { file, status, progress, error } = fileWithProgress;

  return (
    <div className={`file-progress-item ${status}`}>
      <div className="file-info">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
      </div>

      <div className="progress-section">
        {status === "uploading" && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className="status-text">
          {status === "pending" && "Ready to upload"}
          {status === "uploading" && `${progress}%`}
          {status === "success" && "Upload complete"}
          {status === "error" && `Error: ${error}`}
        </div>
      </div>

      <div className="actions">
        {status === "pending" && <button onClick={onUpload}>Upload</button>}
        {status !== "uploading" && <button onClick={onRemove}>Remove</button>}
      </div>
    </div>
  );
};
```

## Image Preview and Cropping

```tsx
import React, { useState, useRef, useCallback } from "react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  cropAspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const ImageUploadWithPreview: React.FC<ImageUploadProps> = ({
  onImageSelect,
  cropAspectRatio,
  maxWidth = 800,
  maxHeight = 600,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setPreview(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const cropImage = useCallback(async () => {
    if (!preview || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = imageRef.current;

    if (!ctx) return;

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped-image.jpg", {
            type: "image/jpeg",
          });
          onImageSelect(croppedFile, canvas.toDataURL());
        }
      },
      "image/jpeg",
      0.9
    );
  }, [preview, cropArea, onImageSelect]);

  const resizeImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const image = new Image();

        image.onload = () => {
          let { width, height } = image;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          ctx?.drawImage(image, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(resizedFile);
              }
            },
            file.type,
            0.9
          );
        };

        image.src = URL.createObjectURL(file);
      });
    },
    [maxWidth, maxHeight]
  );

  return (
    <div className="image-upload-with-preview">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="image-input"
      />

      {preview && (
        <div className="image-preview-container">
          <img
            ref={imageRef}
            src={preview}
            alt="Preview"
            className="image-preview"
          />

          {cropAspectRatio && (
            <div className="crop-controls">
              <button onClick={cropImage}>Crop Image</button>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};
```

## File Upload Validation

```tsx
interface FileValidationRules {
  maxSize?: number;
  minSize?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  customValidator?: (file: File) => string | null;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useFileValidation = (rules: FileValidationRules) => {
  const validateFile = useCallback(
    (file: File): ValidationResult => {
      const errors: string[] = [];

      if (rules.maxSize && file.size > rules.maxSize) {
        errors.push(
          `File size must be less than ${(rules.maxSize / 1024 / 1024).toFixed(
            2
          )}MB`
        );
      }

      if (rules.minSize && file.size < rules.minSize) {
        errors.push(
          `File size must be at least ${(rules.minSize / 1024).toFixed(2)}KB`
        );
      }

      if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
      }

      if (rules.customValidator) {
        const customError = rules.customValidator(file);
        if (customError) {
          errors.push(customError);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
      };
    },
    [rules]
  );

  const validateFiles = useCallback(
    (files: File[]): ValidationResult => {
      const allErrors: string[] = [];

      if (rules.maxFiles && files.length > rules.maxFiles) {
        allErrors.push(`Maximum ${rules.maxFiles} files allowed`);
      }

      files.forEach((file, index) => {
        const result = validateFile(file);
        if (!result.isValid) {
          result.errors.forEach((error) => {
            allErrors.push(`File ${index + 1} (${file.name}): ${error}`);
          });
        }
      });

      return {
        isValid: allErrors.length === 0,
        errors: allErrors,
      };
    },
    [rules, validateFile]
  );

  return { validateFile, validateFiles };
};
```

## Security Considerations

### File Type Validation

```tsx
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "text/plain",
  "application/msword",
];

const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  const isValidMimeType = allowedTypes.includes(file.type);

  const extension = file.name.split(".").pop()?.toLowerCase();
  const validExtensions = allowedTypes
    .map((type) => {
      switch (type) {
        case "image/jpeg":
          return ["jpg", "jpeg"];
        case "image/png":
          return ["png"];
        case "image/gif":
          return ["gif"];
        case "application/pdf":
          return ["pdf"];
        default:
          return [];
      }
    })
    .flat();

  const isValidExtension = extension && validExtensions.includes(extension);

  return isValidMimeType && isValidExtension;
};
```

### File Content Scanning

```tsx
const scanFileContent = async (file: File): Promise<boolean> => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const jpegSignature = [0xff, 0xd8, 0xff];
  const pngSignature = [0x89, 0x50, 0x4e, 0x47];

  if (file.type === "image/jpeg") {
    return bytes
      .slice(0, 3)
      .every((byte, index) => byte === jpegSignature[index]);
  }

  if (file.type === "image/png") {
    return bytes
      .slice(0, 4)
      .every((byte, index) => byte === pngSignature[index]);
  }

  return true;
};
```

## Testing File Upload Components

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it("should handle file selection", async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} />);

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, file);

    expect(mockOnFileSelect).toHaveBeenCalledWith(file);
  });

  it("should validate file types", async () => {
    const user = userEvent.setup();
    render(<FileUpload onFileSelect={mockOnFileSelect} accept="image/*" />);

    const invalidFile = new File(["hello"], "hello.txt", {
      type: "text/plain",
    });
    const input = screen.getByRole("textbox", { hidden: true });

    await user.upload(input, invalidFile);

    expect(screen.getByText(/file type.*not allowed/i)).toBeInTheDocument();
  });

  it("should handle drag and drop", async () => {
    render(<DragDropUpload onFilesSelect={mockOnFileSelect} />);

    const dropZone = screen.getByText(/drag and drop/i).closest("div");
    const file = new File(["hello"], "hello.txt", { type: "text/plain" });

    fireEvent.dragOver(dropZone!);
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith([file]);
    });
  });

  it("should show upload progress", async () => {
    const mockUpload = jest.fn().mockImplementation((file, onProgress) => {
      setTimeout(() => onProgress(50), 100);
      setTimeout(() => onProgress(100), 200);
      return Promise.resolve();
    });

    render(<FileUploadWithProgress upload={mockUpload} />);

    const file = new File(["hello"], "hello.txt", { type: "text/plain" });
    const input = screen.getByRole("textbox", { hidden: true });

    await userEvent.upload(input, file);
    fireEvent.click(screen.getByText("Upload"));

    await waitFor(() => {
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Upload complete")).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### Lazy Loading Large Files

```tsx
const useLazyFileProcessing = () => {
  const processFileInChunks = useCallback(
    async (
      file: File,
      chunkSize: number = 1024 * 1024, // 1MB chunks
      onProgress?: (progress: number) => void
    ) => {
      const totalChunks = Math.ceil(file.size / chunkSize);
      let processedChunks = 0;

      for (let start = 0; start < file.size; start += chunkSize) {
        const chunk = file.slice(start, start + chunkSize);

        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            processedChunks++;
            const progress = (processedChunks / totalChunks) * 100;
            onProgress?.(progress);
            resolve(reader.result);
          };
          reader.readAsArrayBuffer(chunk);
        });

        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    },
    []
  );

  return { processFileInChunks };
};
```

### Virtual File List

```tsx
import { FixedSizeList as List } from "react-window";

interface VirtualFileListProps {
  files: File[];
  height: number;
  itemHeight: number;
}

const VirtualFileList: React.FC<VirtualFileListProps> = ({
  files,
  height,
  itemHeight,
}) => {
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const file = files[index];

    return (
      <div style={style} className="file-row">
        <span>{file.name}</span>
        <span>{(file.size / 1024).toFixed(2)} KB</span>
      </div>
    );
  };

  return (
    <List
      height={height}
      itemCount={files.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

## Best Practices

### File Upload Architecture

1. **Client-side validation first**: Always validate files on the client before uploading
2. **Server-side validation**: Never trust client-side validation alone
3. **Progress feedback**: Provide clear progress indicators for large uploads
4. **Error handling**: Implement comprehensive error handling and recovery
5. **Security**: Validate file types, scan content, and sanitize filenames
6. **Performance**: Use chunked uploads for large files
7. **User experience**: Provide drag-and-drop interfaces and preview capabilities

### Error Recovery

```tsx
const useFileUploadWithRetry = (maxRetries: number = 3) => {
  const uploadWithRetry = async (
    file: File,
    uploadFn: (file: File) => Promise<any>,
    retryCount: number = 0
  ): Promise<any> => {
    try {
      return await uploadFn(file);
    } catch (error) {
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        return uploadWithRetry(file, uploadFn, retryCount + 1);
      }
      throw error;
    }
  };

  return { uploadWithRetry };
};
```

## Interview Questions

### Basic Questions

**Q: How do you handle file uploads in React?**

A: File uploads in React can be handled using HTML file input elements with event handlers. The basic approach involves:

1. Using `<input type="file" />` element
2. Handling the `onChange` event to access selected files
3. Using `FileReader` API for client-side file processing
4. Using `FormData` API for server uploads
5. Implementing progress tracking with XMLHttpRequest

```tsx
const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    // Upload to server
  }
};
```

**Q: What is the difference between controlled and uncontrolled file inputs?**

A: File inputs in React are inherently uncontrolled because their value cannot be set programmatically for security reasons. You can only read the selected files, not set them. However, you can control the upload state and UI around the file input.

**Q: How do you validate files before uploading?**

A: File validation should be performed on multiple levels:

1. **Client-side**: Check file type, size, and format
2. **MIME type validation**: Verify the file's MIME type
3. **Extension validation**: Check file extension
4. **Content validation**: Scan file headers/signatures
5. **Server-side**: Always re-validate on the server

### Intermediate Questions

**Q: How do you implement drag-and-drop file uploads?**

A: Drag-and-drop file uploads involve handling drag events:

1. Use `onDragOver`, `onDragLeave`, and `onDrop` events
2. Prevent default behavior to enable dropping
3. Access files through `e.dataTransfer.files`
4. Provide visual feedback during drag operations
5. Handle multiple files and validation

**Q: How do you show upload progress?**

A: Upload progress can be tracked using XMLHttpRequest:

1. Use `xhr.upload.addEventListener('progress', callback)`
2. Calculate progress percentage from loaded/total bytes
3. Update component state with progress information
4. Provide visual progress indicators (progress bars)
5. Handle upload completion and errors

**Q: How do you handle multiple file uploads?**

A: Multiple file uploads require:

1. Using `multiple` attribute on file input
2. Processing `FileList` to convert to array
3. Managing upload state for each file individually
4. Implementing queue management for sequential/parallel uploads
5. Providing individual progress and status for each file

### Advanced Questions

**Q: How do you implement chunked file uploads for large files?**

A: Chunked uploads involve splitting large files into smaller pieces:

1. **File slicing**: Use `file.slice(start, end)` to create chunks
2. **Sequential upload**: Upload chunks one by one with chunk metadata
3. **Progress tracking**: Track progress across all chunks
4. **Error recovery**: Implement retry logic for failed chunks
5. **Server coordination**: Server reassembles chunks in correct order

```tsx
const uploadFileInChunks = async (file: File, chunkSize: number) => {
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(chunk, i, totalChunks, file.name);
  }
};
```

**Q: How do you optimize file upload performance?**

A: File upload performance optimization strategies:

1. **Compression**: Compress files before upload (images, documents)
2. **Chunked uploads**: Split large files into manageable chunks
3. **Parallel uploads**: Upload multiple files or chunks simultaneously
4. **Client-side processing**: Resize images, validate formats locally
5. **CDN integration**: Upload directly to CDN endpoints
6. **Background uploads**: Continue uploads even when user navigates away
7. **Resume capability**: Allow resuming interrupted uploads

**Q: How do you handle file upload security concerns?**

A: File upload security involves multiple layers:

1. **File type validation**: Whitelist allowed MIME types and extensions
2. **Content scanning**: Verify file headers match declared types
3. **Size limits**: Enforce maximum file sizes
4. **Filename sanitization**: Remove dangerous characters from filenames
5. **Virus scanning**: Integrate with antivirus services
6. **Isolated storage**: Store uploads in isolated directories
7. **Access controls**: Implement proper authentication and authorization
8. **Content-Type headers**: Set appropriate security headers

**Q: How do you test file upload components?**

A: Testing file upload components involves:

1. **Mock File objects**: Create mock files for testing
2. **Event simulation**: Simulate file input changes and drag-drop events
3. **Upload mocking**: Mock XMLHttpRequest or fetch for upload testing
4. **Progress testing**: Test progress callback functionality
5. **Error scenarios**: Test various error conditions and recovery
6. **Validation testing**: Test file validation logic
7. **Integration testing**: Test with actual file operations where needed

```tsx
// Example test
it("should handle file upload", async () => {
  const mockFile = new File(["content"], "test.txt", { type: "text/plain" });
  const mockUpload = jest.fn().mockResolvedValue({ success: true });

  render(<FileUpload onUpload={mockUpload} />);

  const input = screen.getByRole("textbox", { hidden: true });
  await userEvent.upload(input, mockFile);

  expect(mockUpload).toHaveBeenCalledWith(mockFile);
});
```
