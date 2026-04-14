import { Controller, useForm } from "react-hook-form";
import DataTable, { Media, TableColumn } from "react-data-table-component";
import { ILead, Pagination } from "../../types/types";
import { LeadFilterSchema, leadFilterSchema } from "../../schema/lead.schema";
import {
  deleteLead,
  exportLeadZoho,
  generateEmail,
  generateEmailByLead,
  getEmail,
  getExecution,
  getLeads,
  getTags,
} from "../../service/lead.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Button from "../../components/ui/button/Button";
import EmailDialog from "../../components/leads/EmailDialog";
import { EmailGenerated } from "../../components/leads/EmailGenerated";
import Input from "../../components/form/input/InputField";
import LeadGen from "../../components/leads/LeadGen";
import Loading from "../../components/leads/Loading";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Select from "../../components/form/Select";
import { Status } from "../../components/leads/Status";
import api from "../../constants/api";
import toast from "react-hot-toast";
import { useZohoToken } from "../../stores/zoho.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { MOCK_RESPONDED_LEADS, MOCK_TAGS } from "../../data/mockData";

enum ModalState {
  LEAD,
  NONE,
}
export const leadFilterDefault = {
  first_name: "",
  last_name: "",
  email: "",
  category: "",
  designation: "",
  company: "",
  country: "",
  created_at: "",
  email_verified: "",
  is_sent: true,
  is_responded: true,
};
export default function RespondedLead() {
  const [tokens, setTokens] = useZohoToken();
  const [lead, setLead] = useState<null | string>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [toggleClear, setToggleClear] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(ModalState.NONE);
  const { control, getValues, reset } = useForm<LeadFilterSchema>({
    resolver: zodResolver(leadFilterSchema),
    defaultValues: leadFilterDefault,
  });
  const [pagination, setPagination] = useState<Pagination>({
    per_page: 10,
    page: 1,
  });

  const { data: emails, refetch: refetchEmails } = useQuery({
    queryKey: ["email", lead],
    queryFn: () => getEmail(lead as string),
    enabled: !!lead,
    refetchOnWindowFocus: false,
  });

  const { data: apiData, refetch } = useQuery({
    queryKey: ["leads", pagination.per_page, pagination.page],
    queryFn: () => getLeads({ ...pagination, ...getValues() }),
  });
  const data = apiData ?? { data: MOCK_RESPONDED_LEADS, total: MOCK_RESPONDED_LEADS.length };

  const { mutate: leadDelete } = useMutation({
    mutationFn: deleteLead,
    mutationKey: ["delete-lead"],
    onSuccess() {
      toast.success("Lead Deleted!");
      refetch();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const { mutate: leadEmail } = useMutation({
    mutationFn: generateEmail,
    mutationKey: ["generate-email"],
    onSuccess(data) {
      toast.success("Email Generation Started");
      localStorage.setItem("email-generate-process", `${data.data.id}`);
      restartEmailProcess();
    },
    onError(err) {
      toast.error(err.message);
    },
  });
  const { mutate: exportLeadMutate } = useMutation({
    mutationFn: exportLeadZoho,
    mutationKey: ["zoho-export"],
    onSuccess(data) {
      toast.success("Lead Export Started!");
      localStorage.setItem("zoho-process", `${data.data.id}`);
      restartZohoProcess();
    },
    onError(err) {
      toast.error(err.message);
    },
  });

  const { data: apiTags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });
  const tags = apiTags ?? MOCK_TAGS;

  const { data: execution } = useQuery({
    queryKey: ["execution-history"],
    queryFn: () => getExecution("executionid"),
    refetchInterval: 5000,
    enabled() {
      return !!localStorage.getItem("executionid");
    },
  });

  const { mutate: generatedEmailByLead, isPending: isLoadingEmailGeneration } =
    useMutation({
      mutationFn: generateEmailByLead,
      mutationKey: ["generate-email-by-lead"],
      onSuccess(data) {
        toast.success(`Email Generated (${data.time}s)`);
        refetchEmails();
      },
      onError(err) {
        toast.error(err.message);
      },
    });

  const { data: emailProcess, refetch: restartEmailProcess } = useQuery({
    queryKey: ["email-process"],
    queryFn: () => getExecution("email-generate-process"),
    refetchInterval: 5000,
    enabled() {
      return !!localStorage.getItem("email-generate-process");
    },
  });

  const { data: zohoProcess, refetch: restartZohoProcess } = useQuery({
    queryKey: ["zoho-process"],
    queryFn: () => getExecution("zoho-process"),
    refetchInterval: 5000,
    enabled() {
      return !!localStorage.getItem("zoho-process");
    },
  });

  useEffect(() => {
    const handleStatus = (
      status: string | undefined,
      successMessage: string,
      errorMessage: string,
      key: string
    ) => {
      if (status === "SUCCESS") {
        refetch();
        toast.success(successMessage);
        setToggleClear(!toggleClear);
        setSelected([]);
      } else if (status === "FAILED") {
        toast.error(errorMessage);
      }
      if (status !== "RUNNING") {
        localStorage.removeItem(key);
      }
    };

    handleStatus(
      execution?.status,
      "New Leads Generated",
      "Failed to Generate Lead",
      "executionid"
    );

    handleStatus(
      emailProcess?.status,
      "Email Generation Done",
      "Failed to Generate Email",
      "email-generate-process"
    );

    handleStatus(
      zohoProcess?.status,
      "Data Exported to Zoho",
      "Failed to Export",
      "zoho-process"
    );

    if (emailProcess?.status === "SUCCESS") {
      refetchEmails();
    }

    if (zohoProcess?.status === "FAILED") {
      setTokens(null);
    }
  }, [execution?.status, emailProcess?.status, zohoProcess?.status]);

  const options = useMemo(
    () =>
      Object.values(tags ?? {}).map((tag) => ({
        value: tag._id,
        label: tag.cleaned_name,
      })),
    [tags]
  );

  // Memoized CSV generation logic for better performance
  const csvHeaders = useMemo(
    () => [
      "First Name",
      "Last Name",
      "Email Address",
      "Industry",
      "Organization",
      "Designation",
      "Country",
      "Creation Time",
    ],
    []
  );

  const downloadCSV = useMemo(() => {
    return () => {
      if (!data?.data) {
        toast.error("No data available to download.");
        return;
      }

      const csvRows = [csvHeaders.join(",")];
      data.data.forEach((row: ILead) => {
        const values = [
          row.first_name,
          row.last_name,
          row.email,
          tags?.[row.category]?.cleaned_name || "",
          row.company,
          row.designation,
          row.country,
          new Date(row.created_at).toLocaleString(),
        ];
        csvRows.push(values.map((value) => `"${value}"`).join(","));
      });

      const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "leads.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }, [data?.data, tags, csvHeaders]);

  const columns: TableColumn<ILead>[] = [
    { name: "First Name", selector: (row) => row.first_name, sortable: true, width: "120px" },
    { name: "Last Name", selector: (row) => row.last_name, sortable: true, width: "120px" },
    { name: "Email Address", selector: (row) => row.email, sortable: true, grow: 2 },
    {
      name: "Verified",
      selector: (row): any => <Status status={row.email_verified} />,
      sortable: true,
      width: "100px",
    },
    {
      name: "Email Gen.",
      selector: (row): any => <EmailGenerated status={row.emails.length > 0} />,
      sortable: true,
      width: "100px",
    },
    {
      name: "Industry",
      selector: (row) => tags?.[row.category]?.cleaned_name || "",
      sortable: true,
      hide: Media.MD,
    },
    {
      name: "Organization",
      selector: (row) => row.company,
      sortable: true,
      hide: Media.LG,
    },
    {
      name: "Designation",
      selector: (row) => row.designation,
      sortable: true,
      hide: Media.LG,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
      hide: Media.LG,
    },
    {
      name: "Actions",
      width: "200px",
      selector: (row): any => (
        <div className="flex flex-row items-center gap-1.5 py-2">
          <button
            title="Generate Email"
            onClick={() => generatedEmailByLead(row.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors"
          >
            <i className="fa-solid fa-bolt text-[11px]"></i> Email
          </button>
          <button
            title="View Emails"
            onClick={() => setLead(row.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <i className="fa-regular fa-envelope text-[11px]"></i>
          </button>
          <button
            title="Delete"
            onClick={() => confirm("Are you sure? This action is irreversable") && leadDelete(row.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <i className="fa-regular fa-trash-alt text-[11px]"></i>
          </button>
        </div>
      ),
      reorder: true,
    },
  ];

  const handleClose = () => setModalState(ModalState.NONE);

  const handleEmailGeneration = () => {
    if (selected.length == 0) {
      return toast.error("Please select Leads to Generate Emails");
    }
    leadEmail(selected);
  };

  const expandableRowsComponent = useCallback(
    ({ data }: { data: ILead }) => (
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-row gap-2">
          <span className="font-semibold">First Name:</span>
          <span>{data.first_name}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Last Name:</span>
          <span>{data.last_name}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Email:</span>
          <span>{data.email}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Email Verified:</span>
          <span>
            <Status status={data.email_verified} />
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Email Generation:</span>
          <span>
            <EmailGenerated status={data.emails.length > 0} />
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Industry:</span>
          <span>{tags?.[data.category]?.cleaned_name}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Organization:</span>
          <span>{data.company}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Designation:</span>
          <span>{data.designation}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Country:</span>
          <span>{data.country}</span>
        </div>
        <div className="flex flex-row gap-2">
          <span className="font-semibold">Creation Time:</span>
          <span>{new Date(data.created_at).toLocaleString()}</span>
        </div>
      </div>
    ),
    []
  );
  const handleZohoSync = () => {
    if (!tokens) {
      toast.error("Please connect to Zoho CRM");

      window.open(api.ZOHO_AUTH, "_blank");
      return;
    }
    if (selected.length == 0) {
      toast.error("Please select Leads to Export");
      return;
    }

    exportLeadMutate({
      refresh_token: tokens.refresh_token,
      lead_ids: selected,
    });
  };

  return (
    <>
      <PageMeta title="Leadflow - Responded Leads" description="" />
      <PageBreadcrumb
        pageTitle="Responded Leads"
        pageDetails="All leads that have actively responded to your email communication."
        component={
          <div className="flex flex-row gap-2">
            <Button
              isLoading={emailProcess?.status === "RUNNING"}
              onClick={handleEmailGeneration}
              size="sm"
              variant="outline"
            >
              Generate Emails
            </Button>
            <Button variant="outline" onClick={downloadCSV} size="sm">
              Download CSV
            </Button>
            {tokens ? (
              <>
                <Button
                  isLoading={zohoProcess?.status === "RUNNING"}
                  onClick={handleZohoSync}
                  className="ring-violet-500 text-violet-500"
                  size="sm"
                  variant="outline"
                >
                  <i className="fa-duotone fa-cube"></i>
                  ZOHO CRM
                </Button>
                <Button
                  isLoading={zohoProcess?.status === "RUNNING"}
                  onClick={() => setTokens(null)}
                  className="ring-red-500 text-red-500"
                  size="sm"
                  variant="outline"
                >
                  <i className="fa-right-from-bracket fa-duotone"></i>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleZohoSync}
                className="ring-red-500 text-red-500"
                size="sm"
                variant="outline"
              >
                <i className="fa-duotone fa-shield-check"></i>
                Authorize Zoho
              </Button>
            )}
          </div>
        }
      />
      <div className="mb-4 bg-white border border-gray-100 rounded-lg shadow-sm p-3">
        <form>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <Controller control={control} name="first_name" render={({ field }) => <Input placeholder="First Name" size="sm" {...field} />} />
            <Controller control={control} name="last_name" render={({ field }) => <Input placeholder="Last Name" size="sm" {...field} />} />
            <Controller control={control} name="email" render={({ field }) => <Input placeholder="Email" size="sm" {...field} />} />
            <Controller control={control} name="email_verified" render={({ field }) => (
              <Select placeholder="Status" options={[
                { label: "Pending", value: "0" },
                { label: "Verified", value: "1" },
                { label: "Failed", value: "2" },
                { label: "Blocked", value: "3" },
              ]} {...field} />
            )} />
            <Controller control={control} name="company" render={({ field }) => <Input placeholder="Organization" size="sm" {...field} />} />
            <Controller control={control} name="category" render={({ field }) => <Select placeholder="Industry" options={options} {...field} />} />
            <Controller control={control} name="country" render={({ field }) => <Input placeholder="Country" size="sm" {...field} />} />
            <Controller control={control} name="designation" render={({ field }) => <Input placeholder="Designation" size="sm" {...field} />} />
            <Controller control={control} name="created_at" render={({ field }) => <Input placeholder="Date" type="date" size="sm" {...field} />} />
            <Button type="button" onClick={() => refetch()} size="sm" className="col-span-1">
              <i className="fa-solid fa-filter"></i>
            </Button>
            <Button type="button" onClick={() => { reset({}); refetch(); }} size="sm" variant="outline" className="col-span-1">
              <i className="fa-solid fa-rotate-left"></i>
            </Button>
          </div>
        </form>
      </div>
      <div className="data-table-card">
        <DataTable
          selectableRows
          onSelectedRowsChange={({ selectedRows }) =>
            setSelected(selectedRows.map((i) => i.id))
          }
          expandableRows
          expandableRowsComponent={expandableRowsComponent}
          clearSelectedRows={toggleClear}
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
        />
      </div>
      <LeadGen isOpen={modalState == ModalState.LEAD} onClose={handleClose} />
      <EmailDialog
        isOpen={!!lead}
        emails={emails?.data}
        onClose={() => setLead(null)}
      />

      <Loading
        isOpen={emailProcess?.status === "RUNNING"}
        title="Generating Emails"
        subTitle="Please wait..."
      />
      <Loading
        isOpen={isLoadingEmailGeneration}
        title="Generating Email"
        subTitle="Please wait..."
      />
      <Loading
        isOpen={zohoProcess?.status === "RUNNING"}
        title="Exporting to Zoho"
        subTitle="Please wait..."
      />
    </>
  );
}
