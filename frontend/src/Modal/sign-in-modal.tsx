import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type userData = {
  courriel: string;
  mot_de_passe: string;
};

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (formData: userData) => void;
  error: string;
}

const SignInModal = ({
  isOpen,
  onClose,
  onSignIn,
  error,
}: SignInModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<userData>({
    courriel: "",
    mot_de_passe: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSignIn(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hover:bg-transparent [&>button]:focus:bg-transparent [&>button]:active:bg-transparent">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Connexion
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Connectez vous a votre profil pour accéder au service
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@courriel.com"
                value={formData.courriel}
                onChange={(e) =>
                  setFormData({ ...formData, courriel: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={formData.mot_de_passe}
                  onChange={(e) =>
                    setFormData({ ...formData, mot_de_passe: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center mt-2 p-2">{error}</div>
          )}
          <DialogFooter>
            <div className="py-2 w-full">
              <Button type="submit" className="w-full">
                Connexion
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
