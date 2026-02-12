export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--primary-color)]"></div>
      <span className="ml-4 text-[var(--primary-color)] text-lg font-medium"></span>
    </div>
  );
}