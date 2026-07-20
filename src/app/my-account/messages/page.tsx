"use client";
import MessageList from "@/app/components/myaccount/MessageList";
import Messages from "@/app/components/myaccount/Messages";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { fetchUserOrders } from "@/redux/slices/OrderMessage";
import { RootState } from "@/redux/store";
import { useEffect } from "react";

const Page = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(
    (state: RootState) => state.customerMessage.orders,
  );

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);
  return (
    <div className="w-full ">
      {orders.length > 0 ? (
        <>
          <div className="mx-auto w-full max-w-[600px]  px-4 lg:px-0">
            <MessageList />

            <div className="mt-[32px]">
              <Messages />
            </div>
          </div>
        </>
      ) : (
        <div className="border-[1px] border-[#8b8b8b] items-center p-3 flex gap-3  mt-5 text-[#545454]">
          <svg
            className="text-[#8b8b8b] fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
          </svg>
          <h1 className="text-[14px]   font-light">
            Once you place an order you'll have full access to send messages
            from this page.
          </h1>
        </div>
      )}
    </div>
  );
};

export default Page;
