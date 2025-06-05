# Form Validation in React

Form validation is crucial for ensuring data integrity and providing good user experience. This guide covers various validation approaches in React.

## Built-in HTML5 Validation

### Basic HTML5 Validation

```tsx
const HTML5ValidationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    age: "",
    url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      console.log("Form is valid:", formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={8}
        placeholder="Password (min 8 chars)"
      />

      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        required
        min={18}
        max={100}
        placeholder="Age (18-100)"
      />

      <input
        type="url"
        name="url"
        value={formData.url}
        onChange={handleChange}
        placeholder="Website URL"
      />

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Custom Validation Messages

```tsx
const CustomValidationMessages = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors: Record<string, string> = {};

    Array.from(form.elements).forEach((element) => {
      if (element instanceof HTMLInputElement && !element.validity.valid) {
        const name = element.name;
        if (element.validity.valueMissing) {
          newErrors[name] = `${name} is required`;
        } else if (element.validity.typeMismatch) {
          newErrors[name] = `Please enter a valid ${element.type}`;
        } else if (element.validity.tooShort) {
          newErrors[
            name
          ] = `${name} must be at least ${element.minLength} characters`;
        } else if (element.validity.rangeUnderflow) {
          newErrors[name] = `${name} must be at least ${element.min}`;
        } else if (element.validity.rangeOverflow) {
          newErrors[name] = `${name} must be no more than ${element.max}`;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="email" type="email" required placeholder="Email" />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="Password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Custom Validation Hooks

### useValidation Hook

```tsx
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

const useValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    if (rule.required && (!value || value.trim() === "")) {
      return `${name} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${name} must be no more than ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return `${name} format is invalid`;
    }

    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  };

  const validateField = (name: string, value: any) => {
    const error = validate(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || "",
    }));
    return !error;
  };

  const validateAll = (values: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(rules).forEach((name) => {
      const error = validate(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const setFieldTouched = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validateField,
    validateAll,
    setFieldTouched,
    resetValidation,
  };
};

const FormWithCustomValidation = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validationRules: ValidationRules = {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      custom: (value) => {
        if (value && /\s/.test(value)) {
          return "Username cannot contain spaces";
        }
        return null;
      },
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value) => {
        if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain uppercase, lowercase, and number";
        }
        return null;
      },
    },
    confirmPassword: {
      required: true,
      custom: (value) => {
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  };

  const { errors, touched, validateField, validateAll, setFieldTouched } =
    useValidation(validationRules);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFieldTouched(name);
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll(formData)) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
        />
        {touched.username && errors.username && (
          <span className="error">{errors.username}</span>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Confirm Password"
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  );
};
```

## Async Validation

### Debounced Validation

```tsx
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

const useAsyncValidation = () => {
  const [validationState, setValidationState] = useState<{
    [key: string]: {
      isValidating: boolean;
      error: string | null;
      isValid: boolean;
    };
  }>({});

  const validateUsername = async (username: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const unavailableUsernames = ["admin", "user", "test"];
    return !unavailableUsernames.includes(username.toLowerCase());
  };

  const validateEmail = async (email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const existingEmails = ["test@example.com", "admin@example.com"];
    return !existingEmails.includes(email.toLowerCase());
  };

  const debouncedValidateUsername = useCallback(
    debounce(async (username: string) => {
      if (!username) {
        setValidationState((prev) => ({
          ...prev,
          username: { isValidating: false, error: null, isValid: false },
        }));
        return;
      }

      setValidationState((prev) => ({
        ...prev,
        username: { isValidating: true, error: null, isValid: false },
      }));

      try {
        const isValid = await validateUsername(username);
        setValidationState((prev) => ({
          ...prev,
          username: {
            isValidating: false,
            error: isValid ? null : "Username is already taken",
            isValid,
          },
        }));
      } catch (error) {
        setValidationState((prev) => ({
          ...prev,
          username: {
            isValidating: false,
            error: "Validation failed",
            isValid: false,
          },
        }));
      }
    }, 500),
    []
  );

  const debouncedValidateEmail = useCallback(
    debounce(async (email: string) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setValidationState((prev) => ({
          ...prev,
          email: { isValidating: false, error: null, isValid: false },
        }));
        return;
      }

      setValidationState((prev) => ({
        ...prev,
        email: { isValidating: true, error: null, isValid: false },
      }));

      try {
        const isValid = await validateEmail(email);
        setValidationState((prev) => ({
          ...prev,
          email: {
            isValidating: false,
            error: isValid ? null : "Email is already registered",
            isValid,
          },
        }));
      } catch (error) {
        setValidationState((prev) => ({
          ...prev,
          email: {
            isValidating: false,
            error: "Validation failed",
            isValid: false,
          },
        }));
      }
    }, 500),
    []
  );

  return {
    validationState,
    validateUsername: debouncedValidateUsername,
    validateEmail: debouncedValidateEmail,
  };
};

const AsyncValidationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const { validationState, validateUsername, validateEmail } =
    useAsyncValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      validateUsername(value);
    } else if (name === "email") {
      validateEmail(value);
    }
  };

  const isFormValid =
    validationState.username?.isValid && validationState.email?.isValid;

  return (
    <form>
      <div>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {validationState.username?.isValidating && (
          <span className="validating">Checking username...</span>
        )}
        {validationState.username?.error && (
          <span className="error">{validationState.username.error}</span>
        )}
        {validationState.username?.isValid && (
          <span className="success">Username is available!</span>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {validationState.email?.isValidating && (
          <span className="validating">Checking email...</span>
        )}
        {validationState.email?.error && (
          <span className="error">{validationState.email.error}</span>
        )}
        {validationState.email?.isValid && (
          <span className="success">Email is available!</span>
        )}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Submit
      </button>
    </form>
  );
};
```

## Schema Validation with Yup

### Basic Yup Integration

```tsx
import * as Yup from "yup";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),

  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  age: Yup.number()
    .min(16, "Must be at least 16 years old")
    .max(120, "Must be less than 120 years old")
    .required("Age is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const YupValidationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = async (name: string, value: any) => {
    try {
      await validationSchema.validateAt(name, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      await validateField(name, value);
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    await validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      console.log("Form submitted:", formData);
      setErrors({});
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="First Name"
        />
        {touched.firstName && errors.firstName && (
          <span className="error">{errors.firstName}</span>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Email"
        />
        {touched.email && errors.email && (
          <span className="error">{errors.email}</span>
        )}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />
        {touched.password && errors.password && (
          <span className="error">{errors.password}</span>
        )}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Validation Strategies Comparison

| Strategy        | Pros                            | Cons                  | Best For                       |
| --------------- | ------------------------------- | --------------------- | ------------------------------ |
| HTML5           | Native, fast, no dependencies   | Limited customization | Simple forms                   |
| Custom hooks    | Full control, flexible          | More code to maintain | Complex validation logic       |
| Yup/Joi         | Schema-based, declarative       | Additional dependency | Complex forms with nested data |
| React Hook Form | Performance, minimal re-renders | Learning curve        | Forms with many fields         |

## Real-time Validation Patterns

### Progressive Enhancement

```tsx
const ProgressiveValidationForm = () => {
  const [validationLevel, setValidationLevel] = useState<
    "none" | "basic" | "advanced"
  >("none");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    if (validationLevel === "none") return "";

    if (!email) return "Email is required";

    if (validationLevel === "basic") {
      return email.includes("@") ? "" : "Email must contain @";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Please enter a valid email address";
  };

  const validatePassword = (password: string) => {
    if (validationLevel === "none") return "";

    if (!password) return "Password is required";

    if (validationLevel === "basic") {
      return password.length >= 6
        ? ""
        : "Password must be at least 6 characters";
    }

    const checks = [
      { test: password.length >= 8, message: "at least 8 characters" },
      { test: /[A-Z]/.test(password), message: "uppercase letter" },
      { test: /[a-z]/.test(password), message: "lowercase letter" },
      { test: /\d/.test(password), message: "number" },
    ];

    const failed = checks.filter((check) => !check.test);
    return failed.length === 0
      ? ""
      : `Password needs: ${failed.map((f) => f.message).join(", ")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error =
      name === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <div>
      <div>
        <label>
          Validation Level:
          <select
            value={validationLevel}
            onChange={(e) => setValidationLevel(e.target.value as any)}
          >
            <option value="none">None</option>
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>

      <form>
        <div>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
```

## Testing Form Validation

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Form Validation", () => {
  it("shows validation errors on submit", async () => {
    const user = userEvent.setup();
    render(<FormWithCustomValidation />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("username is required")).toBeInTheDocument();
      expect(screen.getByText("email is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<FormWithCustomValidation />);

    const emailInput = screen.getByPlaceholderText("Email");
    await user.type(emailInput, "invalid-email");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("email format is invalid")).toBeInTheDocument();
    });
  });

  it("validates password strength", async () => {
    const user = userEvent.setup();
    render(<FormWithCustomValidation />);

    const passwordInput = screen.getByPlaceholderText("Password");
    await user.type(passwordInput, "weak");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/Password must contain uppercase/)
      ).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Validate on blur**: Provide immediate feedback without being intrusive
2. **Progressive validation**: Start simple and add complexity as needed
3. **Debounce async validation**: Avoid excessive API calls
4. **Clear error states**: Remove errors when input becomes valid
5. **Accessible errors**: Use ARIA attributes for screen readers
6. **Performance**: Only validate touched fields
7. **User experience**: Show success states for positive reinforcement

Form validation in React requires balancing user experience, performance, and maintainability. Choose the approach that best fits your application's complexity and requirements.
