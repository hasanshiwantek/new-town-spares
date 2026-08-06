"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatListDate(d: Date) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = d.getDate();
  const ord =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  return `${months[d.getMonth()]} ${day}${ord} ${d.getFullYear()}`;
}

type SavedList = { name: string; count: number };

export default function SaveCartToList() {
  const defaultName = useMemo(
    () => `Saved cart - ${formatListDate(new Date())}`,
    [],
  );

  const [lists, setLists] = useState<SavedList[]>([
    { name: "Saved cart - Jul 24th 2026", count: 6 },
    { name: "Saved cart - Aug 3rd 2026", count: 8 },
  ]);
  const [selected, setSelected] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [listName, setListName] = useState(defaultName);
  const [shareList, setShareList] = useState(false);

  const openModal = () => {
    setListName(`Saved cart - ${formatListDate(new Date())}`);
    setShareList(false);
    setModalOpen(true);
  };

  const handleCreate = () => {
    const name = listName.trim();
    if (!name) return;
    setLists((prev) => {
      const next = [...prev, { name, count: 0 }];
      setSelected(next.length - 1);
      return next;
    });
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-end gap-[11px] mt-[21px] mb-[11px]">
        <button
          type="button"
          onClick={openModal}
          className="h-[42px] text-[14px] leading-[19px] text-[#333333] underline hover:text-[#ff482e] transition-colors"
        >
          Add new list
        </button>

        <div className="text-right">
          <span className="block text-[14px] leading-[21px] text-[#333333]">
            or save this cart to a list:
          </span>
          <div className="relative mt-[1px]">
            <select
              value={selected}
              onChange={(e) => setSelected(Number(e.target.value))}
              className="h-[42px] w-[263px] max-w-[70vw] border-[0.667px] border-[#ebebeb] rounded-[4px] pl-[14px] pr-[42px] !text-[14px] text-[#333333] bg-white appearance-none outline-none focus:ring-1 focus:ring-[#ff482e]"
            >
              {lists.map((l, i) => (
                <option key={i} value={i}>
                  {l.name} ({l.count})
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#333333]" />
          </div>
        </div>

        <button
          type="button"
          className="h-[42px] px-[32px] border-[0.667px] border-[#ebebeb] rounded-[4px] text-[14px] font-light text-[#333333] bg-white hover:bg-gray-50 transition-colors"
        >
          Save Cart
        </button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden border-0 w-[92vw] sm:max-w-[900px] rounded-none!">
          <DialogHeader className="px-[32px] py-[14px] border-b-[0.667px] border-[#ebebeb] text-left space-y-0">
            <DialogTitle className="text-[25px] leading-[30px] font-normal text-[#333333]">
              Add a new list
            </DialogTitle>
          </DialogHeader>

          <div className="p-[32px]">
            <div className="mb-[28px]">
              <label
                htmlFor="new-list-name"
                className="flex items-baseline justify-between mb-[7px]"
              >
                <span className="text-[14px] leading-[21px] font-light text-[#333333]">
                  List Name:
                </span>
                <span className="text-[10px] leading-[15px] font-light uppercase text-[#333333]">
                  Required
                </span>
              </label>
              <input
                id="new-list-name"
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="h-[42px] w-full border-[0.667px] border-[#ebebeb] rounded-[4px] px-[14px] py-[10.5px] !text-[14px] text-[#333333] bg-white outline-none focus:ring-1 focus:ring-[#ff482e]"
              />
            </div>

            <div className="mb-[28px] flex items-center gap-[11px]">
              <input
                id="share-list"
                type="checkbox"
                checked={shareList}
                onChange={(e) => setShareList(e.target.checked)}
                className="w-[18px] h-[18px] accent-[#ff482e] cursor-pointer"
              />
              <label
                htmlFor="share-list"
                className="text-[14px] leading-[21px] font-light text-[#333333] cursor-pointer"
              >
                Share List?
              </label>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleCreate}
                className="h-[39px] px-[32px] bg-[#ff482e] hover:bg-[#e63e26] text-white text-[14px] font-light rounded-[4px] transition-colors"
              >
                Create New List
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
