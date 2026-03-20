"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { UseFormRegister, FieldErrors, Control, Controller } from "react-hook-form";

interface BillingStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  control: Control<any>;
  onContinue: () => void;
  countryList: Array<{ name: string; code: string }>;
  isActive: boolean;
  isCompleted: boolean;
  onEdit?: () => void;
  billingInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
}

const BillingStep: React.FC<BillingStepProps> = ({
  register,
  errors,
  control,
  onContinue,
  countryList,
  isActive,
  isCompleted,
  onEdit,
  billingInfo,
}) => {
  if (isCompleted && !isActive) {
    // Show completed state with billing info and edit button
    return (
      <div className="flex items-start justify-between">
        <div className="text-base text-gray-600">
          <p>{billingInfo?.firstName} {billingInfo?.lastName}</p>
          <p>{billingInfo?.address}</p>
          <p>{billingInfo?.city}, {billingInfo?.state} {billingInfo?.zip}</p>
          <p>{billingInfo?.country}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="btn-primary"
        >
          EDIT
        </button>
      </div>
    );
  }

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium mb-4 text-gray-700">Billing Address</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="billingFirstName" className="text-base mb-2 text-gray-700">
            First Name
          </label>
          <Input
            id="billingFirstName"
            type="text"
            className={`w-full h-[40px] ${
              errors.billingFirstName ? "border-red-500" : ""
            }`}
            {...register("billingFirstName", {
              required: "First name is required",
            })}
          />
          {errors.billingFirstName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.billingFirstName.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="billingLastName" className="text-base mb-2 text-gray-700">
            Last Name
          </label>
          <Input
            id="billingLastName"
            type="text"
            className={`w-full h-[40px] ${
              errors.billingLastName ? "border-red-500" : ""
            }`}
            {...register("billingLastName", {
              required: "Last name is required",
            })}
          />
          {errors.billingLastName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.billingLastName.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="billingCompany" className="text-base mb-2 text-gray-700">
          Company Name <span className="text-gray-400">(Optional)</span>
        </label>
        <Input
          id="billingCompany"
          type="text"
          className="w-full h-[40px]"
          {...register("billingCompany")}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="billingPhone" className="text-base mb-2 text-gray-700">
          Phone Number <span className="text-gray-400">(Optional)</span>
        </label>
        <Input
          id="billingPhone"
          type="text"
          className="w-full h-[40px]"
          {...register("billingPhone")}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="billingAddress1" className="text-base mb-2 text-gray-700">
          Address Line 1
        </label>
        <Input
          id="billingAddress1"
          type="text"
          className={`w-full h-[40px] ${
            errors.billingAddress1 ? "border-red-500" : ""
          }`}
          {...register("billingAddress1", {
            required: "Address is required",
          })}
        />
        {errors.billingAddress1 && (
          <p className="text-sm text-red-500 mt-1">
            {errors.billingAddress1.message as string}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="billingAddress2" className="text-base mb-2 text-gray-700">
          Address Line 2 <span className="text-gray-400">(Optional)</span>
        </label>
        <Input
          id="billingAddress2"
          type="text"
          className="w-full h-[40px]"
          {...register("billingAddress2")}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="billingCity" className="text-base mb-2 text-gray-700">
          City
        </label>
        <Input
          id="billingCity"
          type="text"
          className={`w-full h-[40px] ${
            errors.billingCity ? "border-red-500" : ""
          }`}
          {...register("billingCity", {
            required: "City is required",
          })}
        />
        {errors.billingCity && (
          <p className="text-sm text-red-500 mt-1">
            {errors.billingCity.message as string}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="billingCountry" className="text-base mb-2 text-gray-700">
          Country
        </label>
        <Controller
          name="billingCountry"
          control={control}
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                className={`w-full h-[40px] ${
                  errors.billingCountry ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryList.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.billingCountry && (
          <p className="text-sm text-red-500 mt-1">
            {errors.billingCountry.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="billingState" className="text-base mb-2 text-gray-700">
            State/Province
          </label>
          <Input
            id="billingState"
            type="text"
            className="w-full h-[40px]"
            {...register("billingState")}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="billingZip" className="text-base mb-2 text-gray-700">
            Postal Code
          </label>
          <Input
            id="billingZip"
            type="text"
            className={`w-full h-[40px] ${
              errors.billingZip ? "border-red-500" : ""
            }`}
            {...register("billingZip", {
              required: "Postal code is required",
            })}
          />
          {errors.billingZip && (
            <p className="text-sm text-red-500 mt-1">
              {errors.billingZip.message as string}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="btn-primary"
      >
        CONTINUE
      </button>
    </div>
  );
};

export default BillingStep;