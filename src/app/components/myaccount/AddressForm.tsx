"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { addCustomerAddress } from "@/redux/slices/myaccountSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  FieldLabel,
  ErrorMsg,
  addrInputCls,
  addrSelectCls,
} from "./addressFormHelpers";
import { Country, State, City } from "country-state-city";
import { useMemo } from "react";

interface AddressFormValues {
  firstName: string;
  lastName: string;
  companyName?: string;
  phoneNumber?: string;
  address1: string;
  address2?: string;
  suburb: string;
  country: string;
  state: string;
  postcode: string;
}

const AddressForm = () => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>();
  const { loading } = useAppSelector((state: RootState) => state.myaccount);
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selectedCountry = watch("country");

  const countryList = Country.getAllCountries().map((c) => ({
    name: c.name,
    code: c.isoCode,
  }));
  const stateList = useMemo(() => {
    if (!selectedCountry) return [];

    return State.getStatesOfCountry(selectedCountry).map((s) => ({
      name: s.name,
      code: s.isoCode,
    }));
  }, [selectedCountry]);
  const onSubmit = async (data: AddressFormValues) => {
    try {
      const mergedData = {

        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName || "",
        phoneNumber: data.phoneNumber || "",
        addressLine1: data.address1 || "",
        addressLine2: data.address2 || "",
        city: data.suburb,
        state: data.state,
        zip: data.postcode,
        country: data.country,
      };

      const result = await dispatch(
        addCustomerAddress({ id: auth?.user?.id, data: mergedData }),
      );

      if (addCustomerAddress.fulfilled.match(result)) {
        reset();
        router.push("/my-account/addresses");
      } else {
        const errorMessage =
          result.error?.message || "Update address failed. Please try again.";
        console.error("Update address failed:", errorMessage);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const rowClass =
    "grid grid-cols-1 min-[551px]:grid-cols-2 gap-7 min-[551px]:gap-5";

  return (
    <div className="max-w-[800px] mx-auto">
      <h2 className="text-[25px] leading-[30px] font-normal text-[#333333] text-center my-[26.25px]">
        Add New Address
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
        {/* Row 1: First Name | Last Name */}
        <div className={rowClass}>
          <div>
            <FieldLabel htmlFor="firstName" required>
              First Name
            </FieldLabel>
            <input
              id="firstName"
              className={addrInputCls(!!errors.firstName)}
              {...register("firstName", { required: true })}
            />
            <ErrorMsg show={!!errors.firstName} label="First Name" />
          </div>
          <div>
            <FieldLabel htmlFor="lastName" required>
              Last Name
            </FieldLabel>
            <input
              id="lastName"
              className={addrInputCls(!!errors.lastName)}
              {...register("lastName", { required: true })}
            />
            <ErrorMsg show={!!errors.lastName} label="Last Name" />
          </div>
        </div>

        {/* Row 2: Company Name | Phone Number */}
        <div className={rowClass}>
          <div>
            <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
            <input
              id="companyName"
              className={addrInputCls()}
              {...register("companyName")}
            />
          </div>
          <div>
            <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
            <input
              id="phoneNumber"
              className={addrInputCls()}
              {...register("phoneNumber")}
            />
          </div>
        </div>

        {/* Row 3: Address Line 1 | Address Line 2 */}
        <div className={rowClass}>
          <div>
            <FieldLabel htmlFor="address1" required>
              Address Line 1
            </FieldLabel>
            <input
              id="address1"
              className={addrInputCls(!!errors.address1)}
              {...register("address1", { required: true })}
            />
            <ErrorMsg show={!!errors.address1} label="Address Line 1" />
          </div>
          <div>
            <FieldLabel htmlFor="address2">Address Line 2</FieldLabel>
            <input
              id="address2"
              className={addrInputCls()}
              {...register("address2")}
            />
          </div>
        </div>

        {/* Row 4: Suburb/City | Country */}
        <div className={rowClass}>
          <div>
            <FieldLabel htmlFor="suburb" required>
              Suburb/City
            </FieldLabel>
            <input
              id="suburb"
              className={addrInputCls(!!errors.suburb)}
              {...register("suburb", { required: true })}
            />
            <ErrorMsg show={!!errors.suburb} label="Suburb/City" />
          </div>
          <div>
            <FieldLabel htmlFor="country" required>
              Country
            </FieldLabel>
            <select
              id="country"
              className={addrSelectCls(!!errors.country)}
              defaultValue=""
              // {...register("country", { required: true, })}
              {...register("country", {
                required: true,
                onChange: () => {
                  setValue("state", "");
                },
              })}
            >
              <option value="" disabled>
                Choose a Country
              </option>
              {countryList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ErrorMsg show={!!errors.country} label="Country" />
          </div>
        </div>

        {/* Row 5: State/Province | Zip/Postcode */}
        <div className={rowClass}>
          <div>
            <FieldLabel htmlFor="state" required>
              State/Province
            </FieldLabel>
            <select
              id="state"
              className={addrSelectCls(!!errors.state)}
              defaultValue=""
              {...register("state", { required: true })}
            >
              <option value="" disabled>
                Choose a State/Province
              </option>
              {stateList.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ErrorMsg show={!!errors.state} label="State/Province" />
          </div>
          <div>
            <FieldLabel htmlFor="postcode" required>
              Zip/Postcode
            </FieldLabel>
            <input
              id="postcode"
              className={addrInputCls(!!errors.postcode)}
              {...register("postcode", { required: true })}
            />
            <ErrorMsg show={!!errors.postcode} label="Zip/Postcode" />
          </div>
        </div>

        {/* Buttons — right-aligned like live */}
        <div className="flex justify-end items-center gap-[11px] mt-[4px]">
          <button
            type="submit"
            className="h-[39px] px-[32px] rounded-[4px] bg-[#FF482E] text-white text-[14px] font-light hover:bg-[#D42020] transition-colors"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-[39px] px-[32px] rounded-[4px] bg-white border border-[#ebebeb] text-[#333333] text-[14px] font-light hover:border-[#FF482E] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
