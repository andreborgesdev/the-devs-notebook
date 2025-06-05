# Formik with React

Formik is a popular library for building forms in React that handles form validation, error handling, and form submission with minimal boilerplate. It provides a declarative approach to form management with excellent TypeScript support and integration capabilities.

## Basic Formik Setup

### Installation and Basic Usage

```bash
npm install formik yup
npm install --save-dev @types/yup
```

```tsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginForm: React.FC = () => {
  const initialValues: FormValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setStatus }: any
  ) => {
    try {
      await loginUser(values);
      setStatus({ type: "success", message: "Login successful!" });
    } catch (error) {
      setStatus({ type: "error", message: "Login failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" placeholder="Enter your email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              name="password"
              placeholder="Enter your password"
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <div>
            <label>
              <Field type="checkbox" name="rememberMe" />
              Remember me
            </label>
          </div>

          {status && (
            <div className={`status ${status.type}`}>{status.message}</div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
```

## Advanced Form Components

### Custom Field Components

```tsx
import { useField, FieldHookConfig } from "formik";

interface TextInputProps {
  label: string;
  placeholder?: string;
  type?: string;
}

const TextInput: React.FC<TextInputProps & FieldHookConfig<string>> = ({
  label,
  placeholder,
  type = "text",
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-group">
      <label htmlFor={props.name}>{label}</label>
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className={meta.touched && meta.error ? "error" : ""}
      />
      {meta.touched && meta.error && (
        <div className="error-message">{meta.error}</div>
      )}
    </div>
  );
};

// Usage
<Formik {...formikProps}>
  <Form>
    <TextInput
      name="firstName"
      label="First Name"
      placeholder="Enter your first name"
    />
    <TextInput
      name="email"
      type="email"
      label="Email Address"
      placeholder="Enter your email"
    />
  </Form>
</Formik>;
```

### Select Component

```tsx
interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  placeholder?: string;
}

const Select: React.FC<SelectProps & FieldHookConfig<string>> = ({
  label,
  options,
  placeholder = "Select an option",
  ...props
}) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-group">
      <label htmlFor={props.name}>{label}</label>
      <select {...field} className={meta.touched && meta.error ? "error" : ""}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <div className="error-message">{meta.error}</div>
      )}
    </div>
  );
};

// Usage
const countryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
];

<Select
  name="country"
  label="Country"
  options={countryOptions}
  placeholder="Select your country"
/>;
```

### Multi-Step Form

```tsx
interface StepProps {
  children: React.ReactNode;
}

const FormStep: React.FC<StepProps> = ({ children }) => {
  return <>{children}</>;
};

interface MultiStepFormProps {
  children: React.ReactElement<StepProps>[];
  initialValues: any;
  validationSchema: any[];
  onSubmit: (values: any) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  children,
  initialValues,
  validationSchema,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [snapshot, setSnapshot] = useState(initialValues);

  const steps = React.Children.toArray(
    children
  ) as React.ReactElement<StepProps>[];
  const isLastStep = currentStep === steps.length - 1;

  const next = (values: any) => {
    setSnapshot(values);
    setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  };

  const previous = (values: any) => {
    setSnapshot(values);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleSubmit = async (values: any, actions: any) => {
    if (isLastStep) {
      await onSubmit(values);
    } else {
      actions.setTouched({});
      next(values);
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={snapshot}
      validationSchema={validationSchema[currentStep]}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, isSubmitting }) => (
        <Form>
          <div className="step-indicator">
            Step {currentStep + 1} of {steps.length}
          </div>

          {steps[currentStep]}

          <div className="form-navigation">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => previous(values)}
                disabled={isSubmitting}
              >
                Previous
              </button>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isLastStep ? "Submit" : "Next"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

// Usage
const UserRegistrationForm: React.FC = () => {
  const validationSchemas = [
    Yup.object().shape({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
    }),
    Yup.object().shape({
      email: Yup.string().email().required("Email is required"),
      password: Yup.string().min(8).required("Password is required"),
    }),
    Yup.object().shape({
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
    }),
  ];

  return (
    <MultiStepForm
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        address: "",
        city: "",
      }}
      validationSchema={validationSchemas}
      onSubmit={handleRegistrationSubmit}
    >
      <FormStep>
        <h2>Personal Information</h2>
        <TextInput name="firstName" label="First Name" />
        <TextInput name="lastName" label="Last Name" />
      </FormStep>

      <FormStep>
        <h2>Account Details</h2>
        <TextInput name="email" type="email" label="Email" />
        <TextInput name="password" type="password" label="Password" />
      </FormStep>

      <FormStep>
        <h2>Address Information</h2>
        <TextInput name="address" label="Address" />
        <TextInput name="city" label="City" />
      </FormStep>
    </MultiStepForm>
  );
};
```

## Dynamic Forms

### Field Arrays

```tsx
import { FieldArray, useFormikContext } from "formik";

interface ContactForm {
  contacts: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
}

const ContactList: React.FC = () => {
  const { values } = useFormikContext<ContactForm>();

  return (
    <FieldArray name="contacts">
      {({ push, remove }) => (
        <div>
          <h3>Contacts</h3>

          {values.contacts.map((contact, index) => (
            <div key={index} className="contact-item">
              <h4>Contact {index + 1}</h4>

              <TextInput
                name={`contacts.${index}.name`}
                label="Name"
                placeholder="Enter contact name"
              />

              <TextInput
                name={`contacts.${index}.email`}
                type="email"
                label="Email"
                placeholder="Enter contact email"
              />

              <TextInput
                name={`contacts.${index}.phone`}
                label="Phone"
                placeholder="Enter contact phone"
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="remove-button"
              >
                Remove Contact
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => push({ name: "", email: "", phone: "" })}
            className="add-button"
          >
            Add Contact
          </button>
        </div>
      )}
    </FieldArray>
  );
};

// Usage in main form
const ContactManagementForm: React.FC = () => {
  const initialValues: ContactForm = {
    contacts: [{ name: "", email: "", phone: "" }],
  };

  const validationSchema = Yup.object().shape({
    contacts: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Name is required"),
          email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
          phone: Yup.string().required("Phone is required"),
        })
      )
      .min(1, "At least one contact is required"),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <ContactList />
        <button type="submit">Save Contacts</button>
      </Form>
    </Formik>
  );
};
```

### Conditional Fields

```tsx
import { useFormikContext } from "formik";

interface EmployeeForm {
  employeeType: "fulltime" | "contractor" | "";
  fullTimeDetails?: {
    salary: number;
    benefits: string[];
  };
  contractorDetails?: {
    hourlyRate: number;
    contractDuration: string;
  };
}

const ConditionalFields: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<EmployeeForm>();

  const handleEmployeeTypeChange = (type: string) => {
    setFieldValue("employeeType", type);

    // Clear other type-specific fields
    if (type === "fulltime") {
      setFieldValue("contractorDetails", undefined);
    } else if (type === "contractor") {
      setFieldValue("fullTimeDetails", undefined);
    }
  };

  return (
    <div>
      <Select
        name="employeeType"
        label="Employee Type"
        options={[
          { value: "fulltime", label: "Full Time" },
          { value: "contractor", label: "Contractor" },
        ]}
        onChange={(e) => handleEmployeeTypeChange(e.target.value)}
      />

      {values.employeeType === "fulltime" && (
        <div className="fulltime-fields">
          <h3>Full Time Details</h3>
          <TextInput
            name="fullTimeDetails.salary"
            type="number"
            label="Annual Salary"
            placeholder="Enter annual salary"
          />

          <FieldArray name="fullTimeDetails.benefits">
            {({ push, remove }) => (
              <div>
                <label>Benefits</label>
                {values.fullTimeDetails?.benefits?.map((benefit, index) => (
                  <div key={index}>
                    <Field name={`fullTimeDetails.benefits.${index}`} />
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => push("")}>
                  Add Benefit
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      )}

      {values.employeeType === "contractor" && (
        <div className="contractor-fields">
          <h3>Contractor Details</h3>
          <TextInput
            name="contractorDetails.hourlyRate"
            type="number"
            label="Hourly Rate"
            placeholder="Enter hourly rate"
          />

          <TextInput
            name="contractorDetails.contractDuration"
            label="Contract Duration"
            placeholder="e.g., 6 months"
          />
        </div>
      )}
    </div>
  );
};
```

## Validation Strategies

### Custom Validation Functions

```tsx
// Async validation
const validateUsername = async (value: string) => {
  if (!value) return "Username is required";

  try {
    const response = await fetch(`/api/users/check-username/${value}`);
    const data = await response.json();

    if (!data.available) {
      return "Username is already taken";
    }
  } catch (error) {
    return "Unable to verify username availability";
  }
};

// Cross-field validation
const validatePasswordConfirmation = (values: any) => {
  const errors: any = {};

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  return errors;
};

// Complex validation schema
const RegistrationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .test("unique-username", "Username is already taken", validateUsername),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test("email-domain", "Email domain not allowed", (value) => {
      const allowedDomains = ["gmail.com", "company.com", "outlook.com"];
      const domain = value?.split("@")[1];
      return allowedDomains.includes(domain || "");
    }),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),

  age: Yup.number()
    .min(18, "Must be at least 18 years old")
    .max(120, "Age cannot exceed 120")
    .required("Age is required"),

  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});
```

### Real-time Validation

```tsx
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";

const RealTimeValidation: React.FC = () => {
  const { values, errors, touched, validateField } = useFormikContext();
  const [validationTimeout, setValidationTimeout] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    const timeout = setTimeout(() => {
      Object.keys(touched).forEach((fieldName) => {
        if (touched[fieldName as keyof typeof touched]) {
          validateField(fieldName);
        }
      });
    }, 500);

    setValidationTimeout(timeout);

    return () => {
      if (validationTimeout) {
        clearTimeout(validationTimeout);
      }
    };
  }, [values]);

  return null;
};

// Usage in form
<Formik {...formikProps}>
  <Form>
    <RealTimeValidation />
    {/* Form fields */}
  </Form>
</Formik>;
```

## Form State Management

### Persisting Form Data

```tsx
import { useEffect } from "react";
import { useFormikContext } from "formik";

const FormPersistence: React.FC<{ storageKey: string }> = ({ storageKey }) => {
  const { values, setValues } = useFormikContext();

  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setValues(parsedData);
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
      }
    }
  }, [storageKey, setValues]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(values));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [values, storageKey]);

  return null;
};

// Usage
<Formik {...formikProps}>
  <Form>
    <FormPersistence storageKey="user-registration-form" />
    {/* Form fields */}
  </Form>
</Formik>;
```

### Form State Restoration

```tsx
const useFormStateManagement = (formId: string) => {
  const [savedStates, setSavedStates] = useState<any[]>([]);

  const saveState = (values: any, label: string) => {
    const newState = {
      id: Date.now(),
      label,
      values: { ...values },
      timestamp: new Date().toISOString(),
    };

    setSavedStates((prev) => [...prev, newState]);
    localStorage.setItem(
      `form-states-${formId}`,
      JSON.stringify([...savedStates, newState])
    );
  };

  const loadState = (stateId: number) => {
    return savedStates.find((state) => state.id === stateId)?.values;
  };

  const deleteState = (stateId: number) => {
    const updatedStates = savedStates.filter((state) => state.id !== stateId);
    setSavedStates(updatedStates);
    localStorage.setItem(
      `form-states-${formId}`,
      JSON.stringify(updatedStates)
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem(`form-states-${formId}`);
    if (saved) {
      setSavedStates(JSON.parse(saved));
    }
  }, [formId]);

  return { savedStates, saveState, loadState, deleteState };
};
```

## Integration with UI Libraries

### Material-UI Integration

```tsx
import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { useField } from "formik";

const MuiTextField: React.FC<any> = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      {...field}
      label={label}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      fullWidth
      margin="normal"
      variant="outlined"
    />
  );
};

const MuiCheckbox: React.FC<any> = ({ label, ...props }) => {
  const [field] = useField({ ...props, type: "checkbox" });

  return (
    <FormControlLabel
      control={<Checkbox {...field} checked={field.value} />}
      label={label}
    />
  );
};

// Usage
<Formik {...formikProps}>
  {({ isSubmitting }) => (
    <Form>
      <MuiTextField name="email" label="Email Address" type="email" />
      <MuiTextField name="password" label="Password" type="password" />
      <MuiCheckbox name="rememberMe" label="Remember me" />

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="contained"
        color="primary"
        fullWidth
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  )}
</Formik>;
```

## Testing Formik Forms

### Unit Testing

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("should display validation errors for empty fields", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        rememberMe: false,
      });
    });
  });

  it("should validate email format", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### Optimizing Re-renders

```tsx
import { memo, useCallback } from "react";

const OptimizedField = memo<any>(({ name, label, type = "text" }) => {
  const [field, meta] = useField(name);

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        {...field}
        id={name}
        type={type}
        className={meta.touched && meta.error ? "error" : ""}
      />
      {meta.touched && meta.error && (
        <div className="error-message">{meta.error}</div>
      )}
    </div>
  );
});

const OptimizedForm: React.FC = () => {
  const handleSubmit = useCallback(async (values: any) => {
    // Handle submission
  }, []);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={handleSubmit}
      validate={useCallback((values: any) => {
        // Validation logic
      }, [])}
    >
      <Form>
        <OptimizedField name="email" label="Email" type="email" />
        <OptimizedField name="password" label="Password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};
```

## Best Practices

### Form Design Principles

1. **Use proper field types and validation**
2. **Provide clear error messages**
3. **Implement progressive disclosure for complex forms**
4. **Use appropriate loading states**
5. **Ensure accessibility compliance**
6. **Optimize for mobile experiences**
7. **Implement proper data persistence**

### Common Pitfalls

- Not validating on the server side
- Overcomplicating validation schemas
- Not handling async validation properly
- Ignoring accessibility requirements
- Not providing proper feedback during submission
- Creating overly complex form structures

## Interview Questions

### Basic Questions

**Q: What is Formik and what problems does it solve?**
A: Formik is a React form library that simplifies form handling by managing form state, validation, error handling, and submission with minimal boilerplate code.

**Q: How do you handle form validation in Formik?**
A: Formik supports validation through validation schemas (typically using Yup), custom validation functions, and field-level validation with real-time feedback.

**Q: What is the purpose of the Field component in Formik?**
A: The Field component automatically connects input elements to Formik's form state, handling value changes, blur events, and providing access to field metadata.

### Intermediate Questions

**Q: How do you implement dynamic forms with Formik?**
A: Use FieldArray for dynamic field lists, conditional rendering based on form values, and proper state management for adding/removing fields dynamically.

**Q: Explain how to integrate Formik with UI component libraries.**
A: Create wrapper components using useField hook to connect UI library components with Formik's state management and validation system.

### Advanced Questions

**Q: How do you optimize Formik forms for performance?**
A: Use React.memo for field components, implement proper validation strategies, minimize re-renders, and use FastField for independent field updates.

**Q: Design a complex multi-step form system with Formik.**
A: Implement step management with state persistence, conditional validation schemas, progress indicators, and proper data flow between steps.
