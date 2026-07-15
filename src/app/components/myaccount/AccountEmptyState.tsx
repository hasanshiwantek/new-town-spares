/**
 * Empty-state alert box — replicates live's `.alertBox.alertBox--info`:
 * 800px centered, bg #dfdfdf, text #666, radius 4px, 14px/21px, padding 11px 16px,
 * with the same Material "error" icon (25px, fill #666, knocked-out "!") and a 16px gap.
 */
const AccountEmptyState = ({ message }: { message: string }) => (
  <div className="max-w-[800px] mx-auto bg-[#dfdfdf] text-[#666666] rounded-[4px] py-[11px] px-[16px] flex items-center gap-[16px]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="#666666"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
    <p className="text-[14px] leading-[21px]">{message}</p>
  </div>
);

export default AccountEmptyState;
