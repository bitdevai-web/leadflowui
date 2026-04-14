import { useNavigate, useSearchParams } from "react-router";

import { getZohoToken } from "../../service/auth.service";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useZohoToken } from "../../stores/zoho.store";

export default function Zoho() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";
  const [, setTokens] = useZohoToken();
  const { data: tokens, error } = useQuery({
    queryKey: ["zoho_token", code],
    queryFn: () => getZohoToken(code),
    enabled: !!code,
  });

  useEffect(() => {
    if (tokens) {
      setTokens(tokens.data);
      navigate("/leads/raw");
      toast.success("Zoho token fetched successfully");
    }
    if (error) {
      toast.error("Error fetching Zoho token:" + error.message);
      navigate("/leads/raw");
    }
  }, [tokens, error]);
  return <div></div>;
}
