"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createEmployee } from "@/api/mutations";
import { useMakeModalResponsive } from "@/hooks/use-make-modal-responsive";
import type { CreateEmployeeDTO } from "@/types";
import { cn } from "@/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Typography } from "./ui/typography";

const passwordSchema = z.string().min(4).max(50);

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

export function EmployeeForm({ className }: { className?: string }) {
  const { formState, handleSubmit, register } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload: CreateEmployeeDTO = {
      username: values.username,
      password: values.confirmPassword,
      role: "stockist",
    };

    await createEmployee(payload);

    window.location.reload();
  }

  const ids = {
    employeeName: "employee-name",
    employeePassword: "employee-password",
    confirmPassword: "employee-repassword",
  };

  return (
    <Card className={cn("space-y-5", className)}>
      <CardHeader>
        <CardTitle className={cn(Typography.h3, "text-center")}>
          Adicionar funcionário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Field>
            <FieldLabel htmlFor={ids.employeeName}>
              Nome do funcionário
            </FieldLabel>
            <Input id={ids.employeeName} required {...register("username")} />
          </Field>
          <Field>
            <FieldLabel htmlFor={ids.employeePassword}>
              Senha do funcionário
            </FieldLabel>
            <Input
              type="password"
              id={ids.employeePassword}
              required
              {...register("password")}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={ids.confirmPassword}>
              Confirme a senha do funcionário
            </FieldLabel>
            <Input
              type="password"
              id={ids.confirmPassword}
              required
              {...register("confirmPassword")}
            />
          </Field>
          <Field>
            <Button disabled={formState.isSubmitting} type="submit">
              {formState.isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </Field>
        </form>
      </CardContent>
    </Card>
  );
}

export function EmployeeFormModal({ children }: { children: ReactNode }) {
  const Modal = useMakeModalResponsive();

  return (
    <Modal.Root>
      <Modal.Content>
        <EmployeeForm />
      </Modal.Content>
      <Modal.Trigger asChild>{children}</Modal.Trigger>
    </Modal.Root>
  );
}
