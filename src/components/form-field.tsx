import type { FieldError, UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FormData } from "./multi-step-form";

interface FormFieldProps {
  name: keyof FormData;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  register: UseFormRegister<FormData>;
  error?: FieldError;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  className,
  register,
  error,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className={error ? "border-red-500" : ""}
        
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
