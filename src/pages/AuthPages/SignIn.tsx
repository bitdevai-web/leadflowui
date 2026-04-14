import AuthLayout from "./AuthPageLayout";
import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Leadflow - Sign In"
        description="leadflow application"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
