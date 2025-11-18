"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAppDispatch } from "@/app/redux/hooks";
import { createPoll } from "@/app/redux/slices/pollsSlice";
import { useRouter } from "next/navigation";

export default function PollCreateForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]); // two default fields

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

    const res = await dispatch(
      createPoll({
        title,
        description,
        options: cleanOptions,
      })
    );

    // When successful, go to dashboard or the poll details page
    // @ts-expect-error 404 error
    if (!res.error) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl mx-auto">

      {/* Title Field */}
      <div>
        <Input
          label="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your question?"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description Field */}
      <div>
        <Input
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain your poll or provide context…"
        />
      </div>

      {/* Options */}
      <div>
        <p className="font-medium mb-2">Options</p>

        <div className="flex flex-col gap-3">
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                value={opt}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 border px-3 py-2 rounded"
              />

              {/* Remove button only if more than 2 options */}
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500 font-bold px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.options && <p className="text-red-500 text-sm mt-2">{errors.options}</p>}

        <Button
          type="button"
          onClickAction={addOption}
          className="mt-3 bg-gray-700 hover:bg-gray-800"
        >
          Add Option
        </Button>
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full">
        Create Poll
      </Button>
    </form>
  );
}
