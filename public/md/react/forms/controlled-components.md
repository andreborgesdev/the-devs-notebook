# Controlled Components in React

Controlled components are form elements whose values are controlled by React state. This pattern provides full control over form data and enables features like validation, formatting, and dynamic behavior.

## Basic Controlled Components

### Text Input

```jsx
function ControlledTextInput() {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label htmlFor="text-input">Enter text:</label>
      <input
        id="text-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <p>Current value: {value}</p>
    </div>
  );
}
```

### Multiple Input Types

```jsx
function BasicForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    bio: "",
    country: "",
    newsletter: false,
    gender: "",
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        >
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleInputChange}
          />
          Subscribe to newsletter
        </label>
      </div>

      <div>
        <fieldset>
          <legend>Gender:</legend>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleInputChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleInputChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleInputChange}
            />
            Other
          </label>
        </fieldset>
      </div>
    </form>
  );
}
```

## Advanced Controlled Component Patterns

### Custom Input Hook

```jsx
function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    onChange: handleChange,
    reset,
  };
}

function FormWithCustomHook() {
  const username = useInput("");
  const email = useInput("");
  const password = useInput("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      username: username.value,
      email: email.value,
      password: password.value,
    });
  };

  const handleReset = () => {
    username.reset();
    email.reset();
    password.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input type="text" {...username} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" {...email} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" {...password} />
      </div>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
}
```

### Form State Management with useReducer

```jsx
const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_MULTIPLE_FIELDS":
      return {
        ...state,
        ...action.fields,
      };
    case "RESET_FORM":
      return action.initialState;
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

function ComplexForm() {
  const initialState = {
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    preferences: {
      newsletter: false,
      notifications: true,
      theme: "light",
    },
    errors: {},
  };

  const [formState, dispatch] = useReducer(formReducer, initialState);

  const updateField = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const updateNestedField = (section, field, value) => {
    dispatch({
      type: "SET_FIELD",
      field: section,
      value: {
        ...formState[section],
        [field]: value,
      },
    });
  };

  const handlePersonalInfoChange = (event) => {
    const { name, value } = event.target;
    updateNestedField("personalInfo", name, value);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    updateNestedField("address", name, value);
  };

  const handlePreferenceChange = (event) => {
    const { name, value, type, checked } = event.target;
    updateNestedField(
      "preferences",
      name,
      type === "checkbox" ? checked : value
    );
  };

  return (
    <form>
      <fieldset>
        <legend>Personal Information</legend>
        <input
          name="firstName"
          placeholder="First Name"
          value={formState.personalInfo.firstName}
          onChange={handlePersonalInfoChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={formState.personalInfo.lastName}
          onChange={handlePersonalInfoChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formState.personalInfo.email}
          onChange={handlePersonalInfoChange}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={formState.personalInfo.phone}
          onChange={handlePersonalInfoChange}
        />
      </fieldset>

      <fieldset>
        <legend>Address</legend>
        <input
          name="street"
          placeholder="Street Address"
          value={formState.address.street}
          onChange={handleAddressChange}
        />
        <input
          name="city"
          placeholder="City"
          value={formState.address.city}
          onChange={handleAddressChange}
        />
        <input
          name="state"
          placeholder="State"
          value={formState.address.state}
          onChange={handleAddressChange}
        />
        <input
          name="zipCode"
          placeholder="ZIP Code"
          value={formState.address.zipCode}
          onChange={handleAddressChange}
        />
      </fieldset>

      <fieldset>
        <legend>Preferences</legend>
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={formState.preferences.newsletter}
            onChange={handlePreferenceChange}
          />
          Newsletter
        </label>
        <label>
          <input
            type="checkbox"
            name="notifications"
            checked={formState.preferences.notifications}
            onChange={handlePreferenceChange}
          />
          Notifications
        </label>
        <select
          name="theme"
          value={formState.preferences.theme}
          onChange={handlePreferenceChange}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </fieldset>
    </form>
  );
}
```

## Input Formatting and Validation

### Real-time Input Formatting

```jsx
function FormattedInputs() {
  const [phone, setPhone] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [ssn, setSsn] = useState("");

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const formatCreditCard = (value) => {
    const cardNumber = value.replace(/[^\d]/g, "");
    return cardNumber
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatSSN = (value) => {
    const ssn = value.replace(/[^\d]/g, "");
    if (ssn.length < 4) return ssn;
    if (ssn.length < 6) return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  const handlePhoneChange = (event) => {
    const formatted = formatPhoneNumber(event.target.value);
    setPhone(formatted);
  };

  const handleCreditCardChange = (event) => {
    const formatted = formatCreditCard(event.target.value);
    setCreditCard(formatted);
  };

  const handleSSNChange = (event) => {
    const formatted = formatSSN(event.target.value);
    setSsn(formatted);
  };

  return (
    <form>
      <div>
        <label>Phone Number:</label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="(555) 123-4567"
          maxLength={14}
        />
      </div>
      <div>
        <label>Credit Card:</label>
        <input
          type="text"
          value={creditCard}
          onChange={handleCreditCardChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
        />
      </div>
      <div>
        <label>SSN:</label>
        <input
          type="text"
          value={ssn}
          onChange={handleSSNChange}
          placeholder="123-45-6789"
          maxLength={11}
        />
      </div>
    </form>
  );
}
```

### Input Validation

```jsx
function ValidatedForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Password must contain uppercase, lowercase, and number";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "age":
        if (!value) {
          error = "Age is required";
        } else if (parseInt(value) < 18) {
          error = "Must be at least 18 years old";
        } else if (parseInt(value) > 120) {
          error = "Age must be realistic";
        }
        break;
    }

    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    if (Object.keys(newErrors).length === 0) {
      console.log("Form is valid:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.password ? "error" : ""}
        />
        {errors.password && (
          <span className="error-message">{errors.password}</span>
        )}
      </div>

      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.confirmPassword ? "error" : ""}
        />
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword}</span>
        )}
      </div>

      <div>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.age ? "error" : ""}
        />
        {errors.age && <span className="error-message">{errors.age}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Dynamic Form Fields

### Adding and Removing Fields

```jsx
function DynamicFieldsForm() {
  const [skills, setSkills] = useState([""]);
  const [experiences, setExperiences] = useState([
    { company: "", position: "", years: "" },
  ]);

  const addSkill = () => {
    setSkills([...skills, ""]);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addExperience = () => {
    setExperiences([...experiences, { company: "", position: "", years: "" }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  return (
    <form>
      <fieldset>
        <legend>Skills</legend>
        {skills.map((skill, index) => (
          <div key={index} className="dynamic-field">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              placeholder="Enter a skill"
            />
            {skills.length > 1 && (
              <button type="button" onClick={() => removeSkill(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addSkill}>
          Add Skill
        </button>
      </fieldset>

      <fieldset>
        <legend>Work Experience</legend>
        {experiences.map((experience, index) => (
          <div key={index} className="experience-group">
            <input
              type="text"
              value={experience.company}
              onChange={(e) =>
                updateExperience(index, "company", e.target.value)
              }
              placeholder="Company"
            />
            <input
              type="text"
              value={experience.position}
              onChange={(e) =>
                updateExperience(index, "position", e.target.value)
              }
              placeholder="Position"
            />
            <input
              type="number"
              value={experience.years}
              onChange={(e) => updateExperience(index, "years", e.target.value)}
              placeholder="Years"
            />
            {experiences.length > 1 && (
              <button type="button" onClick={() => removeExperience(index)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addExperience}>
          Add Experience
        </button>
      </fieldset>
    </form>
  );
}
```

## TypeScript Controlled Components

```tsx
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  username: string;
  email: string;
  age: number | "";
  bio: string;
  country: string;
  newsletter: boolean;
  interests: string[];
}

interface FormErrors {
  username?: string;
  email?: string;
  age?: string;
  bio?: string;
  country?: string;
}

function TypedControlledForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    age: "",
    bio: "",
    country: "",
    newsletter: false,
    interests: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const { checked } = event.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseInt(value, 10),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInterestChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (formData.age === "" || formData.age < 18)
      newErrors.age = "Must be 18 or older";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <div>
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        >
          <option value="">Select a country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
          <option value="uk">United Kingdom</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={formData.newsletter}
            onChange={handleInputChange}
          />
          Subscribe to newsletter
        </label>
      </div>

      <fieldset>
        <legend>Interests:</legend>
        {["Reading", "Sports", "Music", "Travel"].map((interest) => (
          <label key={interest}>
            <input
              type="checkbox"
              value={interest}
              checked={formData.interests.includes(interest)}
              onChange={handleInterestChange}
            />
            {interest}
          </label>
        ))}
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## Performance Optimization

### Debounced Input

```jsx
function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      console.log("Searching for:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <p>Current query: {query}</p>
      <p>Debounced query: {debouncedQuery}</p>
    </div>
  );
}
```

## Best Practices

1. **Single Source of Truth**: Always use React state as the single source of truth for form data
2. **Controlled vs Uncontrolled**: Prefer controlled components for better control and validation
3. **Input Validation**: Implement both client-side and server-side validation
4. **Performance**: Use debouncing for expensive operations like API calls
5. **Accessibility**: Always provide proper labels and ARIA attributes
6. **Error Handling**: Show clear, actionable error messages
7. **Type Safety**: Use TypeScript for better development experience
8. **State Management**: Use useReducer for complex forms with many fields

## Common Mistakes

1. **Forgetting Value Prop**: Not providing the value prop makes the component uncontrolled
2. **Direct State Mutation**: Mutating state directly instead of using setState
3. **Missing Key Prop**: Not providing keys for dynamic form fields
4. **Poor Validation**: Not validating on both client and server sides
5. **Performance Issues**: Not debouncing expensive operations
6. **Accessibility Issues**: Missing labels, ARIA attributes, or proper form structure

## Interview Questions

**Q: What's the difference between controlled and uncontrolled components?**
A: Controlled components have their value controlled by React state, while uncontrolled components manage their own state internally using refs to access DOM values.

**Q: How do you handle form validation in controlled components?**
A: Implement validation functions that run onChange or onBlur, store errors in state, and display error messages conditionally based on validation results.

**Q: When would you use useReducer instead of useState for form state?**
A: Use useReducer for complex forms with many fields, nested data structures, or when you need more predictable state updates with actions.

**Q: How do you optimize performance in forms with many inputs?**
A: Use debouncing for expensive operations, memoize validation functions, avoid creating functions in render, and consider breaking large forms into smaller components.

**Q: How do you handle dynamic form fields in controlled components?**
A: Maintain arrays in state for dynamic fields, use array methods to add/remove items, and ensure each dynamic field has a unique key prop.
