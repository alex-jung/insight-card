// Shared ha-form schema types
export type HaSelector =
  | { boolean: Record<string, never> }
  | { number: { min?: number; max?: number; step?: number; mode?: "box" | "slider"; unit_of_measurement?: string } }
  | { text: { multiline?: boolean; type?: string } }
  | { select: { options: string[] | Array<{ value: string; label: string; description?: string; image?: string }>; mode?: "dropdown" | "list" | "box" } }
  | { entity: { domain?: string | string[]; device_class?: string | string[]; multiple?: boolean } }
  | { color_rgb: Record<string, never> };

export interface HaFormField {
  name: string;
  required?: boolean;
  selector: HaSelector;
}

export interface HaFormExpandable {
  type: "expandable";
  name: string;
  title: string;
  schema: HaFormField[];
}

export interface HaFormGrid {
  type: "grid";
  name: string;
  column_min_width?: string;
  schema: HaFormField[];
}

export type HaFormSchema = HaFormField | HaFormExpandable | HaFormGrid;

export function buildEntitySchema(style: string): HaFormSchema[] {
  const isArea = style === "area";
    return [
    {
      name: "entity",
      selector: { entity: {} },
    },
    {
      name: "name",
      selector: { text: {} },
    },
    {
      name: "y_axis",
      selector: {
        select: {
          mode: "list",
          options: [
            { value: "left", label: "Left axis" },
            { value: "right", label: "Right axis" },
          ],
        },
      },
    },
    { name: "hidden", selector: { boolean: {} as Record<string, never> } },
    {
      type: "expandable",
      name: "appearance",
      title: "Appearance",
      schema: [
        {
          name: "line_width",
          selector: {
            number: { min: 0.5, max: 10, step: 0.5, mode: "slider", unit_of_measurement: "px" },
          },
        },
        ...(isArea
          ? [
              {
                name: "fill_opacity",
                selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" as const } },
              } satisfies HaFormField,
            ]
          : []),
        { name: "stroke_dash", selector: { text: {} } },
      ],
    },
    {
      type: "expandable",
      name: "data",
      title: "Data",
      schema: [
        { name: "attribute", selector: { text: {} } },
        { name: "unit", selector: { text: {} } },
        { name: "scale", selector: { number: { step: 0.001, mode: "box" } } },
        { name: "invert", selector: { boolean: {} as Record<string, never> } },
        {
          name: "transform",
          selector: {
            select: {
              options: [
                { value: "none", label: "None" },
                { value: "diff", label: "Difference" },
                { value: "normalize", label: "Normalize (0–1)" },
                { value: "cumulative", label: "Cumulative" },
              ],
            },
          },
        },
        {
          name: "aggregate",
          selector: {
            select: {
              options: [
                { value: "", label: "None (use card default)" },
                { value: "mean", label: "Mean" },
                { value: "min", label: "Min" },
                { value: "max", label: "Max" },
                { value: "sum", label: "Sum" },
                { value: "last", label: "Last" },
              ],
            },
          },
        },
        {
          name: "statistics",
          selector: {
            select: {
              options: [
                { value: "", label: "None (use History API)" },
                { value: "5minute", label: "5 minutes" },
                { value: "hour", label: "Hour" },
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ],
            },
          },
        },
      ],
    },
  ];
}
