import { Controller, useForm } from "react-hook-form";
import {
  LeadGenerationSchema,
  leadGenerateSchema,
} from "../../schema/lead.schema";
import { generateLead, getTags } from "../../service/lead.service";
import { useMutation, useQuery } from "@tanstack/react-query";

import Button from "../ui/button/Button";
import ErrorMessage from "../form/form-elements/ErrorMessage";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import country from "../../data/country";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export interface ILeadGenProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadGen({ isOpen, onClose }: ILeadGenProps) {
  const { control, handleSubmit } = useForm<LeadGenerationSchema>({
    resolver: zodResolver(leadGenerateSchema),
    defaultValues: {
      country: "",
      industry: "",
      title: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: generateLead,
    mutationKey: ["lead-generate"],
    onSuccess(data) {
      toast.success("Lead Generation Started!");
      localStorage.setItem("executionid", `${data.data.id}`);
      queryClient.refetchQueries({
        queryKey: ["execution-history"],
      });
      onClose()
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const options = useMemo(
    () =>
      Object.values(tags ?? {}).map((tag) => ({
        value: tag._id,
        label: tag.cleaned_name,
      })),
    [tags]
  );

  const titleOptions = [
    { value: "owner", label: "Owner" },
    { value: "founder", label: "Founder" },
    { value: "c_suite", label: "C-Suite" },
    { value: "partner", label: "Partner" },
    { value: "vp", label: "VP" },
    { value: "head", label: "Head" },
    { value: "director", label: "Director" },
    { value: "manager", label: "Manager" },
    { value: "senior", label: "Senior" },
    { value: "entry", label: "Entry" },
    { value: "intern", label: "Intern" },
  ];

  const countryOptions = useMemo(
    () => country.map((c) => ({ value: c.name, label: c.name })),
    []
  );

  return (
    <Modal className="max-w-[480px] p-6" isOpen={isOpen} onClose={onClose}>
      <h4 className="text-lg font-semibold">Generate Leads</h4>
      <p className="text-sm text-gray-600">Select Filters to generate leads</p>

      <form className="mt-5" onSubmit={handleSubmit((data) => mutate([data]))}>
        <Controller
          control={control}
          name="country"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Country <small className="text-sm text-red-500">*</small>
              </Label>
              <Select
                className="w-full"
                placeholder="Country"
                options={countryOptions}
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="industry"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Industry <small className="text-sm text-red-500">*</small>
              </Label>
              <Select
                className="w-full"
                placeholder="Industry"
                options={options}
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Designation <small className="text-sm text-red-500">*</small>
              </Label>
              <Select
                className="w-full"
                placeholder="Designation"
                options={titleOptions}
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />

        <Button className="mt-2" isLoading={isPending} type="submit">
          Generate
        </Button>
      </form>
    </Modal>
  );
}
