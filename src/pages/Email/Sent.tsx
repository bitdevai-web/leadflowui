import { BrevoEvent, IEMailHistory, Pagination } from "../../types/types";
import { Controller, useForm } from "react-hook-form";
import DataTable, { TableColumn } from "react-data-table-component";
import { IEmailFilter, emailFilterSchema } from "../../schema/email.schema";
import {
  deleteEmailHistory,
  getEmailHistory,
} from "../../service/email.service";
import { useMutation, useQuery } from "@tanstack/react-query";

import { AutoComplete } from "@/components/ui/autocomplete";
import Body from "../../components/email/Body";
import Button from "../../components/ui/button/Button";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import { getLeads } from "@/service/lead.service";
import { getSenders } from "@/service/sender.service";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { MOCK_SENT_EMAILS } from "../../data/mockData";

enum ModalState {
  EMAIL,
  NONE,
}
export default function Sent() {
  const [modalState, setModalState] = useState<ModalState>(ModalState.NONE);
  const [email, setEmail] = useState<IEMailHistory | null>(null);
  const { control, getValues, reset } = useForm<IEmailFilter>({
    resolver: zodResolver(emailFilterSchema),
    defaultValues: {
      status: "",
    },
  });
  const [pagination, setPagination] = useState<Pagination>({
    per_page: 10,
    page: 1,
  });

  const [search, setSearch] = useState<string>("");

  const [senderSearch, setSenderSearch] = useState<string>("");

  const { data: leads } = useQuery({
    queryKey: ["leads", search],
    queryFn: () =>
      getLeads({
        per_page: 30,
        page: 1,
        first_name: "",
        last_name: "",
        email: "",
        email_verified: "",
        category: "",
        designation: "",
        company: "",
        country: "",
        created_at: "",
        search: search,
      }),
    enabled: search.length > 2,
  });

  const { data: senders } = useQuery({
    queryKey: ["senders"],
    queryFn: () =>
      getSenders({
        per_page: 100,
        page: 1,
      }),
  });

  const { data: apiData, refetch: refetchEmails } = useQuery({
    queryKey: ["sent-emails", pagination.per_page, pagination.page],
    queryFn: () => getEmailHistory({ ...pagination, ...getValues() }),
    refetchOnWindowFocus: true,
  });
  const data = apiData ?? { data: MOCK_SENT_EMAILS, total: MOCK_SENT_EMAILS.length };

  const { mutate: deleteEmail } = useMutation({
    mutationKey: ["delete-email"],
    mutationFn: deleteEmailHistory,
    onSuccess() {
      refetchEmails();
    },
  });

  const columns: TableColumn<IEMailHistory>[] = [
    {
      name: "Lead Name",
      selector: (row): any =>
        row.lead && `${row.lead.first_name} ${row.lead.last_name}`,
      sortable: true,
    },
    {
      name: "Lead Email",
      selector: (row): any => row.lead && `${row.lead.email}`,
      sortable: true,
    },
    {
      name: "Sender Name",
      selector: (row): any => row.sender && row.sender.name,
      sortable: true,
    },
    {
      name: "Sender Email",
      selector: (row): any => row.sender && row.sender.email,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
    },
    {
      name: "Body",
      selector: (row): any => (
        <div
          className="cursor-pointer"
          onClick={() => {
            setEmail(row);
            setModalState(ModalState.EMAIL);
          }}
        >
          <span className="text-blue-500 fa-solid fa-eye"></span>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row): any => (
        <div
          className={`flex flex-row gap-2 ${
            statusColorMap[row.status || BrevoEvent.SENT_TO_BREVO].badge
          } py-1 px-2 rounded-lg overflow-visible`}
        >
          <span
            className={`font-semibold ${
              statusColorMap[row.status || BrevoEvent.SENT_TO_BREVO].text
            }`}
          >
            {statusLabelMap[row.status].toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      name: "Timezone",
      selector: (row): any => row.lead?.timezone,
      sortable: true,
    },
    {
      name: "Scheduled Time Range",
      selector: (row) =>
        `${row.scheduled_time_min} - ${row.scheduled_time_max}`,
      sortable: true,
    },
    {
      name: "Processed At",
      selector: (row) => new Date(row.created_at).toLocaleString(),
      sortable: true,
    },
    {
      name: "",
      width: "80px",
      selector: (row): any => (
        <div className="flex items-center py-2">
          <button
            title="Delete"
            onClick={() => confirm("Are you sure? \nThis Action is irreversable!") && deleteEmail(row.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <i className="fa-regular fa-trash-alt text-[11px]"></i> Delete
          </button>
        </div>
      ),
      reorder: true,
    },
  ];

  const handleClose = () => setModalState(ModalState.NONE);

  const options = [
    {
      label: "ALL",
      value: "",
    },
    {
      label: "SENT TO BREVO",
      value: BrevoEvent.SENT_TO_BREVO,
    },
    {
      label: "SENT",
      value: BrevoEvent.SENT,
    },
    {
      label: "DELIVERED",
      value: BrevoEvent.DELIVERED,
    },
    {
      label: "UNIQUE OPENED",
      value: BrevoEvent.UNIQUE_OPENED,
    },
    {
      label: "OPENED",
      value: BrevoEvent.OPENED,
    },
    {
      label: "PROXY OPEN",
      value: BrevoEvent.PROXY_OPEN,
    },
    {
      label: "CLICKED",
      value: BrevoEvent.CLICKED,
    },
    {
      label: "SOFT BOUNCE",
      value: BrevoEvent.SOFT_BOUNCE,
    },
    {
      label: "HARD BOUNCE",
      value: BrevoEvent.HARD_BOUNCE,
    },
    {
      label: "INVALID EMAIL",
      value: BrevoEvent.INVALID_EMAIL,
    },
    {
      label: "ERROR",
      value: BrevoEvent.ERROR,
    },
    {
      label: "DEFERRED",
      value: BrevoEvent.DEFERRED,
    },
    {
      label: "SPAM",
      value: BrevoEvent.SPAM,
    },
    {
      label: "UNSUBSCRIBED",
      value: BrevoEvent.UNSUBSCRIBED,
    },
    {
      label: "BLOCKED",
      value: BrevoEvent.BLOCKED,
    },
    {
      label: "SCHEDULED",
      value: BrevoEvent.SCHEDULED,
    },
  ];

  const statusColorMap: Record<BrevoEvent, { text: string; badge: string }> = {
    [BrevoEvent.SENT]: { text: "text-blue-500", badge: "bg-blue-100" },
    [BrevoEvent.DELIVERED]: { text: "text-green-500", badge: "bg-green-100" },
    [BrevoEvent.UNIQUE_OPENED]: {
      text: "text-yellow-500",
      badge: "bg-yellow-100",
    },
    [BrevoEvent.OPENED]: { text: "text-yellow-500", badge: "bg-yellow-100" },
    [BrevoEvent.PROXY_OPEN]: {
      text: "text-yellow-500",
      badge: "bg-yellow-100",
    },
    [BrevoEvent.CLICKED]: { text: "text-yellow-500", badge: "bg-yellow-100" },
    [BrevoEvent.SOFT_BOUNCE]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.HARD_BOUNCE]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.INVALID_EMAIL]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.ERROR]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.DEFERRED]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.SPAM]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.UNSUBSCRIBED]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.BLOCKED]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.SCHEDULED]: { text: "text-gray-500", badge: "bg-gray-100" },
    [BrevoEvent.SENT_TO_BREVO]: { text: "text-gray-500", badge: "bg-gray-100" },
    [BrevoEvent.FAILED]: { text: "text-red-500", badge: "bg-red-100" },
    [BrevoEvent.UNIQUE_PROXY_OPEN]: {
      text: "text-yellow-500",
      badge: "bg-yellow-100",
    },
    [BrevoEvent.UNIQUE_CLICKED]: {
      text: "text-yellow-500",
      badge: "bg-yellow-100",
    },
  };

  const statusLabelMap: Record<BrevoEvent, string> = {
    [BrevoEvent.SENT]: "Sent",
    [BrevoEvent.DELIVERED]: "Delivered",
    [BrevoEvent.UNIQUE_OPENED]: "Unique Opened",
    [BrevoEvent.OPENED]: "Opened",
    [BrevoEvent.PROXY_OPEN]: "Proxy Open",
    [BrevoEvent.CLICKED]: "Clicked",
    [BrevoEvent.SOFT_BOUNCE]: "Soft Bounce",
    [BrevoEvent.HARD_BOUNCE]: "Hard Bounce",
    [BrevoEvent.INVALID_EMAIL]: "Invalid Email",
    [BrevoEvent.ERROR]: "Error",
    [BrevoEvent.DEFERRED]: "Deferred",
    [BrevoEvent.SPAM]: "Spam",
    [BrevoEvent.UNSUBSCRIBED]: "Unsubscribed",
    [BrevoEvent.BLOCKED]: "Blocked",
    [BrevoEvent.SCHEDULED]: "Scheduled",
    [BrevoEvent.SENT_TO_BREVO]: "Sent to Brevo",
    [BrevoEvent.FAILED]: "Failed",
    [BrevoEvent.UNIQUE_PROXY_OPEN]: "Unique Opened",
    [BrevoEvent.UNIQUE_CLICKED]: "Unique Clicked",
  };

  const leadOptions =
    leads?.data.map((lead) => ({
      label: `${lead.first_name} ${lead.last_name}`,
      value: lead.id,
    })) ?? [];

  const senderOptions =
    senders?.data
      ?.filter((item) => `${item.name} ${item.email}`.includes(senderSearch))
      .map((sender) => ({
        label: sender.name,
        value: sender.id.toString(),
      })) ?? [];

  return (
    <>
      <PageMeta title="Leadflow - Sent Emails" description="" />
      <PageBreadcrumb
        pageTitle="Sent Emails"
        pageDetails="View all the emails sent to your leads"
        component={<div className="flex flex-row gap-2"></div>}
      />
      <div className="mb-6">
        <form className="flex flex-row gap-3 w-full">
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select placeholder="Email Status" options={options} {...field} />
            )}
          />

          <Controller
            control={control}
            name="lead_id"
            render={({ field }) => (
              <AutoComplete
                placeholder="Search Lead"
                options={leadOptions}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                onSearch={(search) => {
                  setSearch(search);
                  field.onChange("");
                }}
                debounceMs={500}
              />
            )}
          />

          <Controller
            control={control}
            name="sender_id"
            render={({ field }) => (
              <AutoComplete
                placeholder="Search Sender"
                options={senderOptions}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                onSearch={(search) => {
                  setSenderSearch(search);
                  field.onChange("");
                }}
                debounceMs={500}
              />
            )}
          />

          <Button
            type="button"
            onClick={() => refetchEmails()}
            size="sm"
            className="w-1/10"
          >
            Filter
          </Button>
          <Button
            type="button"
            onClick={() => {
              reset({});
              refetchEmails();
            }}
            size="sm"
            variant="outline"
            className="w-1/10"
          >
            Clear
          </Button>
        </form>
      </div>
      <div className="space-y-6 w-full overflow-auto">
        <DataTable
          responsive
          columns={columns}
          data={data?.data ?? []}
          pagination
          paginationServer
          paginationTotalRows={data?.total ?? 0}
          paginationPerPage={pagination.per_page}
          onChangeRowsPerPage={(per_page) =>
            setPagination({ ...pagination, per_page })
          }
          paginationRowsPerPageOptions={[25, 50, 100, 200]}
          onChangePage={(page) => setPagination({ ...pagination, page })}
          dense
        />
      </div>
      <Body
        isOpen={modalState == ModalState.EMAIL}
        onClose={handleClose}
        email={email}
      />
    </>
  );
}
