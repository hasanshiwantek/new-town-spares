"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EMAIL_REGEX } from "@/const/contact";
import { errorMessage, successMessage } from "@/utils/message";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { AccountSignInLinkModalProps } from "./types";

const AccountSignInLinkModal: React.FC<AccountSignInLinkModalProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setEmail("");
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) {
      errorMessage(
        "Please use a valid email address, such as user@example.com.",
      );
      return;
    }
    setLoading(true);
    try {
      await onSend?.(email.trim());
      successMessage("Sign-in link sent.");
      onClose();
    } catch (err) {
      errorMessage("Could not send the sign-in link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[520px] w-[92vw] p-0 gap-0 rounded-[2px] border border-[#e6e6e6] bg-white shadow-sm"
      >
        <div className="flex items-start justify-between px-[24px] pt-[18px] pb-[8px]">
          <DialogTitle className="text-[18px] leading-[24px] font-normal text-[#6b6b6b]">
            Account sign-in link
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8a8a8a] hover:text-[#333] transition-colors -mt-[2px]"
            aria-label="Close"
          >
            <X className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-[24px] pb-[20px]">
          <p className="text-[14px] leading-[22px] font-light text-[#8a8a8a] mb-[22px] max-w-[420px]">
            Enter the email address associated to your account. We will send you
            a sign-in link.
          </p>

          <label
            htmlFor="sign-in-email"
            className="block text-[14px] leading-[20px] text-[#4a4a4a] mb-[8px]"
          >
            Email Address
          </label>
          <Input
            id="sign-in-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="!h-[40px] !max-w-full px-[12px] border border-[#d9d9d9] bg-white rounded-[2px] text-[14px]! text-[#333] focus:outline-none focus:ring-1 focus:ring-[#ff482e] focus:border-[#ff482e]"
          />

          <div className="flex items-center justify-end gap-[10px] mt-[22px]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-[36px] min-w-[96px] px-[18px] rounded-[2px] border border-[#d0d0d0] bg-white text-[#555] text-[13px]! font-medium tracking-[0.04em] hover:bg-[#fafafa]"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-[36px] min-w-[88px] px-[18px] rounded-[2px] bg-[var(--primary-color)] hover:bg-[var(--confirmation-color)] text-white text-[13px]! font-medium tracking-[0.04em]"
            >
              {loading ? "SENDING..." : "SEND"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSignInLinkModal;
