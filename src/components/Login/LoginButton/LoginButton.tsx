import { useState } from "react";
import { isAxiosError } from "axios";
import { ChevronDown } from "lucide-react";
import { useLogin } from "@/contexts/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/DropdownMenu";
import { toast } from "@/components/ui/overlay/Toaster";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import styles from "./LoginButton.module.css";

const LoginButton = () => {
  const [externalLoginForm, setExternalLoginForm] = useState(false);
  const login = useLogin();

  const handleHusfolkLogin = async () => {
    try {
      // the browser shows its built-in login dialog when the backend
      // (via ITK) challenges the request with a 401
      await login();
    } catch (error) {
      // a 401 means the user dismissed the browser's login dialog
      if (!isAxiosError(error) || error.response?.status !== 401) {
        toast.error("Innlogging feilet");
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={styles.trigger}>
            Logg inn{" "}
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => void handleHusfolkLogin()}>
            Husfolk
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setExternalLoginForm(true)}>
            Ekstern
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LoginPopUp
        open={externalLoginForm}
        onOpenChange={setExternalLoginForm}
      />
    </>
  );
};

export default LoginButton;
