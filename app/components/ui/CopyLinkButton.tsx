"use client";

export default function CopyLinkButton({ pollId }: { pollId: string }) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/poll/${pollId}`
      : "";

  const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <button
      onClick={copy}
      className="
        md:px-3 md:py-2 p-1 text-white text-sm font-medium
        rounded-lg
       bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
    >
      Copy Link
    </button>
  );
}
