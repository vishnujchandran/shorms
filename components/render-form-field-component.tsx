import { format } from "date-fns"
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import type { ControllerRenderProps } from "react-hook-form"

import { cn } from "../lib/utils"
import { FieldType, type FormField as FormFieldType } from "../types/field"
import { FormFieldWrapper } from "./form-field-wrapper"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Checkbox } from "./ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Slider } from "./ui/slider"
import { Switch } from "./ui/switch"
import { Textarea } from "./ui/textarea"

interface RenderFormFieldComponentProps {
  formField: FormFieldType
  field: ControllerRenderProps<
    {
      [x: string]: any
    },
    string
  >
}

export function renderFormFieldComponent({
  formField,
  field,
}: RenderFormFieldComponentProps) {
  const isRequired = Boolean(formField.validation?.required)

  // Ensure field value is never undefined to prevent controlled/uncontrolled warnings
  const safeField = {
    ...field,
    value: field.value ?? "",
  }

  switch (formField.type) {
    case FieldType.INPUT:
      return (
        <FormFieldWrapper {...formField} required={isRequired}>
          <Input placeholder={formField.placeholder} {...safeField} />
        </FormFieldWrapper>
      )
    case FieldType.TEXTAREA:
      return (
        <FormFieldWrapper {...formField} required={isRequired}>
          <Textarea
            placeholder={formField.placeholder}
            className="resize-none"
            {...safeField}
          />
        </FormFieldWrapper>
      )
    case FieldType.NUMBER_INPUT:
      return (
        <FormFieldWrapper {...formField} required={isRequired}>
          <Input
            placeholder={formField.placeholder}
            {...safeField}
            type="number"
          />
        </FormFieldWrapper>
      )
    case FieldType.EMAIL:
      return (
        <FormFieldWrapper {...formField} required={isRequired}>
          <Input placeholder={formField.placeholder} {...safeField} />
        </FormFieldWrapper>
      )
    case FieldType.CHECKBOX:
      return (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {formField.label}
              {isRequired && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
            <FormDescription>{formField.description}</FormDescription>
          </div>
        </FormItem>
      )
    case FieldType.SELECT:
      return (
        <FormItem>
          <FormLabel>
            {formField.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue={formField.default as string}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={formField.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {formField.choices.map((choice, idx) => (
                <SelectItem
                  value={choice.value !== "" ? choice.value : "hello"}
                  key={idx}
                >
                  {choice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{formField.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case FieldType.DATE:
      return (
        <FormItem className="flex flex-col">
          <FormLabel>
            {formField.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FormDescription>{formField.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case FieldType.RADIO_GROUP:
      return (
        <FormItem className="space-y-3">
          <FormLabel>
            {formField.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={formField.default as string}
              className="flex flex-col space-y-1"
            >
              {formField.choices.map((choice, idx) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={idx}
                >
                  <FormControl>
                    <RadioGroupItem value={choice.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{choice.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )
    case FieldType.SWITCH:
      return (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              {formField.label}
              {isRequired && <span className="ml-1 text-destructive">*</span>}
            </FormLabel>
            <FormDescription>{formField.description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )
    case FieldType.COMBOBOX:
      return (
        <FormItem className="flex flex-col">
          <FormLabel>
            {formField.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? formField.choices.find(
                        (choice) => choice.value === field.value
                      )?.label
                    : "Select language"}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search language..." />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {formField.choices.map((choice, idx) => (
                      <CommandItem
                        value={choice.value}
                        key={idx}
                        onSelect={() => field.onChange(choice.value)}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            choice.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {choice.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{formField.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )
    case FieldType.SLIDER:
      return (
        <FormItem>
          <FormLabel>
            {formField.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Slider
              min={formField.min}
              max={formField.max}
              step={formField.step}
              defaultValue={[formField.default as number]}
              onValueChange={(value) => {
                field.onChange(value[0])
              }}
            />
          </FormControl>
          <FormDescription>
            Selected value is{" "}
            {field.value !== undefined ? field.value : formField.default},
            minimun valus is {formField.min}, maximim values is {formField.max},
            step size is {formField.step}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )
    case FieldType.FILE_UPLOAD:
      return (
        <FormItem>
          <FormLabel>
            {formField.label}
            {isRequired && <span className="ml-1 text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={formField.accept}
              multiple={formField.multiple}
              onChange={(e) => field.onChange(e.target.files)}
            />
          </FormControl>
          {formField.description && (
            <FormDescription>{formField.description}</FormDescription>
          )}
          {formField.maxSize && (
            <FormDescription>
              Max file size: {formField.maxSize} MB
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )
  }
}
