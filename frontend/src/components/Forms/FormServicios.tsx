'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useCallback } from 'react';
import { z } from 'zod';
import { Button } from './../Botones/FormButton';
import { Form, FormControl, FormField, FormItem, FormMessage } from './Form';
import ComboInput, { ComboInputRef } from './ComboInput';
import { Label } from './../Label/Label.js';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from './../Select/Select.js';

export type Filtros = {
  servicio: string;
  tarea?: string;
  zona: string;
  ordenarPor: string;
};

// Define the form schema
const formSchema = z.object({
  servicio: z.string().min(1, {
    message: 'Por favor selecciona un servicio.',
  }),
  tarea: z.string().optional(),
  zona: z.string().min(1, {
    message: 'Por favor selecciona una zona.',
  }),
  ordenarPor: z.string().min(1, {
    message: 'Por favor selecciona una opción de orden.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export type ServiciosFormProps = {
  tipoServicios: Array<{
    nombreTipo: string;
    descripcionTipo: string;
    tareas: Array<{ id: number; nombreTarea: string }>;
  }>;
  zonas: Array<{ id: number; descripcionZona: string }>;
  onSubmit: (values: {
    servicio: string;
    tarea?: string;
    zona: string;
    ordenarPor: string;
  }) => void;
  filtrosForm?: Filtros;
};

export function ServiciosForm({
  tipoServicios,
  zonas,
  onSubmit,
  filtrosForm,
}: ServiciosFormProps) {
  const comboInputRef = useRef<ComboInputRef>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      servicio: 'Todos',
      tarea: '',
      zona: 'Todas',
      ordenarPor: 'calificacion',
    },
  });

  // FIX: Use useCallback to memoize the reset function
  const resetForm = useCallback(
    (newValues: Filtros) => {
      const values = {
        servicio: newValues.servicio || 'Todos',
        tarea: newValues.tarea || '',
        zona: newValues.zona || 'Todas',
        ordenarPor: newValues.ordenarPor || 'calificacion',
      };

      // Only reset if values actually changed
      const currentValues = form.getValues();
      const hasChanged =
        currentValues.servicio !== values.servicio ||
        currentValues.tarea !== values.tarea ||
        currentValues.zona !== values.zona ||
        currentValues.ordenarPor !== values.ordenarPor;

      if (hasChanged) {
        form.reset(values);
      }
    },
    [form]
  );

  // FIX: Remove 'form' from dependencies and use a ref to track if we've initialized
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (filtrosForm && tipoServicios.length > 0 && zonas.length > 0) {
      console.log('FormServicios: Resetting form with values:', filtrosForm);
      resetForm(filtrosForm);
      hasInitialized.current = true;
    } else if (
      !hasInitialized.current &&
      tipoServicios.length > 0 &&
      zonas.length > 0
    ) {
      // Set default values only once when data is loaded
      resetForm({
        servicio: 'Todos',
        tarea: '',
        zona: 'Todas',
        ordenarPor: 'calificacion',
      });
      hasInitialized.current = true;
    }
  }, [filtrosForm, tipoServicios.length, zonas.length, resetForm]);

  // Cambia las tareas basandose en que tipo servicio esta seleccionado
  const tareasTipo: Array<{ id: number; nombreTarea: string }> = (() => {
    const tipoSeleccionado = tipoServicios.find(
      (tipo) => tipo.nombreTipo === form.watch('servicio')
    );
    return tipoSeleccionado ? tipoSeleccionado.tareas : [];
  })();

  const handleSubmit = (values: FormValues) => {
    console.log('Form values:', values);
    onSubmit(values);
  };

  const handleTareaSelect = useCallback(
    (item: { id: number; nombreTarea: string }) => {
      form.setValue('tarea', item.nombreTarea);
    },
    [form]
  );

  const handleReset = useCallback(() => {
    form.reset({
      servicio: 'Todos',
      tarea: '',
      zona: 'Todas',
      ordenarPor: 'calificacion',
    });
    comboInputRef.current?.clearInput();
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={
          'hover:scale-105 transition mt-4 ease-in-out duration-400 bg-tinte-5 mx-auto my-2 flex ' +
          'gap-2 py-2 shadow-2xl flex-col max-w-1/3 justify-items-center justify-center items-center rounded-md ' +
          'min-w-60 lg:max-w-60'
        }
      >
        <FormField
          control={form.control}
          name="servicio"
          render={({ field }) => (
            <FormItem className="mb-4 inline-block lg:mr-auto mx-auto">
              <Label
                htmlFor="servicio"
                className="text-secondary font-medium mb-2 block"
              >
                Tipo de Servicio
              </Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="!w-48 text-secondary text-base font-medium bg-white">
                    <SelectValue placeholder="Servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoServicios?.map((tipo, index) => (
                      <SelectItem
                        key={index}
                        value={tipo.nombreTipo}
                        className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                      >
                        {tipo.nombreTipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-4 inline-block lg:mr-auto mx-auto">
          <Label
            htmlFor="tarea"
            className="text-secondary font-medium mb-2 block mr-auto"
          >
            Tarea Específica
          </Label>
          <ComboInput
            ref={comboInputRef}
            items={tareasTipo}
            placeholder="Buscar tarea"
            onSelect={handleTareaSelect}
            className="!w-48"
          />
        </div>

        <FormField
          control={form.control}
          name="zona"
          render={({ field }) => (
            <FormItem className="mb-4 inline-block lg:mr-auto mx-auto">
              <Label
                htmlFor="zona"
                className="text-secondary font-medium mb-2 block"
              >
                Zona
              </Label>
              <FormControl className="">
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="!w-48 text-secondary text-base font-medium bg-white">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zonas?.map((zona, index) => (
                      <SelectItem
                        key={index}
                        value={zona.descripcionZona}
                        className="text-secondary text-base font-medium bg-white hover:bg-gray-20 "
                      >
                        {zona.descripcionZona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ordenarPor"
          render={({ field }) => (
            <FormItem className="mb-4 inline-block lg:mr-auto mx-auto">
              <Label
                htmlFor="ordenarPor"
                className="text-secondary font-medium mb-2 block"
              >
                Ordenar Por
              </Label>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="!w-48 text-secondary text-base font-medium bg-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="calificacion"
                      className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                    >
                      Calificación
                    </SelectItem>
                    <SelectItem
                      value="nombre"
                      className="text-secondary text-base font-medium bg-white hover:bg-gray-200"
                    >
                      Nombre
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-4">
          <Button
            type="submit"
            className={
              'bg-naranja-1 border-2 border-naranja-1 text-white text-center py-1 px-4 rounded-md hover:bg-white ' +
              'hover:border-naranja-1 hover:border-2 hover:text-naranja-1 hover:text-primary transition-duration-300 ' +
              'box-border cursor-pointer w-30'
            }
          >
            Filtrar
          </Button>
          <div className="mt-2  ">
            <Button
              type="reset"
              className={
                'border-1 border-gray-800 min-w-10 bg-gray-500 text-white text-center py-1 px-4 rounder-md  ' +
                'hover:bg-gray-300 hover:text-gray-800 w-30 transition duration-300 cursor-pointer '
              }
              onClick={handleReset}
            >
              Reestablecer
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
