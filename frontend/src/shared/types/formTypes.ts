import { UseFormRegister } from "react-hook-form";

type Color = "primary" | "secondary" | "default" | "danger" | "success" | "warning";

type Types = "text" | "password" | "email" | "number";

type Size = "sm" | "md" | "lg";

type Rules = {
  required?: boolean | string;
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: { value: number; message: string };
  pattern?: {
    value: RegExp;
    message: string;
  };
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/ban-types
  validate?: (value: {}) => boolean | string;
};

type RulesProps = {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  confirmPassword?: object;
  pattern?: RegExp;
};

type FieldProps = {
  name: string;
  label?: string;
  className?: string;
  color?: Color;
  size?: Size;
  rules?: RulesProps;
  disabled?: boolean;
  required?: boolean | string;
  error?: { message?: string };
  register: UseFormRegister<any>;
  [key: string]: any;
};

type InputProps = FieldProps & {
  type: Types;
  labelPlacement?: "outside" | "inside";
};

type EmailProps = FieldProps & {
  labelPlacement?: "outside" | "inside";
};

export type { Types, Rules, RulesProps, FieldProps, InputProps, EmailProps };
