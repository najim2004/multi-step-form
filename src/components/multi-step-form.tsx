"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { StepIndicator } from "./step-indicator";
import { FormField } from "./form-field";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";

const formSchema = z
  .object({
    // Step 1: Personal Information
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),

    // Step 2: Address Details
    streetAddress: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    zipCode: z
      .string()
      .min(1, "Zip code is required")
      .min(4, "Zip code must be at least 5 digits")
      .regex(/^\d+$/, "Zip code must contain only numbers"),

    // Step 3: Account Setup
    username: z
      .string()
      .min(1, "Username is required")
      .min(4, "Username must be at least 4 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormData = z.infer<typeof formSchema>;

const submitFormData = async (data: FormData) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  console.log("Form submitted with data:", data);

  return { success: true, message: "Registration successful!" };
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  // steps
  const steps = [
    { title: "Personal", fields: ["fullName", "email", "phoneNumber"] },
    { title: "Address", fields: ["streetAddress", "city", "zipCode"] },
    { title: "Account", fields: ["username", "password", "confirmPassword"] },
    { title: "Summary", fields: [] },
  ];

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      zipCode: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: submitFormData,
    onSuccess: (data) => {
      reset();
      setCurrentStep(0);
      toast({
        title: "Success!",
        description: data.message,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem submitting your form.",
        variant: "destructive",
      });
    },
  });

  //next button
  const handleNext = async () => {
    const fieldsToValidate = steps[currentStep].fields as Array<keyof FormData>;
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  //previous button
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  //form submission
  const onSubmit = (data: FormData) => {
    if (currentStep === steps.length - 1) {
      mutation.mutate(data);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <FormField
              name="fullName"
              label="Full Name"
              placeholder="Your name"
              register={register}
              error={errors.fullName}
            />
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="yourname@example.com"
              register={register}
              error={errors.email}
            />
            <FormField
              name="phoneNumber"
              label="Phone Number"
              placeholder="01234567890"
              register={register}
              error={errors.phoneNumber}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Address Details</h2>
            <FormField
              name="streetAddress"
              label="Street Address"
              placeholder="123 Main St"
              register={register}
              error={errors.streetAddress}
            />
            <FormField
              name="city"
              label="City"
              placeholder="Dhaka"
              register={register}
              error={errors.city}
            />
            <FormField
              name="zipCode"
              label="Zip Code"
              placeholder="1212"
              register={register}
              error={errors.zipCode}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Account Setup</h2>
            <FormField
              name="username"
              label="Username"
              placeholder="yourname123"
              register={register}
              error={errors.username}
            />
            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="••••••"
              register={register}
              error={errors.password}
            />
            <FormField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••"
              register={register}
              error={errors.confirmPassword}
            />
          </div>
        );
      case 3:
        return <Summary data={getValues()} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <StepIndicator currentStep={currentStep} steps={steps} />

          <form onSubmit={(e) => e.preventDefault()} className="mt-6">
            {renderStepContent()}

            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  Previous
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button" // ফর্ম সাবমিট হবে না
                  className="ml-auto"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button" // শুধু এটাই ফর্ম সাবমিট করবে
                  className="ml-auto"
                  disabled={mutation.isPending}
                  onClick={handleSubmit(onSubmit)}
                >
                  {mutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}

// Summary component
interface SummaryProps {
  data: FormData;
}

function Summary({ data }: SummaryProps) {
  // Group the data by step
  const sections = [
    {
      title: "Personal Information",
      fields: [
        { label: "Full Name", value: data.fullName },
        { label: "Email", value: data.email },
        { label: "Phone Number", value: data.phoneNumber },
      ],
    },
    {
      title: "Address Details",
      fields: [
        { label: "Street Address", value: data.streetAddress },
        { label: "City", value: data.city },
        { label: "Zip Code", value: data.zipCode },
      ],
    },
    {
      title: "Account Information",
      fields: [
        { label: "Username", value: data.username },
        { label: "Password", value: "••••••" }, // Don't show the actual password
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Please review your information before submitting.
      </p>

      {sections.map((section, index) => (
        <div key={index} className="space-y-3">
          <h3 className="font-medium text-lg">{section.title}</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            {section.fields.map((field, fieldIndex) => (
              <div
                key={fieldIndex}
                className="grid grid-cols-2 py-2 border-b last:border-0 border-gray-200 dark:border-gray-700"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {field.label}:
                </span>
                <span className="font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
