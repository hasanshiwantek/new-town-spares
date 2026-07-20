"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  fetchCustomerMessages,
  fetchUserOrders,
  sendCustomerMessage,
} from "@/redux/slices/OrderMessage";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { Check } from "lucide-react";

interface SendMessageValues {
  order_id: number;
  subject: string;
  message: string;
}

interface Order {
  id: number;
  order_id: string;
  placed_on: string;
  total: string;
}

interface SendMessageFormProps {
  orders?: Order[];
}

const Messages = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(
    (state: RootState) => state.customerMessage.orders,
  );
  const { sendLoading } = useAppSelector(
    (state: RootState) => state.customerMessage,
  );
  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm<SendMessageValues>();
  const {
  register,
  handleSubmit,
  reset,
  formState: { errors, touchedFields },
} = useForm<SendMessageValues>({
  mode: "onTouched",
  reValidateMode: "onChange",
});

  function reCallAPis() {
    dispatch(fetchCustomerMessages({ page: 1, pageSize: 100 }));
    dispatch(fetchUserOrders());
  }

  const onSubmit = async (data: SendMessageValues) => {
    const result = await dispatch(sendCustomerMessage(data));

    if (sendCustomerMessage.fulfilled.match(result)) {
      reset();
      reCallAPis();
    }
  };

  const handleClear = () => {
    reset();
  };

  useEffect(() => {
    reCallAPis();
  }, []);

  return (
    <section className="w-full text-[#333333]">
      {/* Title */}
      <h2 className="text-[25px] leading-[30px] font-light text-[#333333] mb-[11px]">
        Send a Message
      </h2>

      {/* Form Container */}
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Order Dropdown */}
          <div className="mb-[28px]">
            <div className="mb-[7px] flex justify-between items-baseline">
              <label className="text-[14px] text-[#333333]">Order:</label>
              <span className="text-[10px] uppercase tracking-wider text-[#333333]">
                Required
              </span>
            </div>

            <div className="relative">
              <select
                {...register("order_id", { required: true })}
                className={`h-[42px] w-full appearance-none rounded-[4px] border bg-white py-[10.5px] pl-[14px] pr-[42px] !text-[14px] text-[#333333] outline-none transition-colors ${
                  errors.order_id ? "border-red-500" : "border-[#ebebeb]"
                }`}
              >
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.label}
                  </option>
                ))}
              </select>

              <svg
                className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#666]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-[28px]">
            <div className="mb-[7px] flex justify-between items-baseline">
              <label className="text-[14px] text-[#333333]">Subject</label>
              <span className="text-[10px] uppercase tracking-wider text-[#333333]">
                Required
              </span>
            </div>

            <div className="relative">
              <input
                {...register("subject", { required: "You must enter a subject" })}
                className={`h-[42px] w-full rounded-[4px] border px-[14px] pr-10 !text-[14px] text-[#333333] outline-none ${
                  errors.subject
                    ? "border-red-500"
                    : touchedFields.subject
                    ? "border-green-500"
                    : "border-[#ebebeb]"
                }`}
              />
              {touchedFields.subject && !errors.subject && (
                <Check
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600"
                />
              )}
            </div>
            {errors.subject && (
              <p className="mt-2 text-[10px] text-[#ff4a32]">
                ✕ {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="mb-[28px]">
            <div className="mb-[7px] flex justify-between items-baseline">
              <label className="text-[14px] text-[#333333]">Message</label>
              <span className="text-[10px] uppercase tracking-wider text-[#333333]">
                Required
              </span>
            </div>

            <textarea
              rows={6}
              {...register("message", { required: "You must enter a message" })}
              className={`w-full rounded-[4px] border px-[14px] py-[10.5px] !text-[14px] text-[#333333] resize-none outline-none transition-colors ${
                errors.message
                  ? "border-red-500"
                  : touchedFields.message
                  ? "border-green-700"
                  : "border-[#ebebeb]"
              }`}
            />
            {errors.message && (
              <p className="mt-2 text-[10px] text-[#ff4a32]">
                ✕ {errors.message.message}
              </p>
            )}
          </div>

          {/* Buttons — live .form-actions: full-width stacked <551px,
              auto-width right-aligned >=551px, 11px gap either way. */}
          <div className="flex flex-col min-[551px]:flex-row min-[551px]:justify-end gap-[11px]">
            <Button
              type="submit"
              disabled={sendLoading}
              className="h-[39px] w-full min-[551px]:w-auto rounded-[4px] bg-[#ff482e] px-[32px] text-[14px] font-light text-white hover:bg-[#ef3b24]"
            >
              {sendLoading ? "Loading..." : "Send Message"}
            </Button>

            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              className="h-[39px] w-full min-[551px]:w-auto rounded-[4px] border border-[#ebebeb] bg-white px-[32px] text-[14px] font-light text-[#333333] hover:bg-[#fafafa]"
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
export default Messages;
