import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getSettings, updateSetting } from "../../service/setting.service";
import toast from "react-hot-toast";
import type { ISetting } from "../../types/types";

function AutoResizeTextarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-none overflow-hidden rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
    />
  );
}

function SettingRow({
  setting,
  onSaved,
}: {
  setting: ISetting;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(setting.value ?? "");
  const isDirty = value !== (setting.value ?? "");

  const mutation = useMutation({
    mutationFn: () => updateSetting(setting.key, { value }),
    onSuccess: () => {
      toast.success(`"${setting.key}" saved`);
      onSaved();
    },
    onError: () => {
      toast.error(`Failed to save "${setting.key}"`);
    },
  });

  return (
    <div className="grid grid-cols-1 gap-2 border-b border-gray-100 py-4 last:border-b-0 dark:border-gray-800 sm:grid-cols-[200px_1fr_auto] sm:items-start sm:gap-4">
      {/* Key */}
      <div className="flex flex-col gap-1">
        <span className="font-mono text-sm font-medium text-gray-800 dark:text-white/90 break-all">
          {setting.key}
        </span>
        {setting.description && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {setting.description}
          </span>
        )}
      </div>

      {/* Value */}
      <AutoResizeTextarea value={value} onChange={setValue} />

      {/* Save button */}
      <div className="flex items-start">
        <button
          disabled={!isDirty || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["settings"] });
  };

  return (
    <>
      <PageMeta title="Settings | LeadFlow" description="Manage application settings" />
      <PageBreadCrumb pageTitle="Settings" />

      <ComponentCard title="Application Settings" desc="Manage API keys and configuration values">
        <div className="px-6 pb-6">
          {isLoading && (
            <div className="space-y-4 py-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
                />
              ))}
            </div>
          )}

          {isError && (
            <p className="py-4 text-sm text-red-500">
              Failed to load settings. Please try again.
            </p>
          )}

          {data?.data.map((setting) => (
            <SettingRow key={setting.key} setting={setting} onSaved={handleSaved} />
          ))}

          {data?.data.length === 0 && (
            <p className="py-4 text-sm text-gray-400">No settings found.</p>
          )}
        </div>
      </ComponentCard>
    </>
  );
}
