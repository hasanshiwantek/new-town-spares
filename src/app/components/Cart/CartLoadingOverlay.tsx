// Blur + bouncing dots shown over a cart list while it's being updated.
// The parent must be `relative`.
const CartLoadingOverlay = () => (
  <div className="absolute inset-0 z-30 flex items-center justify-center">
    {/* Blur layer */}
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

    {/* Loader */}
    <div className="relative z-40 flex gap-2">
      <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      />
      <span
        className="w-2 h-2 bg-black rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      />
    </div>
  </div>
);

export default CartLoadingOverlay;
