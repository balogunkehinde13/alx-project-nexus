"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAppDispatch } from "@/app/redux/hooks";
import { createPoll } from "@/app/redux/slices/pollsSlice";
import { getOrCreateGuestId } from "@/app/lib/utils/guest";
import { useRouter } from "next/navigation";

export default function PollCreateForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]); 
  const [creatorName, setCreatorName] = useState("");

  const [errors, setErrors] = useState<{ title?: string; options?: string }>({});

  // Add a new empty option field
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Update an option text
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Remove an option (unless only 2 left)
  const removeOption = (index: number) => {
    if (options.length <= 2) return; // minimum 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Validation logic
  const validateForm = () => {
    const newErrors: { title?: string; options?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Poll title is required.";
    }

    const filledOptions = options.filter((opt) => opt.trim() !== "");

    if (filledOptions.length < 2) {
      newErrors.options = "At least two options are required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanOptions = options.filter((o) => o.trim() !== "");

    const creatorId = getOrCreateGuestId();

    const res = await dispatch(
      createPoll({
        title,
        description,
        options: cleanOptions,
        createdBy: creatorId,
        creatorName: creatorName || "Anonymous",
      })
    );

    // When successful, go to dashboard or the poll details page
    // @ts-expect-error 404 error
    if (!res.error) {
      router.push("/");
      router.refresh(); // ⭐ This forces server to re-fetch
    }
  };

  return (
    <div className="md:max-w-2xl md:mx-auto py-4 sm:py-8 sm:px-6">
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Create New Poll
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 px-2">
          What do you want to ask?
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Create engaging polls and share with your audience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Name Field */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <Input
            label="Your Name (optional)"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="Enter your name or leave blank"
          />
        </div>

        {/* Title Field */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <Input
            label="Poll Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your question?"
          />
          {errors.title && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errors.title}
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain your poll or provide context…"
          />
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Answer Options
            </p>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full w-fit">
              Minimum 2 options
            </span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 group">
                <div className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm">
                  {index + 1}
                </div>
                <input
                  value={opt}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 border-2 border-gray-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50 focus:bg-white placeholder:text-gray-400"
                />

                {/* Remove button only if more than 2 options */}
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center font-bold text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.options && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-xs sm:text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errors.options}
            </div>
          )}

          <Button
            type="button"
            onClickAction={addOption}
            className="mt-3 sm:mt-4 w-full border-2 border-dashed border-gray-300 bg-transparent text-indigo-600 hover:border-indigo-400 hover:text-indigo-800 hover:bg-indigo-50 transition-all py-2 sm:py-3"
          >
            <span className="flex items-center justify-center gap-2 text-sm sm:text-base text-indigo-600">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Option
            </span>
          </Button>
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-base sm:text-lg py-3 sm:py-4 shadow-lg hover:shadow-xl transition-all"
        >
          Create Poll
        </Button>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2">
          Your poll will be shareable instantly after creation
        </p>
      </form>
    </div>
  );
}