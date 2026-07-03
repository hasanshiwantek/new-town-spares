declare module "react-google-recaptcha" {
  import { Component, Ref } from "react";

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    theme?: "dark" | "light";
    size?: "compact" | "normal" | "invisible";
    tabindex?: number;
    ref?: Ref<ReCAPTCHA>;
  }

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): void;
    executeAsync(): Promise<string | null>;
    getValue(): string | null;
  }
}