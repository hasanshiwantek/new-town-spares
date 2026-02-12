"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHooks";
import { RootState } from "@/redux/store";
import {
  deletecustomeraddress,
  fetchAccountAddress,
  updatecustomer,
} from "@/redux/slices/myaccountSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MyAddress = () => {
  const dispatch = useAppDispatch();

  const { address, loading, error } = useAppSelector(
    (state: RootState) => state.myaccount
  );

  const auth = useAppSelector((state: RootState) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAccountAddress());
  }, [dispatch]);

  const handleDelete = async (id: number | string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete address with ID: ${id}?`
    );
    if (confirmDelete) {
      try {
        await dispatch(deletecustomeraddress({ id })).unwrap();
        dispatch(fetchAccountAddress());
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const openEditModal = (item: any) => {
    setEditData({
      addressId: item.addressId,
      addressLine1: item.addressLine1,
      addressLine2: item.addressLine2,
      city: item.city,
      state: item.state,
      zip: item.zip,
      country: item.country,
    });

    setShowModal(true);
  };

  const handleUpdate = async () => {
    const payload = {
      addresses: [
        {
          id: editData.addressId,
          addressLine1: editData.addressLine1,
          addressLine2: editData.addressLine2,
          city: editData.city,
          state: editData.state,
          zip: editData.zip,
          country: editData.country,
        },
      ],
    };

    try {
      await dispatch(
        updatecustomer({
          id: auth?.user?.id,
          data: payload,
        })
      ).unwrap();

      setShowModal(false);
      dispatch(fetchAccountAddress());
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="max-w-5xl">
      {/* Skeleton Loader */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4 animate-pulse h-48"
            >
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-10 bg-gray-300 rounded w-full mt-auto"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
  <p className="text-red-500">
    Failed to fetch address. {error}
  </p>
)}


      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address List */}
          {address?.addresses?.map((item: any) => (
            <div
              key={item.addressId}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-full"
            >
              <div className="flex flex-col gap-1 mb-4">
                <p className="h6-18-px-medium">
                  {item.customerName || "N/A"}
                </p>
                <p className="text-lg">{item.addressLine1}</p>
                {item.addressLine2 && (
                  <p className="text-lg">{item.addressLine2}</p>
                )}
                <p className="text-lg">
                  {item.city} {item.zip}
                </p>
                <p className="text-lg">{item.country}</p>
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => openEditModal(item)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-bold bg-[#F15939] text-white border border-[#F15939] hover:bg-white hover:text-[#F15939] transition"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.addressId)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-bold bg-white text-[#F15939] border border-[#F15939] hover:bg-[#F15939] hover:text-white transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* New Address Button */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center h-full hover:bg-gray-50 cursor-pointer">
            <Link
              href="/my-account/addresses/new-address"
              className="flex flex-col items-center justify-center gap-2"
            >
              <Plus size={24} />
              <span className="font-medium">New Address</span>
            </Link>
          </div>
        </div>
      )}

      {/* -------------------- EDIT MODAL -------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close Btn */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-600 hover:text-black"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Address</h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Address Line 1 */}
              <div>
                <Label>Address Line 1</Label>
                <Input
                  value={editData.addressLine1}
                  onChange={(e) =>
                    setEditData({ ...editData, addressLine1: e.target.value })
                  }
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <Label>Address Line 2</Label>
                <Input
                  value={editData.addressLine2}
                  onChange={(e) =>
                    setEditData({ ...editData, addressLine2: e.target.value })
                  }
                />
              </div>

              {/* City */}
              <div>
                <Label>City</Label>
                <Input
                  value={editData.city}
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                />
              </div>

              {/* State */}
              <div>
                <Label>State</Label>
                <Input
                  value={editData.state}
                  onChange={(e) =>
                    setEditData({ ...editData, state: e.target.value })
                  }
                />
              </div>

              {/* Zip */}
              <div>
                <Label>Zip Code</Label>
                <Input
                  value={editData.zip}
                  onChange={(e) =>
                    setEditData({ ...editData, zip: e.target.value })
                  }
                />
              </div>

              {/* Country */}
              <div>
                <Label>Country</Label>
                <Input
                  value={editData.country}
                  onChange={(e) =>
                    setEditData({ ...editData, country: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <Button
                onClick={handleUpdate}
                className="w-full bg-[#F15939] text-white"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                className="w-full border border-[#F15939] text-[#F15939]"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* -------------------- END MODAL -------------------- */}
    </div>
  );
};

export default MyAddress;
