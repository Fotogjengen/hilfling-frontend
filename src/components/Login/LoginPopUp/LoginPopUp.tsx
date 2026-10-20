import { Dialog } from "@/components/ui/overlay/Dialog";
import ExternalLoginForm from "./ExternalLoginForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginPopUp = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Logg inn">
      <ExternalLoginForm onSuccess={() => onOpenChange(false)} />
    </Dialog>
  );
};

export default LoginPopUp;
