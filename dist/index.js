import * as z from 'zod';
import { nanoid } from 'nanoid';
import * as React3 from 'react';
import React3__default, { useState, useRef, useEffect, useCallback, useImperativeHandle, useMemo } from 'react';
import { useSensors, useSensor, PointerSensor, DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { useSortable, SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, SearchIcon, PenIcon, Check, Trash2, TypeIcon, TextIcon, HashIcon, AtSignIcon, SquareCheckIcon, ChevronsUpDownIcon, CalendarIcon, CircleDotIcon, ToggleLeftIcon, SlidersHorizontalIcon, UploadIcon, XIcon, CircleIcon, ChevronUpIcon, ChevronDownIcon, GripVertical, ChevronLeft, ChevronRight, SearchCode, Info, Layers, FileJson2, FilePlus, Plus } from 'lucide-react';
import { useFormContext, Controller, useForm, FormProvider } from 'react-hook-form';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useShallow } from 'zustand/shallow';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as LabelPrimitive from '@radix-ui/react-label';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Command as Command$1 } from 'cmdk';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { CSS } from '@dnd-kit/utilities';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// types/field.ts
var FieldType = /* @__PURE__ */ ((FieldType2) => {
  FieldType2["INPUT"] = "INPUT";
  FieldType2["TEXTAREA"] = "TEXTAREA";
  FieldType2["NUMBER_INPUT"] = "NUMBER_INPUT";
  FieldType2["EMAIL"] = "EMAIL";
  FieldType2["CHECKBOX"] = "CHECKBOX";
  FieldType2["SELECT"] = "SELECT";
  FieldType2["DATE"] = "DATE";
  FieldType2["RADIO_GROUP"] = "RADIO_GROUP";
  FieldType2["SWITCH"] = "SWITCH";
  FieldType2["COMBOBOX"] = "COMBOBOX";
  FieldType2["SLIDER"] = "SLIDER";
  FieldType2["FILE_UPLOAD"] = "FILE_UPLOAD";
  return FieldType2;
})(FieldType || {});

// lib/versioning/constants.ts
var SCHEMA_VERSION = "1.0";
var SUPPORTED_VERSIONS = ["1.0"];
var SUPPORTED_FIELD_TYPES = [
  "INPUT",
  "TEXTAREA",
  "EMAIL",
  "NUMBER_INPUT",
  "SELECT",
  "RADIO_GROUP",
  "CHECKBOX",
  "SWITCH",
  "COMBOBOX",
  "SLIDER",
  "DATE",
  "FILE_UPLOAD"
];

// lib/versioning/validate.ts
function validateSchema(schema) {
  const errors = [];
  const warnings = [];
  const unknownTypes = /* @__PURE__ */ new Set();
  if (!schema.version) {
    warnings.push("Schema has no version field, assuming 1.0");
  } else if (!SUPPORTED_VERSIONS.includes(schema.version)) {
    warnings.push(`Schema version ${schema.version} may not be fully supported`);
  }
  if (!schema.pages || !Array.isArray(schema.pages)) {
    errors.push("Schema must have a 'pages' array");
    return { valid: false, errors, warnings, unknownFieldTypes: [] };
  }
  schema.pages.forEach((page, pageIndex) => {
    if (!page.fields || !Array.isArray(page.fields)) {
      errors.push(`Page ${pageIndex} has no fields array`);
      return;
    }
    page.fields.forEach((field, fieldIndex) => {
      if (!field.type) {
        errors.push(`Field ${fieldIndex} on page ${pageIndex} has no type`);
      } else if (!SUPPORTED_FIELD_TYPES.includes(field.type)) {
        unknownTypes.add(field.type);
      }
      if (!field.name) {
        errors.push(`Field ${fieldIndex} on page ${pageIndex} has no name`);
      }
    });
  });
  if (unknownTypes.size > 0) {
    warnings.push(
      `Schema contains unsupported field types: ${Array.from(unknownTypes).join(", ")}`
    );
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    unknownFieldTypes: Array.from(unknownTypes)
  };
}
function isSupportedFieldType(type) {
  return SUPPORTED_FIELD_TYPES.includes(type);
}
function getUnsupportedFields(schema) {
  const unsupported = [];
  schema.pages.forEach((page) => {
    page.fields.forEach((field) => {
      if (!isSupportedFieldType(field.type)) {
        unsupported.push(field.type);
      }
    });
  });
  return Array.from(new Set(unsupported));
}

// lib/versioning/migrate.ts
function migrateSchema(schema, fromVersion, toVersion = SCHEMA_VERSION) {
  const sourceVersion = fromVersion || schema.version || "1.0";
  if (sourceVersion === toVersion) {
    return {
      version: toVersion,
      pages: schema.pages || [],
      metadata: schema.metadata
    };
  }
  return {
    version: toVersion,
    pages: schema.pages || [],
    metadata: schema.metadata
  };
}
function ensureVersion(schema) {
  if (schema.version) {
    return schema;
  }
  return migrateSchema(schema);
}
function generateZodSchema(formFields) {
  const formSchemaObject = {};
  formFields.forEach((field) => {
    var _a, _b, _c, _d, _e;
    let fieldSchema;
    switch (field.type) {
      case "INPUT" /* INPUT */:
      case "TEXTAREA" /* TEXTAREA */:
      case "EMAIL" /* EMAIL */:
      case "SELECT" /* SELECT */:
      case "RADIO_GROUP" /* RADIO_GROUP */:
      case "COMBOBOX" /* COMBOBOX */:
        fieldSchema = z.string();
        break;
      case "NUMBER_INPUT" /* NUMBER_INPUT */:
      case "SLIDER" /* SLIDER */:
        fieldSchema = z.coerce.number();
        break;
      case "CHECKBOX" /* CHECKBOX */:
      case "SWITCH" /* SWITCH */:
        fieldSchema = z.boolean();
        break;
      case "DATE" /* DATE */:
        fieldSchema = z.coerce.date();
        break;
      case "FILE_UPLOAD" /* FILE_UPLOAD */:
        fieldSchema = z.any();
        break;
      default:
        fieldSchema = z.string();
    }
    if (field.type === "EMAIL" /* EMAIL */) {
      fieldSchema = fieldSchema.email({
        message: ((_a = field.validation) == null ? void 0 : _a.errorMessage) || "Invalid email address"
      });
    }
    if (field.validation && (field.type === "INPUT" /* INPUT */ || field.type === "TEXTAREA" /* TEXTAREA */ || field.type === "EMAIL" /* EMAIL */)) {
      if (field.validation.min !== void 0) {
        fieldSchema = fieldSchema.min(field.validation.min, {
          message: field.validation.errorMessage || `Minimum ${field.validation.min} characters required`
        });
      }
      if (field.validation.max !== void 0) {
        fieldSchema = fieldSchema.max(field.validation.max, {
          message: field.validation.errorMessage || `Maximum ${field.validation.max} characters allowed`
        });
      }
    }
    if (field.validation && (field.type === "NUMBER_INPUT" /* NUMBER_INPUT */ || field.type === "SLIDER" /* SLIDER */)) {
      if (field.validation.min !== void 0) {
        fieldSchema = fieldSchema.min(field.validation.min, {
          message: field.validation.errorMessage || `Minimum value is ${field.validation.min}`
        });
      }
      if (field.validation.max !== void 0) {
        fieldSchema = fieldSchema.max(field.validation.max, {
          message: field.validation.errorMessage || `Maximum value is ${field.validation.max}`
        });
      }
    }
    if (((_b = field.validation) == null ? void 0 : _b.regex) && (field.type === "INPUT" /* INPUT */ || field.type === "TEXTAREA" /* TEXTAREA */ || field.type === "EMAIL" /* EMAIL */)) {
      try {
        fieldSchema = fieldSchema.regex(
          new RegExp(field.validation.regex),
          { message: field.validation.errorMessage || "Invalid format" }
        );
      } catch (e) {
        console.error("Invalid regex:", field.validation.regex);
      }
    }
    if (field.type === "FILE_UPLOAD" /* FILE_UPLOAD */ && ((_c = field.validation) == null ? void 0 : _c.maxFileSize)) {
      fieldSchema = z.any().refine(
        (file) => {
          if (!file || !(file instanceof File)) return true;
          return file.size <= field.validation.maxFileSize * 1024 * 1024;
        },
        {
          message: `File size must be less than ${field.validation.maxFileSize}MB`
        }
      );
    }
    if ((_d = field.validation) == null ? void 0 : _d.required) {
      if (fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(1, {
          message: ((_e = field.validation) == null ? void 0 : _e.errorMessage) || "This field is required"
        });
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }
    formSchemaObject[field.name] = fieldSchema;
  });
  return z.object(formSchemaObject);
}
var generateDefaultValues = (formFields) => {
  const defaultValues = {};
  formFields.forEach((field) => {
    if (field.default !== void 0) {
      defaultValues[field.name] = field.default;
    } else {
      switch (field.type) {
        case "CHECKBOX" /* CHECKBOX */:
        case "SWITCH" /* SWITCH */:
          defaultValues[field.name] = false;
          break;
        case "NUMBER_INPUT" /* NUMBER_INPUT */:
        case "SLIDER" /* SLIDER */:
          defaultValues[field.name] = 0;
          break;
        default:
          defaultValues[field.name] = "";
      }
    }
  });
  return defaultValues;
};
var zodSchemaToString = (schema) => {
  if (schema instanceof z.ZodDefault) {
    const defaultValue = typeof schema._def.defaultValue === "function" ? schema._def.defaultValue() : schema._def.defaultValue;
    return `${zodSchemaToString(schema._def.innerType)}.default(${JSON.stringify(defaultValue)})`;
  }
  if (schema instanceof z.ZodBoolean) {
    return `z.boolean()`;
  }
  if (schema instanceof z.ZodNumber) {
    let result = "z.coerce.number()";
    if ("checks" in schema._def && schema._def.checks) {
      schema._def.checks.forEach((check) => {
        if (check.kind === "min") {
          result += `.min(${check.value}${check.message ? `, "${check.message}"` : ""})`;
        } else if (check.kind === "max") {
          result += `.max(${check.value}${check.message ? `, "${check.message}"` : ""})`;
        }
      });
    }
    return result;
  }
  if (schema instanceof z.ZodString) {
    let result = "z.string()";
    if ("checks" in schema._def && schema._def.checks) {
      schema._def.checks.forEach((check) => {
        if (check.kind === "min") {
          result += `.min(${check.value}${check.message ? `, "${check.message}"` : ""})`;
        } else if (check.kind === "max") {
          result += `.max(${check.value}${check.message ? `, "${check.message}"` : ""})`;
        } else if (check.kind === "email") {
          result += `.email(${check.message ? `"${check.message}"` : ""})`;
        } else if (check.kind === "regex") {
          result += `.regex(new RegExp("${check.regex.source.replace(/\\/g, "\\\\")}")${check.message ? `, "${check.message}"` : ""})`;
        }
      });
    }
    return result;
  }
  if (schema instanceof z.ZodDate) {
    return `z.coerce.date()`;
  }
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const shapeStrs = Object.entries(shape).map(
      ([key, value]) => `${key}: ${zodSchemaToString(value)}`
    );
    return `z.object({
  ${shapeStrs.join(",\n  ")}
})`;
  }
  if (schema instanceof z.ZodOptional) {
    return `${zodSchemaToString(schema.unwrap())}.optional()`;
  }
  return "z.unknown()";
};
var getZodSchemaString = (formFields) => {
  const schema = generateZodSchema(formFields);
  const schemaEntries = Object.entries(schema.shape).map(([key, value]) => {
    return `  ${key.replaceAll(" ", "_")}: ${zodSchemaToString(value)}`;
  }).join(",\n");
  return `const formSchema = z.object({
${schemaEntries}
})`;
};
function formPagesToSchema(pages) {
  return {
    version: "3.1.0",
    pages: pages.map((page) => ({
      id: page.id,
      title: page.title,
      fields: page.fields.map((field) => {
        var _a;
        return {
          id: field.id || field.name || nanoid(),
          type: field.type.toLowerCase(),
          name: field.name,
          label: field.label,
          description: field.description,
          required: (_a = field.validation) == null ? void 0 : _a.required,
          validation: field.validation ? __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, field.validation.min !== void 0 && { min: field.validation.min, minLength: field.validation.min }), field.validation.max !== void 0 && { max: field.validation.max, maxLength: field.validation.max }), field.validation.regex && { pattern: field.validation.regex }), field.type === "EMAIL" && { email: true }) : void 0,
          // Map legacy fields to config
          config: __spreadValues(__spreadValues({}, field.placeholder && { placeholder: field.placeholder }), "choices" in field && field.choices ? { options: field.choices } : {})
        };
      })
    }))
  };
}
function schemaToFormPages(schema) {
  return schema.pages.map((page) => ({
    id: page.id,
    title: page.title,
    fields: page.fields.map((field) => {
      var _a, _b;
      return {
        id: field.id,
        type: field.type,
        name: field.name,
        label: field.label,
        description: field.description,
        placeholder: ((_a = field.config) == null ? void 0 : _a.placeholder) || void 0,
        required: field.required,
        choices: ((_b = field.config) == null ? void 0 : _b.options) || void 0,
        validation: field.validation ? {
          required: field.required,
          min: field.validation.min || field.validation.minLength,
          max: field.validation.max || field.validation.maxLength,
          regex: typeof field.validation.pattern === "string" ? field.validation.pattern : void 0
        } : void 0
      };
    })
  }));
}
var INITIAL_PAGE_ID = "page-1";
var useFormStore = create()(
  persist(
    immer((set) => ({
      isEditFormFieldOpen: false,
      pages: [{ id: INITIAL_PAGE_ID, fields: [] }],
      activePageId: INITIAL_PAGE_ID,
      setPages: (pages) => set({ pages }),
      setActivePage: (id) => set({ activePageId: id }),
      addPage: () => {
        const newPageId = `page_${nanoid(8)}`;
        set((state) => {
          state.pages.push({ id: newPageId, fields: [] });
          state.activePageId = newPageId;
        });
      },
      deletePage: (id) => {
        set((state) => {
          if (state.pages.length <= 1) return;
          const index = state.pages.findIndex((p) => p.id === id);
          if (index !== -1) {
            state.pages.splice(index, 1);
            if (state.activePageId === id) {
              state.activePageId = state.pages[Math.max(0, index - 1)].id;
            }
          }
        });
      },
      updatePageTitle: (id, title) => {
        set((state) => {
          const page = state.pages.find((p) => p.id === id);
          if (page) {
            page.title = title;
          }
        });
      },
      addFormField: (formField) => {
        set((state) => {
          const activePage = state.pages.find(
            (p) => p.id === state.activePageId
          );
          if (activePage) {
            activePage.fields.push(formField);
          }
        });
      },
      deleteFormField: (id) => {
        set((state) => {
          state.pages.forEach((page) => {
            page.fields = page.fields.filter((f) => f.id !== id);
          });
        });
      },
      setSelectedFormField: (formField) => {
        set({ selectedFormField: formField });
      },
      setIsEditFormFieldOpen: (open) => {
        set({ isEditFormFieldOpen: open });
      },
      updateFormField: (formField) => {
        set((state) => {
          for (const page of state.pages) {
            const field = page.fields.find((f) => f.id === formField.id);
            if (field) {
              Object.assign(field, formField);
              break;
            }
          }
        });
      },
      clearFormFields: () => {
        set({
          pages: [{ id: INITIAL_PAGE_ID, fields: [] }],
          activePageId: INITIAL_PAGE_ID,
          selectedFormField: void 0
        });
      }
    })),
    {
      name: "form-storage",
      partialize: (state) => ({ pages: state.pages })
    }
  )
);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function generateFieldId() {
  return nanoid(10);
}
function generateFieldName(fieldType) {
  const sanitized = fieldType.toLowerCase().replaceAll(" ", "_");
  return `${sanitized}_${nanoid(8)}`;
}
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, variant, size, asChild = false } = _b, props = __objRest(_b, ["className", "variant", "size", "asChild"]);
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      __spreadValues({
        className: cn(buttonVariants({ variant, size, className })),
        ref
      }, props)
    );
  }
);
Button.displayName = "Button";
var labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    __spreadValues({
      ref,
      className: cn(labelVariants(), className)
    }, props)
  );
});
Label.displayName = LabelPrimitive.Root.displayName;
var Form = FormProvider;
var FormFieldContext = React3.createContext(
  {}
);
var FormField2 = (_a) => {
  var props = __objRest(_a, []);
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, __spreadValues({}, props)) });
};
var useFormField = () => {
  const fieldContext = React3.useContext(FormFieldContext);
  const itemContext = React3.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return __spreadValues({
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`
  }, fieldState);
};
var FormItemContext = React3.createContext(
  {}
);
var FormItem = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const id = React3.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx("div", __spreadValues({ ref, className: cn("space-y-2", className) }, props)) });
});
FormItem.displayName = "FormItem";
var FormLabel = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    __spreadValues({
      ref,
      className: cn(error && "text-destructive", className),
      htmlFor: formItemId
    }, props)
  );
});
FormLabel.displayName = "FormLabel";
var FormControl = React3.forwardRef((_a, ref) => {
  var props = __objRest(_a, []);
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    __spreadValues({
      ref,
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error
    }, props)
  );
});
FormControl.displayName = "FormControl";
var FormDescription = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsx(
    "p",
    __spreadValues({
      ref,
      id: formDescriptionId,
      className: cn("text-[0.8rem] text-muted-foreground", className)
    }, props)
  );
});
FormDescription.displayName = "FormDescription";
var FormMessage = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
  const { error, formMessageId } = useFormField();
  const body = error ? String(error == null ? void 0 : error.message) : children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    __spreadProps(__spreadValues({
      ref,
      id: formMessageId,
      className: cn("text-[0.8rem] font-medium text-destructive", className)
    }, props), {
      children: body
    })
  );
});
FormMessage.displayName = "FormMessage";
function Calendar(_a) {
  var _b = _a, {
    className,
    classNames,
    showOutsideDays = true
  } = _b, props = __objRest(_b, [
    "className",
    "classNames",
    "showOutsideDays"
  ]);
  return /* @__PURE__ */ jsx(
    DayPicker,
    __spreadValues({
      showOutsideDays,
      className: cn("p-3", className),
      classNames: __spreadValues({
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].outside)]:bg-accent/50 [&:has([aria-selected].range_end)]:rounded-r-md",
          props.mode === "range" ? "[&:has(>.range_end)]:rounded-r-md [&:has(>.range_start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md" : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100"
        ),
        range_start: "range_start",
        range_end: "range_end",
        selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside: "outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible"
      }, classNames),
      components: {
        Chevron: ({ orientation }) => {
          const Icon2 = orientation === "left" ? ChevronLeft : ChevronRight;
          return /* @__PURE__ */ jsx(Icon2, { className: "h-4 w-4" });
        }
      }
    }, props)
  );
}
Calendar.displayName = "Calendar";
var Checkbox = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          className: cn("flex items-center justify-center text-current"),
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" })
        }
      )
    })
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    __spreadValues({
      ref,
      className: cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )
    }, props)
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
  return /* @__PURE__ */ jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      __spreadProps(__spreadValues({
        ref,
        className: cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )
      }, props), {
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      })
    )
  ] });
});
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = (_a) => {
  var _b = _a, {
    className
  } = _b, props = __objRest(_b, [
    "className"
  ]);
  return /* @__PURE__ */ jsx(
    "div",
    __spreadValues({
      className: cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )
    }, props)
  );
};
DialogHeader.displayName = "DialogHeader";
var DialogTitle = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    __spreadValues({
      ref,
      className: cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )
    }, props)
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    __spreadValues({
      ref,
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;
var Command = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    Command$1,
    __spreadValues({
      ref,
      className: cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )
    }, props)
  );
});
Command.displayName = Command$1.displayName;
var CommandInput = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
    /* @__PURE__ */ jsx(SearchIcon, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
    /* @__PURE__ */ jsx(
      Command$1.Input,
      __spreadValues({
        ref,
        className: cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )
      }, props)
    )
  ] });
});
CommandInput.displayName = Command$1.Input.displayName;
var CommandList = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    Command$1.List,
    __spreadValues({
      ref,
      className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)
    }, props)
  );
});
CommandList.displayName = Command$1.List.displayName;
var CommandEmpty = React3.forwardRef((props, ref) => /* @__PURE__ */ jsx(
  Command$1.Empty,
  __spreadValues({
    ref,
    className: "py-6 text-center text-sm"
  }, props)
));
CommandEmpty.displayName = Command$1.Empty.displayName;
var CommandGroup = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    Command$1.Group,
    __spreadValues({
      ref,
      className: cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )
    }, props)
  );
});
CommandGroup.displayName = Command$1.Group.displayName;
var CommandSeparator = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    Command$1.Separator,
    __spreadValues({
      ref,
      className: cn("-mx-1 h-px bg-border", className)
    }, props)
  );
});
CommandSeparator.displayName = Command$1.Separator.displayName;
var CommandItem = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    Command$1.Item,
    __spreadValues({
      ref,
      className: cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )
    }, props)
  );
});
CommandItem.displayName = Command$1.Item.displayName;
var Input = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
    return /* @__PURE__ */ jsx(
      "input",
      __spreadValues({
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref
      }, props)
    );
  }
);
Input.displayName = "Input";
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
var PopoverContent = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, align = "center", sideOffset = 4 } = _b, props = __objRest(_b, ["className", "align", "sideOffset"]);
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    __spreadValues({
      ref,
      align,
      sideOffset,
      className: cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )
    }, props)
  ) });
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
var RadioGroup = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    __spreadProps(__spreadValues({
      className: cn("grid gap-2", className)
    }, props), {
      ref
    })
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;
var RadioGroupItem = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx(RadioGroupPrimitive.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx(CircleIcon, { className: "h-2.5 w-2.5 fill-current text-current" }) })
    })
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )
    }, props), {
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronsUpDownIcon, { className: "h-4 w-4 opacity-50" }) })
      ]
    })
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx(ChevronUpIcon, {})
    })
  );
});
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx(ChevronDownIcon, {})
    })
  );
});
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, children, position = "popper" } = _b, props = __objRest(_b, ["className", "children", "position"]);
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position
    }, props), {
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    })
  ) });
});
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    SelectPrimitive.Label,
    __spreadValues({
      ref,
      className: cn("px-2 py-1.5 text-sm font-semibold", className)
    }, props)
  );
});
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    })
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    SelectPrimitive.Separator,
    __spreadValues({
      ref,
      className: cn("-mx-1 my-1 h-px bg-muted", className)
    }, props)
  );
});
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
var Slider = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsxs(
    SliderPrimitive.Root,
    __spreadProps(__spreadValues({
      ref,
      className: cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )
    }, props), {
      children: [
        /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
        /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
      ]
    })
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;
var Switch = React3.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx(
    SwitchPrimitives.Root,
    __spreadProps(__spreadValues({
      className: cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )
    }, props), {
      ref,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitives.Thumb,
        {
          className: cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )
        }
      )
    })
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;
var Textarea = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
    return /* @__PURE__ */ jsx(
      "textarea",
      __spreadValues({
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref
      }, props)
    );
  }
);
Textarea.displayName = "Textarea";
function FormFieldWrapper({
  children,
  label,
  description
}) {
  return /* @__PURE__ */ jsxs(FormItem, { children: [
    /* @__PURE__ */ jsx(FormLabel, { children: label }),
    /* @__PURE__ */ jsx(FormControl, { children }),
    /* @__PURE__ */ jsx(FormDescription, { children: description }),
    /* @__PURE__ */ jsx(FormMessage, {})
  ] });
}
function renderFormFieldComponent({
  formField,
  field
}) {
  var _a, _b;
  const safeField = __spreadProps(__spreadValues({}, field), {
    value: (_a = field.value) != null ? _a : ""
  });
  switch (formField.type) {
    case "INPUT" /* INPUT */:
      return /* @__PURE__ */ jsx(FormFieldWrapper, __spreadProps(__spreadValues({}, formField), { children: /* @__PURE__ */ jsx(Input, __spreadValues({ placeholder: formField.placeholder }, safeField)) }));
    case "TEXTAREA" /* TEXTAREA */:
      return /* @__PURE__ */ jsx(FormFieldWrapper, __spreadProps(__spreadValues({}, formField), { children: /* @__PURE__ */ jsx(
        Textarea,
        __spreadValues({
          placeholder: formField.placeholder,
          className: "resize-none"
        }, safeField)
      ) }));
    case "NUMBER_INPUT" /* NUMBER_INPUT */:
      return /* @__PURE__ */ jsx(FormFieldWrapper, __spreadProps(__spreadValues({}, formField), { children: /* @__PURE__ */ jsx(Input, __spreadProps(__spreadValues({ placeholder: formField.placeholder }, safeField), { type: "number" })) }));
    case "EMAIL" /* EMAIL */:
      return /* @__PURE__ */ jsx(FormFieldWrapper, __spreadProps(__spreadValues({}, formField), { children: /* @__PURE__ */ jsx(Input, __spreadValues({ placeholder: formField.placeholder }, safeField)) }));
    case "CHECKBOX" /* CHECKBOX */:
      return /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4", children: [
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Checkbox, { checked: field.value, onCheckedChange: field.onChange }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1 leading-none", children: [
          /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
          /* @__PURE__ */ jsx(FormDescription, { children: formField.description })
        ] })
      ] });
    case "SELECT" /* SELECT */:
      return /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
        /* @__PURE__ */ jsxs(
          Select,
          {
            onValueChange: field.onChange,
            value: field.value,
            defaultValue: formField.default,
            children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: formField.placeholder }) }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: formField.choices.map((choice, idx) => /* @__PURE__ */ jsx(
                SelectItem,
                {
                  value: choice.value !== "" ? choice.value : "hello",
                  children: choice.label
                },
                idx
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(FormDescription, { children: formField.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] });
    case "DATE" /* DATE */:
      return /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
        /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: cn(
                "pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              ),
              children: [
                field.value ? format(field.value, "PPP") : /* @__PURE__ */ jsx("span", { children: "Pick a date" }),
                /* @__PURE__ */ jsx(CalendarIcon, { className: "ml-auto h-4 w-4 opacity-50" })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsx(
            Calendar,
            {
              mode: "single",
              selected: field.value,
              onSelect: field.onChange
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(FormDescription, { children: formField.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] });
    case "RADIO_GROUP" /* RADIO_GROUP */:
      return /* @__PURE__ */ jsxs(FormItem, { className: "space-y-3", children: [
        /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
          RadioGroup,
          {
            onValueChange: field.onChange,
            defaultValue: formField.default,
            className: "flex flex-col space-y-1",
            children: formField.choices.map((choice, idx) => /* @__PURE__ */ jsxs(
              FormItem,
              {
                className: "flex items-center space-x-3 space-y-0",
                children: [
                  /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(RadioGroupItem, { value: choice.value }) }),
                  /* @__PURE__ */ jsx(FormLabel, { className: "font-normal", children: choice.label })
                ]
              },
              idx
            ))
          }
        ) }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] });
    case "SWITCH" /* SWITCH */:
      return /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsx(FormLabel, { className: "text-base", children: formField.label }),
          /* @__PURE__ */ jsx(FormDescription, { children: formField.description })
        ] }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Switch, { checked: field.value, onCheckedChange: field.onChange }) })
      ] });
    case "COMBOBOX" /* COMBOBOX */:
      return /* @__PURE__ */ jsxs(FormItem, { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
        /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              role: "combobox",
              className: cn(
                "justify-between",
                !field.value && "text-muted-foreground"
              ),
              children: [
                field.value ? (_b = formField.choices.find(
                  (choice) => choice.value === field.value
                )) == null ? void 0 : _b.label : "Select language",
                /* @__PURE__ */ jsx(ChevronsUpDownIcon, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsx(PopoverContent, { className: "p-0", align: "start", children: /* @__PURE__ */ jsxs(Command, { children: [
            /* @__PURE__ */ jsx(CommandInput, { placeholder: "Search language..." }),
            /* @__PURE__ */ jsxs(CommandList, { children: [
              /* @__PURE__ */ jsx(CommandEmpty, { children: "No language found." }),
              /* @__PURE__ */ jsx(CommandGroup, { children: formField.choices.map((choice, idx) => /* @__PURE__ */ jsxs(
                CommandItem,
                {
                  value: choice.value,
                  onSelect: () => field.onChange(choice.value),
                  children: [
                    /* @__PURE__ */ jsx(
                      CheckIcon,
                      {
                        className: cn(
                          "mr-2 h-4 w-4",
                          choice.value === field.value ? "opacity-100" : "opacity-0"
                        )
                      }
                    ),
                    choice.label
                  ]
                },
                idx
              )) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(FormDescription, { children: formField.description }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] });
    case "SLIDER" /* SLIDER */:
      return /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
          Slider,
          {
            min: formField.min,
            max: formField.max,
            step: formField.step,
            defaultValue: [formField.default],
            onValueChange: (value) => {
              field.onChange(value[0]);
            }
          }
        ) }),
        /* @__PURE__ */ jsxs(FormDescription, { children: [
          "Selected value is",
          " ",
          field.value !== void 0 ? field.value : formField.default,
          ", minimun valus is ",
          formField.min,
          ", maximim values is ",
          formField.max,
          ", step size is ",
          formField.step
        ] }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] });
    case "FILE_UPLOAD" /* FILE_UPLOAD */:
      return /* @__PURE__ */ jsxs(FormItem, { children: [
        /* @__PURE__ */ jsx(FormLabel, { children: formField.label }),
        /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "file",
            accept: formField.accept,
            multiple: formField.multiple,
            onChange: (e) => field.onChange(e.target.files)
          }
        ) }),
        formField.description && /* @__PURE__ */ jsx(FormDescription, { children: formField.description }),
        formField.maxSize && /* @__PURE__ */ jsxs(FormDescription, { children: [
          "Max file size: ",
          formField.maxSize,
          " MB"
        ] }),
        /* @__PURE__ */ jsx(FormMessage, {})
      ] });
  }
}
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, sideOffset = 4 } = _b, props = __objRest(_b, ["className", "sideOffset"]);
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    TooltipPrimitive.Content,
    __spreadValues({
      ref,
      sideOffset,
      className: cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )
    }, props)
  ) });
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
function TooltipWrapper({ children, text, side }) {
  return /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children }),
    /* @__PURE__ */ jsx(TooltipContent, { side, children: text })
  ] });
}
var selector = (state) => ({
  deleteFormField: state.deleteFormField,
  setSelectedFormField: state.setSelectedFormField,
  setIsEditFormFieldOpen: state.setIsEditFormFieldOpen
});
var Field = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { formField, form, style, isDragging, onDelete, onEdit } = _b, props = __objRest(_b, ["formField", "form", "style", "isDragging", "onDelete", "onEdit"]);
    const { deleteFormField, setSelectedFormField, setIsEditFormFieldOpen } = useFormStore(useShallow(selector));
    const [pendingDelete, setPendingDelete] = React3.useState(false);
    const timeoutRef = React3.useRef(null);
    const clearDeleteTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    const handleDelete = () => {
      if (!formField.id) return;
      if (pendingDelete) {
        clearDeleteTimeout();
        if (onDelete) {
          onDelete(formField.id);
        } else {
          deleteFormField(formField.id);
        }
      } else {
        setPendingDelete(true);
      }
    };
    const handleDeleteMouseLeave = () => {
      if (pendingDelete) {
        clearDeleteTimeout();
        timeoutRef.current = setTimeout(() => {
          setPendingDelete(false);
        }, 3e3);
      }
    };
    const handleDeleteMouseEnter = () => {
      if (pendingDelete) {
        clearDeleteTimeout();
      }
    };
    React3.useEffect(() => {
      return () => {
        clearDeleteTimeout();
      };
    }, []);
    React3.useEffect(() => {
      if (isDragging && pendingDelete) {
        clearDeleteTimeout();
        setPendingDelete(false);
      }
    }, [isDragging, pendingDelete]);
    const handleEdit = () => {
      if (!formField.id) return;
      if (onEdit) {
        onEdit(formField.id);
      } else {
        setSelectedFormField(formField.id);
        setIsEditFormFieldOpen(true);
      }
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "group relative flex items-center gap-2 rounded-md border-2 border-dashed border-transparent transition-colors",
          {
            "rounded-md border-foreground bg-muted opacity-60": isDragging,
            "bg-destructive/10": pendingDelete
          }
        ),
        style,
        ref,
        children: [
          /* @__PURE__ */ jsxs("div", { className: cn(
            "absolute -left-12 top-1/2 flex -translate-y-1/2 flex-col gap-1 transition-opacity",
            pendingDelete ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          ), children: [
            /* @__PURE__ */ jsx(TooltipWrapper, { text: "Edit field", children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "secondary",
                onClick: handleEdit,
                type: "button",
                className: "h-8 w-8 hover:bg-primary hover:text-primary-foreground",
                children: /* @__PURE__ */ jsx(PenIcon, { className: "size-4" })
              }
            ) }),
            /* @__PURE__ */ jsx(TooltipWrapper, { text: pendingDelete ? "Click again to confirm" : "Delete field", side: "bottom", children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                variant: "secondary",
                onClick: handleDelete,
                onMouseLeave: handleDeleteMouseLeave,
                onMouseEnter: handleDeleteMouseEnter,
                type: "button",
                className: cn(
                  "h-8 w-8 transition-colors",
                  pendingDelete ? "bg-destructive text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground" : "hover:bg-destructive hover:text-destructive-foreground"
                ),
                children: pendingDelete ? /* @__PURE__ */ jsx(Check, { className: "size-4" }) : /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
            FormField2,
            {
              control: form == null ? void 0 : form.control,
              name: formField.name,
              render: ({ field }) => renderFormFieldComponent({ field, formField })
            }
          ) }),
          /* @__PURE__ */ jsx(
            Button,
            __spreadProps(__spreadValues({
              size: "icon",
              variant: "secondary",
              type: "button"
            }, props), {
              className: "absolute -right-12 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 transition-opacity hover:bg-primary hover:text-primary-foreground group-hover:opacity-100",
              children: /* @__PURE__ */ jsx(GripVertical, { className: "size-4" })
            })
          )
        ]
      }
    );
  }
);
Field.displayName = "Field";
var SortableField = React3.memo(({ formField, form, onDelete, onEdit }) => {
  const {
    attributes,
    listeners: listeners2,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: formField.name
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition
  };
  return /* @__PURE__ */ jsx(
    Field,
    __spreadValues(__spreadValues({
      formField,
      form,
      ref: setNodeRef,
      style,
      isDragging,
      onDelete,
      onEdit
    }, attributes), listeners2)
  );
});
SortableField.displayName = "SortableField";
var TOAST_LIMIT = 1;
var TOAST_REMOVE_DELAY = 1e6;
var count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
var toastTimeouts = /* @__PURE__ */ new Map();
var addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST" /* REMOVE_TOAST */,
      toastId
    });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
var reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST" /* ADD_TOAST */:
      return __spreadProps(__spreadValues({}, state), {
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      });
    case "UPDATE_TOAST" /* UPDATE_TOAST */:
      return __spreadProps(__spreadValues({}, state), {
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? __spreadValues(__spreadValues({}, t), action.toast) : t
        )
      });
    case "DISMISS_TOAST" /* DISMISS_TOAST */: {
      const { toastId } = action;
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast2) => {
          addToRemoveQueue(toast2.id);
        });
      }
      return __spreadProps(__spreadValues({}, state), {
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? __spreadProps(__spreadValues({}, t), {
            open: false
          }) : t
        )
      });
    }
    case "REMOVE_TOAST" /* REMOVE_TOAST */:
      if (action.toastId === void 0) {
        return __spreadProps(__spreadValues({}, state), {
          toasts: []
        });
      }
      return __spreadProps(__spreadValues({}, state), {
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      });
  }
};
var listeners = [];
var memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast(_a) {
  var props = __objRest(_a, []);
  const id = genId();
  const update = (props2) => dispatch({
    type: "UPDATE_TOAST" /* UPDATE_TOAST */,
    toast: __spreadProps(__spreadValues({}, props2), { id })
  });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST" /* DISMISS_TOAST */, toastId: id });
  dispatch({
    type: "ADD_TOAST" /* ADD_TOAST */,
    toast: __spreadProps(__spreadValues({}, props), {
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    })
  });
  return {
    id,
    dismiss,
    update
  };
}
var fields = [
  {
    type: "INPUT" /* INPUT */,
    name: "Input",
    label: "Username",
    placeholder: "shadcn",
    description: "Single line text entry",
    Icon: TypeIcon,
    registryDependencies: ["input"]
  },
  {
    type: "TEXTAREA" /* TEXTAREA */,
    name: "Textarea",
    label: "Bio",
    placeholder: "Tell us a little bit about yourself",
    description: "Multi-line text entry",
    Icon: TextIcon,
    registryDependencies: ["textarea"]
  },
  {
    type: "NUMBER_INPUT" /* NUMBER_INPUT */,
    name: "Number Input",
    label: "Age",
    placeholder: "24",
    description: "Numeric value entry",
    Icon: HashIcon,
    registryDependencies: ["input"]
  },
  {
    type: "EMAIL" /* EMAIL */,
    name: "Email",
    label: "Email",
    placeholder: "m@example.com",
    description: "Email address entry",
    Icon: AtSignIcon,
    registryDependencies: ["input"]
  },
  {
    type: "CHECKBOX" /* CHECKBOX */,
    name: "Checkbox",
    label: "Use different settings for my mobile devices",
    description: "Boolean yes/no toggle",
    Icon: SquareCheckIcon,
    registryDependencies: ["checkbox"]
  },
  {
    type: "SELECT" /* SELECT */,
    name: "Select",
    label: "Email",
    placeholder: "Select a verified email to display",
    description: "Dropdown selection",
    Icon: ChevronsUpDownIcon,
    choices: [
      {
        value: "m@example.com",
        label: "m@example.com"
      },
      {
        value: "m@google.com",
        label: "m@google.com"
      },
      {
        value: "m@support.com",
        label: "m@support.com"
      }
    ],
    registryDependencies: ["select"]
  },
  {
    type: "DATE" /* DATE */,
    name: "Date",
    label: "Date of birth",
    description: "Date picker calendar",
    Icon: CalendarIcon,
    registryDependencies: ["popover", "calendar"]
  },
  {
    type: "RADIO_GROUP" /* RADIO_GROUP */,
    name: "Radio Group",
    label: "Notify me about...",
    description: "Single choice from list",
    Icon: CircleDotIcon,
    choices: [
      {
        value: "all",
        label: "All new messages"
      },
      {
        value: "mentions",
        label: "Direct messages and mentions"
      },
      {
        value: "none",
        label: "Nothing"
      }
    ],
    registryDependencies: ["radio-group"]
  },
  {
    type: "SWITCH" /* SWITCH */,
    name: "Switch",
    label: "Marketing emails",
    description: "On/off toggle control",
    Icon: ToggleLeftIcon,
    registryDependencies: ["switch"]
  },
  {
    type: "COMBOBOX" /* COMBOBOX */,
    name: "Combobox",
    label: "Language",
    Icon: ChevronsUpDownIcon,
    description: "Searchable dropdown",
    choices: [
      { label: "English", value: "en" },
      { label: "French", value: "fr" },
      { label: "German", value: "de" },
      { label: "Spanish", value: "es" },
      { label: "Portuguese", value: "pt" },
      { label: "Russian", value: "ru" },
      { label: "Japanese", value: "ja" },
      { label: "Korean", value: "ko" },
      { label: "Chinese", value: "zh" }
    ],
    registryDependencies: ["popover", "command"]
  },
  {
    type: "SLIDER" /* SLIDER */,
    name: "Slider",
    label: "Slider",
    description: "Range value selector",
    Icon: SlidersHorizontalIcon,
    min: 0,
    max: 100,
    step: 10,
    default: 50,
    registryDependencies: ["slider"]
  },
  {
    type: "FILE_UPLOAD" /* FILE_UPLOAD */,
    name: "File Upload",
    label: "Upload File",
    description: "File attachment field",
    Icon: UploadIcon,
    accept: "*/*",
    maxSize: 5,
    multiple: false,
    registryDependencies: ["input"]
  }
];

// components/shorms/builder/constants.ts
var defaultFieldTemplates = fields.map((field) => ({
  type: field.type,
  name: field.name,
  label: field.label,
  description: field.description,
  Icon: field.Icon,
  defaultConfig: {
    placeholder: field.placeholder,
    description: field.description,
    // @ts-expect-error - choices exist on some field types
    choices: field.choices,
    // @ts-expect-error - min/max/step exist on slider
    min: field.min,
    // @ts-expect-error
    max: field.max,
    // @ts-expect-error
    step: field.step,
    default: field.default
  }
}));
var widthClasses = {
  sm: "max-w-2xl",
  // 672px - Not recommended: field controls may overflow
  md: "max-w-3xl",
  // 768px - Recommended minimum
  lg: "max-w-5xl",
  // 1024px
  xl: "max-w-7xl",
  // 1280px
  full: "max-w-full"
};
var fieldCategories = [
  {
    name: "Text Input",
    types: ["INPUT", "TEXTAREA", "EMAIL"]
  },
  {
    name: "Numbers & Dates",
    types: ["NUMBER_INPUT", "SLIDER", "DATE"]
  },
  {
    name: "Selection",
    types: ["SELECT", "RADIO_GROUP", "COMBOBOX"]
  },
  {
    name: "Toggles",
    types: ["CHECKBOX", "SWITCH"]
  },
  {
    name: "Special",
    types: ["FILE_UPLOAD"]
  }
];
var ScrollArea = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, children } = _b, props = __objRest(_b, ["className", "children"]);
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    __spreadProps(__spreadValues({
      ref,
      className: cn("relative overflow-hidden", className)
    }, props), {
      children: [
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    })
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, orientation = "vertical" } = _b, props = __objRest(_b, ["className", "orientation"]);
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    __spreadProps(__spreadValues({
      ref,
      orientation,
      className: cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )
    }, props), {
      children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
    })
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
function FieldLibrary({
  fieldTemplates,
  onFieldSelect,
  searchPlaceholder = "Search fields...",
  showSearch = true,
  className,
  width = 280
}) {
  const [searchQuery, setSearchQuery] = React3.useState("");
  const filteredCategories = React3.useMemo(() => {
    if (!searchQuery.trim()) return fieldCategories;
    const query = searchQuery.toLowerCase();
    return fieldCategories.map((category) => __spreadProps(__spreadValues({}, category), {
      types: category.types.filter((type) => {
        var _a;
        const template = fieldTemplates.find((f) => f.type === type);
        return (template == null ? void 0 : template.name.toLowerCase().includes(query)) || ((_a = template == null ? void 0 : template.description) == null ? void 0 : _a.toLowerCase().includes(query));
      })
    })).filter((category) => category.types.length > 0);
  }, [searchQuery, fieldTemplates]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex h-full flex-col border-r bg-muted/20", className),
      style: { width: `${width}px` },
      children: [
        showSearch && /* @__PURE__ */ jsx("div", { className: "shrink-0 p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(SearchCode, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              placeholder: searchPlaceholder,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "space-y-6 p-4", children: filteredCategories.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "No fields found" }) : filteredCategories.map((category) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: category.name }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: category.types.map((type) => {
            const template = fieldTemplates.find((f) => f.type === type);
            if (!template) return null;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => onFieldSelect(template),
                className: cn(
                  "flex w-full items-start gap-3 rounded-lg border bg-card p-3 text-left transition-all hover:border-primary hover:bg-accent hover:shadow-md"
                ),
                children: [
                  /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/50", children: /* @__PURE__ */ jsx(template.Icon, { className: "h-5 w-5 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-sm font-medium leading-none", children: template.name }),
                    template.description && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: template.description })
                  ] })
                ]
              },
              template.type
            );
          }) })
        ] }, category.name)) }) })
      ]
    }
  );
}
var Separator2 = React3.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, orientation = "horizontal", decorative = true } = _b, props = __objRest(_b, ["className", "orientation", "decorative"]);
    return /* @__PURE__ */ jsx(
      SeparatorPrimitive.Root,
      __spreadValues({
        ref,
        decorative,
        orientation,
        className: cn(
          "shrink-0 bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )
      }, props)
    );
  }
);
Separator2.displayName = SeparatorPrimitive.Root.displayName;
function FormContext({
  pages,
  activePageId,
  className,
  width = 380,
  sections = {
    statistics: true,
    currentPage: true,
    tips: true
  }
}) {
  const activePage = React3.useMemo(
    () => pages.find((p) => p.id === activePageId) || pages[0],
    [pages, activePageId]
  );
  const stats = React3.useMemo(() => {
    const totalFields = pages.reduce((acc, page) => acc + page.fields.length, 0);
    const requiredFields = pages.reduce(
      (acc, page) => acc + page.fields.filter((f) => {
        var _a;
        return (_a = f.validation) == null ? void 0 : _a.required;
      }).length,
      0
    );
    const fieldsWithValidation = pages.reduce(
      (acc, page) => acc + page.fields.filter(
        (f) => f.validation && Object.keys(f.validation).length > 0
      ).length,
      0
    );
    return {
      totalPages: pages.length,
      totalFields,
      currentPageFields: (activePage == null ? void 0 : activePage.fields.length) || 0,
      requiredFields,
      fieldsWithValidation
    };
  }, [pages, activePage]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("flex h-full flex-col border-l bg-muted/20", className),
      style: { width: `${width}px` },
      children: /* @__PURE__ */ jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 p-4 pt-5", children: [
        sections.statistics && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Info, { className: "h-3.5 w-3.5" }),
            "Statistics"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-lg border bg-card p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Total Pages" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: stats.totalPages })
            ] }),
            /* @__PURE__ */ jsx(Separator2, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Total Fields" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: stats.totalFields })
            ] }),
            /* @__PURE__ */ jsx(Separator2, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Current Page" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold", children: [
                stats.currentPageFields,
                " ",
                stats.currentPageFields === 1 ? "field" : "fields"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Separator2, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Required Fields" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: stats.requiredFields })
            ] }),
            /* @__PURE__ */ jsx(Separator2, {}),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "With Validation" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: stats.fieldsWithValidation })
            ] })
          ] })
        ] }),
        sections.currentPage && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Layers, { className: "h-3.5 w-3.5" }),
            "Current Page"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-lg border bg-card p-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Title" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm font-medium", children: (activePage == null ? void 0 : activePage.title) || `Page ${pages.findIndex((p) => p.id === activePageId) + 1}` })
            ] }),
            /* @__PURE__ */ jsx(Separator2, {}),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Fields" }),
              activePage && activePage.fields.length > 0 ? /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-1", children: activePage.fields.map((field) => {
                var _a;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 rounded border bg-muted/30 px-2 py-1.5 text-xs",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "truncate font-medium", children: field.label || field.name }),
                      ((_a = field.validation) == null ? void 0 : _a.required) && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 text-[10px] text-destructive", children: "Required" })
                    ]
                  },
                  field.id
                );
              }) }) : /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "No fields yet" })
            ] })
          ] })
        ] }),
        sections.tips && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsx(FileJson2, { className: "h-3.5 w-3.5" }),
            "Quick Tips"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-lg border bg-card p-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx("p", { children: "\u2022 Click a field to edit its properties" }),
            /* @__PURE__ */ jsx("p", { children: "\u2022 Drag fields to reorder them" }),
            /* @__PURE__ */ jsx("p", { children: "\u2022 Double-click page tabs to rename" }),
            /* @__PURE__ */ jsx("p", { children: "\u2022 Press \u2318K to add fields quickly" })
          ] })
        ] })
      ] }) })
    }
  );
}
var selector2 = (state) => ({
  addFormField: state.addFormField
});
function FieldCommandPalette() {
  const [open, setOpen] = React3.useState(false);
  const { addFormField } = useFormStore(useShallow(selector2));
  React3.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open2) => !open2);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const handleSelectField = (field) => {
    const newFormField = __spreadProps(__spreadValues({}, field), {
      id: generateFieldId(),
      name: generateFieldName(field.name)
    });
    addFormField(newFormField);
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        variant: "outline",
        size: "icon",
        onClick: () => setOpen(true),
        children: /* @__PURE__ */ jsx(SearchCode, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl p-0", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { className: "px-6 pt-6", children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Add Field" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Search and select a field type to add to your form" })
      ] }),
      /* @__PURE__ */ jsxs(Command, { className: "border-t", children: [
        /* @__PURE__ */ jsx(CommandInput, { placeholder: "Search fields..." }),
        /* @__PURE__ */ jsxs(CommandList, { children: [
          /* @__PURE__ */ jsx(CommandEmpty, { children: "No fields found." }),
          /* @__PURE__ */ jsx(CommandGroup, { heading: "Available Fields", children: fields.map((field) => /* @__PURE__ */ jsxs(
            CommandItem,
            {
              value: field.name,
              onSelect: () => handleSelectField(field),
              className: "flex items-center gap-3 py-3",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-md border bg-muted", children: /* @__PURE__ */ jsx(field.Icon, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-medium", children: field.name }),
                  field.description && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: field.description })
                ] })
              ]
            },
            field.type
          )) })
        ] })
      ] })
    ] }) })
  ] });
}
function SortablePageTab({
  page,
  index,
  isActive,
  canDelete,
  onSelect,
  onDelete,
  onRename
}) {
  const { attributes, listeners: listeners2, setNodeRef, transform, transition } = useSortable({ id: page.id });
  const [isEditing, setIsEditing] = React3.useState(false);
  const [editValue, setEditValue] = React3.useState(page.title || "");
  const inputRef = React3.useRef(null);
  React3.useEffect(() => {
    var _a, _b;
    if (isEditing) {
      (_a = inputRef.current) == null ? void 0 : _a.focus();
      (_b = inputRef.current) == null ? void 0 : _b.select();
    }
  }, [isEditing]);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const handleSave = () => {
    if (editValue.trim()) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(page.title || "");
      setIsEditing(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: setNodeRef,
      style,
      className: cn(
        "flex cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-all hover:bg-accent/50 hover:shadow-md",
        isActive && "border-primary bg-primary/10 font-semibold shadow-md ring-1 ring-primary/20"
      ),
      onClick: onSelect,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          __spreadProps(__spreadValues(__spreadValues({}, attributes), listeners2), {
            className: "cursor-grab active:cursor-grabbing",
            children: /* @__PURE__ */ jsx(GripVertical, { className: "h-3 w-3 text-muted-foreground" })
          })
        ),
        isEditing ? /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            type: "text",
            value: editValue,
            onChange: (e) => setEditValue(e.target.value),
            onBlur: handleSave,
            onKeyDown: handleKeyDown,
            onClick: (e) => e.stopPropagation(),
            className: "min-w-[60px] max-w-[120px] bg-transparent px-1 outline-none"
          }
        ) : /* @__PURE__ */ jsx(
          "span",
          {
            className: "max-w-[120px] truncate",
            onDoubleClick: (e) => {
              e.stopPropagation();
              setIsEditing(true);
            },
            children: page.title || `Page ${index + 1}`
          }
        ),
        canDelete && /* @__PURE__ */ jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "ml-1 h-4 w-4 hover:text-destructive",
            onClick: (e) => {
              e.stopPropagation();
              onDelete();
            },
            children: /* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" })
          }
        )
      ]
    }
  );
}
function PageTabs({
  pages,
  activePageId,
  onPageSelect,
  onPageAdd,
  onPageDelete,
  onPageRename,
  onPageReorder,
  dragDropEnabled = true,
  showCommandPalette = false,
  showLeftSidebar = false,
  className,
  renderCommandPalette
}) {
  var _a;
  const [isMounted, setIsMounted] = React3.useState(false);
  const [activePageDragId, setActivePageDragId] = React3.useState(
    null
  );
  React3.useEffect(() => {
    setIsMounted(true);
  }, []);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );
  const handlePageDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onPageReorder) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      const newPages = arrayMove(pages, oldIndex, newIndex);
      onPageReorder(newPages);
    }
    setActivePageDragId(null);
  };
  const handlePageDragStart = (event) => {
    setActivePageDragId(event.active.id);
  };
  const TabContent = () => /* @__PURE__ */ jsx("div", { className: "flex min-w-0 flex-1 items-center gap-2 overflow-x-auto md:gap-3", children: pages.map((page, index) => /* @__PURE__ */ jsx(
    SortablePageTab,
    {
      page,
      index,
      isActive: activePageId === page.id,
      canDelete: pages.length > 1,
      onSelect: () => onPageSelect(page.id),
      onDelete: () => onPageDelete == null ? void 0 : onPageDelete(page.id),
      onRename: (title) => onPageRename == null ? void 0 : onPageRename(page.id, title)
    },
    page.id
  )) });
  if (!isMounted || !dragDropEnabled) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: cn(
          "flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2.5 md:gap-3 md:px-4 md:py-3",
          className
        ),
        children: [
          !showLeftSidebar && showCommandPalette && /* @__PURE__ */ jsxs(Fragment, { children: [
            renderCommandPalette ? renderCommandPalette() : /* @__PURE__ */ jsx(FieldCommandPalette, {}),
            /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border" })
          ] }),
          /* @__PURE__ */ jsx(TabContent, {}),
          /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border" }),
          onPageAdd && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "outline",
              size: "icon",
              onClick: onPageAdd,
              className: "shrink-0",
              children: /* @__PURE__ */ jsx(FilePlus, { className: "h-4 w-4" })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragEnd: handlePageDragEnd,
      onDragStart: handlePageDragStart,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: cn(
              "flex shrink-0 items-center gap-2 border-b bg-muted/20 px-3 py-2.5 md:gap-3 md:px-4 md:py-3",
              className
            ),
            children: [
              !showLeftSidebar && showCommandPalette && /* @__PURE__ */ jsxs(Fragment, { children: [
                renderCommandPalette ? renderCommandPalette() : /* @__PURE__ */ jsx(FieldCommandPalette, {}),
                /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border" })
              ] }),
              /* @__PURE__ */ jsx(
                SortableContext,
                {
                  items: pages.map((p) => p.id),
                  strategy: horizontalListSortingStrategy,
                  children: /* @__PURE__ */ jsx(TabContent, {})
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "h-6 w-px bg-border" }),
              onPageAdd && /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  size: "icon",
                  onClick: onPageAdd,
                  className: "shrink-0",
                  children: /* @__PURE__ */ jsx(FilePlus, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(DragOverlay, { children: activePageDragId && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 rounded-md border bg-background px-2 py-1.5 text-sm opacity-80 shadow-lg", children: [
          /* @__PURE__ */ jsx(GripVertical, { className: "h-3 w-3 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { children: ((_a = pages.find((p) => p.id === activePageDragId)) == null ? void 0 : _a.title) || `Page ${pages.findIndex((p) => p.id === activePageDragId) + 1}` })
        ] }) })
      ]
    }
  );
}
function Builder({
  pages,
  activePageId,
  onPagesChange,
  onActivePageChange,
  onPageAdd,
  onPageDelete,
  onPageRename,
  onPageReorder,
  onFieldAdd,
  onFieldUpdate,
  onFieldDelete,
  onFieldEdit,
  onFieldReorder,
  width = "lg",
  showFieldLibrary,
  showFormContext,
  fieldTemplates = defaultFieldTemplates,
  features = {
    dragDrop: true,
    pageManagement: true,
    fieldSearch: true,
    commandPalette: true
  },
  renderCommandPalette,
  className
}) {
  const [isMounted, setIsMounted] = React3.useState(false);
  const [activeFormField, setActiveFormField] = React3.useState(null);
  const widthClass = typeof width === "string" ? widthClasses[width] : "";
  const widthStyle = typeof width === "number" ? { maxWidth: `${width}px` } : {};
  const leftSidebarVisible = React3.useMemo(() => {
    if (showFieldLibrary !== void 0) return showFieldLibrary;
    if (typeof width === "number") return width >= 1024;
    return width === "lg" || width === "xl" || width === "full";
  }, [width, showFieldLibrary]);
  const rightSidebarVisible = React3.useMemo(() => {
    if (showFormContext !== void 0) return showFormContext;
    if (typeof width === "number") return width >= 1536;
    return width === "full";
  }, [width, showFormContext]);
  React3.useEffect(() => {
    setIsMounted(true);
  }, []);
  useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );
  const activePage = React3.useMemo(
    () => pages.find((p) => p.id === activePageId) || pages[0],
    [pages, activePageId]
  );
  const currentFields = React3.useMemo(
    () => (activePage == null ? void 0 : activePage.fields) || [],
    [activePage]
  );
  const formSchema = React3.useMemo(
    () => generateZodSchema(currentFields),
    [currentFields]
  );
  const defaultValues = React3.useMemo(
    () => generateDefaultValues(currentFields),
    [currentFields]
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange"
  });
  React3.useEffect(() => {
    form.reset(defaultValues, { keepDefaultValues: false });
  }, [defaultValues, form]);
  const onSubmit = (values) => {
    toast({
      title: "You submitted the following values:",
      description: /* @__PURE__ */ jsx("pre", { className: "mt-2 w-[340px] overflow-auto rounded-md bg-slate-950 p-4", children: /* @__PURE__ */ jsx("code", { className: "overflow-auto text-white", children: JSON.stringify(values, null, 2) }) })
    });
  };
  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id && activePage && onFieldReorder) {
      const oldIndex = currentFields.findIndex(
        (field) => field.name === active.id
      );
      const newIndex = currentFields.findIndex(
        (field) => field.name === over.id
      );
      const newFields = arrayMove(currentFields, oldIndex, newIndex);
      onFieldReorder(activePage.id, newFields);
    }
    setActiveFormField(null);
  }
  function handleDragStart(event) {
    const { active } = event;
    const formField = currentFields.find((field) => field.name === active.id);
    if (formField) {
      setActiveFormField(formField);
    }
  }
  const handleFieldSelect = (template) => {
    if (!onFieldAdd) {
      console.warn("onFieldAdd callback not provided");
      return;
    }
    const newField = __spreadProps(__spreadValues({}, template.defaultConfig), {
      id: generateFieldId(),
      name: generateFieldName(template.name),
      type: template.type,
      label: template.label,
      Icon: template.Icon,
      registryDependencies: []
    });
    onFieldAdd(newField);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("flex h-full", widthClass, className),
      style: widthStyle,
      children: [
        leftSidebarVisible && /* @__PURE__ */ jsx(
          FieldLibrary,
          {
            fieldTemplates,
            onFieldSelect: handleFieldSelect,
            showSearch: features.fieldSearch
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col overflow-hidden", children: [
          features.pageManagement && /* @__PURE__ */ jsx(
            PageTabs,
            {
              pages,
              activePageId,
              onPageSelect: onActivePageChange,
              onPageAdd,
              onPageDelete,
              onPageRename,
              onPageReorder,
              dragDropEnabled: features.dragDrop,
              showCommandPalette: features.commandPalette,
              showLeftSidebar: leftSidebarVisible,
              renderCommandPalette
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: isMounted && features.dragDrop ? /* @__PURE__ */ jsx(DndContext, { onDragEnd: handleDragEnd, onDragStart: handleDragStart, children: currentFields.length !== 0 ? /* @__PURE__ */ jsx(Form, __spreadProps(__spreadValues({}, form), { children: /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: form.handleSubmit(onSubmit),
              className: "mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-8 md:gap-6 md:px-8 md:py-10",
              children: [
                /* @__PURE__ */ jsx(
                  SortableContext,
                  {
                    items: currentFields.map((formField) => formField.name),
                    strategy: verticalListSortingStrategy,
                    children: currentFields.map((formField) => /* @__PURE__ */ jsx(
                      SortableField,
                      {
                        formField,
                        form,
                        onDelete: onFieldDelete,
                        onEdit: onFieldEdit
                      },
                      formField.name
                    ))
                  }
                ),
                /* @__PURE__ */ jsx(DragOverlay, { className: "bg-background", children: activeFormField ? /* @__PURE__ */ jsx(Field, { formField: activeFormField }) : /* @__PURE__ */ jsx(Fragment, {}) }),
                /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "mt-2", children: "Submit Form" })
              ]
            }
          ) })) : /* @__PURE__ */ jsx(EmptyState, {}) }) : currentFields.length !== 0 ? /* @__PURE__ */ jsx(Form, __spreadProps(__spreadValues({}, form), { children: /* @__PURE__ */ jsxs(
            "form",
            {
              onSubmit: form.handleSubmit(onSubmit),
              className: "mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-8 md:gap-6 md:px-8 md:py-10",
              children: [
                currentFields.map((formField) => /* @__PURE__ */ jsx(Field, { formField, onDelete: onFieldDelete, onEdit: onFieldEdit }, formField.name)),
                /* @__PURE__ */ jsx(Button, { type: "submit", size: "lg", className: "mt-2", children: "Submit Form" })
              ]
            }
          ) })) : /* @__PURE__ */ jsx(EmptyState, {}) })
        ] }),
        rightSidebarVisible && /* @__PURE__ */ jsx(FormContext, { pages, activePageId })
      ]
    }
  );
}
function EmptyState() {
  return /* @__PURE__ */ jsx("div", { className: "flex h-full items-center justify-center py-24", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20", children: /* @__PURE__ */ jsx(Plus, { className: "h-10 w-10 text-primary" }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold tracking-tight", children: "No fields yet" }),
      /* @__PURE__ */ jsxs("p", { className: "max-w-md text-sm text-muted-foreground", children: [
        "Press",
        " ",
        /* @__PURE__ */ jsx("kbd", { className: "rounded border bg-muted px-1.5 py-0.5 text-xs font-semibold", children: "\u2318K" }),
        " ",
        "to add fields to your form"
      ] })
    ] })
  ] }) });
}
var fieldTypeToIcon = {
  ["INPUT" /* INPUT */]: TypeIcon,
  ["TEXTAREA" /* TEXTAREA */]: TextIcon,
  ["NUMBER_INPUT" /* NUMBER_INPUT */]: HashIcon,
  ["EMAIL" /* EMAIL */]: AtSignIcon,
  ["CHECKBOX" /* CHECKBOX */]: SquareCheckIcon,
  ["SELECT" /* SELECT */]: ChevronsUpDownIcon,
  ["DATE" /* DATE */]: CalendarIcon,
  ["RADIO_GROUP" /* RADIO_GROUP */]: CircleDotIcon,
  ["SWITCH" /* SWITCH */]: ToggleLeftIcon,
  ["COMBOBOX" /* COMBOBOX */]: ChevronsUpDownIcon,
  ["SLIDER" /* SLIDER */]: SlidersHorizontalIcon,
  ["FILE_UPLOAD" /* FILE_UPLOAD */]: UploadIcon
};
var STORAGE_KEY = "shorms-builder-state";
function hydratePages(pages) {
  return pages.map((page) => __spreadProps(__spreadValues({}, page), {
    fields: page.fields.map((field) => __spreadProps(__spreadValues({}, field), {
      Icon: fieldTypeToIcon[field.type] || TypeIcon
    }))
  }));
}
function loadFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return hydratePages(parsed);
    }
  } catch (e) {
    console.warn("Failed to load from localStorage:", e);
  }
  return null;
}
function saveToStorage(pages) {
  if (typeof window === "undefined") return;
  try {
    const toSave = pages.map((page) => __spreadProps(__spreadValues({}, page), {
      fields: page.fields.map((_a) => {
        var _b = _a, { Icon: Icon2 } = _b, field = __objRest(_b, ["Icon"]);
        return field;
      })
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn("Failed to save to localStorage:", e);
  }
}
function useBuilderState(initialPages) {
  var _a;
  const [isHydrated, setIsHydrated] = useState(false);
  const [pages, setPages] = useState(
    initialPages || [
      {
        id: nanoid(),
        title: "Page 1",
        fields: []
      }
    ]
  );
  const [activePageId, setActivePageId] = useState(((_a = pages[0]) == null ? void 0 : _a.id) || "");
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      setPages(stored);
      setActivePageId(stored[0].id);
    }
    setIsHydrated(true);
  }, []);
  useEffect(() => {
    if (isHydrated) {
      saveToStorage(pages);
    }
  }, [pages, isHydrated]);
  const addPage = useCallback(() => {
    const newPage = {
      id: nanoid(),
      title: `Page ${pages.length + 1}`,
      fields: []
    };
    setPages([...pages, newPage]);
    setActivePageId(newPage.id);
  }, [pages]);
  const deletePage = useCallback(
    (pageId) => {
      if (pages.length === 1) {
        console.warn("Cannot delete the last page");
        return;
      }
      const newPages = pages.filter((p) => p.id !== pageId);
      setPages(newPages);
      if (activePageId === pageId) {
        setActivePageId(newPages[0].id);
      }
    },
    [pages, activePageId]
  );
  const updatePageTitle = useCallback(
    (pageId, title) => {
      setPages(pages.map((p) => p.id === pageId ? __spreadProps(__spreadValues({}, p), { title }) : p));
    },
    [pages]
  );
  const reorderPages = useCallback((newPages) => {
    setPages(newPages);
  }, []);
  const addField = useCallback(
    (field) => {
      setPages(
        pages.map(
          (page) => page.id === activePageId ? __spreadProps(__spreadValues({}, page), { fields: [...page.fields, field] }) : page
        )
      );
    },
    [pages, activePageId]
  );
  const updateField = useCallback(
    (fieldId, updates) => {
      setPages(
        pages.map((page) => __spreadProps(__spreadValues({}, page), {
          fields: page.fields.map(
            (f) => f.id === fieldId ? __spreadValues(__spreadValues({}, f), updates) : f
          )
        }))
      );
    },
    [pages]
  );
  const deleteField = useCallback(
    (fieldId) => {
      setPages(
        pages.map((page) => __spreadProps(__spreadValues({}, page), {
          fields: page.fields.filter((f) => f.id !== fieldId)
        }))
      );
    },
    [pages]
  );
  const reorderFields = useCallback(
    (pageId, newFields) => {
      setPages(
        pages.map(
          (page) => page.id === pageId ? __spreadProps(__spreadValues({}, page), { fields: newFields }) : page
        )
      );
    },
    [pages]
  );
  const getActivePage = useCallback(() => {
    return pages.find((p) => p.id === activePageId) || pages[0];
  }, [pages, activePageId]);
  const getActiveFields = useCallback(() => {
    var _a2;
    return ((_a2 = getActivePage()) == null ? void 0 : _a2.fields) || [];
  }, [getActivePage]);
  const reset = useCallback((newPages) => {
    const resetPages = newPages || [
      {
        id: nanoid(),
        title: "Page 1",
        fields: []
      }
    ];
    setPages(resetPages);
    setActivePageId(resetPages[0].id);
  }, []);
  return {
    // State
    pages,
    activePageId,
    onPagesChange: setPages,
    onActivePageChange: setActivePageId,
    // Page operations (with "on" prefix to match Builder props)
    onPageAdd: addPage,
    onPageDelete: deletePage,
    onPageRename: (pageId, title) => updatePageTitle(pageId, title),
    onPageReorder: reorderPages,
    // Field operations (with "on" prefix to match Builder props)
    onFieldAdd: addField,
    onFieldUpdate: (fieldId, updates) => updateField(fieldId, updates),
    onFieldDelete: deleteField,
    onFieldReorder: reorderFields,
    // Utility
    getActivePage,
    getActiveFields,
    reset
  };
}
function ShadcnBuilder(props) {
  return /* @__PURE__ */ jsx(Builder, __spreadValues({}, props));
}
ShadcnBuilder.displayName = "ShadcnBuilder";
function useFormState(options) {
  const { schema, initialValues = {}, maxHistorySize = 50, onDirtyStateChange } = options;
  const [state, setState] = useState(() => {
    const defaultValues = {};
    schema.pages.forEach((page) => {
      page.fields.forEach((field) => {
        if (field.defaultValue !== void 0) {
          defaultValues[field.name] = field.defaultValue;
        } else if (initialValues[field.name] !== void 0) {
          defaultValues[field.name] = initialValues[field.name];
        }
      });
    });
    return {
      values: __spreadValues(__spreadValues({}, defaultValues), initialValues),
      initialValues: __spreadValues(__spreadValues({}, defaultValues), initialValues),
      suggestions: /* @__PURE__ */ new Map(),
      validations: /* @__PURE__ */ new Map(),
      history: [],
      historyIndex: -1,
      dirtyFields: /* @__PURE__ */ new Set(),
      expectingFields: /* @__PURE__ */ new Set(),
      loadingFields: /* @__PURE__ */ new Set(),
      metadata: {
        startedAt: Date.now(),
        aiAssistedFields: /* @__PURE__ */ new Set(),
        userEditedFields: /* @__PURE__ */ new Set()
      }
    };
  });
  const stateRef = useRef(state);
  stateRef.current = state;
  const addToHistory = useCallback((entry) => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
      }
      return __spreadProps(__spreadValues({}, prev), {
        history: newHistory,
        historyIndex: newHistory.length - 1
      });
    });
  }, [maxHistorySize]);
  useCallback((fieldId) => {
    const currentValue = stateRef.current.values[fieldId];
    const initialValue = stateRef.current.initialValues[fieldId];
    return currentValue !== initialValue;
  }, []);
  const getValue = useCallback((fieldId) => {
    return stateRef.current.values[fieldId];
  }, []);
  const setValue = useCallback((fieldId, value, source = "user") => {
    setState((prev) => {
      const oldValue = prev.values[fieldId];
      if (oldValue === value) {
        return prev;
      }
      const newValues = __spreadProps(__spreadValues({}, prev.values), { [fieldId]: value });
      const newDirtyFields = new Set(prev.dirtyFields);
      if (value !== prev.initialValues[fieldId]) {
        newDirtyFields.add(fieldId);
      } else {
        newDirtyFields.delete(fieldId);
      }
      const newMetadata = __spreadValues({}, prev.metadata);
      if (source === "user") {
        newMetadata.userEditedFields = new Set(prev.metadata.userEditedFields).add(fieldId);
      } else if (source === "suggested") {
        newMetadata.aiAssistedFields = new Set(prev.metadata.aiAssistedFields).add(fieldId);
      }
      if (onDirtyStateChange && newDirtyFields.size !== prev.dirtyFields.size) {
        onDirtyStateChange(newDirtyFields.size > 0, Array.from(newDirtyFields));
      }
      return __spreadProps(__spreadValues({}, prev), {
        values: newValues,
        dirtyFields: newDirtyFields,
        metadata: newMetadata
      });
    });
    addToHistory({
      timestamp: Date.now(),
      type: "field-edit",
      fieldIds: [fieldId],
      description: `Changed ${fieldId}`
    });
  }, [onDirtyStateChange, addToHistory]);
  const getSuggestionState = useCallback((fieldId) => {
    return stateRef.current.suggestions.get(fieldId) || null;
  }, []);
  const setSuggestionState = useCallback((fieldId, suggestionState) => {
    setState((prev) => {
      const newSuggestions = new Map(prev.suggestions);
      newSuggestions.set(fieldId, suggestionState);
      return __spreadProps(__spreadValues({}, prev), { suggestions: newSuggestions });
    });
  }, []);
  const acceptSuggestion = useCallback((fieldId) => {
    const suggestion = stateRef.current.suggestions.get(fieldId);
    if (!suggestion) return;
    setValue(fieldId, suggestion.suggestedValue, "suggested");
    setSuggestionState(fieldId, __spreadProps(__spreadValues({}, suggestion), {
      activeValue: "suggested",
      status: "accepted"
    }));
    addToHistory({
      timestamp: Date.now(),
      type: "accept-suggestion",
      fieldIds: [fieldId],
      description: `Accepted suggestion for ${fieldId}`
    });
  }, [setValue, setSuggestionState, addToHistory]);
  const dismissSuggestion = useCallback((fieldId) => {
    const suggestion = stateRef.current.suggestions.get(fieldId);
    if (!suggestion) return;
    setSuggestionState(fieldId, __spreadProps(__spreadValues({}, suggestion), {
      status: "dismissed"
    }));
    addToHistory({
      timestamp: Date.now(),
      type: "dismiss-suggestion",
      fieldIds: [fieldId],
      description: `Dismissed suggestion for ${fieldId}`
    });
  }, [setSuggestionState, addToHistory]);
  const toggleValue = useCallback((fieldId) => {
    const suggestion = stateRef.current.suggestions.get(fieldId);
    if (!suggestion) return;
    const newActiveValue = suggestion.activeValue === "user" ? "suggested" : "user";
    const newValue = newActiveValue === "user" ? suggestion.userValue : suggestion.suggestedValue;
    setValue(fieldId, newValue, newActiveValue === "suggested" ? "suggested" : "user");
    setSuggestionState(fieldId, __spreadProps(__spreadValues({}, suggestion), {
      activeValue: newActiveValue
    }));
    addToHistory({
      timestamp: Date.now(),
      type: "toggle-value",
      fieldIds: [fieldId],
      description: `Toggled to ${newActiveValue} value for ${fieldId}`
    });
  }, [setValue, setSuggestionState, addToHistory]);
  const resetToOriginalSuggestion = useCallback((fieldId) => {
    const suggestion = stateRef.current.suggestions.get(fieldId);
    if (!suggestion) return;
    setSuggestionState(fieldId, __spreadProps(__spreadValues({}, suggestion), {
      suggestedValue: suggestion.originalSuggestedValue,
      suggestedValueModified: false
    }));
    if (suggestion.activeValue === "suggested") {
      setValue(fieldId, suggestion.originalSuggestedValue, "suggested");
    }
  }, [setSuggestionState, setValue]);
  const markAsReviewed = useCallback((fieldId) => {
    const suggestion = stateRef.current.suggestions.get(fieldId);
    if (!suggestion) return;
    setSuggestionState(fieldId, __spreadProps(__spreadValues({}, suggestion), {
      status: "reviewing"
    }));
  }, [setSuggestionState]);
  const acceptAllSuggestions = useCallback(() => {
    const fieldIds = [];
    stateRef.current.suggestions.forEach((suggestion, fieldId) => {
      if (suggestion.status === "available" || suggestion.status === "reviewing") {
        acceptSuggestion(fieldId);
        fieldIds.push(fieldId);
      }
    });
    addToHistory({
      timestamp: Date.now(),
      type: "bulk-accept",
      fieldIds,
      description: `Accepted ${fieldIds.length} suggestions`
    });
  }, [acceptSuggestion, addToHistory]);
  const acceptAllOnPage = useCallback((pageId) => {
    const page = schema.pages.find((p) => p.id === pageId);
    if (!page) return;
    const fieldIds = [];
    page.fields.forEach((field) => {
      const suggestion = stateRef.current.suggestions.get(field.name);
      if (suggestion && (suggestion.status === "available" || suggestion.status === "reviewing")) {
        acceptSuggestion(field.name);
        fieldIds.push(field.name);
      }
    });
    addToHistory({
      timestamp: Date.now(),
      type: "bulk-accept",
      fieldIds,
      description: `Accepted ${fieldIds.length} suggestions on page ${pageId}`
    });
  }, [schema, acceptSuggestion, addToHistory]);
  const dismissAllOnPage = useCallback((pageId) => {
    const page = schema.pages.find((p) => p.id === pageId);
    if (!page) return;
    page.fields.forEach((field) => {
      const suggestion = stateRef.current.suggestions.get(field.name);
      if (suggestion && (suggestion.status === "available" || suggestion.status === "reviewing")) {
        dismissSuggestion(field.name);
      }
    });
  }, [schema, dismissSuggestion]);
  const getFieldValidation = useCallback((fieldId) => {
    return stateRef.current.validations.get(fieldId) || null;
  }, []);
  useCallback((fieldId, validation) => {
    setState((prev) => {
      const newValidations = new Map(prev.validations);
      if (validation) {
        newValidations.set(fieldId, validation);
      } else {
        newValidations.delete(fieldId);
      }
      return __spreadProps(__spreadValues({}, prev), { validations: newValidations });
    });
  }, []);
  const undo = useCallback(() => {
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      historyIndex: Math.max(-1, prev.historyIndex - 1)
    }));
  }, []);
  const redo = useCallback(() => {
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      historyIndex: Math.min(prev.history.length - 1, prev.historyIndex + 1)
    }));
  }, []);
  const clearHistory = useCallback(() => {
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      history: [],
      historyIndex: -1
    }));
  }, []);
  const reset = useCallback(() => {
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      values: __spreadValues({}, prev.initialValues),
      dirtyFields: /* @__PURE__ */ new Set(),
      suggestions: /* @__PURE__ */ new Map(),
      validations: /* @__PURE__ */ new Map(),
      history: [],
      historyIndex: -1
    }));
  }, []);
  const markClean = useCallback(() => {
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      lastSavedAt: Date.now(),
      lastSavedValues: __spreadValues({}, prev.values)
    }));
  }, []);
  const getChanges = useCallback(() => {
    const changes = [];
    const baseValues = stateRef.current.lastSavedValues || stateRef.current.initialValues;
    Object.keys(stateRef.current.values).forEach((fieldId) => {
      const currentValue = stateRef.current.values[fieldId];
      const baseValue = baseValues[fieldId];
      if (currentValue !== baseValue) {
        const suggestion = stateRef.current.suggestions.get(fieldId);
        const source = (suggestion == null ? void 0 : suggestion.status) === "accepted" ? "suggested" : "user";
        changes.push({
          fieldId,
          from: baseValue,
          to: currentValue,
          timestamp: Date.now(),
          source
        });
      }
    });
    return changes;
  }, []);
  const cancelJob = useCallback(async (jobId) => {
    setState((prev) => __spreadProps(__spreadValues({}, prev), {
      activeJobId: prev.activeJobId === jobId ? void 0 : prev.activeJobId
    }));
  }, []);
  const getPendingSuggestions = useCallback(() => {
    const pending = [];
    stateRef.current.suggestions.forEach((suggestion, fieldId) => {
      if (suggestion.status === "available" || suggestion.status === "reviewing") {
        pending.push(fieldId);
      }
    });
    return pending;
  }, []);
  const getSuggestionCount = useCallback(() => {
    return getPendingSuggestions().length;
  }, [getPendingSuggestions]);
  const getPageBadges = useCallback((pageId) => {
    const page = schema.pages.find((p) => p.id === pageId);
    if (!page) {
      return { errors: 0, warnings: 0, suggestions: 0 };
    }
    let errors2 = 0;
    let warnings = 0;
    let suggestions = 0;
    page.fields.forEach((field) => {
      const validation = stateRef.current.validations.get(field.name);
      if (validation && !validation.valid) {
        if (validation.severity === "error" && validation.blocking) {
          errors2++;
        } else if (validation.severity === "warning") {
          warnings++;
        }
      }
      const suggestion = stateRef.current.suggestions.get(field.name);
      if (suggestion && (suggestion.status === "available" || suggestion.status === "reviewing")) {
        suggestions++;
      }
    });
    return { errors: errors2, warnings, suggestions };
  }, [schema]);
  const getExpectingFields = useCallback(() => {
    return Array.from(stateRef.current.expectingFields);
  }, []);
  const getLoadingFields = useCallback(() => {
    return Array.from(stateRef.current.loadingFields);
  }, []);
  const isValid = useMemo(() => {
    let valid = true;
    state.validations.forEach((validation) => {
      if (!validation.valid && validation.blocking) {
        valid = false;
      }
    });
    return valid;
  }, [state.validations]);
  const errors = useMemo(() => {
    const errorMap = {};
    state.validations.forEach((validation, fieldId) => {
      if (!validation.valid && validation.message) {
        errorMap[fieldId] = validation.message;
      }
    });
    return errorMap;
  }, [state.validations]);
  const metadata = useMemo(() => __spreadProps(__spreadValues({}, state.metadata), {
    aiAssistedFields: Array.from(state.metadata.aiAssistedFields),
    userEditedFields: Array.from(state.metadata.userEditedFields)
  }), [state.metadata]);
  return {
    // Values
    values: state.values,
    getValue,
    setValue,
    // Dirty state
    isDirty: state.dirtyFields.size > 0,
    dirtyFields: state.dirtyFields,
    hasUnsavedChanges: state.lastSavedAt ? state.dirtyFields.size > 0 : state.dirtyFields.size > 0,
    // Validation
    isValid,
    errors,
    getFieldValidation,
    // Suggestions
    getSuggestionState,
    getPendingSuggestions,
    getSuggestionCount,
    getPageBadges,
    getExpectingFields,
    getLoadingFields,
    // Suggestion actions
    acceptSuggestion,
    dismissSuggestion,
    toggleValue,
    markAsReviewed,
    resetToOriginalSuggestion,
    // Bulk actions
    acceptAllSuggestions,
    acceptAllOnPage,
    dismissAllOnPage,
    // History
    canUndo: state.historyIndex >= 0,
    canRedo: state.historyIndex < state.history.length - 1,
    undo,
    redo,
    clearHistory,
    // Draft
    lastSavedAt: state.lastSavedAt,
    isDraftSaved: state.lastSavedAt !== void 0,
    // Jobs
    activeJobId: state.activeJobId,
    cancelJob,
    // Metadata
    metadata,
    // Utility
    reset,
    markClean,
    getChanges
  };
}
function useValidation(options) {
  const { schema, formState } = options;
  const cacheRef = useRef(/* @__PURE__ */ new Map());
  const debounceTimersRef = useRef(/* @__PURE__ */ new Map());
  const pendingRef = useRef(/* @__PURE__ */ new Map());
  const fieldMap = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    schema.pages.forEach((page) => {
      page.fields.forEach((field) => {
        map.set(field.name, field);
      });
    });
    return map;
  }, [schema]);
  const getCachedResult = useCallback((fieldId, value) => {
    const cached = cacheRef.current.get(`${fieldId}:${JSON.stringify(value)}`);
    if (!cached) return null;
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1e3) {
      cacheRef.current.delete(`${fieldId}:${JSON.stringify(value)}`);
      return null;
    }
    return cached.result;
  }, []);
  const cacheResult = useCallback((fieldId, value, result, ttl) => {
    const cacheKey = `${fieldId}:${JSON.stringify(value)}`;
    cacheRef.current.set(cacheKey, {
      result,
      timestamp: Date.now(),
      ttl
    });
  }, []);
  const normalizeResult = useCallback((result) => {
    if (result === true) {
      return { valid: true };
    }
    if (typeof result === "string") {
      return {
        valid: false,
        message: result,
        severity: "error",
        blocking: true
      };
    }
    return __spreadProps(__spreadValues({}, result), {
      severity: result.severity || "error",
      blocking: result.blocking !== void 0 ? result.blocking : result.severity === "error"
    });
  }, []);
  const runSyncValidation = useCallback((field, value, allValues) => {
    const validation = field.validation;
    if (!validation) {
      return { valid: true };
    }
    if (field.required && (value === void 0 || value === null || value === "")) {
      return {
        valid: false,
        message: `${field.label} is required`,
        severity: "error",
        blocking: true
      };
    }
    if (typeof value === "string") {
      if (validation.minLength !== void 0 && value.length < validation.minLength) {
        return {
          valid: false,
          message: `Minimum ${validation.minLength} characters required`,
          severity: "error",
          blocking: true
        };
      }
      if (validation.maxLength !== void 0 && value.length > validation.maxLength) {
        return {
          valid: false,
          message: `Maximum ${validation.maxLength} characters allowed`,
          severity: "error",
          blocking: true
        };
      }
    }
    if (typeof value === "number") {
      if (validation.min !== void 0 && value < validation.min) {
        return {
          valid: false,
          message: `Minimum value is ${validation.min}`,
          severity: "error",
          blocking: true
        };
      }
      if (validation.max !== void 0 && value > validation.max) {
        return {
          valid: false,
          message: `Maximum value is ${validation.max}`,
          severity: "error",
          blocking: true
        };
      }
    }
    if (validation.pattern && typeof value === "string") {
      const regex = typeof validation.pattern === "string" ? new RegExp(validation.pattern) : validation.pattern;
      if (!regex.test(value)) {
        return {
          valid: false,
          message: "Invalid format",
          severity: "error",
          blocking: true
        };
      }
    }
    if (validation.email && typeof value === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          valid: false,
          message: "Invalid email address",
          severity: "error",
          blocking: true
        };
      }
    }
    if (validation.url && typeof value === "string") {
      try {
        new URL(value);
      } catch (e) {
        return {
          valid: false,
          message: "Invalid URL",
          severity: "error",
          blocking: true
        };
      }
    }
    if (validation.phone && typeof value === "string") {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, "").length < 10) {
        return {
          valid: false,
          message: "Invalid phone number",
          severity: "error",
          blocking: true
        };
      }
    }
    if (validation.validate) {
      const result = validation.validate(value, allValues);
      return normalizeResult(result);
    }
    return { valid: true };
  }, [normalizeResult]);
  const runAsyncValidation = useCallback(async (field, value, allValues) => {
    const validation = field.validation;
    if (!validation || !validation.validateAsync) {
      return { valid: true };
    }
    const context = {
      fieldId: field.name,
      allValues,
      schema
    };
    const cacheEnabled = validation.cacheResults !== false;
    if (cacheEnabled) {
      const cached = getCachedResult(field.name, value);
      if (cached) {
        return cached;
      }
    }
    const pendingKey = `${field.name}:${JSON.stringify(value)}`;
    const pending = pendingRef.current.get(pendingKey);
    if (pending) {
      const result = await pending;
      return normalizeResult(result);
    }
    const promise = validation.validateAsync(value, context);
    pendingRef.current.set(pendingKey, promise);
    try {
      const result = await promise;
      const normalized = normalizeResult(result);
      if (cacheEnabled) {
        const ttl = validation.cacheTtl || 300;
        cacheResult(field.name, value, normalized, ttl);
      }
      return normalized;
    } catch (error) {
      return {
        valid: false,
        message: error instanceof Error ? error.message : "Validation error",
        severity: "error",
        blocking: true
      };
    } finally {
      pendingRef.current.delete(pendingKey);
    }
  }, [schema, getCachedResult, cacheResult, normalizeResult]);
  const validateField = useCallback(async (fieldId) => {
    var _a;
    const field = fieldMap.get(fieldId);
    if (!field) {
      return { valid: true };
    }
    const value = formState.getValue(fieldId);
    const allValues = formState.values;
    const syncResult = runSyncValidation(field, value, allValues);
    if (!syncResult.valid) {
      return syncResult;
    }
    if ((_a = field.validation) == null ? void 0 : _a.validateAsync) {
      return await runAsyncValidation(field, value, allValues);
    }
    return { valid: true };
  }, [fieldMap, formState, runSyncValidation, runAsyncValidation]);
  const validateFieldDebounced = useCallback((fieldId) => {
    return new Promise((resolve) => {
      var _a;
      const field = fieldMap.get(fieldId);
      const debounce = ((_a = field == null ? void 0 : field.validation) == null ? void 0 : _a.debounce) || 500;
      const existingTimer = debounceTimersRef.current.get(fieldId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      const timer = setTimeout(async () => {
        const result = await validateField(fieldId);
        resolve(result);
      }, debounce);
      debounceTimersRef.current.set(fieldId, timer);
    });
  }, [fieldMap, validateField]);
  const validateDependentFields = useCallback(async (fieldId) => {
    const dependentFields = [];
    fieldMap.forEach((field, fid) => {
      var _a;
      if ((_a = field.dependsOn) == null ? void 0 : _a.includes(fieldId)) {
        dependentFields.push(fid);
      }
    });
    await Promise.all(
      dependentFields.map(async (fid) => {
        const result = await validateField(fid);
        return result;
      })
    );
  }, [fieldMap, validateField]);
  const validateAll = useCallback(async () => {
    const results = /* @__PURE__ */ new Map();
    const promises = Array.from(fieldMap.keys()).map(async (fieldId) => {
      const result = await validateField(fieldId);
      results.set(fieldId, result);
    });
    await Promise.all(promises);
    return results;
  }, [fieldMap, validateField]);
  const validatePage = useCallback(async (pageId) => {
    const page = schema.pages.find((p) => p.id === pageId);
    if (!page) {
      return /* @__PURE__ */ new Map();
    }
    const results = /* @__PURE__ */ new Map();
    const promises = page.fields.map(async (field) => {
      const result = await validateField(field.name);
      results.set(field.name, result);
    });
    await Promise.all(promises);
    return results;
  }, [schema, validateField]);
  const validateCrossField = useCallback(async () => {
    var _a;
    const results = /* @__PURE__ */ new Map();
    if (!((_a = schema.validation) == null ? void 0 : _a.crossField)) {
      return results;
    }
    for (const rule of schema.validation.crossField) {
      const values = {};
      rule.fields.forEach((fieldId) => {
        values[fieldId] = formState.getValue(fieldId);
      });
      const result = rule.validate(values);
      const normalized = normalizeResult(result);
      if (!normalized.valid) {
        rule.fields.forEach((fieldId) => {
          results.set(fieldId, normalized);
        });
      }
    }
    return results;
  }, [schema, formState, normalizeResult]);
  const clearCacheForField = useCallback((fieldId) => {
    const keysToDelete = [];
    cacheRef.current.forEach((_, key) => {
      if (key.startsWith(`${fieldId}:`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => cacheRef.current.delete(key));
  }, []);
  return {
    validateField,
    validateFieldDebounced,
    validateDependentFields,
    validateAll,
    validatePage,
    validateCrossField,
    clearCacheForField
  };
}
function useSuggestions(options) {
  const { schema, formState, onSuggest } = options;
  const pendingRef = useRef(/* @__PURE__ */ new Map());
  const fieldMap = useRef(/* @__PURE__ */ new Map());
  if (fieldMap.current.size === 0) {
    schema.pages.forEach((page) => {
      page.fields.forEach((field) => {
        fieldMap.current.set(field.name, field);
      });
    });
  }
  const isSuggestionExpired = useCallback((suggestion) => {
    if (!suggestion.expiresAt) return false;
    return Date.now() > suggestion.expiresAt;
  }, []);
  const createSuggestionState = useCallback((fieldId, result, currentUserValue) => {
    var _a;
    const field = fieldMap.current.get(fieldId);
    const ttl = ((_a = field == null ? void 0 : field.suggest) == null ? void 0 : _a.ttl) || 3600;
    return {
      userValue: currentUserValue,
      suggestedValue: result.suggestedValue,
      originalSuggestedValue: result.suggestedValue,
      activeValue: "user",
      // Default to user value initially
      suggestedValueModified: false,
      status: "available",
      confidence: result.confidence || 0,
      reason: result.reason || "",
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl * 1e3,
      source: result.source
    };
  }, []);
  const requestSuggestion = useCallback(async (fieldId) => {
    if (!onSuggest) {
      return null;
    }
    const field = fieldMap.current.get(fieldId);
    if (!field || !field.suggest) {
      return null;
    }
    const currentValue = formState.getValue(fieldId);
    const allValues = formState.values;
    const pending = pendingRef.current.get(fieldId);
    if (pending) {
      return await pending;
    }
    const currentSuggestion = formState.getSuggestionState(fieldId);
    if (currentSuggestion) {
      __spreadProps(__spreadValues({}, currentSuggestion), {
        status: "loading"
      });
    }
    const promise = onSuggest(fieldId, currentValue, allValues);
    pendingRef.current.set(fieldId, promise);
    try {
      const result = await promise;
      const minConfidence = field.suggest.minConfidence || 0.7;
      if (result.confidence !== void 0 && result.confidence < minConfidence) {
        return null;
      }
      return result;
    } catch (error) {
      console.error(`Error getting suggestion for ${fieldId}:`, error);
      return null;
    } finally {
      pendingRef.current.delete(fieldId);
    }
  }, [onSuggest, formState]);
  const applySuggestionResult = useCallback((fieldId, result) => {
    const field = fieldMap.current.get(fieldId);
    if (!field) return;
    const currentUserValue = formState.getValue(fieldId);
    createSuggestionState(fieldId, result, currentUserValue);
  }, [formState, createSuggestionState]);
  const shouldTriggerSuggestion = useCallback((fieldId, newValue) => {
    const field = fieldMap.current.get(fieldId);
    if (!field || !field.suggest) {
      return false;
    }
    const currentSuggestion = formState.getSuggestionState(fieldId);
    if ((currentSuggestion == null ? void 0 : currentSuggestion.status) === "loading" || (currentSuggestion == null ? void 0 : currentSuggestion.status) === "expecting") {
      return false;
    }
    if (currentSuggestion && !isSuggestionExpired(currentSuggestion)) {
      return false;
    }
    if (newValue === void 0 || newValue === null || newValue === "") {
      return false;
    }
    return true;
  }, [formState, isSuggestionExpired]);
  const handleFieldChange = useCallback(async (fieldId, newValue) => {
    if (!shouldTriggerSuggestion(fieldId, newValue)) {
      return;
    }
    const result = await requestSuggestion(fieldId);
    if (result) {
      applySuggestionResult(fieldId, result);
    }
  }, [shouldTriggerSuggestion, requestSuggestion, applySuggestionResult]);
  const triggerDependentSuggestions = useCallback(async (fieldId) => {
    const dependentFields = [];
    fieldMap.current.forEach((field, fid) => {
      var _a;
      if (((_a = field.dependsOn) == null ? void 0 : _a.includes(fieldId)) && field.suggest) {
        dependentFields.push(fid);
      }
    });
    dependentFields.forEach((fid) => {
      formState.getSuggestionState(fid);
    });
    await Promise.all(
      dependentFields.map((fid) => requestSuggestion(fid))
    );
  }, [formState, requestSuggestion]);
  const clearExpiredSuggestions = useCallback(() => {
    fieldMap.current.forEach((_, fieldId) => {
      const suggestion = formState.getSuggestionState(fieldId);
      if (suggestion && isSuggestionExpired(suggestion)) ;
    });
  }, [formState, isSuggestionExpired]);
  const getFieldsWithSuggestions = useCallback(() => {
    const fields2 = [];
    fieldMap.current.forEach((_, fieldId) => {
      const suggestion = formState.getSuggestionState(fieldId);
      if (suggestion && suggestion.status !== "none" && !isSuggestionExpired(suggestion)) {
        fields2.push(fieldId);
      }
    });
    return fields2;
  }, [formState, isSuggestionExpired]);
  const getSuggestionStats = useCallback(() => {
    let total = 0;
    let available = 0;
    let accepted = 0;
    let dismissed = 0;
    let loading = 0;
    fieldMap.current.forEach((_, fieldId) => {
      const suggestion = formState.getSuggestionState(fieldId);
      if (suggestion && suggestion.status !== "none") {
        total++;
        switch (suggestion.status) {
          case "available":
          case "reviewing":
            available++;
            break;
          case "accepted":
            accepted++;
            break;
          case "dismissed":
            dismissed++;
            break;
          case "loading":
          case "expecting":
            loading++;
            break;
        }
      }
    });
    return { total, available, accepted, dismissed, loading };
  }, [formState]);
  return {
    requestSuggestion,
    applySuggestionResult,
    handleFieldChange,
    triggerDependentSuggestions,
    clearExpiredSuggestions,
    getFieldsWithSuggestions,
    getSuggestionStats
  };
}
function useBackgroundJob(options) {
  const {
    schema,
    formState,
    onJobProgress,
    onJobCancel,
    onBulkSuggest,
    pollInterval = 2e3,
    blocking = false
  } = options;
  const [currentJob, setCurrentJob] = useState(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const pollTimerRef = useRef(void 0);
  const processedUpdatesRef = useRef(/* @__PURE__ */ new Set());
  const startBulkSuggest = useCallback(async (files) => {
    if (!onBulkSuggest) {
      return null;
    }
    try {
      const response = await onBulkSuggest(files, schema, formState.values);
      if (response.immediate) {
        Object.entries(response.immediate.suggestions).forEach(([fieldId, suggestion]) => {
          const currentUserValue = formState.getValue(fieldId);
          const suggestionState = {
            userValue: currentUserValue,
            suggestedValue: suggestion.suggestedValue,
            originalSuggestedValue: suggestion.suggestedValue,
            activeValue: "user",
            suggestedValueModified: false,
            status: "available",
            confidence: suggestion.confidence || 0,
            reason: suggestion.reason || "",
            timestamp: Date.now(),
            source: suggestion.source
          };
        });
        return null;
      }
      if (response.job) {
        const { jobId, affectedFields, estimatedDuration, estimatedFieldCount } = response.job;
        affectedFields.forEach((fieldId) => {
          const suggestionState = {
            userValue: formState.getValue(fieldId),
            suggestedValue: void 0,
            originalSuggestedValue: void 0,
            activeValue: "user",
            suggestedValueModified: false,
            status: "expecting",
            confidence: 0,
            reason: "Loading...",
            timestamp: Date.now()
          };
        });
        const job = {
          jobId,
          status: "queued",
          progress: 0,
          partialResults: {},
          fieldsCompleted: [],
          fieldsPending: affectedFields,
          startedAt: Date.now(),
          estimatedTimeRemaining: estimatedDuration
        };
        setCurrentJob(job);
        startPolling(jobId);
        if (blocking) {
          setIsBlocking(true);
        }
        return jobId;
      }
      return null;
    } catch (error) {
      console.error("Error starting bulk suggest:", error);
      return null;
    }
  }, [onBulkSuggest, schema, formState, blocking]);
  const pollJob = useCallback(async (jobId) => {
    if (!onJobProgress) {
      return;
    }
    try {
      const job = await onJobProgress(jobId);
      setCurrentJob(job);
      if (job.newUpdates) {
        job.newUpdates.forEach((update) => {
          const updateKey = `${jobId}:${update.fieldId}:${update.timestamp}`;
          if (processedUpdatesRef.current.has(updateKey)) {
            return;
          }
          const suggestionState = {
            userValue: formState.getValue(update.fieldId),
            suggestedValue: update.value,
            originalSuggestedValue: update.value,
            activeValue: "user",
            suggestedValueModified: false,
            status: "available",
            confidence: update.confidence,
            reason: "",
            timestamp: update.timestamp
          };
          processedUpdatesRef.current.add(updateKey);
        });
      }
      job.fieldsCompleted.forEach((fieldId) => {
        const value = job.partialResults[fieldId];
        if (value !== void 0) {
          const currentSuggestion = formState.getSuggestionState(fieldId);
          if (currentSuggestion && currentSuggestion.status === "expecting") {
            const updatedState = __spreadProps(__spreadValues({}, currentSuggestion), {
              suggestedValue: value,
              originalSuggestedValue: value,
              status: "available"
            });
          }
        }
      });
      if (job.status === "completed" || job.status === "failed" || job.status === "cancelled") {
        stopPolling();
        setIsBlocking(false);
        processedUpdatesRef.current.clear();
        job.fieldsPending.forEach((fieldId) => {
          var _a;
          const currentSuggestion = formState.getSuggestionState(fieldId);
          if (currentSuggestion && currentSuggestion.status === "expecting") {
            const updatedState = __spreadProps(__spreadValues({}, currentSuggestion), {
              status: job.status === "failed" ? "none" : "available",
              error: (_a = job.errors) == null ? void 0 : _a[fieldId]
            });
          }
        });
      }
    } catch (error) {
      console.error("Error polling job:", error);
      stopPolling();
      setIsBlocking(false);
    }
  }, [onJobProgress, formState]);
  const startPolling = useCallback((jobId) => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
    pollTimerRef.current = setInterval(() => {
      pollJob(jobId);
    }, pollInterval);
    pollJob(jobId);
  }, [pollJob, pollInterval]);
  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = void 0;
    }
  }, []);
  const cancelJob = useCallback(async (jobId) => {
    if (!onJobCancel) {
      console.warn("onJobCancel not provided");
      return;
    }
    try {
      await onJobCancel(jobId);
      setCurrentJob((prev) => {
        if (prev && prev.jobId === jobId) {
          return __spreadProps(__spreadValues({}, prev), {
            status: "cancelled"
          });
        }
        return prev;
      });
      stopPolling();
      setIsBlocking(false);
      if (currentJob) {
        [...currentJob.fieldsCompleted, ...currentJob.fieldsPending].forEach((fieldId) => {
          const suggestion = formState.getSuggestionState(fieldId);
          if (suggestion && (suggestion.status === "expecting" || suggestion.status === "loading")) {
            const updatedState = __spreadProps(__spreadValues({}, suggestion), {
              status: "none"
            });
          }
        });
      }
    } catch (error) {
      console.error("Error cancelling job:", error);
    }
  }, [onJobCancel, currentJob, formState, stopPolling]);
  const resumeJob = useCallback(async (jobId) => {
    if (!onJobProgress) {
      console.warn("onJobProgress not provided, cannot resume job");
      return;
    }
    try {
      const job = await onJobProgress(jobId);
      setCurrentJob(job);
      if (job.status === "queued" || job.status === "processing") {
        startPolling(jobId);
        if (blocking) {
          setIsBlocking(true);
        }
      }
    } catch (error) {
      console.error("Error resuming job:", error);
    }
  }, [onJobProgress, startPolling, blocking]);
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);
  const jobInfo = currentJob ? {
    jobId: currentJob.jobId,
    status: currentJob.status,
    progress: currentJob.progress,
    fieldsCompleted: currentJob.fieldsCompleted.length,
    fieldsPending: currentJob.fieldsPending.length,
    estimatedTimeRemaining: currentJob.estimatedTimeRemaining,
    isActive: currentJob.status === "queued" || currentJob.status === "processing"
  } : null;
  return {
    currentJob,
    jobInfo,
    isBlocking,
    startBulkSuggest,
    cancelJob,
    resumeJob
  };
}
var Renderer = React3__default.forwardRef((props, ref) => {
  var _a;
  const {
    schema,
    onSubmit,
    formStateRef,
    features = {},
    maxHistorySize = 50,
    onSuggest,
    onBulkSuggest,
    onJobProgress,
    onJobCancel,
    onSaveDraft,
    initialValues,
    initialJobId,
    onDirtyStateChange,
    onUndo,
    onRedo,
    renderField,
    renderPage,
    renderProgress,
    renderNavigation
  } = props;
  const {
    stateManagement = true,
    autoSave,
    backgroundJobs
  } = features;
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = schema.pages[currentPageIndex];
  const justNavigatedRef = useRef(false);
  const formElementRef = useRef(null);
  const formState = useFormState({
    schema,
    initialValues,
    maxHistorySize,
    onDirtyStateChange
  });
  const validation = useValidation({
    schema,
    formState
  });
  const suggestions = useSuggestions({
    schema,
    formState,
    onSuggest
  });
  const backgroundJob = useBackgroundJob({
    schema,
    formState,
    onJobProgress,
    onJobCancel,
    onBulkSuggest,
    pollInterval: (backgroundJobs == null ? void 0 : backgroundJobs.pollInterval) || 2e3,
    blocking: (backgroundJobs == null ? void 0 : backgroundJobs.blocking) || false
  });
  useEffect(() => {
    if (!(autoSave == null ? void 0 : autoSave.enabled) || !onSaveDraft) {
      return;
    }
    const interval = setInterval(() => {
      if (formState.isDirty) {
        const changes = formState.getChanges();
        onSaveDraft(formState.values, changes).then(() => {
          formState.markClean();
        }).catch((error) => {
          console.error("Auto-save failed:", error);
        });
      }
    }, (autoSave.interval || 30) * 1e3);
    return () => clearInterval(interval);
  }, [autoSave, onSaveDraft, formState]);
  useEffect(() => {
    if (initialJobId && backgroundJob.resumeJob) {
      backgroundJob.resumeJob(initialJobId);
    }
  }, [initialJobId, backgroundJob]);
  useEffect(() => {
    const interval = setInterval(() => {
      suggestions.clearExpiredSuggestions();
    }, 6e4);
    return () => clearInterval(interval);
  }, [suggestions]);
  const handleFieldChange = useCallback(async (fieldId, value, fieldType) => {
    let convertedValue = value;
    if (fieldType === "number" && value !== "" && value !== null) {
      convertedValue = Number(value);
    }
    formState.setValue(fieldId, convertedValue, "user");
    await validation.validateFieldDebounced(fieldId);
    await suggestions.handleFieldChange(fieldId, value);
    await validation.validateDependentFields(fieldId);
    await suggestions.triggerDependentSuggestions(fieldId);
  }, [formState, validation, suggestions]);
  const handleNextPage = useCallback(async () => {
    const pageValidation = await validation.validatePage(currentPage.id);
    let hasBlockingErrors = false;
    pageValidation.forEach((result) => {
      if (!result.valid && result.blocking) {
        hasBlockingErrors = true;
      }
    });
    if (hasBlockingErrors) {
      return;
    }
    if (currentPageIndex < schema.pages.length - 1) {
      justNavigatedRef.current = true;
      setCurrentPageIndex((prev) => prev + 1);
      window.scrollTo(0, 0);
      setTimeout(() => {
        justNavigatedRef.current = false;
      }, 100);
    }
  }, [currentPageIndex, schema.pages.length, currentPage, validation]);
  const handlePrevPage = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  }, [currentPageIndex]);
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (justNavigatedRef.current) {
      return;
    }
    if (currentPageIndex < schema.pages.length - 1) {
      return;
    }
    const allValidation = await validation.validateAll();
    let hasBlockingErrors = false;
    allValidation.forEach((result) => {
      if (!result.valid && result.blocking) {
        hasBlockingErrors = true;
      }
    });
    if (hasBlockingErrors) {
      console.warn("Form has validation errors");
      return;
    }
    const crossFieldValidation = await validation.validateCrossField();
    if (crossFieldValidation.size > 0) {
      let hasCrossFieldErrors = false;
      crossFieldValidation.forEach((result) => {
        if (!result.valid && result.blocking) {
          hasCrossFieldErrors = true;
        }
      });
      if (hasCrossFieldErrors) {
        console.warn("Form has cross-field validation errors");
        return;
      }
    }
    try {
      await onSubmit(formState.values);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  }, [formState, validation, onSubmit, currentPageIndex, schema.pages.length]);
  useImperativeHandle(formStateRef || ref, () => __spreadProps(__spreadValues({}, formState), {
    navigation: {
      currentPageIndex,
      totalPages: schema.pages.length,
      onPrevious: handlePrevPage,
      onNext: handleNextPage,
      canGoPrevious: currentPageIndex > 0,
      canGoNext: currentPageIndex < schema.pages.length - 1,
      isLastPage: currentPageIndex === schema.pages.length - 1
    },
    submit: () => {
      var _a2;
      (_a2 = formElementRef.current) == null ? void 0 : _a2.requestSubmit();
    }
  }), [formState, currentPageIndex, schema.pages.length, handlePrevPage, handleNextPage]);
  useCallback(async (files) => {
    if (!onBulkSuggest) {
      return;
    }
    const jobId = await backgroundJob.startBulkSuggest(files);
    if (jobId) {
      console.log("Started bulk suggestion job:", jobId);
    }
  }, [onBulkSuggest, backgroundJob]);
  const renderFieldDefault = useCallback((field, value) => {
    var _a2;
    return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs("label", { htmlFor: field.name, className: "block text-sm font-medium", children: [
        field.label,
        field.required && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      field.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: field.description }),
      field.type === "textarea" ? /* @__PURE__ */ jsx(
        "textarea",
        {
          id: field.name,
          name: field.name,
          value: value || "",
          onChange: (e) => handleFieldChange(field.name, e.target.value, field.type),
          className: "w-full px-3 py-2 border rounded-md",
          required: field.required,
          rows: 4
        }
      ) : /* @__PURE__ */ jsx(
        "input",
        {
          id: field.name,
          name: field.name,
          type: field.type === "email" ? "email" : field.type === "number" ? "number" : "text",
          value: value || "",
          onChange: (e) => handleFieldChange(field.name, e.target.value, field.type),
          className: "w-full px-3 py-2 border rounded-md",
          required: field.required
        }
      ),
      formState.errors[field.name] && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-500", children: formState.errors[field.name] }),
      ((_a2 = formState.getSuggestionState(field.name)) == null ? void 0 : _a2.status) === "available" && /* @__PURE__ */ jsx("div", { className: "text-sm text-blue-500", children: "\u{1F4A1} Suggestion available" })
    ] }, field.id);
  }, [formState, handleFieldChange]);
  const renderPageDefault = useCallback((page, children) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      page.title && /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: page.title }),
      page.description && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: page.description }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
    ] });
  }, []);
  const renderProgressDefault = useCallback((current, total, progress2) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "Step ",
          current,
          " of ",
          total
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          Math.round(progress2),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-blue-500 transition-all duration-300",
          style: { width: `${progress2}%` }
        }
      ) })
    ] });
  }, []);
  useCallback((page) => {
    return true;
  }, []);
  const renderFields = useCallback(() => {
    if (!currentPage) {
      return /* @__PURE__ */ jsx("div", { children: "No page defined" });
    }
    return currentPage.fields.map((field) => {
      if (field.showIf) {
        if (typeof field.showIf === "function") {
          if (!field.showIf(formState.values)) {
            return null;
          }
        }
      }
      const value = formState.getValue(field.name);
      if (renderField) {
        return renderField(field, value, (newValue) => handleFieldChange(field.name, newValue));
      }
      return renderFieldDefault(field, value);
    });
  }, [currentPage, formState, renderField, renderFieldDefault, handleFieldChange]);
  const progress = (currentPageIndex + 1) / schema.pages.length * 100;
  return /* @__PURE__ */ jsxs("div", { className: "w-full min-h-full flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-6 pt-6", children: [
      renderProgress ? renderProgress(currentPageIndex + 1, schema.pages.length, progress) : renderProgressDefault(currentPageIndex + 1, schema.pages.length, progress),
      ((_a = backgroundJob.jobInfo) == null ? void 0 : _a.isActive) && /* @__PURE__ */ jsxs("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Analyzing your files..." }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              backgroundJob.jobInfo.fieldsCompleted,
              " of",
              " ",
              backgroundJob.jobInfo.fieldsCompleted + backgroundJob.jobInfo.fieldsPending,
              " fields completed"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
              Math.round(backgroundJob.jobInfo.progress * 100),
              "%"
            ] }),
            backgroundJob.jobInfo.estimatedTimeRemaining && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "~",
              Math.round(backgroundJob.jobInfo.estimatedTimeRemaining / 60),
              "m remaining"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => backgroundJob.jobInfo && backgroundJob.cancelJob(backgroundJob.jobInfo.jobId),
            className: "text-sm text-red-500 hover:text-red-700",
            children: "Cancel"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { ref: formElementRef, onSubmit: handleSubmit, className: "flex-1 flex flex-col px-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: renderPage ? renderPage(currentPage, renderFields()) : renderPageDefault(currentPage, renderFields()) }),
      renderNavigation ? renderNavigation({
        currentPageIndex,
        totalPages: schema.pages.length,
        onPrevious: handlePrevPage,
        onNext: handleNextPage,
        canGoPrevious: currentPageIndex > 0,
        canGoNext: currentPageIndex < schema.pages.length - 1,
        isLastPage: currentPageIndex === schema.pages.length - 1
      }) : /* @__PURE__ */ jsxs("div", { className: "flex justify-between mt-8 py-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handlePrevPage,
            disabled: currentPageIndex === 0,
            className: "px-4 py-2 border rounded-md disabled:opacity-50",
            children: "Previous"
          }
        ),
        currentPageIndex < schema.pages.length - 1 ? /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleNextPage,
            className: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600",
            children: "Next"
          }
        ) : /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600",
            children: "Submit"
          }
        )
      ] })
    ] })
  ] });
});
Renderer.displayName = "Renderer";
function ShadcnRenderer(_a) {
  var _b = _a, { className, title, description } = _b, props = __objRest(_b, ["className", "title", "description"]);
  const [navProps, setNavProps] = React3.useState(null);
  const rendererRef = React3.useRef(null);
  const pendingNavProps = React3.useRef(null);
  const renderField = React3.useCallback((field, value, onChange) => {
    return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxs(Label, { htmlFor: field.name, children: [
        field.label,
        field.required && /* @__PURE__ */ jsx("span", { className: "text-destructive ml-1", children: "*" })
      ] }),
      field.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: field.description }),
      renderFieldInput(field, value, onChange)
    ] }, field.id);
  }, []);
  const renderFieldInput = (field, value, onChange) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i;
    const placeholder = ((_a2 = field.config) == null ? void 0 : _a2.placeholder) || ((_b2 = field.config) == null ? void 0 : _b2.placeholderText);
    const options = ((_c = field.config) == null ? void 0 : _c.options) || [];
    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return /* @__PURE__ */ jsx(
          Input,
          {
            id: field.name,
            name: field.name,
            type: field.type,
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            placeholder,
            required: field.required
          }
        );
      case "number":
        return /* @__PURE__ */ jsx(
          Input,
          {
            id: field.name,
            name: field.name,
            type: "number",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            placeholder,
            required: field.required,
            min: (_d = field.validation) == null ? void 0 : _d.min,
            max: (_e = field.validation) == null ? void 0 : _e.max
          }
        );
      case "textarea":
        return /* @__PURE__ */ jsx(
          Textarea,
          {
            id: field.name,
            name: field.name,
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            placeholder,
            required: field.required,
            rows: 4
          }
        );
      case "select":
        return /* @__PURE__ */ jsxs(Select, { value: value || "", onValueChange: onChange, children: [
          /* @__PURE__ */ jsx(SelectTrigger, { id: field.name, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: placeholder || "Select an option" }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: options == null ? void 0 : options.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
        ] });
      case "radio":
        return /* @__PURE__ */ jsx(RadioGroup, { value: value || "", onValueChange: onChange, children: options == null ? void 0 : options.map((option) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(RadioGroupItem, { value: option.value, id: `${field.name}-${option.value}` }),
          /* @__PURE__ */ jsx(Label, { htmlFor: `${field.name}-${option.value}`, className: "font-normal", children: option.label })
        ] }, option.value)) });
      case "checkbox":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Checkbox,
            {
              id: field.name,
              checked: !!value,
              onCheckedChange: onChange
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: field.name, className: "font-normal", children: placeholder || "Check this box" })
        ] });
      case "switch":
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(
            Switch,
            {
              id: field.name,
              checked: !!value,
              onCheckedChange: onChange
            }
          ),
          /* @__PURE__ */ jsx(Label, { htmlFor: field.name, className: "font-normal", children: placeholder || "Toggle" })
        ] });
      case "slider":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            Slider,
            {
              id: field.name,
              value: [value || ((_f = field.validation) == null ? void 0 : _f.min) || 0],
              onValueChange: (vals) => onChange(vals[0]),
              min: ((_g = field.validation) == null ? void 0 : _g.min) || 0,
              max: ((_h = field.validation) == null ? void 0 : _h.max) || 100,
              step: 1
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground text-center", children: value || ((_i = field.validation) == null ? void 0 : _i.min) || 0 })
        ] });
      case "date":
        return /* @__PURE__ */ jsxs(Popover, { children: [
          /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              ),
              children: [
                /* @__PURE__ */ jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }),
                value ? format(new Date(value), "PPP") : /* @__PURE__ */ jsx("span", { children: "Pick a date" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", children: /* @__PURE__ */ jsx(
            Calendar,
            {
              mode: "single",
              selected: value ? new Date(value) : void 0,
              onSelect: (date) => onChange(date == null ? void 0 : date.toISOString()),
              initialFocus: true
            }
          ) })
        ] });
      case "file":
        return /* @__PURE__ */ jsx(
          Input,
          {
            id: field.name,
            name: field.name,
            type: "file",
            onChange: (e) => {
              var _a3;
              const file = (_a3 = e.target.files) == null ? void 0 : _a3[0];
              onChange(file);
            },
            required: field.required
          }
        );
      default:
        return /* @__PURE__ */ jsx(
          Input,
          {
            id: field.name,
            name: field.name,
            type: "text",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            placeholder,
            required: field.required
          }
        );
    }
  };
  const renderPage = React3.useCallback((page, children) => {
    if (!page) {
      return /* @__PURE__ */ jsx("div", { className: "space-y-4", children });
    }
    return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      page.title && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: page.title }),
        page.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: page.description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
    ] });
  }, []);
  const renderProgress = React3.useCallback(() => null, []);
  const renderNavigation = React3.useCallback((props2) => {
    pendingNavProps.current = props2;
    return null;
  }, []);
  React3.useLayoutEffect(() => {
    const pending = pendingNavProps.current;
    if (pending && (!navProps || pending.currentPageIndex !== navProps.currentPageIndex || pending.totalPages !== navProps.totalPages || pending.isLastPage !== navProps.isLastPage)) {
      setNavProps(pending);
    }
  });
  const handleToolbarSubmit = React3.useCallback(() => {
    var _a2;
    (_a2 = rendererRef.current) == null ? void 0 : _a2.submit();
  }, []);
  const progress = navProps ? navProps.currentPageIndex / Math.max(navProps.totalPages - 1, 1) * 100 : 0;
  return /* @__PURE__ */ jsxs("div", { className: cn("w-full h-full flex flex-col", className), children: [
    (title || description) && /* @__PURE__ */ jsxs("div", { className: "shrink-0 px-6 py-4 border-b bg-background", children: [
      title && /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsx(
      Renderer,
      __spreadProps(__spreadValues({}, props), {
        ref: rendererRef,
        renderField,
        renderPage,
        renderProgress,
        renderNavigation
      })
    ) }),
    navProps && /* @__PURE__ */ jsx("div", { className: "shrink-0 px-6 py-4 border-t bg-background", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: navProps.onPrevious,
          disabled: !navProps.canGoPrevious,
          className: `w-32 ${!navProps.canGoPrevious ? "invisible" : ""}`,
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "mr-2 h-4 w-4" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-primary transition-all duration-300",
          style: { width: `${progress}%` }
        }
      ) }),
      navProps.isLastPage ? /* @__PURE__ */ jsxs(Button, { type: "button", onClick: handleToolbarSubmit, className: "w-32", children: [
        "Submit",
        /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 h-4 w-4" })
      ] }) : /* @__PURE__ */ jsxs(Button, { type: "button", onClick: navProps.onNext, className: "w-32", children: [
        "Next",
        /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 h-4 w-4" })
      ] })
    ] }) })
  ] });
}
function ShadcnViewer({
  pages,
  submissionData,
  mode = "detailed",
  showValidation = true,
  showFieldTypes = true,
  showPageNavigation = true,
  showMetadata = false,
  className,
  title,
  description
}) {
  const [currentPageIndex, setCurrentPageIndex] = React3.useState(0);
  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length;
  const canGoPrevious = currentPageIndex > 0;
  const canGoNext = currentPageIndex < totalPages - 1;
  const isLastPage = currentPageIndex === totalPages - 1;
  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    if (canGoNext) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };
  const progress = totalPages > 1 ? currentPageIndex / (totalPages - 1) * 100 : 100;
  return /* @__PURE__ */ jsxs("div", { className: cn("w-full h-full flex flex-col", className), children: [
    (title || description) && /* @__PURE__ */ jsxs("div", { className: "shrink-0 px-6 py-4 border-b bg-background", children: [
      title && /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsx("div", { className: "p-6", children: currentPage && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      mode === "detailed" && /* @__PURE__ */ jsx("div", { className: "space-y-1", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: currentPage.title || `Page ${currentPageIndex + 1}` }) }),
      currentPage.fields.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-muted-foreground", children: "No fields in this page" }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: currentPage.fields.map((field) => /* @__PURE__ */ jsx(
        FieldView,
        {
          field,
          value: submissionData == null ? void 0 : submissionData[field.name],
          showType: showFieldTypes,
          showValidation
        },
        field.id
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "shrink-0 px-6 py-4 border-t bg-background", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handlePrevious,
          disabled: !canGoPrevious,
          className: `w-32 ${!canGoPrevious ? "invisible" : ""}`,
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "mr-2 h-4 w-4" }),
            "Previous"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-full bg-primary transition-all duration-300",
          style: { width: `${progress}%` }
        }
      ) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          onClick: handleNext,
          disabled: isLastPage,
          className: `w-32 ${isLastPage ? "invisible" : ""}`,
          children: [
            "Next",
            /* @__PURE__ */ jsx(ChevronRight, { className: "ml-2 h-4 w-4" })
          ]
        }
      )
    ] }) })
  ] });
}
function FieldView({
  field,
  value,
  showType,
  showValidation
}) {
  const displayValue = value !== void 0 && value !== null && value !== "" ? String(value) : "\u2014";
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2 p-4 rounded-lg border bg-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs(Label, { className: "text-sm font-medium", children: [
        field.label,
        field.required && /* @__PURE__ */ jsx("span", { className: "text-destructive ml-1", children: "*" })
      ] }),
      showType && /* @__PURE__ */ jsx("span", { className: "text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground", children: field.type })
    ] }),
    field.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: field.description }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-foreground", children: displayValue }),
    showValidation && field.validation && /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
      field.validation.min !== void 0 && /* @__PURE__ */ jsxs("span", { children: [
        "Min: ",
        field.validation.min,
        " "
      ] }),
      field.validation.max !== void 0 && /* @__PURE__ */ jsxs("span", { children: [
        "Max: ",
        field.validation.max,
        " "
      ] }),
      field.validation.pattern && /* @__PURE__ */ jsxs("span", { children: [
        "Pattern: ",
        field.validation.pattern
      ] })
    ] })
  ] });
}

// components/shorms/viewer/utils.ts
function formatFieldValue(field, value) {
  if (value === null || value === void 0 || value === "") {
    return "(No value provided)";
  }
  switch (field.type) {
    case "CHECKBOX" /* CHECKBOX */:
    case "SWITCH" /* SWITCH */:
      return value ? "\u2713 Yes" : "\u2717 No";
    case "DATE" /* DATE */:
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return String(value);
      }
    case "FILE_UPLOAD" /* FILE_UPLOAD */:
      if (typeof value === "object" && value.name) {
        const size = value.size ? ` (${formatFileSize(value.size)})` : "";
        return `${value.name}${size}`;
      }
      return String(value);
    case "SELECT" /* SELECT */:
    case "RADIO_GROUP" /* RADIO_GROUP */:
    case "COMBOBOX" /* COMBOBOX */:
      const choices = field.choices || field.options;
      if (choices && Array.isArray(choices)) {
        const option = choices.find((opt) => opt.value === value);
        if (option) {
          return option.label;
        }
      }
      return String(value);
    case "SLIDER" /* SLIDER */:
    case "NUMBER_INPUT" /* NUMBER_INPUT */:
      return typeof value === "number" ? value.toLocaleString() : String(value);
    case "INPUT" /* INPUT */:
    case "TEXTAREA" /* TEXTAREA */:
    case "EMAIL" /* EMAIL */:
    default:
      return String(value);
  }
}
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}
function getValidationSummary(validation) {
  if (!validation) return [];
  const rules = [];
  if (validation.required) {
    rules.push("Required");
  }
  if (validation.min !== void 0) {
    rules.push(`Min: ${validation.min}`);
  }
  if (validation.max !== void 0) {
    rules.push(`Max: ${validation.max}`);
  }
  if (validation.regex) {
    rules.push(`Pattern: ${validation.regex}`);
  }
  if (validation.maxFileSize) {
    rules.push(`Max file size: ${validation.maxFileSize}MB`);
  }
  if (validation.errorMessage) {
    rules.push(`Error: ${validation.errorMessage}`);
  }
  return rules;
}
function getFormStatistics(pages) {
  const stats = {
    totalPages: pages.length,
    totalFields: 0,
    requiredFields: 0,
    fieldTypes: {}
  };
  pages.forEach((page) => {
    page.fields.forEach((field) => {
      var _a;
      stats.totalFields++;
      if ((_a = field.validation) == null ? void 0 : _a.required) {
        stats.requiredFields++;
      }
      const fieldType = field.type;
      stats.fieldTypes[fieldType] = (stats.fieldTypes[fieldType] || 0) + 1;
    });
  });
  return stats;
}
function getFieldTypeLabel(fieldType) {
  const labels = {
    ["INPUT" /* INPUT */]: "Text Input",
    ["TEXTAREA" /* TEXTAREA */]: "Textarea",
    ["EMAIL" /* EMAIL */]: "Email",
    ["NUMBER_INPUT" /* NUMBER_INPUT */]: "Number",
    ["CHECKBOX" /* CHECKBOX */]: "Checkbox",
    ["SELECT" /* SELECT */]: "Select",
    ["RADIO_GROUP" /* RADIO_GROUP */]: "Radio Group",
    ["SLIDER" /* SLIDER */]: "Slider",
    ["DATE" /* DATE */]: "Date",
    ["SWITCH" /* SWITCH */]: "Switch",
    ["FILE_UPLOAD" /* FILE_UPLOAD */]: "File Upload",
    ["COMBOBOX" /* COMBOBOX */]: "Combobox"
  };
  return labels[fieldType] || fieldType;
}
function formatDate(dateString) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString();
  } catch (e) {
    return dateString;
  }
}
function getWidthClass(width) {
  const widthMap = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "w-full"
  };
  return widthMap[width || "lg"];
}
function FieldDisplay({
  field,
  value,
  mode,
  showValidation,
  showFieldType
}) {
  var _a, _b, _c;
  const validationRules = getValidationSummary(field.validation);
  const hasValue = value !== void 0 && value !== null && value !== "";
  if (mode === "summary") {
    return /* @__PURE__ */ jsxs("div", { className: "py-1 text-sm", children: [
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: field.label }),
      ((_a = field.validation) == null ? void 0 : _a.required) && /* @__PURE__ */ jsx("span", { className: "text-red-500 ml-1", children: "*" })
    ] });
  }
  if (mode === "compact") {
    return /* @__PURE__ */ jsx("div", { className: "py-2 border-b border-gray-200 last:border-b-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: field.label }),
          ((_b = field.validation) == null ? void 0 : _b.required) && /* @__PURE__ */ jsx("span", { className: "text-red-500 text-xs", children: "*" }),
          showFieldType && /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded", children: getFieldTypeLabel(field.type) })
        ] }),
        showValidation && validationRules.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600", children: validationRules.join(" \u2022 ") })
      ] }),
      hasValue && /* @__PURE__ */ jsx("div", { className: "text-sm font-mono bg-blue-50 px-3 py-1 rounded border border-blue-200", children: formatFieldValue(field, value) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "p-4 border border-gray-200 rounded-lg mb-4 bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: [
          field.label,
          ((_c = field.validation) == null ? void 0 : _c.required) && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        field.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mt-1", children: field.description })
      ] }),
      showFieldType && /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded", children: getFieldTypeLabel(field.type) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
      field.placeholder && /* @__PURE__ */ jsxs("div", { className: "text-gray-600", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Placeholder:" }),
        " ",
        field.placeholder
      ] }),
      showValidation && validationRules.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "Validation:" }),
        /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside ml-2 mt-1 text-gray-600", children: validationRules.map((rule, idx) => /* @__PURE__ */ jsx("li", { children: rule }, idx)) })
      ] }),
      (() => {
        const choices = field.choices || field.options;
        if (choices && choices.length > 0) {
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "Options:" }),
            /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside ml-2 mt-1 text-gray-600", children: choices.map((option, idx) => /* @__PURE__ */ jsxs("li", { children: [
              option.label,
              " (",
              option.value,
              ")"
            ] }, idx)) })
          ] });
        }
        return null;
      })(),
      hasValue && /* @__PURE__ */ jsxs("div", { className: "mt-3 pt-3 border-t border-gray-200", children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: "Submitted Value:" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 p-3 bg-blue-50 border border-blue-200 rounded font-mono text-blue-900", children: formatFieldValue(field, value) })
      ] }),
      !hasValue && value !== void 0 && /* @__PURE__ */ jsx("div", { className: "mt-3 pt-3 border-t border-gray-200", children: /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-500", children: "No value submitted" }) })
    ] })
  ] });
}
function Viewer({
  pages,
  submissionData,
  mode = "detailed",
  showValidation = true,
  showFieldTypes = true,
  showPageNavigation = true,
  showMetadata = true,
  metadata,
  className = "",
  width = "lg",
  onPrevious,
  onNext,
  onSubmit,
  showToolbar = true
}) {
  const [activePage, setActivePage] = useState(0);
  const stats = getFormStatistics(pages);
  if (mode === "summary") {
    return /* @__PURE__ */ jsx("div", { className: `${getWidthClass(width)} mx-auto ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg border border-gray-200 p-6", children: [
      showMetadata && (metadata == null ? void 0 : metadata.title) && /* @__PURE__ */ jsxs("div", { className: "mb-6 pb-6 border-b border-gray-200", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900", children: metadata.title }),
        metadata.description && /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: metadata.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Form Statistics" }),
          /* @__PURE__ */ jsxs("dl", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { className: "text-sm text-gray-600", children: "Pages" }),
              /* @__PURE__ */ jsx("dd", { className: "text-2xl font-bold text-gray-900", children: stats.totalPages })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { className: "text-sm text-gray-600", children: "Total Fields" }),
              /* @__PURE__ */ jsx("dd", { className: "text-2xl font-bold text-gray-900", children: stats.totalFields })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { className: "text-sm text-gray-600", children: "Required Fields" }),
              /* @__PURE__ */ jsx("dd", { className: "text-2xl font-bold text-red-600", children: stats.requiredFields })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("dt", { className: "text-sm text-gray-600", children: "Optional Fields" }),
              /* @__PURE__ */ jsx("dd", { className: "text-2xl font-bold text-gray-900", children: stats.totalFields - stats.requiredFields })
            ] })
          ] })
        ] }),
        Object.keys(stats.fieldTypes).length > 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-md font-semibold text-gray-900 mb-2", children: "Field Types" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: Object.entries(stats.fieldTypes).map(([type, count2]) => /* @__PURE__ */ jsxs("li", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: getFieldTypeLabel(type) }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: count2 })
          ] }, type)) })
        ] }),
        showMetadata && /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-gray-200", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-md font-semibold text-gray-900 mb-2", children: "Information" }),
          /* @__PURE__ */ jsxs("dl", { className: "space-y-1 text-sm", children: [
            (metadata == null ? void 0 : metadata.createdAt) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-gray-600", children: "Created" }),
              /* @__PURE__ */ jsx("dd", { className: "text-gray-900", children: formatDate(metadata.createdAt) })
            ] }),
            (metadata == null ? void 0 : metadata.updatedAt) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-gray-600", children: "Last Updated" }),
              /* @__PURE__ */ jsx("dd", { className: "text-gray-900", children: formatDate(metadata.updatedAt) })
            ] }),
            (metadata == null ? void 0 : metadata.submittedAt) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-gray-600", children: "Submitted" }),
              /* @__PURE__ */ jsx("dd", { className: "text-gray-900", children: formatDate(metadata.submittedAt) })
            ] }),
            (metadata == null ? void 0 : metadata.submittedBy) && /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("dt", { className: "text-gray-600", children: "Submitted By" }),
              /* @__PURE__ */ jsx("dd", { className: "text-gray-900", children: metadata.submittedBy })
            ] })
          ] })
        ] })
      ] })
    ] }) });
  }
  const currentPage = pages[activePage];
  const shouldShowPageNav = showPageNavigation && pages.length > 1;
  return /* @__PURE__ */ jsx("div", { className: `${getWidthClass(width)} mx-auto ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg border border-gray-200", children: [
    showMetadata && metadata && /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-gray-200", children: [
      metadata.title && /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: metadata.title }),
      metadata.description && /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: metadata.description }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-gray-600", children: [
        metadata.createdAt && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Created:" }),
          " ",
          formatDate(metadata.createdAt)
        ] }),
        metadata.submittedAt && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Submitted:" }),
          " ",
          formatDate(metadata.submittedAt)
        ] }),
        metadata.submittedBy && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "By:" }),
          " ",
          metadata.submittedBy
        ] })
      ] })
    ] }),
    shouldShowPageNav && /* @__PURE__ */ jsx("div", { className: "px-6 pt-6", children: /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-2", children: pages.map((page, index) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActivePage(index),
        className: `px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${index === activePage ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
        children: [
          page.title || `Page ${index + 1}`,
          /* @__PURE__ */ jsxs("span", { className: "ml-2 text-xs opacity-75", children: [
            "(",
            page.fields.length,
            " fields)"
          ] })
        ]
      },
      page.id
    )) }) }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children: currentPage && /* @__PURE__ */ jsxs(Fragment, { children: [
      mode === "detailed" && /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: currentPage.title || `Page ${activePage + 1}` }),
      currentPage.fields.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-gray-500", children: "No fields in this page" }) : /* @__PURE__ */ jsx("div", { children: currentPage.fields.map((field) => /* @__PURE__ */ jsx(
        FieldDisplay,
        {
          field,
          value: submissionData == null ? void 0 : submissionData[field.name],
          mode,
          showValidation,
          showFieldType: showFieldTypes
        },
        field.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        stats.totalPages,
        " page",
        stats.totalPages !== 1 ? "s" : "",
        " \u2022",
        " ",
        stats.totalFields,
        " field",
        stats.totalFields !== 1 ? "s" : "",
        " \u2022",
        " ",
        stats.requiredFields,
        " required"
      ] }),
      shouldShowPageNav && /* @__PURE__ */ jsxs("div", { children: [
        "Page ",
        activePage + 1,
        " of ",
        pages.length
      ] })
    ] }) }),
    showToolbar && /* @__PURE__ */ jsx("div", { className: "px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            if (onPrevious) {
              onPrevious();
            } else if (activePage > 0) {
              setActivePage(activePage - 1);
            }
          },
          disabled: activePage === 0,
          className: `px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activePage === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
          children: "Previous"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            const isLastPage = activePage === pages.length - 1;
            if (isLastPage) {
              onSubmit == null ? void 0 : onSubmit();
            } else if (onNext) {
              onNext();
            } else {
              setActivePage(activePage + 1);
            }
          },
          className: "px-6 py-2 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors",
          children: activePage === pages.length - 1 ? "Submit" : "Next"
        }
      )
    ] }) })
  ] }) });
}

// index.ts
var Headless = {
  Builder,
  Renderer,
  Viewer
};

export { ShadcnBuilder as Builder, FieldDisplay, FieldLibrary, FieldType, FormContext, Headless, PageTabs, ShadcnRenderer as Renderer, SCHEMA_VERSION, SUPPORTED_FIELD_TYPES, SUPPORTED_VERSIONS, ShadcnViewer as Viewer, defaultFieldTemplates, ensureVersion, fieldCategories, formPagesToSchema, formatFieldValue, generateDefaultValues, generateZodSchema, getFieldTypeLabel, getFormStatistics, getUnsupportedFields, getValidationSummary, getZodSchemaString, isSupportedFieldType, migrateSchema, schemaToFormPages, useBuilderState, validateSchema, widthClasses };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map