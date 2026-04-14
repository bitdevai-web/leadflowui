import { ComponentType } from "react";

// AUTH BYPASSED FOR UI DEVELOPMENT
export default function auth(Component: ComponentType) {
  return function AuthrizationComponent(props: any) {
    return <Component {...props} />;
  };
}
