"use client";

import { useState } from "react";
import { User, Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";

interface LoginFormProps {
  onLogin: (token: string, user: any) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dni || !password) {
      toast.error("Complete todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login({ dni, password });

      onLogin(response.access_token, response.user);

      toast.success(`Bienvenido ${response.user.firstName}`);
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4">
          {/* LOGO */}
          <div className="flex justify-center">
            <img
              src="/logo-municipalidad.png"
              alt="Logo institución"
              className="h-16 object-contain"
            />
          </div>

          <div>
            <CardTitle className="text-2xl font-semibold">
              Centro de Atención Municipal
            </CardTitle>

            <CardDescription className="text-sm mt-1">
              Ingrese sus credenciales para continuar
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DNI */}

            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>

              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                <Input
                  id="dni"
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="Ingrese su DNI"
                  disabled={loading}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  disabled={loading}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* BUTTON */}

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            {/* FOOTER */}

            <p className="text-xs text-center text-gray-500 pt-2">
              Acceso exclusivo para personal autorizado
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
