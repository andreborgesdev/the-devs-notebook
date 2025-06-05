# React Hook Form

React Hook Form is a performant, flexible, and extensible forms library with easy validation and minimal re-renders.

## Installation

```bash
pnpm add react-hook-form
```

## Basic Usage

### Simple Form

```tsx
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  age: number;
}

const BasicForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: "Name is required" })}
        placeholder="Name"
      />
      {errors.name && <span>{errors.name.message}</span>}

      <input
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}

      <input
        type="number"
        {...register("age", {
          required: "Age is required",
          min: { value: 18, message: "Must be at least 18" },
        })}
        placeholder="Age"
      />
      {errors.age && <span>{errors.age.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Advanced Validation

### Custom Validation Rules

```tsx
const AdvancedForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input
        {...register("username", {
          required: "Username is required",
          minLength: {
            value: 3,
            message: "Username must be at least 3 characters",
          },
          validate: {
            noSpaces: (value) =>
              !value.includes(" ") || "Username cannot contain spaces",
            uniqueUsername: async (value) => {
              const isUnique = await checkUsernameUnique(value);
              return isUnique || "Username already exists";
            },
          },
        })}
        placeholder="Username"
      />
      {errors.username && <span>{errors.username.message}</span>}

      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: "Password must contain uppercase, lowercase, and number",
          },
        })}
        placeholder="Password"
      />
      {errors.password && <span>{errors.password.message}</span>}

      <input
        type="password"
        {...register("confirmPassword", {
          required: "Please confirm password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        placeholder="Confirm Password"
      />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit">Register</button>
    </form>
  );
};

async function checkUsernameUnique(username: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return !["admin", "user", "test"].includes(username.toLowerCase());
}
```

## Form State Management

### Using Controller for Custom Components

```tsx
import { Controller, useForm } from "react-hook-form";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  error,
}) => (
  <div className={`select ${error ? "error" : ""}`}>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FormWithController = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
  ];

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="country"
        control={control}
        rules={{ required: "Please select a country" }}
        render={({ field, fieldState }) => (
          <CustomSelect
            value={field.value || ""}
            onChange={field.onChange}
            options={countryOptions}
            error={!!fieldState.error}
          />
        )}
      />
      {errors.country && <span>{errors.country.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Dynamic Fields

```tsx
import { useFieldArray, useForm } from "react-hook-form";

interface DynamicFormData {
  users: {
    name: string;
    email: string;
  }[];
}

const DynamicForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DynamicFormData>({
    defaultValues: {
      users: [{ name: "", email: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        <div key={field.id} className="user-row">
          <input
            {...register(`users.${index}.name`, {
              required: "Name is required",
            })}
            placeholder="Name"
          />
          {errors.users?.[index]?.name && (
            <span>{errors.users[index].name.message}</span>
          )}

          <input
            {...register(`users.${index}.email`, {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email",
              },
            })}
            placeholder="Email"
          />
          {errors.users?.[index]?.email && (
            <span>{errors.users[index].email.message}</span>
          )}

          <button
            type="button"
            onClick={() => remove(index)}
            disabled={fields.length === 1}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: "", email: "" })}>
        Add User
      </button>

      <button type="submit">Submit All</button>
    </form>
  );
};
```

## Form Modes and Performance

### Different Validation Modes

```tsx
const ValidationModes = () => {
  const formOnChange = useForm({
    mode: "onChange",
  });

  const formOnBlur = useForm({
    mode: "onBlur",
  });

  const formOnSubmit = useForm({
    mode: "onSubmit",
  });

  const formAll = useForm({
    mode: "all",
  });

  return (
    <div>
      <h3>Validation Modes Comparison</h3>

      <div>
        <h4>onChange (validates on every change)</h4>
        <form onSubmit={formOnChange.handleSubmit(console.log)}>
          <input
            {...formOnChange.register("email", {
              required: "Email required",
            })}
            placeholder="Email"
          />
          {formOnChange.formState.errors.email && (
            <span>{formOnChange.formState.errors.email.message}</span>
          )}
        </form>
      </div>

      <div>
        <h4>onBlur (validates when field loses focus)</h4>
        <form onSubmit={formOnBlur.handleSubmit(console.log)}>
          <input
            {...formOnBlur.register("email", {
              required: "Email required",
            })}
            placeholder="Email"
          />
          {formOnBlur.formState.errors.email && (
            <span>{formOnBlur.formState.errors.email.message}</span>
          )}
        </form>
      </div>
    </div>
  );
};
```

## Integration with UI Libraries

### React Hook Form with Material-UI

```tsx
import { Controller, useForm } from "react-hook-form";
import { TextField, Button, FormControl, FormHelperText } from "@mui/material";

const MaterialUIForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="firstName"
        control={control}
        rules={{ required: "First name is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="First Name"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Email"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};
```

## Testing React Hook Form

```tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BasicForm } from "./BasicForm";

describe("BasicForm", () => {
  it("validates required fields", async () => {
    const user = userEvent.setup();
    render(<BasicForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    const user = userEvent.setup();
    render(<BasicForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    await user.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();

    render(<BasicForm onSubmit={mockSubmit} />);

    await user.type(screen.getByPlaceholderText("Name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Age"), "25");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        age: 25,
      });
    });
  });
});
```

## Best Practices

### Performance Optimization

```tsx
import { useForm, useWatch } from "react-hook-form";
import { memo } from "react";

const OptimizedFormField = memo<{
  name: string;
  control: any;
  register: any;
  error?: any;
}>(({ name, control, register, error }) => {
  const value = useWatch({
    control,
    name,
  });

  return (
    <div>
      <input
        {...register(name, { required: `${name} is required` })}
        placeholder={name}
      />
      {error && <span>{error.message}</span>}
      <span>Current value: {value}</span>
    </div>
  );
});

const PerformantForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <OptimizedFormField
        name="name"
        control={control}
        register={register}
        error={errors.name}
      />
      <OptimizedFormField
        name="email"
        control={control}
        register={register}
        error={errors.email}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## Common Patterns

| Pattern         | Use Case             | Benefits                    |
| --------------- | -------------------- | --------------------------- |
| `register`      | Simple form fields   | Minimal boilerplate         |
| `Controller`    | Custom components    | Full control over rendering |
| `useFieldArray` | Dynamic lists        | Built-in array operations   |
| `useWatch`      | Conditional fields   | Optimized subscriptions     |
| `setValue`      | Programmatic updates | Manual form control         |

## Interview Questions

**Q: What are the advantages of React Hook Form over other form libraries?**

A: React Hook Form offers several advantages:

- **Performance**: Minimal re-renders due to uncontrolled components approach
- **Bundle Size**: Lightweight with no dependencies
- **Developer Experience**: Simple API with TypeScript support
- **Validation**: Built-in validation with custom rules
- **Integration**: Easy integration with UI libraries

**Q: How does React Hook Form minimize re-renders?**

A: React Hook Form uses uncontrolled components by default, storing form state in refs rather than React state. This means form updates don't trigger component re-renders, only validation and submit events do.

**Q: When would you use Controller vs register?**

A: Use `register` for native HTML inputs and `Controller` for custom components or third-party UI library components that need controlled behavior.

**Q: How do you handle async validation in React Hook Form?**

A: Use async functions in the validate option or custom validation rules that return promises.

## Common Mistakes

1. **Not using TypeScript**: Missing type safety for form data
2. **Overusing Controller**: Using Controller for simple inputs
3. **Wrong validation mode**: Using onChange mode unnecessarily
4. **Not memoizing components**: Causing unnecessary re-renders
5. **Complex nested validation**: Not structuring validation rules properly

## Migration from Formik

```tsx
const FormikForm = () => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Required";
      return errors;
    },
    onSubmit: (values) => console.log(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.errors.email && <span>{formik.errors.email}</span>}
    </form>
  );
};

const ReactHookForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input {...register("email", { required: "Required" })} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
};
```

React Hook Form provides a modern, performant approach to form handling in React with excellent developer experience and minimal boilerplate code.
