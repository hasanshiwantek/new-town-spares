"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchCustomerMessages,
  fetchUserOrders,
  sendCustomerMessage,
} from "@/redux/slices/OrderMessage";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { useEffect } from "react";
import { RootState } from "@/redux/store";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMessageValues>();

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
   <section className=" w-[500px]  text-[#545454] roboto-font">
      {/* Title */}
    <h2 className="text-[25px] font-light text-[#333] mb-4">
  Send a Message
</h2>

      {/* Form Container */}
      <div className="bg-[#]  w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
          {/* Order Dropdown */}
         <div className="mb-8">
  <div className="mb-2 flex justify-between">
    <label className="text-[14px] text-[#333]">
      Order:
    </label>

    <span className="text-[10px] uppercase tracking-wider text-[#777]">
      REQUIRED
    </span>
  </div>

  <div className="relative">
    <select
      {...register("order_id", { required: true })}
      className={`h-[36px] w-full appearance-none rounded border bg-white px-4 pr-10 text-[16px] text-[#444] outline-none ${
        errors.order_id
          ? "border-red-500"
          : "border-[#ddd]"
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
         <div className="mb-8">
  <div className="mb-2 flex justify-between">
    <label className="text-[14px] text-[#333]">
      Subject
    </label>

    <span className="text-[10px] uppercase tracking-wider text-[#777]">
      REQUIRED
    </span>
  </div>

  <input
    {...register("subject", { required: true })}
    className={`h-[36px] w-full rounded border px-4 text-[16px] outline-none ${
      errors.subject
        ? "border-red-500"
        : "border-[#ddd]"
    }`}
  />
</div>

          {/* Message */}
          <div className="mb-8">
  <div className="mb-2 flex justify-between">
    <label className="text-[14px] text-[#333]">
      Message
    </label>

    <span className="text-[10px] uppercase tracking-wider text-[#777]">
      REQUIRED
    </span>
  </div>

  <textarea
    rows={8}
    {...register("message", { required: true })}
    className={`w-full rounded border p-2 text-[10px] outline-none resize-none ${
      errors.message
        ? "border-red-500"
        : "border-[#ddd]"
    }`}
  />
</div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
  <Button
    type="submit"
    disabled={sendLoading}
    className="h-[32px] min-w-[170px] rounded-none bg-[#ff4a32] text-white hover:bg-[#ef3b24]"
  >
    {sendLoading ? "Loading..." : "Send Message"}
  </Button>

  <Button
    type="button"
    onClick={handleClear}
    variant="outline"
    className="h-[32px] min-w-[100px]  rounded-none border  bg-white text-[#555] hover:bg-[#fafafa]"
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
