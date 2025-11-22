"use client";

export default function CopyLinkButton({ pollId }: { pollId: string }) {
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/poll/${pollId}`
    : "";

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  return (
    <button
      onClick={copy}
      className="p-2 rounded-lg border hover:bg-gray-700"
    >
      Copy Poll Link
    </button>
  );
}
