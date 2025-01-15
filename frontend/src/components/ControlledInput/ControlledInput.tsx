import * as React from "react";
import { useId } from "react";
import { Input as NUInput } from "@nextui-org/input";

import { FieldProps, Rules } from "@/shared/types/formTypes";

export const ControlledInput: React.FC<FieldProps> = ({
  name,
  required,
  error,
  rules,
  register,
  ...props
}) => {
  const id = useId();
  const formRules: Rules = {};
  const { minLength, maxLength, pattern } = rules || {};

  if (required) {
    formRules["required"] = typeof required === "boolean" ? `${name} is required` : required;
  }

  if (minLength) {
    formRules["minLength"] = {
      value: minLength,
      message: `${name} must have a minimum of ${minLength} characters`,
    };
  }

  if (maxLength) {
    formRules["maxLength"] = {
      value: maxLength,
      message: `${name} must have a minimum of ${maxLength} characters`,
    };
  }

  if (pattern) {
    formRules["pattern"] = {
      value: pattern,
      message: "The value entered does not match the required pattern",
    };
  }

  const inputProps = {
    id,
    name,
    isRequired: Boolean(required),
    type: "text",
    isInvalid: Boolean(error),
    errorMessage: error?.message,
    ...props,
    ...(typeof register === "function" ? register(name, formRules) : {}),
  };

  return <NUInput {...inputProps} />;
};
