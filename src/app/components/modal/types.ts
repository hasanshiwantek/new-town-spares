export interface AccountSignInLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?: (email: string) => Promise<void> | void;
}
