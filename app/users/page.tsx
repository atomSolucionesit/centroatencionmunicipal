"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { usersApi, type User } from "@/lib/api/users";

export default function UsersPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    role: "OPERATOR",
    area: "operador",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    } else if (!loading && isAuthenticated && user?.role !== "ADMIN") {
      router.replace("/dashboard");
      toast.error("No tienes permisos para acceder a esta página");
    } else if (!loading && isAuthenticated && user?.role === "ADMIN") {
      loadUsers();
    }
  }, [isAuthenticated, loading, user, router]);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const result = await usersApi.updateUser(editingUser.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          area: formData.area
        });
        if (result.mensaje === "editado") {
          toast.success("Usuario actualizado exitosamente");
          setOpen(false);
          setEditingUser(null);
          setFormData({ firstName: "", lastName: "", dni: "", email: "", password: "", role: "OPERATOR", area: "operador" });
          loadUsers();
        } else {
          toast.error("Error al actualizar usuario");
        }
      } else {
        const result = await usersApi.createUser({
          ...formData,
          organizationId: user?.organizationId || "default-org",
        });
        if (result.mensaje === "add") {
          toast.success("Usuario creado exitosamente");
          setOpen(false);
          setFormData({ firstName: "", lastName: "", dni: "", email: "", password: "", role: "OPERATOR", area: "operador" });
          loadUsers();
        } else {
          toast.error(result.mensaje || "Error al crear usuario");
        }
      }
    } catch (error) {
      toast.error(editingUser ? "Error al actualizar usuario" : "Error al crear usuario");
    }
  };

  if (loading || (isAuthenticated && user?.role !== "ADMIN")) {
    return null;
  }

  if (loadingUsers) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout userRole={user?.role}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <Dialog open={open} onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) {
                setEditingUser(null);
                setFormData({ firstName: "", lastName: "", dni: "", email: "", password: "", role: "OPERATOR", area: "operador" });
              }
            }}>
              <DialogTrigger asChild>
                <Button>Crear Usuario</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div>
                      <Label>DNI</Label>
                      <Input
                        value={formData.dni}
                        onChange={(e) =>
                          setFormData({ ...formData, dni: e.target.value })
                        }
                        required
                      />
                    </div>
                  )}
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  {!editingUser && (
                    <div>
                      <Label>Contraseña</Label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  )}
                  <div className="flex flex-row w-full gap-4 justify-between">
                    <div className="w-full">
                      <Label>Rol</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                          <SelectItem value="MANAGER">Gerente</SelectItem>
                          <SelectItem value="OPERATOR">Operador</SelectItem>
                          <SelectItem value="DRIVER">Conductor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Label>Área</Label>
                      <Select
                        value={formData.area}
                        onValueChange={(value) =>
                          setFormData({ ...formData, area: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operador">Operador</SelectItem>
                          <SelectItem value="corralon">Corralón</SelectItem>
                          <SelectItem value="alumbrado">Alumbrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingUser ? "Actualizar Usuario" : "Crear Usuario"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usuarios Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Nombre</th>
                      <th className="text-left p-2">DNI</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Rol</th>
                      <th className="text-left p-2">Área</th>
                      <th className="text-left p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b">
                        <td className="p-2">
                          {u.nombre} {u.apellido}
                        </td>
                        <td className="p-2">{u.dni}</td>
                        <td className="p-2">{u.correo}</td>
                        <td className="p-2">{u.tipo}</td>
                        <td className="p-2">{u.area}</td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUser(u);
                              setFormData({
                                firstName: u.nombre,
                                lastName: u.apellido,
                                dni: u.dni,
                                email: u.correo,
                                password: "",
                                role: u.tipo,
                                area: u.area || "operador"
                              });
                              setOpen(true);
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        <Toaster position="bottom-center" />
      </div>
    </AuthenticatedLayout>
  );
}
