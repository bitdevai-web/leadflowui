import { Controller, useForm } from "react-hook-form";
import { ISenderSchema, senderSchema } from "../../schema/sender.schema";

import Button from "../ui/button/Button";
import ErrorMessage from "../form/form-elements/ErrorMessage";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import { createSender } from "../../service/sender.service";
import { queryClient } from "../../main";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

export interface ICreateSenderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSender({ isOpen, onClose }: ICreateSenderProps) {
  const { control, handleSubmit, reset } = useForm<ISenderSchema>({
    resolver: zodResolver(senderSchema),
    defaultValues: {
      name: "",
      ending: "",
      designation: "",
      email: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createSender,
    mutationKey: ["create-sender"],
    onSuccess() {
      toast.success("Sender Created!");
      queryClient.refetchQueries({
        queryKey: ["senders"],
      });
      reset();
      onClose();
    },
  });

  useEffect;

  return (
    <Modal className="max-w-[480px] p-6" isOpen={isOpen} onClose={onClose}>
      <h4 className="text-lg font-semibold">Create Sender</h4>
      <p className="text-sm text-gray-600">
        Create a new sender by filling out the form below. All fields are
        required.
      </p>

      <form className="mt-5" onSubmit={handleSubmit((data) => mutate(data))}>
        <Controller
          control={control}
          name="ending"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Ending <small className="text-sm text-red-500">*</small>
              </Label>
              <Input className="w-full" placeholder="Best Regards" {...field} />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Name <small className="text-sm text-red-500">*</small>
              </Label>
              <Input className="w-full" placeholder="John Doe" {...field} />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Email <small className="text-sm text-red-500">*</small>
              </Label>
              <Input
                className="w-full"
                placeholder="john.doe@example.com"
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="designation"
          render={({ field, fieldState }) => (
            <div className="mt-2">
              <Label>
                Designation <small className="text-sm text-red-500">*</small>
              </Label>
              <Input
                className="w-full"
                placeholder="Vice President"
                {...field}
              />
              <ErrorMessage fieldState={fieldState} />
            </div>
          )}
        />

        <Button className="mt-2" isLoading={isPending} type="submit">
          Save
        </Button>
      </form>
    </Modal>
  );
}
