# Uncontrolled Components in React

Uncontrolled components maintain their own internal state and expose their values through refs. While controlled components are generally preferred, uncontrolled components can be useful for certain scenarios like file inputs or when integrating with third-party libraries.

## Basic Uncontrolled Components

### Simple Uncontrolled Input

```jsx
function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = inputRef.current.value;
    console.log("Input value:", value);
  };

  const handleReset = () => {
    inputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input id="name" type="text" ref={inputRef} defaultValue="John Doe" />
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
}
```

### Multiple Uncontrolled Inputs

```jsx
function UncontrolledForm() {
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      age: formData.get("age"),
      bio: formData.get("bio"),
      country: formData.get("country"),
      newsletter: formData.get("newsletter") === "on",
      interests: formData.getAll("interests"),
    };

    console.log("Form data:", data);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" name="name" defaultValue="" required />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" defaultValue="" required />
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          name="age"
          defaultValue=""
          min="18"
          max="120"
        />
      </div>

      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" defaultValue="" rows={4} />
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <select id="country" name="country" defaultValue="">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" name="newsletter" defaultChecked={false} />
          Subscribe to newsletter
        </label>
      </div>

      <fieldset>
        <legend>Interests:</legend>
        <label>
          <input type="checkbox" name="interests" value="reading" />
          Reading
        </label>
        <label>
          <input type="checkbox" name="interests" value="sports" />
          Sports
        </label>
        <label>
          <input type="checkbox" name="interests" value="music" />
          Music
        </label>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## File Input Handling

### Basic File Upload

```jsx
function FileUpload() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      console.log("Uploading file:", selectedFile.name);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleReset = () => {
    fileInputRef.current.value = "";
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div>
      <div>
        <label htmlFor="file-input">Choose file:</label>
        <input
          id="file-input"
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <p>Selected file: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p>Type: {selectedFile.type}</p>
        </div>
      )}

      {preview && (
        <div className="preview">
          <img src={preview} alt="Preview" style={{ maxWidth: 200 }} />
        </div>
      )}

      <div>
        <button onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
```

### Multiple File Upload

```jsx
function MultipleFileUpload() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);

    if (newFiles.length === 0) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files first");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      console.log(
        "Uploading files:",
        selectedFiles.map((f) => f.name)
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="files-input">Choose files:</label>
        <input
          id="files-input"
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="files-list">
          <h3>Selected Files ({selectedFiles.length}):</h3>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <span>
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </span>
                <button onClick={() => removeFile(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <button onClick={handleUpload} disabled={selectedFiles.length === 0}>
          Upload All Files
        </button>
        <button
          onClick={() => {
            fileInputRef.current.value = "";
            setSelectedFiles([]);
          }}
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
```

## Advanced Uncontrolled Patterns

### Mixed Controlled and Uncontrolled

```jsx
function MixedForm() {
  const [formMode, setFormMode] = useState("controlled");
  const [controlledValue, setControlledValue] = useState("");
  const uncontrolledRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      controlled: controlledValue,
      uncontrolled: uncontrolledRef.current.value,
      mode: formMode,
    };

    console.log("Form data:", data);
  };

  const switchMode = () => {
    if (formMode === "controlled") {
      uncontrolledRef.current.value = controlledValue;
      setFormMode("uncontrolled");
    } else {
      setControlledValue(uncontrolledRef.current.value);
      setFormMode("controlled");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p>Current mode: {formMode}</p>
        <button type="button" onClick={switchMode}>
          Switch to {formMode === "controlled" ? "Uncontrolled" : "Controlled"}
        </button>
      </div>

      {formMode === "controlled" ? (
        <div>
          <label>Controlled Input:</label>
          <input
            type="text"
            value={controlledValue}
            onChange={(e) => setControlledValue(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <label>Uncontrolled Input:</label>
          <input
            type="text"
            ref={uncontrolledRef}
            defaultValue={controlledValue}
          />
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Custom Uncontrolled Hook

```jsx
function useUncontrolledInput(defaultValue = "") {
  const ref = useRef(null);

  const getValue = useCallback(() => {
    return ref.current ? ref.current.value : defaultValue;
  }, [defaultValue]);

  const setValue = useCallback((value) => {
    if (ref.current) {
      ref.current.value = value;
    }
  }, []);

  const reset = useCallback(() => {
    if (ref.current) {
      ref.current.value = defaultValue;
    }
  }, [defaultValue]);

  const focus = useCallback(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return {
    ref,
    getValue,
    setValue,
    reset,
    focus,
  };
}

function FormWithCustomHook() {
  const nameInput = useUncontrolledInput("John Doe");
  const emailInput = useUncontrolledInput("");
  const messageInput = useUncontrolledInput("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      name: nameInput.getValue(),
      email: emailInput.getValue(),
      message: messageInput.getValue(),
    };

    console.log("Form data:", formData);
  };

  const handleReset = () => {
    nameInput.reset();
    emailInput.reset();
    messageInput.reset();
    nameInput.focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" ref={nameInput.ref} />
      </div>

      <div>
        <label>Email:</label>
        <input type="email" ref={emailInput.ref} />
      </div>

      <div>
        <label>Message:</label>
        <textarea ref={messageInput.ref} rows={4} />
      </div>

      <div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
```

## Integration with Third-Party Libraries

### jQuery Plugin Integration

```jsx
function jQueryIntegration() {
  const containerRef = useRef(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const $container = $(containerRef.current);

    $container.datepicker({
      onSelect: function (dateText) {
        setValue(dateText);
      },
    });

    return () => {
      $container.datepicker("destroy");
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Selected date:", value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Select Date:</label>
        <input
          ref={containerRef}
          type="text"
          readOnly
          placeholder="Click to select date"
        />
      </div>
      <p>Selected: {value}</p>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Canvas Integration

```jsx
function CanvasSignature() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, []);

  const startDrawing = (event) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureData = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const signatureData = getSignatureData();
    console.log("Signature data:", signatureData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Signature:</label>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          style={{ border: "1px solid #ccc" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div>
        <button type="button" onClick={clearCanvas}>
          Clear Signature
        </button>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}
```

## TypeScript with Uncontrolled Components

```tsx
import React, { useRef, FormEvent, ChangeEvent } from "react";

interface FormElements extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  email: HTMLInputElement;
  age: HTMLInputElement;
  bio: HTMLTextAreaElement;
  country: HTMLSelectElement;
}

interface FormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

function TypedUncontrolledForm(): JSX.Element {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<FormElement>): void => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      username: form.elements.username.value,
      email: form.elements.email.value,
      age: parseInt(form.elements.age.value, 10),
      bio: form.elements.bio.value,
      country: form.elements.country.value,
      newsletter: formData.get("newsletter") === "on",
    };

    console.log("Form data:", data);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0].name);
    }
  };

  const resetForm = (): void => {
    if (formRef.current) {
      formRef.current.reset();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          defaultValue=""
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" type="email" name="email" defaultValue="" required />
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          name="age"
          defaultValue=""
          min={18}
          max={120}
        />
      </div>

      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea id="bio" name="bio" defaultValue="" rows={4} />
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <select id="country" name="country" defaultValue="">
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" name="newsletter" defaultChecked={false} />
          Subscribe to newsletter
        </label>
      </div>

      <div>
        <label htmlFor="file">Upload file:</label>
        <input
          id="file"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,.pdf"
        />
      </div>

      <div>
        <button type="submit">Submit</button>
        <button type="button" onClick={resetForm}>
          Reset
        </button>
      </div>
    </form>
  );
}
```

## Validation with Uncontrolled Components

### HTML5 Validation

```jsx
function HTML5ValidatedForm() {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = formRef.current;

    if (form.checkValidity()) {
      const formData = new FormData(form);
      console.log("Form is valid:", Object.fromEntries(formData));
      setErrors({});
    } else {
      const newErrors = {};
      const inputs = form.querySelectorAll("input, textarea, select");

      inputs.forEach((input) => {
        if (!input.validity.valid) {
          newErrors[input.name] = input.validationMessage;
        }
      });

      setErrors(newErrors);
    }
  };

  const handleInvalid = (event) => {
    event.preventDefault();
    setErrors((prev) => ({
      ...prev,
      [event.target.name]: event.target.validationMessage,
    }));
  };

  const handleInput = (event) => {
    if (errors[event.target.name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[event.target.name];
        return newErrors;
      });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          onInvalid={handleInvalid}
          onInput={handleInput}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          minLength={8}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$"
          title="Password must contain at least 8 characters with uppercase, lowercase, and number"
          onInvalid={handleInvalid}
          onInput={handleInput}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          name="age"
          required
          min={18}
          max={120}
          onInvalid={handleInvalid}
          onInput={handleInput}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## When to Use Uncontrolled Components

### Appropriate Use Cases

| Use Case                 | Reason                                       |
| ------------------------ | -------------------------------------------- |
| File inputs              | HTML file inputs are inherently uncontrolled |
| Form libraries           | Some libraries expect uncontrolled inputs    |
| Simple forms             | When you don't need real-time validation     |
| Third-party integrations | When integrating with non-React libraries    |
| Performance              | Avoiding re-renders for large forms          |
| Legacy code              | Migrating existing HTML forms                |

### Controlled vs Uncontrolled Comparison

| Aspect      | Controlled                    | Uncontrolled                       |
| ----------- | ----------------------------- | ---------------------------------- |
| Data flow   | React state controls value    | DOM maintains state                |
| Validation  | Real-time validation possible | Validation on submit               |
| Performance | May cause re-renders          | Better performance for large forms |
| Testing     | Easier to test                | Requires DOM interaction           |
| Debugging   | Easier to debug               | State hidden in DOM                |
| Flexibility | More flexible and predictable | Less flexible                      |

## Best Practices

1. **Use defaultValue**: Use `defaultValue` instead of `value` for uncontrolled components
2. **FormData API**: Leverage the FormData API for easy data extraction
3. **HTML5 Validation**: Use built-in HTML5 validation when appropriate
4. **Refs for Interaction**: Use refs when you need to interact with the input programmatically
5. **File Inputs**: Always use uncontrolled pattern for file inputs
6. **Mixed Approach**: Consider mixing controlled and uncontrolled components when appropriate
7. **Accessibility**: Don't forget proper labels and ARIA attributes
8. **Performance**: Consider uncontrolled for performance-critical forms

## Common Mistakes

1. **Using value prop**: Using `value` instead of `defaultValue` makes it controlled
2. **Forgetting refs**: Not using refs when you need to access input values
3. **Missing name attributes**: Forgetting name attributes breaks FormData extraction
4. **Inconsistent patterns**: Mixing controlled and uncontrolled patterns inconsistently
5. **No validation**: Not implementing any form validation
6. **Performance assumptions**: Assuming uncontrolled is always faster

## Interview Questions

**Q: When would you choose uncontrolled components over controlled components?**
A: For file inputs (which are inherently uncontrolled), when integrating with third-party libraries, for simple forms where you don't need real-time validation, or when performance is critical for large forms.

**Q: How do you get values from uncontrolled components?**
A: Use refs to access the DOM directly, or use the FormData API with form submission to extract all form values at once.

**Q: Can you mix controlled and uncontrolled components in the same form?**
A: Yes, but it should be done thoughtfully. File inputs are always uncontrolled, while other inputs can be controlled for validation and real-time feedback.

**Q: How do you implement validation with uncontrolled components?**
A: Use HTML5 validation attributes, the Constraint Validation API, or validate on form submission using refs to access values.

**Q: What's the difference between value and defaultValue?**
A: `value` makes a component controlled (React manages the value), while `defaultValue` sets the initial value for an uncontrolled component (DOM manages the value).
