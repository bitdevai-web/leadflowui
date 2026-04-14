export default function ErrorMessage({ fieldState }: { fieldState: any }) {
  const message = fieldState?.error?.message;

  if (!message) return null;
  return (
    <div className="text-red-500 text-xs mt-1">
      <i className="fa-solid fa-exclamation-circle mr-1"></i> {message}
    </div>
  );
}
