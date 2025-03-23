export const DEFAULT_TABLE_COLUMNS = [
  {
    name: "created_at",
    type: "timestamp with time zone",
    default: "now()",
  },
  {
    name: "updated_at",
    type: "timestamp with time zone",
    default: "now()",
  },
  {
    name: "deleted_at",
    type: "timestamp with time zone",
    isNullable: true,
  },
];

export const JWT_SECRET = process.env.JWT_SECRET